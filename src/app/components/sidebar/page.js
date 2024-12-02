"use client"
import { useState, useEffect } from "react";
import DropdownItem from "../formcomponents/dropdown/dropdown";
import DropdownItemSingle from "../formcomponents/dropdown/dropdownSingle";

export default function Sidebar() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  // Retrieve openDropdown state from sessionStorage when the component mounts
  useEffect(() => {
    const savedDropdown = sessionStorage.getItem("openDropdown");
    if (savedDropdown) {
      setOpenDropdown(savedDropdown);
    }
  }, []);

  // Function to handle when a dropdown item is selected
  const handleSelectItem = (itemName) => {
    const newDropdown = openDropdown === itemName ? null : itemName;
    setOpenDropdown(newDropdown);
    sessionStorage.setItem("openDropdown", newDropdown); // Store in session storage
  };

  const InfrastructurelistItems = [
    { icon: "/formicons/dropdown/Cabinet.svg", name: "Edit Cabinets", url: "/dashboard/infrastructure/editcabinets" },
    { icon: "/formicons/dropdown/Buildings1.svg", name: "Edit Data Centers", url: "/dashboard/infrastructure/editdatacenters" },
    { icon: "/formicons/dropdown/Container.svg", name: "Edit Containers", url: "/subitem1" },
    { icon: "/formicons/dropdown/Location.svg", name: "Edit Zones", url: "/subitem1" },
    { icon: "/formicons/dropdown/Flex-rows.svg", name: "Edit Rows of Cabinets", url: "/subitem1" },
    { icon: "/formicons/dropdown/Image3.svg", name: "Edit Images", url: "/subitem1" }
  ];

  return (
    <div className="sidebar d-flex flex-column vh-100 p-3 shadow-lg">
      <div className="d-flex justify-content-between p-0 m-0">
        <div className="fs-6 m-0 p-0">
          <small>
            <p className="m-0 p-0">User : Yohani</p>
            <p className="m-0 p-0">Role : Technician</p>
          </small>
        </div>
        <img src="/idclogo.svg" alt="Company Logo" className="img-fluid" style={{ width: "120px" }} />
      </div>

      <hr />

      <div className="container rounded-3 border border-secondary border-2 vh-100">
        <div className="mt-3">
          <DropdownItemSingle
            icon="formicons/dropdown/Dashboard.svg"
            itemName="Dashboard"
            onSelectItem={setSelectedItem}
            selectedItem={selectedItem}
            Url="/dashboard"
          />
          <DropdownItem
            icon="/formicons/dropdown/Buildings2.svg"
            itemName="Infrastructure Management"
            listItems={InfrastructurelistItems}
            selectedItem={selectedItem}
            onSelectItem={setSelectedItem}
            openDropdown={openDropdown}
            onOpenDropdown={handleSelectItem}
          />
          <DropdownItem
            icon="/formicons/dropdown/Buildings2.svg"
            itemName="Bulk Import"
            listItems={InfrastructurelistItems}
            selectedItem={selectedItem}
            onSelectItem={setSelectedItem}
            openDropdown={openDropdown}
            onOpenDropdown={handleSelectItem}
          />

        </div>
      </div>
    </div>
  );
}
