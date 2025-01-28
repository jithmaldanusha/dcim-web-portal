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
  const isSelected = openDropdown === itemName;

  const handleClick = () => {
    onOpenDropdown(itemName);
  };

  const handleSelectItem = (itemName) => {
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

      {isSelected && (
        <ul className="dropdown-list">
          {listItems.map((item, index) => (
            <li
              className={`dropdown-list-item shadow-sm m-1 ${selectedItem === item.name ? "list-selected" : ""} ${item.disabled ? "disabled-dropdown-item" : ""}`}
              key={index}
            >
              {!item.disabled ? (
                <Link href={item.url} passHref legacyBehavior>
                  <a className="d-flex align-items-center" onClick={() => handleSelectItem(item.name)}>
                    <img src={item.icon} alt={item.name} className="dropdown-list-icon" />
                    <span className="dropdown-list-name">{item.name}</span>
                  </a>
                </Link>
              ) : (
                <div className="d-flex align-items-center disabled-dropdown">
                  <img src={item.icon} alt={item.name} className="dropdown-list-icon" />
                  <span className="dropdown-list-name">{item.name}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
