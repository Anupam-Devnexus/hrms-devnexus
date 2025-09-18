import React from "react";
import { User, Users, Calendar, Mail } from "lucide-react"; // icons

const TeamCard = ({ team }) => {
  const createdAt = new Date(team.createdAt).toLocaleDateString();
  const updatedAt = new Date(team.updatedAt).toLocaleDateString();

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-5 border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold text-blue-600">{team.name}</h2>
        <span className="text-xs text-gray-500">ID: {team._id}</span>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4">
        {team.description || "No description provided."}
      </p>

      {/* Lead */}
      <div className="flex items-center gap-2 mb-3">
        <User size={18} className="text-blue-500" />
        <p className="text-gray-800 text-sm">
          <strong>Lead:</strong> {team.lead?.FirstName} {team.lead?.LastName} (
          <span className="text-blue-600">{team.lead?.Email}</span>)
        </p>
      </div>

      {/* Members */}
      <div className="mb-3">
        <div className="flex items-center gap-2 mb-1">
          <Users size={18} className="text-green-500" />
          <p className="font-medium text-gray-800">Members</p>
        </div>
        <ul className="pl-6 list-disc text-sm text-gray-700">
          {team.members?.map((m) => (
            <li key={m._id}>
              {m.FirstName} {m.LastName}{" "}
              <span className="text-blue-600">({m.Email})</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Dates */}
      <div className="flex justify-between text-xs text-gray-500 mt-4">
        <div className="flex items-center gap-1">
          <Calendar size={14} /> Created: {createdAt}
        </div>
        <div className="flex items-center gap-1">
          <Calendar size={14} /> Updated: {updatedAt}
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
