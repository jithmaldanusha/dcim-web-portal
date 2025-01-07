"use client"
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from "react";
import DropdownItem from "../formcomponents/dropdown/dropdown";
import DropdownItemSingle from "../formcomponents/dropdown/dropdownSingle";

export default function Sidebar() {

  const [selectedItem, setSelectedItem] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [loggedUser, setLoggedUser] = useState(null);
  const [loggedUserRole, setLoggedUserRole] = useState(null);

  useEffect(() => {
    setLoggedUser(localStorage.getItem('user'))
    setLoggedUserRole(localStorage.getItem('userRole'))
  });

  // Function to handle when a dropdown item is selected
  const handleSelectItem = (itemName) => {
    const newDropdown = openDropdown === itemName ? null : itemName;
    setOpenDropdown(newDropdown);
  };

  const InfrastructurelistItems = [
    { icon: "/formicons/dropdown/Cabinet.svg", name: "Add New Cabinet", url: "/dashboard/infrastructure/editcontainers" },
    { icon: "/formicons/dropdown/Cabinet.svg", name: "Manage Cabinet", url: "/dashboard/infrastructure/managecabinet" },  
  ];

  const BulkImportlistItems = [
    { icon: "/formicons/dropdown/Cabinet.svg", name: "Import Devices", url: "/dashboard/infrastructure/importdevices" },
  ];

  const userAccountslistItems = [
    { icon: "/formicons/dropdown/users.svg", name: "My Account", url: "/dashboard/users/manageaccount" },
    { icon: "/formicons/dropdown/users.svg", name: "Manage Users", url: "/dashboard/users/manageusers" },
  ];

  return (
    <div className="sidebar d-flex flex-column vh-100 p-3 shadow">
      <div className="d-flex justify-content-between p-0 m-0">
        <div className="fs-6 m-0 p-0">
          <small>
            <p className="m-0 p-0">User : {loggedUser}</p>
            <p className="m-0 p-0">Role : {loggedUserRole}</p>
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
            listItems={BulkImportlistItems}
            selectedItem={selectedItem}
            onSelectItem={setSelectedItem}
            openDropdown={openDropdown}
            onOpenDropdown={handleSelectItem}
          />

          <DropdownItem
            icon="/formicons/dropdown/users.svg"
            itemName="User Accounts"
            listItems={userAccountslistItems}
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
