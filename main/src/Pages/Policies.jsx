import React, { useState } from "react";
import Data from "../DataStore/Policies.json";

const Policies = () => {
  const [accepted, setAccepted] = useState(
    Data.Acknowledgement.DigitalAcceptance.Accepted
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [editing, setEditing] = useState(null); // which policy is being edited
  const [editedPolicy, setEditedPolicy] = useState("");

  const authuser = JSON.parse(localStorage.getItem("authUser"));
  const role = authuser?.user?.Role; // role of user
  console.log("User role:", role);

  const handleAccept = () => {
    setAccepted(true);
    console.log("Policy accepted on:", new Date().toISOString());
  };

  const handleEdit = (key, policyText) => {
    setEditing(key);
    setEditedPolicy(policyText);
  };

  const handleSave = async (key) => {
    try {
      const updatedPolicy = {
        ...Data.HRPolicies[key],
        Policy: editedPolicy,
      };

      // call API to update
      const res = await fetch("https://your-backend-api.com/api/update-policy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          policyName: key,
          updatedPolicy,
        }),
      });

      if (!res.ok) throw new Error("Failed to update policy");

      console.log("✅ Policy updated successfully");
      setEditing(null);
    } catch (error) {
      console.error("❌ Error updating policy:", error);
    }
  };

  // Filter policies
  const filteredPolicies = Object.entries(Data.HRPolicies).filter(
    ([key, policy]) => {
      const title = key.replace(/([A-Z])/g, " $1").trim().toLowerCase();
      const text = `${policy.Policy} ${policy.KeyPoints.join(" ")}`.toLowerCase();
      return (
        title.includes(searchTerm.toLowerCase()) ||
        text.includes(searchTerm.toLowerCase())
      );
    }
  );

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Company HR Policies
        </h1>

        {/* Search */}
        <input
          type="text"
          placeholder="Search policies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Policy List */}
        {filteredPolicies.length > 0 ? (
          <div className="space-y-6">
            {filteredPolicies.map(([key, policy]) => (
              <div
                key={key}
                className="bg-white p-5 rounded-lg shadow hover:shadow-md transition"
              >
                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </h2>

                {editing === key ? (
                  <textarea
                    value={editedPolicy}
                    onChange={(e) => setEditedPolicy(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-600 mb-3">{policy.Policy}</p>
                )}

                <ul className="list-disc pl-5 space-y-1 text-gray-600 mb-3">
                  {policy.KeyPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>

                {/* Admin / HR controls */}
                {(role === "ADMIN" || role === "HR") && (
                  <div className="flex gap-3">
                    {editing === key ? (
                      <>
                        <button
                          onClick={() => handleSave(key)}
                          className="bg-green-600 text-white px-4 py-1 rounded-lg hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditing(null)}
                          className="bg-gray-400 text-white px-4 py-1 rounded-lg hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEdit(key, policy.Policy)}
                        className="bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No policies found matching your search.
          </p>
        )}

        {/* Acknowledgement */}
        <div className="mt-10 bg-white p-5 rounded-lg shadow text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Acknowledgement
          </h2>
          <p className="text-gray-600 mb-5">{Data.Acknowledgement.Statement}</p>
          {accepted ? (
            <p className="text-green-600 font-medium">
              ✅ You have accepted these policies.
            </p>
          ) : (
            <button
              onClick={handleAccept}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Accept Policies
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Policies;
