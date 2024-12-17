"use client"; // This is a client-side component
import { usePageName } from "../pagenamecontext/page";
import './page.css';

export default function TopNavbar() {
  const { pageName } = usePageName();

  return (
    <nav className="navbar custom-nav" style={{ backgroundColor: 'blue' }}>
      <div className="container-fluid">
        <p className="fs-4 m-0 p-2 text-light">
          {pageName} {/* Display the dynamic pagename */}
        </p>
      </div>
    </nav>
  );
}
