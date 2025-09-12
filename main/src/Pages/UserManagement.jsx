import React, { useEffect } from "react";
import { useUserStore } from "../Zustand/GetAllData";
import EmployeeCard from "../Component/Card/EmployeeCard";
import { useNavigate } from "react-router-dom";
import { AiFillEdit } from "react-icons/ai";
const UserManagement = () => {
    const navigate = useNavigate();
    const { allData, fetchAllData, deleteUser, loading, error } = useUserStore();

    useEffect(() => {
        fetchAllData();
    }, []);

    console.log("All User Data:", allData);

    const authUser = JSON.parse(localStorage.getItem("authUser"));
    const currentUserRole = authUser?.isExists?.Role?.toUpperCase();

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // Flatten all users across roles
    const users = Object.values(allData.data || {}).flat();
    console.log(currentUserRole)

    return (
        <div className="flex flex-col min-w-full min-h-screen p-4">
            <section className="flex items-center justify-between flex-wrap gap-6 mb-6">
                <h2 className="text-2xl text-white font-semibold">User Management</h2>
                {currentUserRole === "ADMIN"  && (
                    <button
                        onClick={() => navigate("/dashboard/add-user")}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        Add New User
                    </button>
                )}
            </section>

            {/* Users Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {users.length > 0 ? (
                    users.map((user) => (
                        <div key={user._id} className="relative">
                            <EmployeeCard employee={user} />

                            {/* Delete Button for Admins */}
                            {currentUserRole === "ADMIN"  && (
                                <button
                                    onClick={() => deleteUser(user._id, user.Role, currentUserRole)}
                                    className="absolute bottom-1 right-2 px-1 py-1 bg-red-600 text-white text-xs rounded-full hover:bg-red-700 transition"
                                >
                                    Delete
                                </button>
                            )}
                            {/* Delete Button for Admins */}
                            {currentUserRole === "ADMIN"  && (
                                <button
                                    onClick={() => navigate(`/dashboard/edit-profile/${user._id}`)}
                                    className="absolute top-1 right-1 text-green-800  text-md rounded-full hover:bg-green-700 transition hover:text-white "
                                >
                                    <AiFillEdit/>
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No users found.</p>
                )}
            </div>
        </div>
    );
};

export default UserManagement;
