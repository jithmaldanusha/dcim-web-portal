"use client";
import { useEffect, useState } from "react";
import { ValidateToken } from "../api/session";
import { useRouter } from "next/navigation";
import SessionTimeout from "../components/utils/sessiontimeout";

export default function Dashboard() {
  const router = useRouter();
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setSessionExpired(true);
      return;
    }

    const validateAndHandleExpiration = async () => {
      try {
        await ValidateToken(token);
      } catch (error) {
        localStorage.removeItem("token");
        setSessionExpired(true); // Show the modal on session expiration
      }
    };

    validateAndHandleExpiration();
  }, [router]);

  const handleModalClose = () => {
    setSessionExpired(false);
    router.push("/"); // Redirect to login
  };

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      {/* Add dashboard content here */}
      <SessionTimeout show={sessionExpired} onClose={handleModalClose} />
    </div>
  );
}
