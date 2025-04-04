"use client";
import { useEffect, useState } from "react";
import FormInput from "@/app/components/formcomponents/form_input/page";
import { getDataCenters } from "@/app/api/datacenters";
import { getCabinetsByDataCenter } from "@/app/api/cabinets";
import { getManufacturers } from "@/app/api/manufacturers";
import { getModelsByManufacturer, DirectImportBulk, requestBulkDeviceApproval } from "@/app/api/devices";
import ExcelUpload from "@/app/components/excelfileupload/page";
import { getDepartments } from "@/app/api/departments";
import { getPrimaryContacts } from "@/app/api/people";
import RadioSwitch from "@/app/components/formcomponents/switch/radioswitch";
import Confirmation from "@/app/components/utils/confirmationmodal";
import Spinner from "@/app/components/utils/spinner";
import SuccessModal from "@/app/components/utils/successmodal";
import { useRouter } from "next/navigation";
import { checkUserMail } from "@/app/api/useraccounts";
import SessionTimeout from "@/app/components/utils/sessiontimeout";
import { ValidateToken } from "@/app/api/session";

export default function BulkImportDevices() {
    const router = useRouter();
    const initialData = {
        DataCenter: "",
        Cabinet: "",
        Manufacturer: "",
        Model: "",
        Owner: "",
        PrimaryContact: "",
    };

    const [sessionExpired, setSessionExpired] = useState(false);
    const [dropdownData, setDropdownData] = useState(initialData);
    const [dataCenterOptions, setDataCenters] = useState([]);
    const [manufacturersOptions, setManufacturers] = useState([]);
    const [cabinetOptions, setCabinetOptions] = useState([]);
    const [modelOptions, setModelOptions] = useState([]);
    const [ownerOptions, setOwnerOptions] = useState([]);
    const [contactOptions, setContactOptions] = useState([]);
    const [importedData, setImportedData] = useState([]);
    const [isCustomImport, setIsCustomImport] = useState(true);
    const [invalidRows, setInvalidRows] = useState([]);
    const [isValid, setIsValid] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [actionType, setActionType] = useState('');


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setSessionExpired(true);
            return;
        }

        const validateAndHandleExpiration = async () => {
            try {
                await ValidateToken(token);
            } catch (error) {
                localStorage.removeItem("token");
                setSessionExpired(true);
            }
        };

        const fetchData = async () => {
            try {
                const datacenters = await getDataCenters();
                const manufacturers = await getManufacturers();
                const owners = await getDepartments();
                const contacts = await getPrimaryContacts();

                setDataCenters(datacenters.map((dc) => dc.Name, (dc) => dc.DataCenterID));
                setManufacturers(manufacturers.map((mf) => mf.Name));
                setOwnerOptions(owners.map((on) => on.Name));
                setContactOptions(contacts.map((cn) => cn[0]));
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchData();
        validateAndHandleExpiration();
    }, []);

    const handleModalClose = () => {
        setSessionExpired(false);
        window.location.href = "/";
    };

    const handleInputChange = async (field, value) => {
        setDropdownData({
            ...dropdownData,
            [field]: value,
        });

        if (field === "DataCenter") {
            try {
                const cabinets = await getCabinetsByDataCenter(value);
                setCabinetOptions(cabinets);
            } catch (err) {
                console.error("Error fetching cabinets:", err);
            }
        }

        if (field === "Manufacturer") {
            try {
                const models = await getModelsByManufacturer(value);
                setModelOptions(models);
            } catch (err) {
                console.error("Error fetching models:", err);
            }
        }
    };

    const handleDataProcessed = (data) => {
        setImportedData(data);
    };

    const handleClear = async () => {
        setFormData(initialData);
    };

    const handleSwitch = (isCustom) => {
        setIsCustomImport(!isCustom);
        setDropdownData({
            DataCenter: "",
            Cabinet: "",
            Manufacturer: "",
            Model: "",
            Owner: "",
            PrimaryContact: "",
        })
    };

    const handleValidate = async () => {
        const invalidRows = [];

        await Promise.all(
            importedData.map(async (item) => {
                const isValidDataCenter = dataCenterOptions.includes(dropdownData.DataCenter || item.DataCenter);
                const isValidManufacturer = manufacturersOptions.includes(dropdownData.Manufacturer || item.Manufacturer);
                const isValidOwner = ownerOptions.includes(dropdownData.Owner || item.Owner);
                const isValidPrimaryContact = contactOptions.includes(dropdownData.PrimaryContact || item.PrimaryContact);

                let isValidCabinet = true;
                if (dropdownData.DataCenter || item.DataCenter) {
                    const cabinets = await getCabinetsByDataCenter(dropdownData.DataCenter || item.DataCenter);
                    const cabinetNames = cabinets.map(cabinet => cabinet.split(' - ')[1]);
                    isValidCabinet = cabinetNames.includes(dropdownData.Cabinet.split(' - ')[1] || item.Cabinet);
                }


                let isValidModel = true;
                if (dropdownData.Manufacturer || item.Manufacturer) {
                    const models = await getModelsByManufacturer(dropdownData.Manufacturer || item.Manufacturer);
                    isValidModel = models.includes(dropdownData.Model || item.Model);
                }

                const rowErrors = [];
                if (!isValidDataCenter) rowErrors.push(`Invalid DataCenter: ${dropdownData.DataCenter || item.DataCenter}`);
                if (!isValidManufacturer) rowErrors.push(`Invalid Manufacturer: ${dropdownData.Manufacturer || item.Manufacturer}`);
                if (!isValidOwner) rowErrors.push(`Invalid Owner: ${dropdownData.Owner || item.Owner}`);
                if (!isValidPrimaryContact) rowErrors.push(`Invalid PrimaryContact: ${dropdownData.PrimaryContact || item.PrimaryContact}`);
                if (!isValidCabinet) rowErrors.push(`Invalid Cabinet: ${dropdownData.Cabinet || item.Cabinet}`);
                if (!isValidModel) rowErrors.push(`Invalid Model: ${dropdownData.Model || item.Model}`);

                if (rowErrors.length > 0) {
                    invalidRows.push({ rowIndex: item, errors: rowErrors });
                }
            })
        );

        setInvalidRows(invalidRows);

        if (invalidRows.length === 0) {
            alert("Validation successful!");
            setIsValid(true);
        } else {
            alert("Some rows have invalid data.");
            setIsValid(false);
        }
    };

    const handleSubmit = () => {
        setShowConfirmation(true);
    };
    const handleConfirmSubmit = async () => {
        setShowConfirmation(false);
        setLoading(true);

        try {
            const userId = localStorage.getItem("user");
            const userMail = await checkUserMail(userId);
            if (!userMail.Email) {
                alert("You need to set up your email address in your account before proceeding.");
                setLoading(false);
                return;
            }

            const userRole = localStorage.getItem("userRole");
            const formattedData = importedData.map((item) => ({
                dataCenter: dropdownData.DataCenter || item.DataCenter,
                cabinet: dropdownData.Cabinet || item.Cabinet,
                manufacturer: dropdownData.Manufacturer || item.Manufacturer,
                model: dropdownData.Model || item.Model,
                owner: dropdownData.Owner || item.Owner,
                primaryContact: dropdownData.PrimaryContact || item.PrimaryContact,
                position: item.Position,
                label: item.Label,
                hostname: item.Hostname,
                serialNo: item.SerialNo,
                assetTag: item.AssetTag,
                halfDepth: item.HalfDepth,
                backSide: item.BackSide,
                hypervisor: item.Hypervisor,
                installDate: item.InstallDate,
                reservation: item.Reservation,
            }));

            let result;
            if (userRole === "Super-Admin" || userRole === "Admin") {
                result = await DirectImportBulk(formattedData);
                setSuccessMessage('Devices imported successfully.');
            } else {
                result = await requestBulkDeviceApproval(formattedData, userId);
                setSuccessMessage('Approval request sent to the Admin.');
            }

            setLoading(false);
            setShowSuccess(true);
            handleClear();

        } catch (error) {
            setLoading(false);
            console.error('Error during bulk import or approval request:', error.message);
            alert('Failed to send approval request: ' + (error.message || 'Unknown error'));
        }
    };

    return (
        <div className="container p-5">
            <SessionTimeout show={sessionExpired} onClose={handleModalClose} />

            <Confirmation
                show={showConfirmation}
                onClose={() => setShowConfirmation(false)}
                onConfirm={handleConfirmSubmit}
                message={actionType === "update"
                    ? `Are you sure you want to update the cabinet: ${formData.location}?`
                    : `Are you sure you want to import these devices?`}
            />

            {loading && <Spinner />}

            <SuccessModal
                show={showSuccess}
                message={successMessage}
                onClose={() => {
                    setShowSuccess(false);
                    window.location.reload();
                }}
            />

            <div className="col-xl-12 d-flex">
                <h6 className="me-2">Switch to Easy Import:</h6>
                <RadioSwitch onSwitch={handleSwitch} />
            </div>
            <hr />
            <div className="d-flex">
                <div className="col-xl-6 p-1">
                    <FormInput
                        type="dropdown"
                        label={<span>Select DataCenter<span style={{ color: 'red' }}>*</span></span>}
                        options={dataCenterOptions}
                        value={dropdownData.DataCenter}
                        onChange={(val) => handleInputChange("DataCenter", val)}
                        disabled={isCustomImport}
                    />

                    <FormInput
                        type="dropdown"
                        label={<span>Select Cabinet<span style={{ color: 'red' }}>*</span></span>}
                        options={cabinetOptions}
                        value={dropdownData.Cabinet}
                        onChange={(val) => handleInputChange("Cabinet", val)}
                        disabled={isCustomImport}
                    />
                </div>

                <div className="col-xl-6 p-1">
                    <FormInput
                        type="dropdown"
                        label="Select Manufacturer"
                        options={manufacturersOptions}
                        value={dropdownData.Manufacturer}
                        onChange={(val) => handleInputChange("Manufacturer", val)}
                        disabled={isCustomImport}
                    />

                    <FormInput
                        type="dropdown"
                        label="Select Model"
                        options={modelOptions}
                        value={dropdownData.Model}
                        onChange={(val) => handleInputChange("Model", val)}
                        disabled={isCustomImport}
                    />
                </div>
            </div>

            <div className="d-flex">
                <div className="col-xl-8 p-1">
                    <FormInput
                        type="dropdown"
                        label={<span>Select Owner<span style={{ color: 'red' }}>*</span></span>}
                        options={ownerOptions}
                        value={dropdownData.Owner}
                        onChange={(val) => handleInputChange("Owner", val)}
                        className="col-xl-6"
                        disabled={isCustomImport}
                    />
                </div>
                <div className="col-xl-4 p-1">
                    <FormInput
                        type="dropdown"
                        label={<span>Select Primary Contact<span style={{ color: 'red' }}>*</span></span>}
                        options={contactOptions}
                        value={dropdownData.PrimaryContact}
                        onChange={(val) => handleInputChange("PrimaryContact", val)}
                        className="col-xl-6"
                        disabled={isCustomImport}
                    />
                </div>
            </div>

            <ExcelUpload dropdownData={dropdownData} onDataProcessed={handleDataProcessed} />

            {importedData.length > 0 && (
                <div className="mt-4 mb-3" style={{ overflowX: "auto" }}>
                    <h5>Preview Import</h5>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>Data Center</th>
                                <th>Cabinet</th>
                                <th>Manufacturer</th>
                                <th>Model</th>
                                <th>Owner</th>
                                <th>Primary Contact</th>
                                <th>Position</th>
                                <th>Label</th>
                                <th>Hostname</th>
                                <th>Serial No</th>
                                <th>Asset Tag</th>
                                <th>Half Depth</th>
                                <th>Back Side</th>
                                <th>Hypervisor</th>
                                <th>Install Date</th>
                                <th>Reservation</th>
                            </tr>
                        </thead>
                        <tbody>
                            {importedData.map((row, index) => (
                                <tr key={index}>
                                    <td>{dropdownData.DataCenter || row.DataCenter}</td>
                                    <td>{dropdownData.Cabinet.split(' - ')[1] || row.Cabinet}</td>
                                    <td>{dropdownData.Manufacturer || row.Manufacturer}</td>
                                    <td>{dropdownData.Model || row.Model}</td>
                                    <td>{dropdownData.Owner || row.Owner}</td>
                                    <td>{dropdownData.PrimaryContact || row.PrimaryContact}</td>
                                    <td>{row.Position}</td>
                                    <td>{row.Label}</td>
                                    <td>{row.Hostname}</td>
                                    <td>{row.SerialNo}</td>
                                    <td>{row.AssetTag}</td>
                                    <td>{row.HalfDepth}</td>
                                    <td>{row.BackSide}</td>
                                    <td>{row.Hypervisor}</td>
                                    <td>{new Date((row.InstallDate - 25569) * 86400 * 1000).toLocaleDateString()}</td>
                                    <td>{row.Reservation}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="d-flex mt-4">
                        <button type="button" className="btn btn-primary me-1" onClick={handleValidate}>
                            Validate Import
                        </button>

                        <button
                            onClick={handleSubmit}
                            className="btn btn-success"
                            disabled={!isValid}
                        >
                            Submit
                        </button>
                    </div>
                    {invalidRows.length > 0 && (
                        <div className="alert alert-danger mt-4">
                            <h5>Invalid Rows</h5>
                            <ul>
                                {invalidRows.map((invalidRow, index) => (
                                    <li key={index}>
                                        <strong>{`Row ${index + 1}`}</strong>:
                                        <ul>
                                            {invalidRow.errors.map((error, errIndex) => (
                                                <li key={errIndex}>{error}</li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
