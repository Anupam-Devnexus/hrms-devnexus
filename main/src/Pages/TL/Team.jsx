import React, { useEffect, useState } from "react";
import { useUserStore } from "../../Zustand/GetAllData";
import { useTeamStore } from "../../Zustand/useTeamStore";

export default function CreateTeam() {
  const { allData, fetchAllData, loading, error } = useUserStore();

  const {
    selectedTeam,
    teamName,
    teamDescription,
    toggleMember,
    isMember,
    setTeamName,
    setTeamDescription,
    saveTeam,
  } = useTeamStore();

  const [role, setRole] = useState("");

  useEffect(() => {
    fetchAllData();
    const authUser = JSON.parse(localStorage.getItem("authUser"));
    setRole(authUser?.user?.Role || "");
  }, []);

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  const employees = allData.data?.EMPLOYEE || [];

  return (
    <div className="p-6 space-y-6 text-white">
      <h2 className="text-2xl font-bold">👥 Create New Team</h2>

      {/* Team Details */}
      <div className="space-y-4">
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Team Name"
          className="w-full p-2 border rounded text-white"
        />
        <textarea
          value={teamDescription}
          onChange={(e) => setTeamDescription(e.target.value)}
          placeholder="Team Description"
          className="w-full p-2 border rounded text-white"
        />
      </div>

      {/* Employee Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Select Employees</h3>
        <div className="grid grid-cols-2 gap-4">
          {employees.map((emp) => (
            <label
              key={emp._id}
              className="flex items-center space-x-2 bg-gray-800 p-2 rounded cursor-pointer hover:bg-gray-700"
            >
              <input
                type="checkbox"
                checked={isMember(emp._id)}
                onChange={() => toggleMember(emp._id)}
              />
              <span>{emp.FirstName} {emp.LastName}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Save Team Button */}
      <button
        onClick={saveTeam}
        className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
      >
        Save Team
      </button>
    </div>
  );
}
