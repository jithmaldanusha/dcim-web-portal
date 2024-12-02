import React from "react";
import Link from "next/link";
import './dropdown.css';

export default function DropdownItem({
  icon,
  itemName,
  listItems,
  selectedItem,
  onSelectItem,
  openDropdown,
  onOpenDropdown,
}) {
  // Check if this dropdown item is the currently open one
  const isSelected = openDropdown === itemName;

  // Handle the click event to toggle the dropdown visibility
  const handleClick = () => {
    // Toggle the dropdown open state
    onOpenDropdown(itemName);
  };

  // Function to handle list item selection and store in session storage
  const handleSelectItem = (itemName) => {
    // Save the selected item to sessionStorage
    sessionStorage.setItem("selectedDropdownItem", itemName);
    console.log(sessionStorage.getItem("selectedDropdownItem"))
    // Call the external onSelectItem function if needed
    onSelectItem(itemName);
  };

  return (
    <div className="dropdown-item-container">
      <div
        className={`dropdown-item ${isSelected ? "selected" : ""}`}
        onClick={handleClick}
      >
        <div className="dropdown-content">
          <img src={icon} alt="icon" className="dropdown-icon" />
          <span className="dropdown-name">{itemName}</span>
          <img
            src={isSelected ? "/formicons/dropdown/chevron-up.svg" : "/formicons/dropdown/chevron-down.svg"}
            alt="arrow"
            className="dropdown-arrow"
          />
        </div>
      </div>

      {/* Display the dropdown list only when the dropdown item is selected (open) */}
      {isSelected && (
        <ul className="dropdown-list">
          {listItems.map((item, index) => (
            <li className={`dropdown-list-item m-1 ${selectedItem === item.name ? "list-selected" : ""}`} key={index}>
              <Link href={item.url} passHref legacyBehavior>
                <a className="d-flex align-items-center" onClick={() => handleSelectItem(item.name)}>
                  <img src={item.icon} alt={item.name} className="dropdown-list-icon" />
                  <span className="dropdown-list-name">{item.name}</span>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
