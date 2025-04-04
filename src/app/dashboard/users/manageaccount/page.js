"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { updateUsernameAPI, updateEmailAPI, updatePasswordAPI, updateRoleAPI, fetchUserData, updateEmailPassAPI } from "@/app/api/useraccounts";
import FormInput from "@/app/components/formcomponents/form_input/page";
import Confirmation from "@/app/components/utils/confirmationmodal";
import { Logout, ValidateToken } from "@/app/api/session";
import SessionTimeout from "@/app/components/utils/sessiontimeout";

export default function ManageAccount() {
    const [sessionExpired, setSessionExpired] = useState(false);
    const [message, setConfirmationMessage] = useState();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationAction, setConfirmationAction] = useState(null);
    const [feedback, setFeedback] = useState("");
    const [userData, setUserData] = useState({
        userId: "",
        email: "",
        role: "",
        emailPass: ""
    });


    useEffect(() => {
        const storedUserId = localStorage.getItem("user");
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
                setSessionExpired(true);
              }
            };

        const getUser = async () => {
            try {
                if (storedUserId) {
                    const response = await fetchUserData(storedUserId);
                    setUserData({
                        userId: response.data.UserID,
                        email: response.data.Email,
                        role: response.data.Role,
                        emailPass: response.data.EmailPass
                    });
                } else {
                    console.error("User ID not found in localStorage.");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        getUser();
        validateAndHandleExpiration();
    }, []);

    const handleModalClose = () => {
        setSessionExpired(false);
        window.location.href = "/";
      };

    const [formData, setFormData] = useState({
        newUserId: "",
        newUserEmail: "",
        newUserEmailPass: "",
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
        newRole: "",
    });

    const handleInputChange = (field, value) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    const showConfirmationModal = (action, message) => {
        setConfirmationAction(() => action);
        setConfirmationMessage(message);
        setShowConfirmation(true);
    };

    const handleConfirmOk = async () => {
        if (confirmationAction) await confirmationAction();
        setShowConfirmation(false);
    };

    const handleConfirmClose = () => {
        setShowConfirmation(false);
    };

    const updateUsername = async () => {
        try {
            const response = await updateUsernameAPI(formData.newUserId, userData.userId);
            setFeedback(response.message || "Username updated successfully!");
            if (response) {
                await Logout(userData.userId);
                localStorage.removeItem("token");
                window.location.href = '/';
            }
        } catch (error) {
            setFeedback(error.message || "Error updating username.");
        }
    };


    const updateEmail = async () => {
        try {
            const response = await updateEmailAPI(formData.newUserEmail, userData.userId);
            setFeedback(response.message || "Email updated successfully!");
        } catch (error) {
            setFeedback(error.message || "Error updating Email.");
        }
    };

    const updateEmailPass = async () => {
        try {
            const response = await updateEmailPassAPI(formData.newUserEmailPass, userData.userId);
            setFeedback(response.message || "Email password updated successfully!");
        } catch (error) {
            setFeedback(error.message || "Error updating email password.");
        }
    };

    const updatePassword = async () => {
        if (formData.newPassword !== formData.confirmNewPassword) {
            setFeedback("Passwords do not match.");
            return;
        }
        try {
            const response = await updatePasswordAPI(formData.currentPassword, formData.newPassword, userData.userId);
            setFeedback(response.message || "Password updated successfully!");
        } catch (error) {
            setFeedback(error.message || "Error updating password.");
        }
    };

    return (
        <section className="container p-5">
            <SessionTimeout show={sessionExpired} onClose={handleModalClose} />
            {feedback && <p>{feedback}</p>}

            <Confirmation
                show={showConfirmation}
                onClose={handleConfirmClose}
                onConfirm={handleConfirmOk}
                message={message}
            />

            <div className="container">
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID(Username)</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Email Password Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{userData.userId}</td>
                            <td>{userData.email ? userData.email : "Not provided"}</td>
                            <td>{userData.role}</td>
                            <td>
                                <span style={{ color: userData.emailPass ? 'green' : 'red' }}>
                                    {userData.emailPass ? "Set" : "Not Set"}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <hr />
            <div className="mt-4">
                <h5>Manage Credentials</h5>
                <div className="d-flex mt-1">
                    <FormInput
                        type="text"
                        label="Edit Username"
                        placeholder="Enter new username"
                        value={formData.newUserId}
                        onChange={(val) => handleInputChange("newUserId", val)}
                    />
                    <button
                        className="btn btn-primary h-75 m-4 p-2"
                        onClick={() => showConfirmationModal(
                            () => updateUsername(),
                            `Are you sure you want to change the username to: '${formData.newUserId}'? 
                            You will be logged out of dcim once the username is changed.`
                        )}
                    >
                        Update Username
                    </button>

                </div>

                {/* Update Password */}
                <FormInput
                    type="text"
                    label="Enter Current Password"
                    value={formData.currentPassword}
                    onChange={(val) => handleInputChange("currentPassword", val)}
                />
                <FormInput
                    type="text"
                    label="Enter New Password"
                    value={formData.newPassword}
                    onChange={(val) => handleInputChange("newPassword", val)}
                />
                <FormInput
                    type="text"
                    label="Confirm New Password"
                    value={formData.confirmNewPassword}
                    onChange={(val) => handleInputChange("confirmNewPassword", val)}
                />
                <button
                    className="btn btn-primary"
                    onClick={() => showConfirmationModal(() => updatePassword(), "Are you sure you want to update the password?")}
                >
                    Update Password
                </button>
            </div>
            <hr />
            <div className="mt-4">
                <h5>Email Configuration</h5>
                <div className="d-flex mt-1">
                    <FormInput
                        type="text"
                        label="Edit Email"
                        placeholder="Enter new email"
                        value={userData.email}
                        onChange={(val) => handleInputChange("newUserEmail", val)}
                    />
                    <button
                        className="btn btn-primary h-75 m-4 p-2"
                        onClick={() => showConfirmationModal(() => updateEmail(), `Are you sure you want to change the email to: '${formData.newUserEmail}'?`)}
                    >
                        Update Email
                    </button>
                </div>
                <div className="d-flex mt-1">
                    <FormInput
                        type="password"
                        label="Set Email Password"
                        placeholder="Enter new password"
                        onChange={(val) => handleInputChange("newUserEmailPass", val)}
                    />
                    <button
                        className="btn btn-primary h-75 m-4 p-2"
                        onClick={() => showConfirmationModal(() => updateEmailPass(), `Are you sure you want to set the password as: '${formData.newUserEmailPass}'?`)}
                    >
                        Update Email Password
                    </button>
                </div>
            </div>


        </section>
    );
}
