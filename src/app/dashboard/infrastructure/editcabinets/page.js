"use client";
import FormInput from "@/app/components/formcomponents/form_input/page";
import { useState, useEffect } from "react";
import { getCabinets, getCabinetByLocation, getRequiredData, updateCabinet, addNewCabinet, deleteCabinet } from "@/app/api/cabinets";

export default function EditCabinets() {
    const initialFormData = {
        cabinetID: "",
        cabinet: "",
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
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});
    const [cabinetsData, setCabinetsData] = useState([]);
    const [dataCenters, setDataCenters] = useState([]);
    const [assignedTos, setAssignedTos] = useState([]);
    const [zones, setZones] = useState([]);
    const [cabinetRows, setCabinetRows] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const cabinets = await getCabinets();
                const dropdowndata = await getRequiredData();
                setCabinetsData(cabinets);

                const datacenterOptions = dropdowndata.datacenters.map(dc => dc.Name);
                const departmentOptions = dropdowndata.departments.map(dc => dc.Name);
                const zonesOptions = dropdowndata.zones.map(dc => dc.Description);
                const cabinetRowsOptions = dropdowndata.cabinetrows.map(dc => dc.Name);

                setDataCenters(datacenterOptions);
                setAssignedTos(departmentOptions);
                setZones(zonesOptions);
                setCabinetRows(cabinetRowsOptions);

            } catch (err) {
                console.error("Error fetching cabinets data:", err);
            }
        };
        fetchData();

    }, []);

    const handleCabinetSelect = async (selectedCabinet) => {
        try {
            const cabinetLocation = selectedCabinet.split(',')[0].trim();
            const cabinetDetails = await getCabinetByLocation(cabinetLocation);

            setFormData((prevState) => ({
                ...prevState,
                cabinetID: cabinetDetails ? cabinetDetails.CabinetID : null,
                cabinet: cabinetDetails ? cabinetDetails.Cabinet : selectedCabinet,
                location: cabinetDetails ? cabinetDetails.Location : null,
                dataCenter: cabinetDetails ? cabinetDetails.DataCenter : null,
                assignedTo: cabinetDetails ? cabinetDetails.AssignedTo || "" : null,
                zone: cabinetDetails ? cabinetDetails.Zone : null,
                cabinetRow: cabinetDetails ? cabinetDetails.CabinetRow : null,
                cabinetHeight: cabinetDetails ? cabinetDetails.CabinetHeight : null,
                u1Position: cabinetDetails ? cabinetDetails.U1Position : null,
                model: cabinetDetails ? cabinetDetails.Model : null,
                keyLockInfo: cabinetDetails ? cabinetDetails.KeyLockInfo : null,
                maxKW: cabinetDetails ? cabinetDetails.MaxKW : null,
                maxWeight: cabinetDetails ? cabinetDetails.MaxWeight : null,
                dateOfInstallation: cabinetDetails ? cabinetDetails.DateOfInstallation.substring(0, 10) : null,
                notes: cabinetDetails ? cabinetDetails.Notes : null,
            }));
        } catch (err) {
            console.error("Error fetching cabinet details:", err);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.cabinet || formData.cabinet.length > 10) {
            newErrors.cabinet = "Cabinet name must be provided, max-10";
        }

        if (!formData.location || formData.location.length > 20) {
            newErrors.location = "Location must be provided, max-20.";
        }

        if (!/^[\d]{1,3}$/.test(formData.cabinetHeight)) {
            newErrors.cabinetHeight = "Cabinet height must be a number";
        }

        if (!formData.u1Position || (formData.u1Position !== "Top" && formData.u1Position !== "Bottom")) {
            newErrors.u1Position = "Please select U1 Position.";
        }

        if (!formData.maxKW || isNaN(formData.maxKW)) {
            newErrors.maxKW = "Maximum kW must be a number.";
        }

        if (!formData.maxWeight || isNaN(formData.maxWeight)) {
            newErrors.maxWeight = "Maximum weight must be a number.";
        }

        if (!formData.dateOfInstallation) {
            newErrors.dateOfInstallation = "Date of Installation is required.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field, value) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            console.log(formData);
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            let result;

            if (formData.cabinetID) {
                result = await updateCabinet(formData);
            } else {
                result = await addNewCabinet(formData);
            }

            if (result.success) {
                setSuccess(true);
                setFormData(initialFormData);
            } else {
                setErrors({ apiError: result.message || 'Failed to update/insert cabinet' });
            }
        } catch (error) {
            setErrors({ apiError: 'An error occurred while saving the data. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setFormData(initialFormData);
        setErrors({});
        setSuccess(false);
    };

    const handleDelete = async () => {
        if (!formData.cabinetID) {
            setErrors({ apiError: 'Select a Cabinet to delete.' });
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            const result = await deleteCabinet(formData.cabinetID);

            if (result.success) {
                setSuccess(true);
                setFormData(initialFormData);
            } else {
                setErrors({ apiError: result.message || 'Failed to delete cabinet' });
            }
        } catch (error) {
            setErrors({ apiError: 'An error occurred while deleting the data. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container p-5">
            <div className="col-xl-6">
                {loading && <p>Loading...</p>}
                {success && <p className="alert alert-success">Changes saved successfully!</p>}
                {Object.keys(errors).length > 0 && (
                    <div className="alert alert-danger">
                        {Object.values(errors).map((error, index) => (
                            <p key={index}>{error}</p>
                        ))}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <FormInput
                        type="dropdown"
                        label="Cabinet"
                        firstValue="New"
                        options={cabinetsData.map(item => `${item.Location}, ${item.DataCenterName}`)}
                        onChange={(val) => handleCabinetSelect(val)}
                        secondaryInputValue="New Cabinet Name"
                        onSecondaryInputChange={(val) => handleInputChange('cabinet', val)}
                        placeholder="Enter New Cabinet Name"
                        secondaryLabel="Add/Edit Cabinet name"
                    />

                    {/* Form Inputs */}
                    <FormInput
                        type="text"
                        label="Location"
                        value={formData.location}
                        onChange={(val) => handleInputChange('location', val)}
                    />
                    <FormInput
                        type="dropdown"
                        label="Data Center"
                        options={dataCenters}
                        value={formData.dataCenter}
                        onChange={(val) => handleInputChange('dataCenter', val)}
                    />
                    <FormInput
                        type="dropdown"
                        label="Assigned To"
                        options={assignedTos.map(option => option)}
                        value={formData.assignedTo || "Not Assigned"}
                        onChange={(val) => handleInputChange('assignedTo', val)}
                    />
                    <FormInput
                        type="dropdown"
                        label="Zone"
                        options={zones}
                        value={formData.zone || "N/A"}
                        onChange={(val) => handleInputChange('zone', val)}
                    />
                    <FormInput
                        type="dropdown"
                        label="Cabinet Row"
                        options={cabinetRows}
                        value={formData.cabinetRow || "N/A"}
                        onChange={(val) => handleInputChange('cabinetRow', val)}
                    />
                    <FormInput
                        type="text"
                        label="Cabinet Height(U)"
                        value={formData.cabinetHeight}
                        onChange={(val) => handleInputChange('cabinetHeight', val)}
                    />
                    <FormInput
                        type="dropdown"
                        firstValue="Please Select"
                        label="U1 Position"
                        options={['Bottom', 'Top']}
                        onChange={(val) => handleInputChange('u1Position', val)}
                    />
                    <FormInput
                        type="text"
                        label="Model"
                        value={formData.model}
                        onChange={(val) => handleInputChange('model', val)}
                    />
                    <FormInput
                        type="text"
                        label="Key/Lock Information"
                        value={formData.keyLockInfo}
                        onChange={(val) => handleInputChange('keyLockInfo', val)}
                    />
                    <FormInput
                        type="text"
                        label="Maximum kW"
                        value={formData.maxKW}
                        onChange={(val) => handleInputChange('maxKW', val)}
                    />
                    <FormInput
                        type="text"
                        label="Maximum Weight"
                        value={formData.maxWeight}
                        onChange={(val) => handleInputChange('maxWeight', val)}
                    />
                    <FormInput
                        type="date"
                        label="Date of Installation"
                        value={formData.dateOfInstallation}
                        onChange={(val) => handleInputChange('dateOfInstallation', val)}
                        width="50%"
                    />
                    <FormInput
                        type="textarea"
                        label="Notes"
                        value={formData.notes}
                        onChange={(val) => handleInputChange('notes', val)}
                        width="100%"
                    />
                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary">Submit</button>
                        <button type="button" className="btn btn-secondary" onClick={handleClear}>Clear</button>
                        <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
