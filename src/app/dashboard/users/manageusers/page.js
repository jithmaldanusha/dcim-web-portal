"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllUsers, addNewUser, removeUser } from "@/app/api/useraccounts";
import FormInput from "@/app/components/formcomponents/form_input/page";
import Confirmation from "@/app/components/utils/confirmationmodal";
import SuccessModal from "@/app/components/utils/successmodal";
import Spinner from "@/app/components/utils/spinner";

export default function ManageUsers() {
    const router = useRouter();
    const [allUsers, setAllUsers] = useState([]);
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [actionMessage, setActionMessage] = useState("");
    const [confirmationMessage, setConfirmationMessage] = useState("");
    const [pendingAction, setPendingAction] = useState(null);

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await getAllUsers();
                setAllUsers(response.data); // Set the entire data array
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        getUsers();
    }, []);

    const [formData, setFormData] = useState({
        newUserId: "",
        newPassword: "",
        confirmNewPassword: "",
        newRole: "",
        deleteUserId: "",
    });

    const handleInputChange = (field, value) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    const confirmAction = (action, message) => {
        setPendingAction(action);
        setConfirmationMessage(message);
        setShowConfirmation(true);
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmNewPassword) {
            setFeedback("Passwords do not match!");
            return;
        }
        confirmAction("add", "Are you sure you want to add this user?");
    };

    const handleRemoveUser = async (e) => {
        e.preventDefault();
        confirmAction("remove", "Are you sure you want to remove this user?");
    };

    const executePendingAction = async () => {
        setShowConfirmation(false);
        setLoading(true);

        try {
            if (pendingAction === "add") {
                const newUser = {
                    UserID: formData.newUserId,
                    Password: formData.newPassword,
                    Role: formData.newRole,
                };
                const response = await addNewUser(newUser);
                setActionMessage(response.data.message);
                setFormData({
                    newUserId: "",
                    newPassword: "",
                    confirmNewPassword: "",
                    newRole: "",
                });
            } else if (pendingAction === "remove") {
                const deleteUser = formData.deleteUserId;
                const response = await removeUser(deleteUser);
                setActionMessage(response.data.message);
                setFormData({
                    deleteUserId: "",
                });
            }
            setShowSuccess(true);
        } catch (error) {
            setFeedback("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="container p-5">
            {feedback && <p>{feedback}</p>}

            {loading && <Spinner />}

            <Confirmation
                show={showConfirmation}
                onClose={() => setShowConfirmation(false)}
                onConfirm={executePendingAction}
                message={confirmationMessage}
            />

            <SuccessModal
                show={showSuccess}
                message={actionMessage}
                onClose={() => {
                    setShowSuccess(false);
                    router.push(router); // Reloads the current route
                }}
            />


            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th scope="col">User ID</th>
                        <th scope="col">Role</th>
                        <th scope="col">Email</th>
                    </tr>
                </thead>
                <tbody>
                    {allUsers.length > 0 ? (
                        allUsers.map((user, index) => (
                            <tr key={index}>
                                <td>{user.UserID}</td>
                                <td>{user.Role}</td>
                                <td>{user.Email ? user.Email : "Not Yet Provided"}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No users found.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <hr />

            <h3>Add new user</h3>
            <form onSubmit={handleAddUser}>
                <FormInput
                    type="text"
                    label="Enter Username"
                    placeholder="Enter username"
                    value={formData.newUserId}
                    onChange={(val) => handleInputChange("newUserId", val)}
                />
                <FormInput
                    type="text"
                    label="Enter New Password"
                    value={formData.newPassword}
                    onChange={(val) => handleInputChange("newPassword", val)}
                />
                <FormInput
                    type="password"
                    label="Confirm New Password"
                    value={formData.confirmNewPassword}
                    onChange={(val) => handleInputChange("confirmNewPassword", val)}
                />
                <FormInput
                    type="dropdown"
                    label="Select User Role"
                    options={["Admin", "User"]}
                    value={formData.newRole}
                    onChange={(val) => handleInputChange("newRole", val)}
                />
                <button type="submit" className="btn btn-primary mt-2">
                    Add User
                </button>
            </form>
            <hr />

            <h3>Remove User</h3>
            <form onSubmit={handleRemoveUser}>
                <FormInput
                    type="text"
                    label="Enter UserName"
                    placeholder="Enter username to remove"
                    value={formData.deleteUserId}
                    onChange={(val) => handleInputChange("deleteUserId", val)}
                />

                <button type="submit" className="btn btn-primary mt-2">
                    Remove User
                </button>
            </form>
        </section>
    );
}
