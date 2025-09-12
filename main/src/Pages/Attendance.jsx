import React, { useEffect, useState } from "react";
import { useUserStore } from "../Zustand/GetAllData";
import { useNavigate } from "react-router-dom";

const Attendance = () => {
  const { allData, fetchAllData, loading, error } = useUserStore();
  const [attendanceData, setAttendanceData] = useState([]);
  const navigate = useNavigate();

  const authUser = JSON.parse(localStorage.getItem("authUser")) || {};
  const username = authUser?.username;
  const role = authUser?.role?.toUpperCase() || "EMPLOYEE";

  useEffect(() => {
    fetchAllData();
  }, []);
  console.log("All Data:", allData);

  useEffect(() => {
    if (allData?.data) {
      const users = Object.values(allData.data).flat();

      if (role === "ADMIN" || role === "HR") {
        setAttendanceData(users);
      } else {
        const user = users.find(
          (u) =>
            u.FirstName.toLowerCase() === username?.toLowerCase() ||
            u.Email.toLowerCase() === username?.toLowerCase()
        );
        setAttendanceData(user ? [user] : []);
      }
    }
  }, [allData, role, username]);

  if (loading) return <div>Loading attendance...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-2 ">
      <h2 className="text-2xl text-white font-semibold mb-2">Attendance</h2>

      {attendanceData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Employee ID</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Department</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Last Updated</th>
                {(role === "ADMIN" || role === "HR") && (
                  <th className="px-4 py-2 text-left">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{user.EmployeeId}</td>
                  <td className="px-4 py-2">
                    {user.FirstName} {user.LastName}
                  </td>
                  <td className="px-4 py-2">{user.Role}</td>
                  <td className="px-4 py-2">{user.Department}</td>
                  <td className="px-4 py-2">
                    {user.IsActive ? (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                        Present
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">
                        Absent
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-gray-500 text-sm">
                    {new Date(user.updatedAt).toLocaleString()}
                  </td>
                  {(role === "ADMIN" || role === "HR") && (
                    <td className="px-4 py-2">
                      <button
                        onClick={() => navigate(`/dashboard/mark-attendance/${user._id}`)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition"
                      >
                        Mark Attendance
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No attendance records found.</p>
      )}
    </div>
  );
};

export default Attendance;
