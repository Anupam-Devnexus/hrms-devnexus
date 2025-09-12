import React, { useEffect, useState } from "react";
import { useUserStore } from "../Zustand/GetAllData";

const Profile = () => {
  const { allData, fetchAllData, loading, error } = useUserStore();
  const [currentUser, setCurrentUser] = useState(null);

  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const username = authUser?.username;
  const role = authUser?.role?.toUpperCase() || "EMPLOYEE";

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (allData?.data && username) {
      const roleUsers = allData.data[role] || [];
      const user = roleUsers.find(
        (u) =>
          u.FirstName.toLowerCase() === username.toLowerCase() ||
          u.Email.toLowerCase() === username.toLowerCase()
      );
      setCurrentUser(user || null);
    }
  }, [allData, username, role]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!currentUser) return <div>No user data found.</div>;

  // Handle permissions safely
  const permissions =
    currentUser.Permissions && currentUser.Permissions.length > 0
      ? Array.isArray(currentUser.Permissions[0])
        ? currentUser.Permissions[0]
        : (() => {
            try {
              return JSON.parse(currentUser.Permissions[0]);
            } catch {
              return [currentUser.Permissions[0]];
            }
          })()
      : [];

  return (
    <div className="flex justify-center items-center py-4 px-4">
      <div className="w-full max-w-5xl bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="relative h-40 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2">
            <img
              src={currentUser.Profile_url}
              alt={currentUser.FirstName + " " + currentUser.LastName}
              className="w-40 h-40 rounded-xl border-4 border-white shadow-lg object-cover"
            />
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-24 text-center px-6 pb-10">
          <h2 className="text-3xl font-bold text-gray-800">
            {currentUser.FirstName} {currentUser.LastName}
          </h2>
          <div className="flex justify-center w-full items-center gap-4 border-b border-gray-200 pb-4">

          <p className="text-indigo-500 font-medium">{currentUser.Designation}</p>
          <p className="text-gray-500">{currentUser.Department}</p>
          <p className="text-gray-400 text-sm">{currentUser.Role}</p>
          </div>

          {/* Employee Info */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {/* Contact */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">📞 Contact</h3>
              <p className="text-gray-600 text-sm">📧 {currentUser.Email}</p>
              <p className="text-gray-600 text-sm">📱 {currentUser.Phone}</p>
              <p className="text-gray-600 text-sm">🏠 {currentUser.Address}</p>
            </div>

            {/* Emergency */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">🚨 Emergency Contact</h3>
              <p className="text-gray-600 text-sm">
                👤 {currentUser.EmergencyName} ({currentUser.EmergencyRelation})
              </p>
              <p className="text-gray-600 text-sm">📱 {currentUser.EmergencyPhone}</p>
            </div>

            {/* Job Details */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">💼 Job Info</h3>
              <p className="text-gray-600 text-sm">🆔 Employee ID: {currentUser.EmployeeId}</p>
              <p className="text-gray-600 text-sm">
                🗓 Joining:{" "}
                {currentUser.JoiningDate
                  ? new Date(currentUser.JoiningDate).toLocaleDateString()
                  : "N/A"}
              </p>
              <p className="text-gray-600 text-sm">
                🎂 DOB:{" "}
                {currentUser.Dob ? new Date(currentUser.Dob).toLocaleDateString() : "N/A"}
              </p>
              <p className="text-gray-600 text-sm">
                ✅ Status:{" "}
                {currentUser.IsActive ? (
                  <span className="text-green-600 font-medium">Active</span>
                ) : (
                  <span className="text-red-600 font-medium">Inactive</span>
                )}
              </p>
            </div>

            {/* Permissions */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">🔑 Permissions</h3>
              <div className="flex flex-wrap gap-2">
                {permissions.length > 0 && permissions[0] !== "" ? (
                  permissions.map((perm, idx) => (
                    <span
                      key={idx}
                      className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full"
                    >
                      {perm}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">No permissions</span>
                )}
              </div>
            </div>

            {/* Allowed Tabs */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">📂 Allowed Tabs</h3>
              <div className="flex flex-wrap gap-2">
                {currentUser.AllowedTabs && currentUser.AllowedTabs.length > 0 ? (
                  currentUser.AllowedTabs.map((tab, idx) => (
                    <span
                      key={idx}
                      className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full"
                    >
                      {tab}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">No access</span>
                )}
              </div>
            </div>

            {/* Tasks */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">📋 Tasks</h3>
              {currentUser.Tasks && currentUser.Tasks.length > 0 ? (
                <ul className="list-disc pl-5 text-sm text-gray-600">
                  {currentUser.Tasks.map((task, idx) => (
                    <li key={idx}>{task}</li>
                  ))}
                </ul>
              ) : (
                <span className="text-gray-400 text-sm">No tasks assigned</span>
              )}
            </div>

            {/* System Info */}
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">⚙️ System Info</h3>
              <p className="text-gray-600 text-sm">Created: {new Date(currentUser.createdAt).toLocaleString()}</p>
              <p className="text-gray-600 text-sm">Updated: {new Date(currentUser.updatedAt).toLocaleString()}</p>
              {/* <p className="text-gray-600 text-sm break-all">Profile Public ID: {currentUser.Profile_Public_id}</p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
