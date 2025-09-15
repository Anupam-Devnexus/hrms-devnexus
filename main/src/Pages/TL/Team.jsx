import React, { useEffect } from "react";
import { useUserStore } from "../../Zustand/GetAllData";
import { useTeamStore } from "../../Zustand/useTeamStore";
import TeamCard from "../../Component/Card/TeamCard";

const Team = () => {
  const { allData, fetchAllData, loading, error } = useUserStore();

  const {
    selectedTeam,
    teamName,
    teamDescription,
    showMyTeam,
    toggleShowMyTeam,
    saveTeam,
    resetTeam,
    setTeamName,
    setTeamDescription,
    removeMember,
  } = useTeamStore();

  useEffect(() => {
    fetchAllData();
  }, []);

  const employees = allData.data?.EMPLOYEE || [];
  const teamMembers = employees.filter((emp) =>
    selectedTeam.includes(emp._id)
  );

  if (loading) return <div className="text-white">Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl text-white font-bold mb-4">Team Management</h2>

      {/* Toggle View */}
      <button
        onClick={toggleShowMyTeam}
        className="mb-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
      >
        {showMyTeam ? "← Back to All Employees" : "👥 View My Team"}
      </button>

      {/* My Team View */}
      {showMyTeam ? (
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">My Team</h3>
          {teamMembers.length === 0 ? (
            <p className="text-gray-400">No members selected yet.</p>
          ) : (
            teamMembers.map((emp) => (
              <div
                key={emp._id}
                className="flex items-center gap-3 bg-gray-800 p-3 rounded-lg mb-2"
              >
                <TeamCard employee={emp} />
                <button
                  onClick={() => removeMember(emp._id)}
                  className="ml-auto px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            ))
          )}

          {/* Team Info Form */}
          {teamMembers.length > 0 && (
            <div className="mt-4 space-y-3">
              <input
                type="text"
                placeholder="Team Name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-600 bg-gray-900 text-white"
              />
              <textarea
                placeholder="Team Description (optional)"
                value={teamDescription}
                onChange={(e) => setTeamDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-600 bg-gray-900 text-white"
              />
              <div className="flex gap-3">
                <button
                  onClick={saveTeam}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save Team ({teamMembers.length})
                </button>
                <button
                  onClick={resetTeam}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        // All Employees View
        <div>
          {employees.length === 0 && <p>No employees found.</p>}
          {employees.map((emp) => (
            <TeamCard key={emp._id} employee={emp} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Team;
