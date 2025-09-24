import React, { useEffect, useMemo } from "react";
import SearchBarComp from "../Component/SearchBarComp";
import { useUserStore } from "../Zustand/GetAllData";
import { useTaskStore } from "../Zustand/GetTask";
import { useTeams } from "../Zustand/GetTeams";
import TaskCard from "../Component/Card/TaskCard";
import {
  FaUsers,
  FaDollarSign,
  FaCheckCircle,
  FaCalendar,
  FaCheckSquare,
  FaSun,
  FaClipboardList,
  FaBell,
  FaTasks,
} from "react-icons/fa";

// Icon mapping
const iconMap = {
  users: FaUsers,
  "dollar-sign": FaDollarSign,
  "check-circle": FaCheckCircle,
  calendar: FaCalendar,
  "check-square": FaCheckSquare,
  sun: FaSun,
  "clipboard-list": FaClipboardList,
  bell: FaBell,
  tasks: FaTasks,
};

// Color mapping
const colorMap = {
  blue: "from-blue-500/20 to-blue-500/5 text-blue-600",
  green: "from-green-500/20 to-green-500/5 text-green-600",
  yellow: "from-yellow-500/20 to-yellow-500/5 text-yellow-600",
  red: "from-red-500/20 to-red-500/5 text-red-600",
  purple: "from-purple-500/20 to-purple-500/5 text-purple-600",
};

export default function Dashboard() {
  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const role = authUser?.user?.Role || "EMPLOYEE";
  const userId = authUser?.user?._id;

  const { allData, fetchAllData } = useUserStore();
  const { tasks, fetchTasks } = useTaskStore();
  const { teamList, fetchTeams } = useTeams();

  useEffect(() => {
    fetchAllData();
    fetchTasks();
    fetchTeams();
  }, []);

  // Filter userData
  const userData = useMemo(() => {
    if (!allData?.data) return null;
    const roleArray = allData.data[role.toUpperCase()] || [];
    return roleArray.find((user) => user._id === userId) || null;
  }, [allData, role, userId]);

  // Filter tasks based on role
  const filteredTasks = useMemo(() => {
    if (["ADMIN", "TL", "MANAGER"].includes(role.toUpperCase())) {
      return tasks; // Elevated roles see all
    }
    return tasks?.filter((task) =>
      task.assignee?.some((a) => a._id === userId)
    );
  }, [tasks, role, userId]);

  // Stats
  const cardData = [
    {
      label: "Leaves Taken",
      value: userData?.Leaves?.length ?? 0,
      icon: "calendar",
      color: "blue",
      description: "Total leaves applied",
    },
    {
      label: "Tasks Assigned",
      value: filteredTasks?.length ?? 0,
      icon: "tasks",
      color: "green",
      description: "Tasks you need to complete",
    },
    {
      label: "Teams Joined",
      value: role.toUpperCase() === "EMPLOYEE" ? userData?.JoinedTeams?.length ?? 0 : teamList?.length ?? 0,
      icon: "users",
      color: "yellow",
      description: role.toUpperCase() === "EMPLOYEE" ? "Teams you are in" : "Total teams in system",
    },
    {
      label: "Notifications",
      value: userData?.Notifications?.length ?? 0,
      icon: "bell",
      color: "red",
      description: "Unread notifications",
    },
  ];

  // Task breakdown
  const taskStats = useMemo(() => {
    const statusMap = { todo: 0, inprogress: 0, done: 0 };
    filteredTasks?.forEach((task) => {
      const st = task.status?.toLowerCase();
      if (statusMap[st] !== undefined) statusMap[st]++;
    });
    return statusMap;
  }, [filteredTasks]);

  if (!userData) {
    return (
      <div className="p-6 flex justify-center items-center">
        <h2 className="text-lg font-semibold text-gray-500 animate-pulse">
          Loading user data...
        </h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 px-2 bg-gray-100 min-h-screen">
      {/* Search bar */}
      <SearchBarComp />

      {/* User Info */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-white rounded-2xl shadow-md border border-gray-200">
        <img
          src={userData.Profile_url || "/default-avatar.png"}
          alt="Profile"
          className="w-28 h-28 rounded-2xl border-4 border-indigo-500 shadow-lg object-cover"
        />
        <div className="flex flex-col">
          <h2 className="text-3xl font-bold text-gray-800">
            {userData.FirstName} {userData.LastName}
          </h2>
          <i className="text-md text-indigo-600 font-medium">
            {userData.Designation}
          </i>
          <p className="text-sm text-gray-500">{userData.Department}</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cardData.map((card, index) => {
          const Icon = iconMap[card.icon] || FaClipboardList;
          const colorClass =
            colorMap[card.color] || "from-gray-500/20 to-gray-500/5 text-gray-600";

          return (
            <div
              key={index}
              className={`relative rounded-2xl p-4 shadow-md bg-gradient-to-br ${colorClass} backdrop-blur-md 
                          border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-[1.03]`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-600">{card.label}</h3>
                  <p className="text-3xl font-bold text-gray-800">{card.value}</p>
                </div>
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white shadow-inner">
                  <Icon className="text-2xl" />
                </div>
              </div>
              <p className="mt-4 text-xs text-gray-500 leading-relaxed">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Task Status Overview */}
      <div className="bg-white p-4 rounded-2xl shadow-md border">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Task Overview</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xl font-bold text-blue-600">{taskStats.todo}</p>
            <p className="text-sm text-gray-500">To Do</p>
          </div>
          <div>
            <p className="text-xl font-bold text-yellow-600">{taskStats.inprogress}</p>
            <p className="text-sm text-gray-500">In Progress</p>
          </div>
          <div>
            <p className="text-xl font-bold text-green-600">{taskStats.done}</p>
            <p className="text-sm text-gray-500">Completed</p>
          </div>
        </div>
      </div>

      {/* Tasks */}
      <div className="mt-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {["ADMIN", "TL", "MANAGER"].includes(role.toUpperCase()) ? "All Tasks" : "Your Tasks"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTasks && filteredTasks.length > 0 ? (
            filteredTasks.map((task) => <TaskCard key={task._id} task={task} />)
          ) : (
            <p className="text-gray-500 italic">No tasks assigned yet.</p>
          )}
        </div>
      </div>

      {/* Teams */}
      {/* <div className="mt-6 bg-white p-4 rounded-2xl shadow-md border">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Teams</h2>
        {role.toUpperCase() === "EMPLOYEE" ? (
          userData?.JoinedTeams?.length > 0 ? (
            <ul className="space-y-2">
              {userData.JoinedTeams.map((team) => (
                <li key={team._id} className="p-3 rounded-lg border bg-gray-50">
                  <p className="font-medium text-gray-700">{team.name}</p>
                  <p className="text-sm text-gray-500">{team.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 italic">You haven't joined any team.</p>
          )
        ) : teamList?.length > 0 ? (
          <ul className="space-y-2">
            {teamList.map((team) => (
              <li key={team._id} className="p-3 rounded-lg border bg-gray-50">
                <p className="font-medium text-gray-700">{team.name}</p>
                <p className="text-sm text-gray-500">{team.description}</p>
                <p className="text-xs text-gray-400">
                  Lead: {team.lead?.FirstName} {team.lead?.LastName}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No teams created yet.</p>
        )}
      </div> */}
    </div>
  );
}
