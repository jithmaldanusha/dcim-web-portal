"use client";
import { useState } from "react";
import { usePageName } from "../pagenamecontext/page";
import './page.css';
import { Logout } from "@/app/api/session";
import Confirmation from "../utils/confirmationmodal";

export default function TopNavbar() {
  const { pageName } = usePageName();
  const [isClicked, setIsClicked] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleLogoutClick = () => {
    setIsClicked(true); // Turn the icon red
    setShowModal(true); // Show confirmation modal
  };

  const handleConfirmLogout = async () => {
    const userId = localStorage.getItem('user');
    try {
      await Logout(userId);
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error.message);
    } finally {
      setShowModal(false); // Close the modal after action
    }
  };

  return (
    <>
      <nav className="navbar custom-nav" style={{ backgroundColor: 'blue' }}>
        <div className="container-fluid">
          <p className="fs-4 m-0 p-2 text-light">
            {pageName} {/* Display the dynamic pagename */}
          </p>
          
          {/* Logout icon with tooltip */}
          <div className="logout-icon-wrapper">
            <img
              src="/formicons/logout.svg"
              alt="Logout"
              className={`logout-icon ${isClicked ? 'clicked' : ''}`} 
              onClick={handleLogoutClick}
            />
            <span className="tooltip-text">Logout</span>
          </div>
        </div>
      </nav>

      {/* Confirmation modal */}
      <Confirmation
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmLogout}
        message="Are you sure you want to log out?"
      />
    </>
  );
}
