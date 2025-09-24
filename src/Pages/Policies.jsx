import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiCheck, FiX } from "react-icons/fi";

const Policies = () => {
  const [policies, setPolicies] = useState([]);
  const [acknowledgement, setAcknowledgement] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [editing, setEditing] = useState(null);
  const [editedSubPolicy, setEditedSubPolicy] = useState({ description: "", subHeading: "" });
  const [loading, setLoading] = useState(true);

  const authuser = JSON.parse(localStorage.getItem("authUser"));
  const role = authuser?.user?.Role;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await fetch(
          "https://hrms-backend-9qzj.onrender.com/api/policy/get-policy"
        );
        if (!res.ok) throw new Error("Failed to fetch policies");
        const data = await res.json();
        setPolicies(data?.policy || []);
        setAcknowledgement(data?.Acknowledgement || {});
        setLoading(false);
        // console.log("Policies fetched:", data?.policy);
      } catch (error) {
        console.error("Error fetching policies:", error);
        setLoading(false);
      }
    };
    fetchPolicies();
  }, []);

  const handleAccept = async () => {
    try {
      await fetch("https://your-backend-api.com/api/accept-policies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: authuser.user.id, accepted: true }),
      });
      setAcknowledgement((prev) => ({
        ...prev,
        DigitalAcceptance: { Accepted: true },
      }));
    } catch (error) {
      console.error("Failed to accept policies:", error);
    }
  };

  const handleEdit = (policyIndex, subPolicyIndex) => {
    setEditing({ policyIndex, subPolicyIndex });
    setEditedSubPolicy({ 
      description: policies[policyIndex].subPolicies[subPolicyIndex].description,
      subHeading: policies[policyIndex].subPolicies[subPolicyIndex].subHeading
    });
  };

  const handleSave = async (policyIndex, subPolicyIndex) => {
    try {
      const updatedPolicy = { ...policies[policyIndex] };
      updatedPolicy.subPolicies[subPolicyIndex] = editedSubPolicy;

      const res = await fetch("https://your-backend-api.com/api/update-policy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ policyId: updatedPolicy._id, updatedPolicy }),
      });
      if (!res.ok) throw new Error("Failed to update policy");

      const updatedPolicies = [...policies];
      updatedPolicies[policyIndex] = updatedPolicy;
      setPolicies(updatedPolicies);
      setEditing(null);
    } catch (error) {
      console.error("Error updating policy:", error);
    }
  };

  const filteredPolicies = policies.filter((policy) =>
    policy.heading.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.subPolicies.some(sp => 
      sp.subHeading.toLowerCase().includes(searchTerm.toLowerCase()) || 
      sp.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading policies...</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-800 text-center md:text-left">
            HUMAN RESOURCE POLICIES
          </h1>

          {role === "ADMIN" && (
            <button
              onClick={() => navigate("/dashboard/Add-policy")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition"
            >
              Add Policy
            </button>
          )}
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search policies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Policy Cards */}
        {filteredPolicies.length ? (
          <div className="space-y-5">
            {filteredPolicies.map((policy, pIndex) => (
              <div
                key={policy._id}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-700">{policy.heading}</h2>
                  </div>
                  <span className="text-sm text-gray-400">
                    {new Date(policy.updatedAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="mt-4 space-y-4">
                  {policy.subPolicies.map((sp, sIndex) => (
                    <div key={sIndex} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
                      {editing?.policyIndex === pIndex && editing?.subPolicyIndex === sIndex ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editedSubPolicy.subHeading}
                            onChange={(e) =>
                              setEditedSubPolicy((prev) => ({ ...prev, subHeading: e.target.value }))
                            }
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <textarea
                            value={editedSubPolicy.description}
                            onChange={(e) =>
                              setEditedSubPolicy((prev) => ({ ...prev, description: e.target.value }))
                            }
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      ) : (
                        <>
                          <h3 className="font-semibold text-gray-700">{sp.subHeading}</h3>
                          <p className="text-gray-600 mt-1">{sp.description}</p>
                        </>
                      )}

                      {(role === "ADMIN" || role === "HR") && (
                        <div className="mt-2 flex gap-2">
                          {editing?.policyIndex === pIndex && editing?.subPolicyIndex === sIndex ? (
                            <>
                              <button
                                onClick={() => handleSave(pIndex, sIndex)}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-lg flex items-center gap-1"
                              >
                                <FiCheck /> Save
                              </button>
                              <button
                                onClick={() => setEditing(null)}
                                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1 rounded-lg flex items-center gap-1"
                              >
                                <FiX /> Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleEdit(pIndex, sIndex)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-lg flex items-center gap-1"
                            >
                              <FiEdit2 /> Edit
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">No policies found.</p>
        )}

        {/* Acknowledgement section */}
        {acknowledgement?.Statement && (
          <div className="mt-10 bg-white p-6 rounded-2xl shadow text-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Acknowledgement</h2>
            <p className="text-gray-600 mb-5">{acknowledgement.Statement}</p>
            {acknowledgement?.DigitalAcceptance?.Accepted ? (
              <p className="text-green-600 font-medium">✅ You have accepted these policies.</p>
            ) : (
              <button
                onClick={handleAccept}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
              >
                Accept Policies
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Policies;
