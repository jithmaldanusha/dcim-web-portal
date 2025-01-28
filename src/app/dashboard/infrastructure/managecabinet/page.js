"use client";
import { deleteCabinet, getCabinetData, getCabinetsByDataCenter, getRequiredData, requestDeleteCabinetApproval, updateCabinet } from "@/app/api/cabinets";
import FormInput from "@/app/components/formcomponents/form_input/page";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SessionTimeout from "@/app/components/utils/sessiontimeout";
import Confirmation from "@/app/components/utils/confirmationmodal";
import Spinner from "@/app/components/utils/spinner";
import SuccessModal from "@/app/components/utils/successmodal";
import { ValidateToken } from "@/app/api/session";
import { checkUserMail } from "@/app/api/useraccounts";

export default function ManageCabinet() {
    const router = useRouter();
    const initialFormData = {
        cabinetID: "",
        dataCenter: "",
        location: "",
        assignedTo: "",
        zone: "",
        cabinetRow: "",
        cabinetHeight: "",
        u1Position: "",
        model: "",
        keyLockInfo: "",
        maxKW: "",
        maxWeight: "",
        dateOfInstallation: "",
        notes: "",
    };

    const [formData, setFormData] = useState(initialFormData);
    const [dataCenters, setDataCenters] = useState([]);
    const [assignedTos, setAssignedTos] = useState([]);
    const [zones, setZones] = useState([]);
    const [cabinetRows, setCabinetRows] = useState([]);
    const [cabinets, setCabinets] = useState([]);
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
                setLoading(true);
                const dropdowndata = await getRequiredData();
                const datacenterOptions = dropdowndata.datacenters.map(dc => dc.Name);
                const departmentOptions = ["General Use", ...dropdowndata.departments.map(dep => dep.Name)];
                const zonesOptions = ["N/A", ...dropdowndata.zones.map(zone => zone.Description)];
                const cabinetRowsOptions = ["N/A", ...dropdowndata.cabinetRows.map(cab => cab.Name)];

                setDataCenters(datacenterOptions);
                setAssignedTos(departmentOptions);
                setZones(zonesOptions);
                setCabinetRows(cabinetRowsOptions);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching cabinets data:", err);
            }
        };
        fetchData();
    }, []);

    const handleModalClose = () => {
        setSessionExpired(false);
        router.push("/").then(() => {
            router.reload();
        });
    };

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setActionType("update");
        setShowConfirmation(true);
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        setActionType("delete");
        setShowConfirmation(true);
    };

    const handleClear = async () => {
        setFormData(initialFormData);
        setCabinets([]);
    };

    const handleDataCenterChange = async (val) => {
        handleInputChange('dataCenter', val);
        setLoading(true);
        try {
            const fetchedCabinets = await getCabinetsByDataCenter(val);
            setCabinets(fetchedCabinets);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching cabinets by DataCenter:", error);
        }
    };

    const handleCabinetChange = async (val) => {
        const selectedCabinetID = val.split(' - ')[0];
        handleInputChange("cabinetID", selectedCabinetID);
        setLoading(true);

        try {
            const fetchedCabinetData = await getCabinetData(selectedCabinetID);
            setFormData((prevData) => ({
                ...prevData,
                location: fetchedCabinetData.Location || prevData.location,
                assignedTo: fetchedCabinetData.AssignedTo || "General Use",
                zone: fetchedCabinetData.Zone || "N/A",
                cabinetRow: fetchedCabinetData.CabinetRow || "N/A",
                cabinetHeight: fetchedCabinetData.CabinetHeight || prevData.cabinetHeight,
                u1Position: fetchedCabinetData.U1Position || prevData.u1Position,
                model: fetchedCabinetData.Model || prevData.model,
                keyLockInfo: fetchedCabinetData.KeyLockInfo || prevData.keyLockInfo,
                maxKW: fetchedCabinetData.MaxKW || prevData.maxKW,
                maxWeight: fetchedCabinetData.MaxWeight || prevData.maxWeight,
                dateOfInstallation: fetchedCabinetData.DateOfInstallation.substring(0, 10) || prevData.dateOfInstallation,
                notes: fetchedCabinetData.Notes || prevData.notes,
            }));
            setLoading(false);

        } catch (error) {
            console.error("Error fetching cabinet data:", error);
        }
    };

    const handleConfirmSubmit = async () => {
        setLoading(true);
        const userId = localStorage.getItem("user");
        const userRole = localStorage.getItem("userRole");
        try {
            // Check if the user's email is set up
            const userMail = await checkUserMail(userId);
            if (!userMail.Email) {
                alert("You need to set up your email address in your account before proceeding.");
                setLoading(false);
                return;
            }

            if (actionType === "update") {
                const response = await updateCabinet(formData);
                if (response) {
                    setSuccessMessage("Cabinet updated successfully!");
                    setLoading(false);
                    setShowConfirmation(false);
                    setShowSuccess(true);
                }


            } else if (actionType === "delete") {

                if (userRole === "Super-Admin" || userRole === "Admin") {
                    const response = await deleteCabinet(formData.cabinetID);
                    if (response) {
                        setSuccessMessage("Cabinet removed successfully!");
                        setLoading(false);
                        setShowConfirmation(false);
                        setShowSuccess(true);
                    }

                } else {
                    alert("You don't have permission to perform this task. An admin approval is required.");
                    const response = await requestDeleteCabinetApproval(formData.cabinetID, userId);
                    if (response) {
                        setLoading(false);
                        setShowConfirmation(false);
                        setSuccessMessage("Email Sent successfully!");
                        setShowSuccess(true);
                    }
                }
            }

        } catch (error) {
            console.error("Error:", error);
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
                message={actionType === "update" ? `Are you sure you want to update cabinet: ${formData.location}` : `Are you sure you want to remove cabinet: ${formData.location}`}
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
                    <h4>Update Cabinet</h4>
                    <div className="container-flex d-flex">
                        <div className="col-xl-6 p-1">
                            <FormInput
                                type="dropdown"
                                label="Select Data Center"
                                options={dataCenters}
                                value={formData.dataCenter}
                                onChange={(val) => { handleDataCenterChange(val); }}
                            />
                            <FormInput
                                type="dropdown"
                                label="Select Cabinet"
                                options={cabinets}
                                value={formData.cabinetID}
                                onChange={(val) => {
                                    const selectedCabinetID = val.split(' - ')[0];
                                    handleInputChange("cabinetID", selectedCabinetID);
                                    handleCabinetChange(selectedCabinetID);
                                }}
                            />
                            <FormInput
                                type="text"
                                placeholder="Select Cabinet First"
                                label="Cabinet/Location"
                                options={cabinets}
                                value={formData.location}
                                onChange={(val) => { handleInputChange("location", val) }}
                            />
                            <FormInput
                                type="dropdown"
                                label="Zone"
                                options={zones}
                                value={formData.zone}
                                onChange={(val) => handleInputChange("zone", val)}
                            />
                            <FormInput
                                type="dropdown"
                                label={<span>Cabinet Row<span style={{ color: 'red' }}>*</span></span>}
                                options={cabinetRows}
                                value={formData.cabinetRow}
                                onChange={(val) => handleInputChange("cabinetRow", val)}
                            />
                            <FormInput
                                type="dropdown"
                                label={<span>Assigned To<span style={{ color: 'red' }}>*</span></span>}
                                options={assignedTos}
                                value={formData.assignedTo}
                                onChange={(val) => handleInputChange("assignedTo", val)}
                            />
                            <FormInput
                                type="dropdown"
                                label={<span>U1 Position<span style={{ color: 'red' }}>*</span></span>}
                                options={["default", "Bottom", "Top"]}
                                value={formData.u1Position}
                                onChange={(val) => handleInputChange("u1Position", val)}
                            />
                        </div>
                        <div className="col-xl-6 p-1">
                            <FormInput
                                type="text"
                                label="Cabinet Height(U)"
                                value={formData.cabinetHeight}
                                onChange={(val) => handleInputChange("cabinetHeight", val)}
                            />
                            <FormInput
                                type="text"
                                label="Model"
                                value={formData.model}
                                onChange={(val) => handleInputChange("model", val)}
                            />
                            <FormInput
                                type="text"
                                label="Key/Lock Information"
                                value={formData.keyLockInfo}
                                onChange={(val) => handleInputChange("keyLockInfo", val)}
                            />
                            <FormInput
                                type="text"
                                label="Maximum kW"
                                value={formData.maxKW}
                                onChange={(val) => handleInputChange("maxKW", val)}
                            />
                            <FormInput
                                type="text"
                                label="Maximum Weight"
                                value={formData.maxWeight}
                                onChange={(val) => handleInputChange("maxWeight", val)}
                            />
                            <FormInput
                                type="date"
                                label={<span>Date of Installation<span style={{ color: 'red' }}>*</span></span>}
                                value={formData.dateOfInstallation}
                                onChange={(val) => handleInputChange("dateOfInstallation", val)}
                            />
                            <FormInput
                                type="textarea"
                                label="Notes"
                                value={formData.notes}
                                onChange={(val) => handleInputChange("notes", val)}
                                height="115px"
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <button type="submit" className="btn btn-primary m-1">
                        Update
                    </button>
                    <button type="button" className="btn btn-danger m-1" onClick={handleDelete}>
                        Remove
                    </button>
                    <button type="reset" className="btn btn-secondary m-1" onClick={handleClear}>
                        Clear
                    </button>
                </div>
            </form>
        </div>
    );
}

