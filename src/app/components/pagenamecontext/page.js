'use client'
import { createContext, useState, useContext, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const PageNameContext = createContext();

export function PageNameProvider({ children }) {
  const [pageName, setPageName] = useState("Dashboard");
  const pathname = usePathname();

  const routeToPageName = {
    '/dashboard': 'Dashboard',
    '/dashboard/infrastructure/addnewcabinet': 'Add New Cabinet',
    '/dashboard/infrastructure/managecabinet': 'Manage Cabinet',
    '/dashboard/infrastructure/adddevice': 'Add Device',
    '/dashboard/infrastructure/managedevices': 'Manage Devices',
    '/dashboard/infrastructure/importdevices': 'Import Devices',
    '/dashboard/users/manageaccount': 'My Account',
    '/dashboard/users/manageusers': 'Manage Users',
    // Add more routes as needed
  };

  useEffect(() => {
    const currentPage = routeToPageName[pathname] || 'Dashboard';
    setPageName(currentPage);
  }, [pathname]);

  return (
    <PageNameContext.Provider value={{ pageName, setPageName }}>
      {children}
    </PageNameContext.Provider>
  );
}

export function usePageName() {
  return useContext(PageNameContext);
}
