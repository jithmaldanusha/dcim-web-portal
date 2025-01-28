"use client";
import { useEffect, useState } from "react";
import { ValidateToken } from "../api/session";
import { useRouter } from "next/navigation";
import SessionTimeout from "../components/utils/sessiontimeout";
import { fetchPendingRequests, fetchRejectedRequests } from "../api/requests"; // Import the new API function

export default function Dashboard() {
  const router = useRouter();
  const [sessionExpired, setSessionExpired] = useState(false);
  const [user, setUser] = useState('');
  const [pendingRequests, setPendingRequests] = useState([]); // State to hold pending requests
  const [rejectedRequests, setRejectedRequests] = useState([]); // State to hold rejected requests

  useEffect(() => {
    const token = localStorage.getItem("token");
    setUser(localStorage.getItem("user"));
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

    // Fetch pending and rejected requests on load
    const getPendingRequests = async () => {
      try {
        const response = await fetchPendingRequests();
        setPendingRequests(response.data); // Set pending requests in state
      } catch (error) {
        console.error('Error fetching pending requests:', error);
      }
    };

    const getRejectedRequests = async () => {
      try {
        const response = await fetchRejectedRequests();
        setRejectedRequests(response.data); // Set rejected requests in state
      } catch (error) {
        console.error('Error fetching rejected requests:', error);
      }
    };

    getPendingRequests();
    getRejectedRequests();
  }, [router]);

  const handleModalClose = () => {
    setSessionExpired(false);
    window.location.href = "/";
  };

  return (
    <div className="container p-5">
      <SessionTimeout show={sessionExpired} onClose={handleModalClose} />

      <h4>
        Hello <span style={{ color: 'green' }}>{user}</span>, Welcome to IDC Manager!
      </h4>

      {/* Two equal sections for tables */}
      <div className="row mt-5">
        {/* Left section: Pending Requests */}
        <div className="col-6">
          <h6>Pending Requests</h6>
          <div className="outer-container bg-warning shadow rounded" style={{ height: '50%' }}>
            <div className="inner-container p-3" style={{ height: '100%', overflowY: 'auto' }}>
              <table className="table table-striped">
                <thead style={{ position: 'sticky', top: 0 }}>
                  <tr>
                    <th>Request ID</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingRequests.length > 0 ? (
                    pendingRequests.map((request) => {
                      const date = new Date(request.DateTime).toLocaleDateString();
                      const time = new Date(request.DateTime).toLocaleTimeString();
                      return (
                        <tr key={request.RequestID}>
                          <td>{request.RequestID}</td>
                          <td>{request.Status}</td>
                          <td>{date}</td>
                          <td>{time}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4">No pending requests found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right section: Rejected Requests */}
        <div className="col-6">
          <h6>Rejected Requests</h6>
          <div className="outer-container bg-danger shadow rounded" style={{ height: '50%' }}>
            <div className="inner-container p-3" style={{ height: '100%', overflowY: 'auto' }}>
              <table className="table table-striped">
                <thead style={{ position: 'sticky', top: 0 }}>
                  <tr>
                    <th>Request ID</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {rejectedRequests.length > 0 ? (
                    rejectedRequests.map((request) => {
                      const date = new Date(request.DateTime).toLocaleDateString();
                      const time = new Date(request.DateTime).toLocaleTimeString();
                      return (
                        <tr key={request.RequestID}>
                          <td>{request.RequestID}</td>
                          <td>{request.Status}</td>
                          <td>{date}</td>
                          <td>{time}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="4">No rejected requests found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
