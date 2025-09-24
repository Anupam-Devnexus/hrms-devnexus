import React, { useEffect, useState } from "react";
import { useUserStore } from "../Zustand/GetAllData";

// Reusable components
const InfoItem = ({ label, value }) => (
  <p className="text-gray-600 text-sm">
    <span className="font-medium text-gray-800">{label}:</span>{" "}
    {value || "N/A"}
  </p>
);

const Badge = ({ text, color = "indigo" }) => (
  <span
    className={`bg-${color}-100 text-${color}-700 text-xs font-semibold px-3 py-1 rounded-full shadow-sm`}
  >
    {text}
  </span>
);

const Section = ({ title, children }) => (
  <div className="p-4 border rounded-xl shadow-sm bg-gray-50">
    <h3 className="font-semibold text-gray-700 mb-2 text-sm">{title}</h3>
    {children}
  </div>
);

const Profile = () => {
  const { allData, fetchAllData, loading, error } = useUserStore();
  const [currentUser, setCurrentUser] = useState(null);
  const [isActive, setIsActive] = useState(false);

  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const username = authUser.user?.FirstName;
  const role = authUser.user?.Role?.toUpperCase() || "EMPLOYEE";

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
      if (user) setIsActive(user.IsActive);
    }
  }, [allData, username, role]);

  const toggleStatus = () => {
    setIsActive((prev) => !prev);
    // Here you can call API to update user status
    // await api.updateUserStatus(currentUser._id, !isActive);
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center py-10 text-red-600">Error: {error}</div>;
  if (!currentUser)
    return <div className="text-center py-10">No user data found.</div>;

  // Parse permissions safely
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
    <div className="flex justify-center items-center py-2 px-2">
      <div className="w-full max-w-6xl bg-white shadow-2xl rounded-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="relative h-44 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2">
            <img
              src={currentUser.Profile_url}
              alt={`${currentUser.FirstName} ${currentUser.LastName}`}
              className="w-40 h-40 rounded-2xl border-4 border-white shadow-xl object-cover"
            />
          </div>
        </div>

        {/* User Info */}
        <div className="mt-24 text-center px-6 pb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-1">
            {currentUser.FirstName} {currentUser.LastName}
          </h2>

          <div className="flex flex-wrap justify-center gap-4 items-center border-b border-gray-200 pb-4">
            <p className="text-indigo-500 font-medium">
              {currentUser.Designation}
            </p>
            <p className="text-gray-500">{currentUser.Department}</p>
            <Badge
              text={currentUser.Role}
              color={currentUser.Role === "ADMIN" ? "red" : "blue"}
            />
          </div>

          {/* Toggle Button */}
          <div className="mt-6">
            <button
              onClick={toggleStatus}
              className={`px-6 py-2 rounded-full text-white font-medium shadow-md transition 
                ${
                  isActive
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
            >
              {isActive ? "Deactivate" : "Activate"}
            </button>
          </div>

          {/* Details Grid */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {/* Contact */}
            <Section title="📞 Contact">
              <InfoItem label="Email" value={currentUser.Email} />
              <InfoItem label="Phone" value={currentUser.Phone} />
              <InfoItem label="Address" value={currentUser.Address} />
            </Section>

            {/* Emergency */}
            <Section title="🚨 Emergency Contact">
              <InfoItem
                label="Name"
                value={`${currentUser.EmergencyName} (${currentUser.EmergencyRelation})`}
              />
              <InfoItem label="Phone" value={currentUser.EmergencyPhone} />
            </Section>

            {/* Job Info */}
            <Section title="💼 Job Info">
              <InfoItem label="Employee ID" value={currentUser.EmployeeId} />
              <InfoItem
                label="Joining Date"
                value={
                  currentUser.JoiningDate
                    ? new Date(currentUser.JoiningDate).toLocaleDateString()
                    : "N/A"
                }
              />
              <InfoItem
                label="Date of Birth"
                value={
                  currentUser.Dob
                    ? new Date(currentUser.Dob).toLocaleDateString()
                    : "N/A"
                }
              />
              <p className="text-sm mt-2">
                Status:{" "}
                {isActive ? (
                  <Badge text="Active" color="green" />
                ) : (
                  <Badge text="Inactive" color="red" />
                )}
              </p>
            </Section>

            {/* Permissions */}
            <Section title="🔑 Permissions">
              <div className="flex flex-wrap gap-2">
                {permissions.length > 0 && permissions[0] !== "" ? (
                  permissions.map((perm, idx) => (
                    <Badge key={idx} text={perm} />
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">No permissions</span>
                )}
              </div>
            </Section>

            {/* Allowed Tabs */}
            <Section title="📂 Allowed Tabs">
              <div className="flex flex-wrap gap-2">
                {currentUser.AllowedTabs?.length > 0 ? (
                  currentUser.AllowedTabs.map((tab, idx) => (
                    <Badge key={idx} text={tab} color="green" />
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">No access</span>
                )}
              </div>
            </Section>

            {/* Tasks */}
            <Section title="📋 Tasks">
              {currentUser.Tasks?.length > 0 ? (
                <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                  {currentUser.Tasks.map((task, idx) => (
                    <li key={idx}>{task}</li>
                  ))}
                </ul>
              ) : (
                <span className="text-gray-400 text-sm">
                  No tasks assigned
                </span>
              )}
            </Section>

            {/* System Info */}
            <Section title="⚙️ System Info">
              <InfoItem
                label="Created"
                value={new Date(currentUser.createdAt).toLocaleString()}
              />
              <InfoItem
                label="Updated"
                value={new Date(currentUser.updatedAt).toLocaleString()}
              />
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
