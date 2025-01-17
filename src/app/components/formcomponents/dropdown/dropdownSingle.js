import React from "react";
import Link from "next/link";
import { usePageName } from "../../pagenamecontext/page";
import './dropdown.css'; 

export default function DropdownItemSingle({
  icon,
  itemName,
  Url,
  onSelectItem,
  selectedItem,
}) {
  const { setPageName } = usePageName();

  const handleClick = () => {
    onSelectItem(itemName);
    setPageName(itemName);
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
