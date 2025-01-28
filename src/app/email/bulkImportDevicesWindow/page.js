"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const AddBulkDevicesWindow = () => {
    const [requestStatus, setRequestStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [deviceData, setDeviceData] = useState([]);
    const [requestID, setRequestID] = useState(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const reqID = urlParams.get('requestID');
        setRequestID(reqID);

        // Extract devices from the URL parameters
        const devices = [];
        let deviceIndex = 0;

        while (urlParams.has(`devices[${deviceIndex}][model]`)) {
            const device = {};
            urlParams.forEach((value, key) => {
                const deviceMatch = key.match(new RegExp(`devices\\[${deviceIndex}\\]\\[(.*)\\]`));
                if (deviceMatch) {
                    device[deviceMatch[1]] = value;
                }
            });
            devices.push(device);
            deviceIndex++;
        }

        setDeviceData(devices);

        const checkRequestStatus = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/requests/getStatus/${reqID}`);
                const result = response.data;

                if (result.status) {
                    setRequestStatus(result.status);
                }
            } catch (error) {
                console.error('Error fetching request status:', error);
                alert('Error fetching request status');
                window.close();
            } finally {
                setIsLoading(false);
            }
        };

        if (reqID) {
            checkRequestStatus();
        }
    }, []);

    const handleApprove = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/devices/bulkImport`, { data: deviceData });
            const result = response.data;

            if (result) {
                alert(result.message);

                await axios.post(`${API_BASE_URL}/api/requests/updateStatus/${requestID}`, {
                    status: 'Approved',
                });

                window.close();
            } else {
                alert('Error approving devices: ' + result.error);
            }
        } catch (error) {
            console.error('Error approving devices:', error);
            alert('Error approving devices: ' + error.message);
        }
    };

    const handleReject = async () => {
        try {
            await axios.post(`${API_BASE_URL}/api/requests/updateStatus/${requestID}`, {
                status: 'Rejected',
            });

            alert('Device request rejected.');
            window.close();
        } catch (error) {
            console.error('Error rejecting device request:', error);
            alert('Error rejecting device request: ' + error.message);
        }
    };

    if (isLoading) {
        return (
            <div className="container mt-5 text-center">
                <h4>Loading...</h4>
            </div>
        );
    }

    if (requestStatus === 'Approved' || requestStatus === 'Rejected') {
        return (
            <div className="container mt-5 text-center">
                <h4>This request has been {requestStatus} by the Admin!</h4>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <h4 className="mb-4">New Bulk Device request {`(RequestID: ${requestID})`}</h4>
            <table className="table table-bordered overflow-scroll">
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
                        <th>Serial Number</th>
                        <th>Asset Tag</th>
                        <th>Install Date</th>
                        <th>Reservation</th>
                    </tr>
                </thead>
                <tbody>
                    {deviceData.map((device, index) => (
                        <tr key={index}>
                            <td>{device.dataCenter}</td>
                            <td>{device.cabinet.split(' - ')[1]}</td>
                            <td>{device.manufacturer}</td>
                            <td>{device.model}</td>
                            <td>{device.owner}</td>
                            <td>{device.primaryContact}</td>
                            <td>{device.position}</td>
                            <td>{device.label}</td>
                            <td>{device.hostname}</td>
                            <td>{device.serialNo}</td>
                            <td>{device.assetTag}</td>
                            <td>{device.installDate}</td>
                            <td>{device.reservation}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="d-flex">
                <button onClick={handleApprove} className="btn btn-success me-2">
                    Approve
                </button>
                <button onClick={handleReject} className="btn btn-danger">
                    Reject
                </button>
            </div>
        </div>
    );
};

export default AddBulkDevicesWindow;
