"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const BulkApproveDevices = () => {
    const [requestStatus, setRequestStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [devices, setDevices] = useState([]);
    const [requestID, setRequestID] = useState(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const reqID = urlParams.get("requestID");
        setRequestID(reqID);
        console.log(urlParams);
    
        // Parse the device data from URL parameters
        const parsedDevices = [];
        const deviceKeys = Object.keys(urlParams);
        
        // Filter out the 'requestID' key and process device fields
        deviceKeys.forEach((key) => {
            if (key !== "requestID") {
                const match = key.match(/^devices\[(\d+)\]\[(\w+)\]$/);
                if (match) {
                    const deviceIndex = match[1]; // e.g., 0, 1, 2, ...
                    const field = match[2]; //tbc
    
                    // Initialize the device if it doesn't exist
                    if (!parsedDevices[deviceIndex]) {
                        parsedDevices[deviceIndex] = {};
                    }
    
                    // Use decodeURIComponent to decode any encoded values
                    parsedDevices[deviceIndex][field] = decodeURIComponent(urlParams.get(key));
                }
            }
        });
    
        // Set devices after parsing the query string
        setDevices(parsedDevices);
        console.log(parsedDevices);
        setIsLoading(false);
    }, []);
    
    const handleBulkApprove = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/devices/bulkImport`, { devices });
            const result = response.data;

            if (result.success) {
                alert("Devices approved successfully!");

                await axios.post(`${API_BASE_URL}/api/requests/updateStatus/${requestID}`, {
                    status: "Approved",
                });

                window.close();
            } else {
                alert("Error approving devices: " + result.error);
            }
        } catch (error) {
            console.error("Error approving devices:", error);
            alert("Error approving devices: " + error.message);
        }
    };

    const handleReject = async () => {
        try {
            await axios.post(`${API_BASE_URL}/api/requests/updateStatus/${requestID}`, {
                status: "Rejected",
            });

            alert("Device request rejected.");
            window.close();
        } catch (error) {
            console.error("Error rejecting device request:", error);
            alert("Error rejecting device request: " + error.message);
        }
    };

    if (isLoading) {
        return (
            <div className="container mt-5 text-center">
                <h4>Loading...</h4>
            </div>
        );
    }

    if (requestStatus === "Approved" || requestStatus === "Rejected") {
        return (
            <div className="container mt-5 text-center">
                <h4>This request has been {requestStatus} by the Admin!</h4>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h4 className="mb-4">Bulk Import Device Approval (RequestID: {requestID})</h4>
            <table className="table table-bordered">
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
                        <th>Install Date</th>
                        <th>Reservation</th>
                    </tr>
                </thead>
                <tbody>
                    {devices.map((device, index) => (
                        <tr key={index}>
                            <td>{device.dataCenter}</td>
                            <td>{device.cabinet}</td>
                            <td>{device.manufacturer}</td>
                            <td>{device.model}</td>
                            <td>{device.owner}</td>
                            <td>{device.primaryContact}</td>
                            <td>{device.position}</td>
                            <td>{device.label}</td>
                            <td>{device.hostname}</td>
                            <td>{device.serialNo}</td>
                            <td>{device.assetTag}</td>
                            <td>{new Date(device.installDate).toLocaleDateString()}</td>
                            <td>{device.reservation}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="d-flex">
                <button onClick={handleBulkApprove} className="btn btn-success me-2">
                    Approve All
                </button>
                <button onClick={handleReject} className="btn btn-danger">
                    Reject
                </button>
            </div>
        </div>
    );
};

export default BulkApproveDevices;
