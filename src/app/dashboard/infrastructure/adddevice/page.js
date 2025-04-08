"use client"
import { useEffect, useState } from "react";
import FormInput from "@/app/components/formcomponents/form_input/page";
import { useRouter } from "next/navigation";
import { ValidateToken } from "@/app/api/session";
import SessionTimeout from "@/app/components/utils/sessiontimeout";
import Confirmation from "@/app/components/utils/confirmationmodal";
import Spinner from "@/app/components/utils/spinner";
import SuccessModal from "@/app/components/utils/successmodal";
import { AddDevice, getModelsByManufacturer, getRequiredDeviceData, requestDeviceAddApproval } from "@/app/api/devices";
import { getCabinetsByDataCenter } from "@/app/api/cabinets";
import { checkUserMail } from "@/app/api/useraccounts";

export default function AddNewDevice() {
    const router = useRouter();
    const initialFormData = {
        dataCenter: "",
        location: "",
        position: "",
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
    const [modelOptions, setModelOptions] = useState([]);
    const [sessionExpired, setSessionExpired] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

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
                const cabinetsOptions = cabinets.map(cabinet => cabinet.split(' - ')[1]);
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
    };

    const handleClear = () => {
        setFormData(initialFormData);
    };
    const handleConfirmSubmit = () => {
        setShowConfirmation(false);
        handleSubmit();
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setShowConfirmation(true);
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

        const userMail = await checkUserMail(userId);
        if (!userMail?.Email?.[0]?.Email) {
            alert("You need to set up your email address in your account before proceeding.");
            setLoading(false);
            return;
        }

        try {
            let response;
            if (userRole === "Super-Admin" || userRole === "Admin") {
                response = await AddDevice(formData);
            } else {
                alert("You don't have permission perform this task. An admin approval is required");
                response = await requestDeviceAddApproval(formData, userId);
            }

            if (response) {
                setSuccessMessage(response.message);
                setShowSuccess(true);
            } else {
                alert("There was an issue processing your request.");
            }

        } catch (error) {
            console.error("Error submitting the form:", error);
            alert("There was an error occured. Contact Admin");
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
                message={`Are you sure you want to add new Device: ${formData.label}`}
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

            <form onSubmit={handleFormSubmit}>
                <div className="container-flex">
                    <h4>Add New Device</h4>
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
                                label="Position"
                                value={formData.position}
                                onChange={(val) => handleInputChange('position', val)}
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
                                label={<span>Label<span style={{ color: 'red' }}>*</span></span>}
                                value={formData.label}
                                onChange={(val) => handleInputChange('label', val)}
                            />
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
                        <button type="submit" className="btn btn-primary m-1">Add Device</button>
                        <button type="button" className="btn btn-secondary" onClick={handleClear}>Clear</button>
                    </div>

                </div>
            </form>
        </div>
    )
}
