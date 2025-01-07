"use client";
import { getCabinetsByDataCenter, getRequiredData } from "@/app/api/cabinets"; // Assume this API fetches necessary dropdown data
import FormInput from "@/app/components/formcomponents/form_input/page"; // FormInput component
import { useEffect, useState } from "react";

export default function ManageCabinet() {
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
    const [dataCenters, setDataCenters] = useState([]);
    const [assignedTos, setAssignedTos] = useState([]);
    const [zones, setZones] = useState([]);
    const [cabinetRows, setCabinetRows] = useState([]);
    const [cabinets, setCabinets] = useState([]);

    // Handle form input changes
    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Perform the API call to submit the form data
            const response = await fetch('/api/cabinets/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (result.success) {
                alert("Cabinet updated successfully!");
            } else {
                console.error("Error updating cabinet:", result.message);
                alert("Failed to update cabinet.");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("An error occurred during submission.");
        }
    };

    // Fetch dropdown data for the form
    useEffect(() => {
        const fetchData = async () => {
            try {
                const dropdowndata = await getRequiredData();
                const datacenterOptions = dropdowndata.datacenters.map(dc => dc.Name);
                const departmentOptions = ["General Use", ...dropdowndata.departments.map(dep => dep.Name)];
                const zonesOptions = ["N/A", ...dropdowndata.zones.map(zone => zone.Description)];
                const cabinetRowsOptions = ["N/A", ...dropdowndata.cabinetRows.map(cab => cab.Name)];

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

    const handleDataCenterChange = async (val) => {
        handleInputChange('dataCenter', val);
        try {
            const fetchedCabinets = await getCabinetsByDataCenter(val);  // Fetch cabinets based on selected DataCenter
            setCabinets(fetchedCabinets); // Set cabinet options based on selected DataCenter
        } catch (error) {
            console.error("Error fetching cabinets by DataCenter:", error);
        }
    };

    return (
        <div className="container p-5">
            <form onSubmit={handleSubmit}>
                <div className="container-flex">
                    <h4>Update Cabinet</h4>
                    <div className="container-flex d-flex">
                        <div className="col-xl-6 p-1">
                            <FormInput
                                type="dropdown"
                                label="Select Data Center"
                                options={dataCenters}
                                value={formData.dataCenter}
                                onChange={(val) => {
                                    handleInputChange("dataCenter", val); 
                                    handleDataCenterChange(val);       
                                }}
                            />
                            <FormInput
                                type="dropdown"
                                label="Select Cabinet"
                                options={cabinets}
                                value={formData.cabinet}
                                onChange={(val) => handleInputChange("cabinet", val)}
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
                    <button type="submit" className="btn btn-primary mt-3">
                        Update Cabinet
                    </button>
                </div>
            </form>
        </div>
    );
}
