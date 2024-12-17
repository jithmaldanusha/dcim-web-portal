// components/PageNameContext.js
'use client'
import { createContext, useState, useContext } from 'react';

const PageNameContext = createContext();

export function PageNameProvider({ children }) {
  const [pageName, setPageName] = useState("Dashboard"); // Default page name

  return (
    <PageNameContext.Provider value={{ pageName, setPageName }}>
      {children}
    </PageNameContext.Provider>
  );
}

export function usePageName() {
  return useContext(PageNameContext);
}
