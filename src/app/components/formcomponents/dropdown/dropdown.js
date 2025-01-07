import React from "react";
import Link from "next/link";
import { usePageName } from "../../pagenamecontext/page";
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
  const { setPageName } = usePageName();
  const isSelected = openDropdown === itemName;

  // Handle the click event to toggle the dropdown visibility
  const handleClick = () => {
    onOpenDropdown(itemName);
  };

  // Function to handle list item selection and store in session storage
  const handleSelectItem = (itemName) => {
    onSelectItem(itemName);
    setPageName(itemName);
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
            <li className={`dropdown-list-item shadow-sm m-1 ${selectedItem === item.name ? "list-selected" : ""}`} key={index}>
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
