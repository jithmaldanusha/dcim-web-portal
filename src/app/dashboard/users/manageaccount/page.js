"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { updateUsernameAPI, updateEmailAPI, updatePasswordAPI, updateRoleAPI, getAllUsers, fetchUserData } from "@/app/api/useraccounts";
import FormInput from "@/app/components/formcomponents/form_input/page";
import Confirmation from "@/app/components/utils/confirmationmodal";

export default function ManageAccount() {
    const router = useRouter();
    const [userID, setUserId] = useState();
    const [userRole, setUserRole] = useState();
    const [userEmail, setUserEmail] = useState();
    const [message, setConfirmationMessage] = useState();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationAction, setConfirmationAction] = useState(null);
    const [feedback, setFeedback] = useState("");

    useEffect(() => {
        // Fetch local storage values directly
        const storedUserId = localStorage.getItem("user");
        const storedUserRole = localStorage.getItem("userRole");

        setUserId(storedUserId);
        setUserRole(storedUserRole);

        const getUser = async () => {
            try {
                if (storedUserId) {
                    const response = await fetchUserData(storedUserId);
                    setUserEmail(response.data.Email);
                } else {
                    console.error("User ID not found in localStorage.");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        getUser();
    }, []);

    const [formData, setFormData] = useState({
        newUserId: "",
        newUserEmail: "",
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
            const response = await updateUsernameAPI(formData.newUserId, userID);
            setFeedback(response.message || "Username updated successfully!");
        } catch (error) {
            setFeedback(error.message || "Error updating username.");
        }
    };

    const updateEmail = async () => {
        try {
            const response = await updateEmailAPI(formData.newUserEmail, userID);
            setFeedback(response.message || "Username updated successfully!");
        } catch (error) {
            setFeedback(error.message || "Error updating username.");
        }
    };

    const updatePassword = async () => {
        if (formData.newPassword !== formData.confirmNewPassword) {
            setFeedback("Passwords do not match.");
            return;
        }

        try {
            const response = await updatePasswordAPI(formData.currentPassword, formData.newPassword, userID);
            setFeedback(response.message || "Password updated successfully!");
        } catch (error) {
            setFeedback(error.message || "Error updating password.");
        }
    };

    const updateRole = async () => {
        try {
            const response = await updateRoleAPI(formData.newRole, userID);
            setFeedback(response.message || "Role updated successfully!");
        } catch (error) {
            setFeedback(error.message || "Error updating role.");
        }
    };

    return (
        <section className="container p-5">
            {feedback && <p>{feedback}</p>}

            <Confirmation
                show={showConfirmation}
                onClose={handleConfirmClose}
                onConfirm={handleConfirmOk}
                message={message}
            />
            <h3>Manage Account</h3>

            {/* Display current username and role */}
            <FormInput type="text" label="Username" value={userID} disabled />
            <FormInput type="text" label="Role" value={userRole} disabled />

            <hr />

            <div className="d-flex">
                <FormInput
                    type="text"
                    label="Edit Username"
                    placeholder="Enter new username"
                    value={formData.newUserId}
                    onChange={(val) => handleInputChange("newUserId", val)}
                />
                <button
                    className="btn btn-primary h-75 m-4 p-2"
                    onClick={() => showConfirmationModal(() => updateUsername(), `Are you sure you want to change the username to: ${formData.newUserId}?`)}
                >
                    Update Username
                </button>

                <FormInput
                    type="text"
                    label="Edit Email"
                    placeholder="Enter new E-mail"
                    value={userEmail}
                    onChange={(val) => handleInputChange("newUserEmail", val)}
                />
                <button
                    className="btn btn-primary h-75 m-4 p-2"
                    onClick={() => showConfirmationModal(() => updateEmail(), `Are you sure you want to change the email: ${formData.newUserEmail}?`)}
                >
                    Update Email
                </button>
            </div>

            <hr />

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

            <hr />

            {/* Update Role */}
            <div className="d-flex">
                <FormInput
                    type="dropdown"
                    label="Select New Role"
                    options={["Admin", "User"]}
                    value={formData.newRole}
                    onChange={(val) => handleInputChange("newRole", val)}
                />
                <button
                    className="btn btn-primary h-75 m-4 p-2"
                    onClick={() => showConfirmationModal(() => updateRole(), `Are you sure you want to change the role to: ${formData.newRole}?`)}
                >
                    Update Role
                </button>
            </div>

        </section>
    );
}
