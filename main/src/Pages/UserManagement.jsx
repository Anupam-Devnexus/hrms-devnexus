import React, { useEffect } from "react";
import { useUserStore } from "../Zustand/GetAllData";
import { User, Shield, Users, Briefcase, Trash2 } from "lucide-react";

const roleIcons = {
  ADMIN: <Shield className="w-6 h-6 text-purple-600" />,
  HR: <Users className="w-6 h-6 text-pink-600" />,
  TL: <Briefcase className="w-6 h-6 text-blue-600" />,
  EMPLOYEE: <User className="w-6 h-6 text-green-600" />,
};

// Get logged in user
const authUser = JSON.parse(localStorage.getItem("authUser")) || {};
const userRole = authUser.role || "EMPLOYEE";

const UserCard = ({ user, onDelete }) => {
  const handleDelete = () => {
    if (
      window.confirm(
        `⚠️ Are you sure you want to delete ${user.FirstName} ${user.LastName}?`
      )
    ) {
      onDelete(user._id);
    }
  };

  return (
    <div className="p-5 border rounded-2xl shadow-sm bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
      {/* Profile Image */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <img
            src={
              user.Profile_url ||
              "https://via.placeholder.com/100x100.png?text=User"
            }
            alt={`${user.FirstName} ${user.LastName}`}
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
          />
          {user.IsActive && (
            <span className="absolute bottom-2 right-2 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-800">
            {user.FirstName} {user.LastName}
          </h3>
          <p className="text-sm text-blue-600 font-medium">
            {user.Designation || "Employee"}
          </p>
          <span className="inline-block mt-1 px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
            {user.Role || "N/A"}
          </span>
        </div>
      </div>

      {/* Contact Info */}
      <div className="mt-4 grid grid-cols-1 text-sm text-gray-600">
        <p>📧 {user.Email}</p>
        <p>📞 {user.Phone}</p>
        <p className="text-gray-500 text-xs">ID: {user.EmployeeId}</p>
      </div>

      {/* Status + Actions */}
      <div className="mt-4 flex justify-between items-center">
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full ${
            user.IsActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {user.IsActive ? "Active" : "Inactive"}
        </span>

        <div className="flex gap-2">
          <button className="px-3 py-1 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50">
            View Profile
          </button>
          {/* Show Delete Button only if Logged-in user is ADMIN */}
          {userRole === "admin" && (
            <button
              onClick={handleDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              title="Delete user"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const RoleSection = ({ role, users, onDelete }) => (
  <div className="mb-10">
    <div className="flex items-center gap-2 mb-4">
      {roleIcons[role]}
      <h2 className="text-2xl font-bold text-gray-800">{role}</h2>
      <span className="ml-2 px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700">
        {users.length} {users.length === 1 ? "user" : "users"}
      </span>
    </div>
    {users.length === 0 ? (
      <p className="text-gray-500 italic">No {role} found.</p>
    ) : (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <UserCard key={user._id} user={user} onDelete={onDelete} />
        ))}
      </div>
    )}
  </div>
);

const UserManagement = () => {
  const { allData, fetchAllData, deleteUser, loading, error } = useUserStore();

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  const roles = ["ADMIN", "HR", "TL", "EMPLOYEE"];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold mb-8 text-gray-900">
        👥 User Management
      </h1>
      {roles.map((role) => (
        <RoleSection
          key={role}
          role={role}
          users={allData.data?.[role] || []}
          onDelete={deleteUser}
        />
      ))}
    </div>
  );
};

export default UserManagement;
