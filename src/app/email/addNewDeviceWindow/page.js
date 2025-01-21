"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const AddNewDeviceWindow = () => {
    const [requestStatus, setRequestStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [deviceData, setFormData] = useState({});
    const [requestID, setRequestID] = useState(null);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const reqID = urlParams.get('requestID');
        setRequestID(reqID);

        const data = {};
        urlParams.forEach((value, key) => {
            if (key !== 'requestID') {
                data[key] = value;
            }
        });

        setFormData(data);
        console.log(data)
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
            const response = await axios.post(`${API_BASE_URL}/api/devices/addDevice`, deviceData);
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
            <h4 className="mb-4">New Device request {`(RequestID: ${requestID})`}</h4>
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
                    <tr>
                        <td>{deviceData.dataCenter}</td>
                        <td>{deviceData.location}</td>
                        <td>{deviceData.manufacturer}</td>
                        <td>{deviceData.model}</td>
                        <td>{deviceData.owner}</td>
                        <td>{deviceData.primaryContact}</td>
                        <td>{deviceData.position}</td>
                        <td>{deviceData.label}</td>
                        <td>{deviceData.hostname}</td>
                        <td>{deviceData.serialNo}</td>
                        <td>{deviceData.assetTag}</td>
                        <td>{deviceData.installDate}</td>
                        <td>{deviceData.reservation}</td>
                    </tr>
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

export default AddNewDeviceWindow;
