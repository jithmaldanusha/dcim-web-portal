"use client"
import { useEffect, useState } from "react";
import { usePageName } from "../pagenamecontext/page";
import DropdownItemSingle from "../formcomponents/dropdown/dropdownSingle";
import DropdownItem from "../formcomponents/dropdown/dropdown";

export default function Sidebar() {
  const context = usePageName();
  if (!context) return null; // Return null if the context is not available

  const { pageName, setPageName } = context;
  const [openDropdown, setOpenDropdown] = useState(null);
  const [userId, setUserId] = useState('');
  const [userRole, setUserName] = useState('');

  useEffect(() => {
    setOpenDropdown(null);
    setUserName(localStorage.getItem('userRole'));
    setUserId(localStorage.getItem('user'));
  }, [pageName]);

  const handleSelectItem = (itemName) => {
    const newDropdown = openDropdown === itemName ? null : itemName;
    setOpenDropdown(newDropdown);
  };

  const InfrastructurelistItems = [
    { icon: "/formicons/dropdown/cabinet.svg", name: "Add New Cabinet", url: "/dashboard/infrastructure/addnewcabinet" },
    { icon: "/formicons/dropdown/managecabinet.svg", name: "Manage Cabinet", url: "/dashboard/infrastructure/managecabinet" },
    { icon: "/formicons/dropdown/device.svg", name: "Add Device", url: "/dashboard/infrastructure/adddevice" },
    { icon: "/formicons/dropdown/managedevice.svg", name: "Manage Devices", url: "/dashboard/infrastructure/managedevices" },
  ];

  const BulkImportlistItems = [
    { icon: "/formicons/dropdown/Cabinet.svg", name: "Import Devices", url: "/dashboard/infrastructure/importdevices" },
  ];

  const userAccountslistItems = [
    { icon: "/formicons/dropdown/users.svg", name: "My Account", url: "/dashboard/users/manageaccount" },
    { icon: "/formicons/dropdown/users.svg", name: "Manage Users", url: "/dashboard/users/manageusers", disabled: !(userRole === "Admin" || userRole === "Super-Admin") },
  ];

  return (
    <div className="sidebar d-flex flex-column vh-100 p-3 shadow">
      <div className="d-flex justify-content-between p-0 m-0">
        <div className="fs-6 m-0 p-0">
          <small>
            <p className="m-0 p-0">User: {typeof window !== "undefined" && userId}</p>
            <p className="m-0 p-0">Role: {typeof window !== "undefined" && userRole}</p>
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
            onSelectItem={setPageName}
            selectedItem={pageName}
            Url="/dashboard"
          />
          <DropdownItem
            icon="/formicons/dropdown/Buildings2.svg"
            itemName="Infrastructure Management"
            listItems={InfrastructurelistItems}
            selectedItem={pageName}
            onSelectItem={setPageName}
            openDropdown={openDropdown}
            onOpenDropdown={handleSelectItem}
          />
          <DropdownItem
            icon="/formicons/dropdown/Buildings2.svg"
            itemName="Bulk Import"
            listItems={BulkImportlistItems}
            selectedItem={pageName}
            onSelectItem={setPageName}
            openDropdown={openDropdown}
            onOpenDropdown={handleSelectItem}
          />
          <DropdownItem
            icon="/formicons/dropdown/users.svg"
            itemName="User Accounts"
            listItems={userAccountslistItems}
            selectedItem={pageName}
            onSelectItem={setPageName}
            openDropdown={openDropdown}
            onOpenDropdown={handleSelectItem}
          />
        </div>
      </div>
    </div>
  );
}
