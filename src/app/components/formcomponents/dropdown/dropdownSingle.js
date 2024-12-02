import React from "react";
import Link from "next/link";
import './dropdown.css'; 

export default function DropdownItemSingle({
  icon,
  itemName,
  Url,  // New prop for the URL
  onSelectItem,
  selectedItem,
}) {
  // Handle the click event to select the item
  const handleClick = () => {
    onSelectItem(itemName);
    // Optionally store in sessionStorage if needed
    sessionStorage.setItem("selectedDropdownItem", itemName);
  };

  return (
    <Link href={Url} passHref legacyBehavior>
      <a
        className={`dropdown-item mb-2 ${selectedItem === itemName ? "selected" : ""}`}
        onClick={handleClick}
      >
        <div className="dropdown-content">
          <img src={icon} alt="icon" className="dropdown-icon" />
          <span className="dropdown-name">{itemName}</span>
        </div>
      </a>
    </Link>
  );
}
