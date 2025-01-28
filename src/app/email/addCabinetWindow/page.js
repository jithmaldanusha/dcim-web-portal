"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const AddCabinetWindow = () => {
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
      const response = await axios.post(`${API_BASE_URL}/api/cabinets/addCabinet`, formData);
      const result = response.data;

      if (result.success) {
        alert('Cabinet approved successfully!');

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
      <h4 className="mb-4">New Cabinet request {`(RequestID: ${requestID})`}</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Data Center</th>
            <th>Location</th>
            <th>Assigned To</th>
            <th>Zone</th>
            <th>Cabinet Row</th>
            <th>Cabinet Height</th>
            <th>U1 Position</th>
            <th>Model</th>
            <th>Key Lock Info</th>
            <th>Max KW</th>
            <th>Max Weight</th>
            <th>Date of Installation</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{formData.dataCenter}</td>
            <td>{formData.location}</td>
            <td>{formData.assignedTo}</td>
            <td>{formData.zone}</td>
            <td>{formData.cabinetRow}</td>
            <td>{formData.cabinetHeight}</td>
            <td>{formData.u1Position}</td>
            <td>{formData.model}</td>
            <td>{formData.keyLockInfo}</td>
            <td>{formData.maxKW}</td>
            <td>{formData.maxWeight}</td>
            <td>{formData.dateOfInstallation}</td>
            <td>{formData.notes}</td>
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

export default AddCabinetWindow;
