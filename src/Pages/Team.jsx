import React, { useEffect, useState } from "react";
import { useTeams } from "../Zustand/GetTeams";
import TeamCard from "../Component/Card/TeamCardforLead";

const Team = () => {
  const role =
    JSON.parse(localStorage.getItem("authUser"))?.user?.Role || "Employee";

  const { loading, error, teamList, fetchTeams } = useTeams();
  const [adminTeams, setAdminTeams] = useState(null);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState(null);

  useEffect(() => {
    if (role === "ADMIN") {
      const fetchAllTeams = async () => {
        setAdminLoading(true);
        setAdminError(null);

        try {
          const token = JSON.parse(localStorage.getItem("authUser"))?.accessToken;
          const res = await fetch(
            "https://hrms-backend-9qzj.onrender.com/api/team/get-teams",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!res.ok) throw new Error("Failed to fetch all teams");

          const data = await res.json();
          setAdminTeams(data);
        } catch (err) {
          setAdminError(err.message);
        } finally {
          setAdminLoading(false);
        }
      };

      fetchAllTeams();
    } else {
      fetchTeams(); // default user fetch
    }
  }, [role, fetchTeams]);

  const totalCount =
    role === "ADMIN"
      ? adminTeams?.count || 0
      : teamList?.count || 0;

  const list =
    role === "ADMIN"
      ? adminTeams?.teams || []
      : teamList?.teams || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white rounded-2xl shadow-xl p-6 mb-8">
        <h1 className="text-3xl font-extrabold tracking-wide">
          {role} – Teams Dashboard
        </h1>
        <p className="mt-2 text-lg text-indigo-100">
          {role === "ADMIN"
            ? "View and manage all teams"
            : "Manage and explore your joined teams here"}
        </p>
        <div className="mt-4">
          <span className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium">
            Total Teams: <span className="font-bold">{totalCount}</span>
          </span>
        </div>
      </div>

      {/* Loading */}
      {(loading || adminLoading) && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, idx) => (
            <div
              key={idx}
              className="h-40 bg-white/60 animate-pulse rounded-2xl shadow-md"
            ></div>
          ))}
        </div>
      )}

      {/* Error */}
      {(error || adminError) && (
        <p className="text-red-600 font-medium bg-red-50 border border-red-200 rounded-lg p-3">
          {error || adminError}
        </p>
      )}

      {/* Teams Grid */}
      {!loading && !adminLoading && !(error || adminError) && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.length > 0 ? (
            list.map((team) => <TeamCard key={team._id} team={team} />)
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-600 text-lg font-medium">
                🚀 No teams found
              </p>
              <p className="text-gray-400 text-sm">
                {role === "ADMIN"
                  ? "No teams have been created yet."
                  : "Once you join a team, it will appear here."}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Team;
