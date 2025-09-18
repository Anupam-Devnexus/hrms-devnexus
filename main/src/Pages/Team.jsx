import { useEffect } from "react";
import React from "react";
import { useTeams } from "../Zustand/GetTeams";
import TeamCard from "../Component/Card/TeamCardforLead";

const Team = () => {
  const role = JSON.parse(localStorage.getItem("authUser"))?.user?.Role;
  const { loading, error, teamList, fetchTeams } = useTeams();

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const total_count = teamList?.count || 0;
  const list = teamList?.teams || [];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {role} – Teams Dashboard
      </h1>

      {loading && <p className="text-blue-600">Loading teams...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <>
          <p className="mb-4 text-gray-700 font-medium">
            Total Teams Joined: <span className="text-blue-600">{total_count}</span>
          </p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((team) => (
              <TeamCard key={team._id} team={team} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Team;
