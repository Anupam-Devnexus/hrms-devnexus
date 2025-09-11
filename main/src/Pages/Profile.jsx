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
    <div className="flex justify-center  items-center ">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="relative h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <img
              src={currentUser.Profile_url}
              alt={currentUser.FirstName + " " + currentUser.LastName}
              className="w-32 h-32 rounded-md border-4 border-white shadow-lg object-cover"
            />
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-20 text-center px-6 pb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {currentUser.FirstName} {currentUser.LastName}
          </h2>
          <p className="text-indigo-500 font-medium mt-1">{currentUser.Designation}</p>
          <p className="text-gray-500 mt-1">{currentUser.Department}</p>
          <p className="text-gray-400 text-sm mt-1">{currentUser.Role}</p>
          <div className="mt-4 flex justify-between space-x-6">

            {/* Contact Info */}
            <div className="mt-6 text-left">
              <h3 className="font-semibold text-gray-700 mb-2">Contact</h3>
              <p className="text-gray-500 text-sm">📧 {currentUser.Email}</p>
              <p className="text-gray-500 text-sm">📞 {currentUser.Phone}</p>
              <p className="text-gray-500 text-sm">🏠 {currentUser.Address}</p>
            </div>

            {/* Emergency Contact */}
            <div className="mt-4 text-left">
              <h3 className="font-semibold text-gray-700 mb-2">Emergency Contact</h3>
              <p className="text-gray-500 text-sm">
                👤 {currentUser.EmergencyName} ({currentUser.EmergencyRelation})
              </p>
              <p className="text-gray-500 text-sm">📞 {currentUser.EmergencyPhone}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">

            {/* Permissions */}
            <div className="mt-4 text-left">
              <h3 className="font-semibold text-gray-700 mb-2">Permissions</h3>
              <div className="flex flex-wrap gap-2">
                {permissions.length > 0 ? (
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

            {/* Dates */}
            <div className="mt-6 flex gap-3 justify-between text-gray-500 text-sm">
              <p>🗓 Joining: {new Date(currentUser.JoiningDate).toLocaleDateString()}</p>
              <p>🎂 DOB: {new Date(currentUser.Dob).toLocaleDateString()}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
