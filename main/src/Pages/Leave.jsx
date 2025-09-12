import React from "react";
import Data from "../DataStore/leaves.json";
import { useNavigate } from "react-router-dom";
const Leave = () => {
    const authUser = JSON.parse(localStorage.getItem("authUser"));
    const navigate = useNavigate();
    console.log("", Data)
    const currentUser = Data.leaves.find(
  (u) =>
    u.Name.toLowerCase().includes(authUser?.username?.toLowerCase()) ||
    u.Email?.toLowerCase().includes(authUser?.username?.toLowerCase())
);
    

    if (!currentUser) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-red-500 font-semibold text-lg">
                    No leave data found for this user.
                </p>
            </div>
        );
    }

    const { LeaveBalance, LeaveHistory } = currentUser;

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">

                {/* Header */}
                <section>

                    <h1 className="text-3xl flex items-center gap-4 font-bold text-gray-800 text-center">
                        Leave Dashboard
                        <span className="block text-lg text-blue-800 font-medium">
                            {currentUser.Name} — {currentUser.Role}
                        </span>
                    </h1>
                </section>
                { authUser.role !== "admin" && <button className="p-2 bg-blue-500 text-white rounded-md"
                    onClick={() => {

                        navigate(`/dashboard/apply-leave/${currentUser.EmployeeId}`);
                    }}
                >Apply Leave</button>}
            </div>

            {/* Leave Balance Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="flex items-center justify-between bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-sm uppercase tracking-wide">Total Allowed</h3>
                    <p className="text-3xl font-bold">{LeaveBalance.TotalAllowed}</p>
                </div>
                <div className="flex items-center justify-between bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-sm uppercase tracking-wide">Used</h3>
                    <p className="text-3xl font-bold">{LeaveBalance.Used}</p>
                </div>
                <div className="flex items-center justify-between bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl p-6 shadow-lg">
                    <h3 className="text-sm uppercase tracking-wide">Remaining</h3>
                    <p className="text-3xl font-bold">{LeaveBalance.Remaining}</p>
                </div>
            </div>

            {/* Last Leave Taken */}
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
                <h2 className="text-xl font-semibold mb-4">🗓 Last Leave Taken</h2>
                {LeaveBalance.LastLeaveTaken ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                        <p>
                            <span className="font-semibold">Type:</span>{" "}
                            {LeaveBalance.LastLeaveTaken.Type}
                        </p>
                        <p>
                            <span className="font-semibold">Dates:</span>{" "}
                            {LeaveBalance.LastLeaveTaken.FromDate} →{" "}
                            {LeaveBalance.LastLeaveTaken.ToDate}
                        </p>
                        <p>
                            <span className="font-semibold">Reason:</span>{" "}
                            {LeaveBalance.LastLeaveTaken.Reason}
                        </p>
                        <p>
                            <span className="font-semibold">Status:</span>{" "}
                            <span
                                className={`px-3 py-1 text-xs font-medium rounded-full ${LeaveBalance.LastLeaveTaken.Status === "Approved"
                                    ? "bg-green-100 text-green-700"
                                    : LeaveBalance.LastLeaveTaken.Status === "Rejected"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-yellow-100 text-yellow-700"
                                    }`}
                            >
                                {LeaveBalance.LastLeaveTaken.Status}
                            </span>
                        </p>
                    </div>
                ) : (
                    <p className="text-gray-400">No leave taken yet.</p>
                )}
            </div>

            {/* Leave History */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-4">📋 Leave History</h2>
                {LeaveHistory && LeaveHistory.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-gray-700 uppercase text-xs">
                                    <th className="p-3">Leave ID</th>
                                    <th className="p-3">Type</th>
                                    <th className="p-3">From</th>
                                    <th className="p-3">To</th>
                                    <th className="p-3">Reason</th>
                                    <th className="p-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {LeaveHistory.map((leave, idx) => (
                                    <tr
                                        key={idx}
                                        className="border-b hover:bg-gray-50 transition"
                                    >
                                        <td className="p-3 font-medium">{leave.LeaveId}</td>
                                        <td className="p-3">{leave.Type}</td>
                                        <td className="p-3">{leave.FromDate}</td>
                                        <td className="p-3">{leave.ToDate}</td>
                                        <td className="p-3">{leave.Reason}</td>
                                        <td className="p-3">
                                            <span
                                                className={`px-3 py-1 text-xs font-medium rounded-full ${leave.Status === "Approved"
                                                    ? "bg-green-100 text-green-700"
                                                    : leave.Status === "Rejected"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                    }`}
                                            >
                                                {leave.Status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-400">No leave history available.</p>
                )}
            </div>
        </div>
    );
};

export default Leave;
