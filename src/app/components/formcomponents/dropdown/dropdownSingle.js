import React from "react";
import Link from "next/link";
import { usePageName } from "../../pagenamecontext/page";
import './dropdown.css'; 

export default function DropdownItemSingle({
  icon,
  itemName,
  Url,  // New prop for the URL
  onSelectItem,
  selectedItem,
}) {
  const { setPageName } = usePageName();
  // Handle the click event to select the item
  const handleClick = () => {
    onSelectItem(itemName);
    setPageName(itemName);
    console.log(itemName);
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
