"use client"
import { useEffect, useState } from "react";
import FormInput from "@/app/components/formcomponents/form_input/page";
import { useRouter } from "next/navigation";
import { ValidateToken } from "@/app/api/session";
import SessionTimeout from "@/app/components/utils/sessiontimeout";
import Confirmation from "@/app/components/utils/confirmationmodal";
import Spinner from "@/app/components/utils/spinner";
import SuccessModal from "@/app/components/utils/successmodal";
import { deleteDevice, getDeviceByID, getLabelByCabinet, getModelsByManufacturer, getRequiredDeviceData, requestDeviceRemoveApproval, requestDeviceUpdateApproval, UpdateDevice } from "@/app/api/devices";
import { getCabinetsByDataCenter } from "@/app/api/cabinets";
import { checkUserMail } from "@/app/api/useraccounts";

export default function ManageDevices() {
    const router = useRouter();
    const initialFormData = {
        dataCenter: "",
        location: "",
        position: "",
        selectedlabel: "",
        label: "",
        height: "",
        manufacturer: "",
        model: "",
        hostname: "",
        serialNo: "",
        assetTag: "",
        halfDepth: 0,
        backside: 0,
        hypervisor: "",
        installDate: "",
        reservation: "",
        owner: "",
        primaryContact: "",
    };
    const [formData, setFormData] = useState(initialFormData);
    const [dataCenters, setDataCenters] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [manufacturers, setManufacturers] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [decviceStatuses, setDeviceStatuses] = useState([]);
    const [locationOptions, setCabinetOptions] = useState([]);
    const [labelOptions, setLabelOptions] = useState([]);
    const [modelOptions, setModelOptions] = useState([]);
    const [sessionExpired, setSessionExpired] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [actionType, setActionType] = useState("");

    useEffect(() => {
        const token = localStorage.getItem('token')
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

        validateAndHandleExpiration();
    }, [router]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dropdowndata = await getRequiredDeviceData();
                const datacenterOptions = dropdowndata.datacenters.map(dc => dc.Name);
                const departmentOptions = dropdowndata.departments.map(dp => dp.Name);
                const manufacturersOptions = dropdowndata.manufacturers.map(mf => mf.Name);
                const contactOptions = dropdowndata.primaryContacts.map(pc => pc[0]);
                const deviceStatusOptions = dropdowndata.deviceStatuses.map(status => status.Status);

                setDataCenters(datacenterOptions);
                setDepartments(departmentOptions);
                setManufacturers(manufacturersOptions);
                setContacts(contactOptions);
                setDeviceStatuses(deviceStatusOptions)

            } catch (err) {
                console.error("Error fetching Device data:", err);
            }
        };
        fetchData();
    }, []);

    const handleModalClose = () => {
        setSessionExpired(false);
        window.location.href = "/";
    };

    const handleInputChange = async (field, value) => {
        setFormData(prevState => ({
            ...prevState,
            [field]: value
        }));

        if (field === "dataCenter") {
            try {
                const cabinets = await getCabinetsByDataCenter(value);
                const cabinetsOptions = cabinets.map(cabinet => cabinet);
                setCabinetOptions(cabinetsOptions);
            } catch (err) {
                console.error("Error fetching cabinets:", err);
            }
        }

        if (field === "manufacturer") {
            try {
                const models = await getModelsByManufacturer(value);
                const modelOptions = models.map(md => md);
                setModelOptions(modelOptions);
            } catch (err) {
                console.error("Error fetching models:", err);
                setModelOptions([]);
            }
        }
        if (field === "location") {
            try {
                const deviceLabels = await getLabelByCabinet(value.split(' - ')[0]);
                setLabelOptions(deviceLabels)
            } catch (err) {
                console.error("Error fetching devices:", err);
                setLabelOptions([]);
            }
        }
        if (field === "selectedlabel") {
            try {
                const deviceData = await getDeviceByID(value.split(' - ')[0]);
                setFormData((prevData) => ({
                    ...prevData,
                    position: deviceData.position,
                    label: deviceData.label,
                    height: deviceData.height,
                    manufacturer: deviceData.manufacturer,
                    model: deviceData.model,
                    hostname: deviceData.hostname,
                    serialNo: deviceData.serialNo,
                    assetTag: deviceData.assetTag,
                    halfDepth: deviceData.halfDepth,
                    backside: deviceData.backside,
                    hypervisor: deviceData.hypervisor,
                    installDate: deviceData.installDate.substring(0, 10),
                    reservation: deviceData.status,
                    owner: deviceData.owner,
                    primaryContact: deviceData.primaryContact,

                }));
            } catch (err) {
                console.error("Error fetching devices:", err);
                setLabelOptions([]);
            }
        }
    };

    const handleClear = () => {
        setFormData(initialFormData);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setActionType("update");
        setShowConfirmation(true);
    };

    const handleRemove = async (e) => {
        e.preventDefault();
        setActionType("delete");
        setShowConfirmation(true);
    }

    const handleConfirmSubmit = () => {
        setShowConfirmation(false);
        handleSubmit();
    };

    const handleSubmit = async () => {
        setLoading(true);
        const userId = localStorage.getItem("user");
        const userRole = localStorage.getItem("userRole");

        const { dataCenter, location, owner, label, installDate, primaryContact } = formData;
        if (!dataCenter || !location || !owner || !label || !installDate || !primaryContact) {
            alert("Please ensure all the required fields are entered");
            setLoading(false);
            return;
        }
        try {
            const deviceId = formData.selectedlabel.split(' - ')[0]

            if (actionType == "update") {
                let response;
                response = await UpdateDevice(formData, deviceId);

                if (response) {
                    setSuccessMessage(response.message);
                    setShowSuccess(true);
                } else {
                    alert("There was an issue processing your request.");
                }
            }

            if (actionType == "delete") {

                const userMail = await checkUserMail(userId);
                if (!userMail?.Email?.[0]?.Email) {
                    alert("You need to set up your email address in your account before proceeding.");
                    setLoading(false);
                    return;
                }

                let response;
                if (userRole === "Super-Admin" || userRole === "Admin") {
                    const deviceId = formData.selectedlabel.split(' - ')[0]
                    response = await deleteDevice(deviceId);
                } else {
                    alert("You don't have permission perform this task. An admin approval is required");
                    response = await requestDeviceRemoveApproval(deviceId, userId);
                }

                if (response) {
                    setSuccessMessage(response.message);
                    setShowSuccess(true);
                } else {
                    alert("There was an issue processing your request.");
                }
            }

        } catch (error) {
            console.error("Error submitting the form:", error);
            alert("There was an error adding the new device. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container p-5">
            <SessionTimeout show={sessionExpired} onClose={handleModalClose} />

            <Confirmation
                show={showConfirmation}
                onClose={() => setShowConfirmation(false)}
                onConfirm={handleConfirmSubmit}
                message={`Are you sure you want to update Device: ${formData.selectedlabel}`}
            />

            {loading && <Spinner />}

            <SuccessModal
                show={showSuccess}
                message={successMessage}
                onClose={() => {
                    setShowSuccess(false);
                    handleClear();
                }}
            />

            <form onSubmit={handleUpdate}>
                <div className="container-flex">
                    <h4>Manage Device</h4>
                    <div className="container-flex d-flex">
                        <div className="col-xl-6 p-1">
                            <FormInput
                                type="dropdown"
                                label={<span>Select Data Center<span style={{ color: 'red' }}>*</span></span>}
                                options={dataCenters}
                                value={formData.dataCenter}
                                onChange={(val) => handleInputChange('dataCenter', val)}
                            />
                            <FormInput
                                type="dropdown"
                                label={<span>Cabinet/Location<span style={{ color: 'red' }}>*</span></span>}
                                options={locationOptions}
                                value={formData.location}
                                onChange={(val) => handleInputChange('location', val)}
                            />

                            <FormInput
                                type="dropdown"
                                label={<span>Select Device<span style={{ color: 'red' }}>*</span></span>}
                                options={labelOptions}
                                value={formData.selectedlabel}
                                onChange={(val) => handleInputChange('selectedlabel', val)}
                            />

                            <FormInput
                                type="text"
                                label={<span>Label<span style={{ color: 'red' }}>*</span></span>}
                                value={formData.label}
                                onChange={(val) => handleInputChange('label', val)}
                            />

                            <FormInput
                                type="text"
                                label="Position"
                                value={formData.position}
                                onChange={(val) => handleInputChange('position', val)}
                            />

                            <FormInput
                                type="dropdown"
                                label={<span>Department<span style={{ color: 'red' }}>*</span></span>}
                                options={departments}
                                value={formData.owner}
                                onChange={(val) => handleInputChange('owner', val)}
                            />
                            <FormInput
                                type="dropdown"
                                label="Manufacturer"
                                options={manufacturers}
                                value={formData.manufacturer}
                                onChange={(val) => handleInputChange('manufacturer', val)}
                            />
                            <FormInput
                                type="dropdown"
                                label="Model"
                                options={modelOptions}
                                value={formData.model}
                                onChange={(val) => handleInputChange('model', val)}
                            />
                            <FormInput
                                type="dropdown"
                                label={<span>Primary Contact<span style={{ color: 'red' }}>*</span></span>}
                                options={contacts}
                                value={formData.primaryContact}
                                onChange={(val) => handleInputChange('primaryContact', val)}
                            />

                            <FormInput
                                type="text"
                                label={`Height(U)`}
                                value={formData.height}
                                onChange={(val) => handleInputChange('height', val)}
                            />

                        </div>

                        <div className="col-xl-6 p-1">

                            <FormInput
                                type="text"
                                label="Host Name"
                                value={formData.hostname}
                                onChange={(val) => handleInputChange('hostname', val)}
                            />
                            <FormInput
                                type="text"
                                label="Serial No"
                                value={formData.serialNo}
                                onChange={(val) => handleInputChange('serialNo', val)}
                            />
                            <FormInput
                                type="text"
                                label="Hypervisor"
                                value={formData.hypervisor}
                                onChange={(val) => handleInputChange('hypervisor', val)}
                            />
                            <FormInput
                                type="text"
                                label="Asset Tag"
                                value={formData.assetTag}
                                onChange={(val) => handleInputChange('assetTag', val)}
                            />
                            <FormInput
                                type="date"
                                label={<span>Date of Installation<span style={{ color: 'red' }}>*</span></span>}
                                value={formData.installDate}
                                onChange={(val) => handleInputChange('installDate', val)}
                            />
                            <FormInput
                                type="dropdown"
                                label="Status"
                                options={decviceStatuses}
                                value={formData.reservation}
                                onChange={(val) => handleInputChange('reservation', val)}
                            />
                            <FormInput
                                type="checkbox"
                                label="Half Depth"
                                value={formData.halfDepth}
                                onChange={(val) => handleInputChange('halfDepth', val)}
                            />
                            <FormInput
                                type="checkbox"
                                label="Back Side"
                                value={formData.backside}
                                onChange={(val) => handleInputChange('backside', val)}
                            />
                        </div>
                    </div>
                    <div className="mt-3">
                        <button type="submit" className="btn btn-primary m-1">Update Device</button>
                        <button type="button" className="btn btn-danger m-1" onClick={handleRemove}>Remove Device</button>
                        <button type="button" className="btn btn-secondary" onClick={handleClear}>Clear</button>
                    </div>

                </div>
            </form>
        </div>
    )
}
