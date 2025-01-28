"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const DeleteCabinetWindow = () => {
    const [requestStatus, setRequestStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({});
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
            const { cabinetID } = formData;
            console.log(cabinetID)
            const response = await axios.delete(`${API_BASE_URL}/api/cabinets/deleteCabinet/${cabinetID}`);
            const result = response.data;

            if (result.success) {
                alert('Cabinet approved and deleted successfully!');

                await axios.post(`${API_BASE_URL}/api/requests/updateStatus/${requestID}`, {
                    status: 'Approved',
                });

                window.close();
            } else {
                alert('Error approving cabinet: ' + result.error);
            }
        } catch (error) {
            console.error('Error approving cabinet:', error);
            alert('Error approving cabinet: ' + error.message);
        }
    };


    const handleReject = async () => {
        try {
            await axios.post(`${API_BASE_URL}/api/requests/updateStatus/${requestID}`, {
                status: 'Rejected',
            });

            alert('Cabinet request rejected.');
            window.close();
        } catch (error) {
            console.error('Error rejecting cabinet request:', error);
            alert('Error rejecting cabinet request: ' + error.message);
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
            <h4 className="mb-4">Remove Cabinet request {`(RequestID: ${requestID})`}</h4>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Data Center</th>
                        <th>Location</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{formData.datacenter}</td>
                        <td>{formData.location}</td>
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

export default DeleteCabinetWindow;
