"use client"
import { useState } from "react";
import { usePageName } from "../pagenamecontext/page";
import { Logout } from "@/app/api/session";
import Confirmation from "../utils/confirmationmodal";
import './page.css';

export default function TopNavbar() {
  const [isClicked, setIsClicked] = useState(false);
  const [showModal, setShowModal] = useState(false);

  if (typeof window === 'undefined') {
    // Return nothing during SSR/SSG to avoid using the context
    return null;
  }

  const { pageName } = usePageName();

  const handleLogoutClick = () => {
    setIsClicked(true);
    setShowModal(true);
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
      setShowModal(false);
    }
  };

  return (
    <>
      <nav className="navbar custom-nav" style={{ backgroundColor: 'blue' }}>
        <div className="container-fluid">
          <p className="fs-4 m-0 p-2 text-light">
            {pageName}
          </p>

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

      <Confirmation
        show={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmLogout}
        message="Are you sure you want to log out?"
      />
    </>
  );
}
