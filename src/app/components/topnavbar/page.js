"use client"; // This is a client-side component
import { useState, useEffect } from "react";

export default function TopNavbar() {
  const [pagename, setPageName] = useState("Dashboard"); // Default page name

  useEffect(() => {
    // Retrieve the pagename from sessionStorage when the component mounts
    const storedPageName = sessionStorage.getItem("selectedDropdownItem");
    if (storedPageName) {
      setPageName(storedPageName);
    }
  }, []); // Run only once after the component mounts

  return (
    <nav className="navbar navbar-light" style={{ backgroundColor: 'blue' }}>
      <div className="container-fluid">
        <p className="fw-bold fs-4 m-0 p-2">
          {pagename} {/* Display the dynamic pagename */}
        </p>
      </div>
    </nav>
  );
}
