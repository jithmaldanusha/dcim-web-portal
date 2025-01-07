"use client"
import { useEffect, useState } from "react";
import FormInput from "@/app/components/formcomponents/form_input/page";
import { addNewCabinet, getRequiredData } from "@/app/api/cabinets";
import { useRouter } from "next/navigation";
import { ValidateToken } from "@/app/api/session";
import SessionTimeout from "@/app/components/utils/sessiontimeout";

export default function AddNewCabinets() {
    const router = useRouter();
    const initialFormData = {
        dataCenter: '',
        location: '',
        assignedTo: '',
        zone: '',
        cabinetRow: '',
        cabinetHeight: '',
        u1Position: 'default',
        model: '',
        keyLockInfo: '',
        maxKW: '',
        maxWeight: '',
        dateOfInstallation: '',
        notes: ''
    };
    const [formData, setFormData] = useState(initialFormData);
    const [dataCenters, setDataCenters] = useState([]);
    const [assignedTos, setAssignedTos] = useState([]);
    const [zones, setZones] = useState([]);
    const [cabinetRows, setCabinetRows] = useState([]);
    const [sessionExpired, setSessionExpired] = useState(false);

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
                const dropdowndata = await getRequiredData();
                const datacenterOptions = dropdowndata.datacenters.map(dc => dc.Name);
                const departmentOptions = ["General Use", ...dropdowndata.departments.map(dc => dc.Name)];
                const zonesOptions = ["N/A", ...dropdowndata.zones.map(dc => dc.Description)];
                const cabinetRowsOptions = ["N/A", ...dropdowndata.cabinetRows.map(dc => dc.Name)];

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

    const handleModalClose = () => {
        setSessionExpired(false);
        router.push("/").then(() => {
            router.reload();
        });
    };

    const handleInputChange = (field, value) => {
        setFormData(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    const handleClear = () => {
        setFormData(initialFormData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { dataCenter, assignedTo, zone, cabinetRow, location, dateOfInstallation } = formData;
        if (!dataCenter || !assignedTo || !zone || !cabinetRow || !location || !dateOfInstallation) {
            alert("Please ensure all the Required fields are entered");
            return;
        }

        try {
            const response = await addNewCabinet(formData);
            console.log("New cabinet added successfully:", response);
        } catch (error) {
            console.error("Error submitting the form:", error);
            alert("There was an error adding the new cabinet. Please try again.");
        }
    };

    return (
        <div className="container p-5">
            <SessionTimeout show={sessionExpired} onClose={handleModalClose} />
            <form onSubmit={handleSubmit}>
                <div className="container-flex">
                    <h4>Add New Cabinet</h4>
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
                                label={<span>Zone<span style={{ color: 'red' }}>*</span></span>}
                                options={zones}
                                value={formData.zone}
                                onChange={(val) => handleInputChange('zone', val)}
                            />
                            <FormInput
                                type="dropdown"
                                label={<span>Cabinet Row<span style={{ color: 'red' }}>*</span></span>}
                                options={cabinetRows}
                                value={formData.cabinetRow}
                                onChange={(val) => handleInputChange('cabinetRow', val)}
                            />
                            <FormInput
                                type="dropdown"
                                label={<span>Assigned To<span style={{ color: 'red' }}>*</span></span>}
                                options={assignedTos}
                                value={formData.assignedTo}
                                onChange={(val) => handleInputChange('assignedTo', val)}
                            />
                            <FormInput
                                type="dropdown"
                                label={<span>U1 Position<span style={{ color: 'red' }}>*</span></span>}
                                options={['default', 'Bottom', 'Top']}
                                value={formData.u1Position}
                                onChange={(val) => handleInputChange('u1Position', val)}
                            />
                            <FormInput
                                type="text"
                                label={`Cabinet Height(U)`}
                                value={formData.cabinetHeight}
                                onChange={(val) => handleInputChange('cabinetHeight', val)}
                            />
                            <FormInput
                                type="text"
                                label={`Model`}
                                value={formData.model}
                                onChange={(val) => handleInputChange('model', val)}
                            />
                        </div>

                        <div className="col-xl-6 p-1">
                            <FormInput
                                type="text"
                                label={<span>Cabinet/Location<span style={{ color: 'red' }}>*</span></span>}
                                value={formData.location}
                                onChange={(val) => handleInputChange('location', val)}
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
                                label={<span>Date of Installation<span style={{ color: 'red' }}>*</span></span>}
                                value={formData.dateOfInstallation}
                                onChange={(val) => handleInputChange('dateOfInstallation', val)}
                            />
                            <FormInput
                                type="textarea"
                                label="Notes"
                                value={formData.notes}
                                onChange={(val) => handleInputChange('notes', val)}
                                height="115px"
                            />
                        </div>
                    </div>
                    <div className="mt-3">
                        <button type="submit" className="btn btn-primary m-1">Add Cabinet</button>
                        <button type="button" className="btn btn-secondary" onClick={handleClear}>Clear</button>
                    </div>
                </div>
            </form>
        </div>
    )
}
