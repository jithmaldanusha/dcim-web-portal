"use client";
import React, { useState } from "react";
import Link from "next/link";  // Import Link from Next.js
import './dropdown.css';

export default function DropdownListItem({ icon, name, url }) {
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = () => {
    setIsSelected(true);
  };

  return (
    <li className={`dropdown-list-item ${isSelected ? "list-selected" : ""}`}>
      <Link href={url} passHref onClick={handleClick}>
        <div className="d-flex align-items-center">
          <img src={icon} alt="icon" className="dropdown-list-icon" />
          <span className="dropdown-list-name">{name}</span>
        </div>
      </Link>
    </li>
  );
}
