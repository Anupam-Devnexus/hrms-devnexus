import React, { useEffect } from "react";
import { useLeaveStore } from "../Zustand/GetLeave";
import LeaveCard from "../Component/Card/LeaveCard";

const LeavesApproval = () => {
  const { leaveList, error, loading, fetchLeave, updateLeaveStatus } = useLeaveStore();

  useEffect(() => {
    fetchLeave();
  }, []);

  console.log(leaveList)

  const handleStatusChange = async (id, status) => {
    await updateLeaveStatus(id, status);
  };

  if (loading) return <p className="text-center text-gray-500">Loading leaves...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div>
      <h1 className="text-xl text-white p-3 font-bold mb-6">Leave Approvals</h1>
      <div className="grid grid-cols-1 md:grid-cols-3">
        {leaveList.length === 0 ? (
          <p className="text-gray-600">No leave requests found.</p>
        ) : (
          leaveList.map((leave) => (
            <LeaveCard
              key={leave._id}
              leave={leave}
              onStatusChange={handleStatusChange}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default LeavesApproval;
