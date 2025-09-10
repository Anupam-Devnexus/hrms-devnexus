import React, { useState } from "react";
import {
  Home,
  User,
  ClipboardList,
  Bell,
  CheckSquare,
  Users,
  FileText,
  Settings,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { FaPowerOff } from "react-icons/fa";

// ✅ Config-driven menu (supports nested submenus)
const menuConfig = {
  common: [
    { label: "Dashboard", icon: <Home size={18} />, path: "/dashboard" },
    { label: "Profile", icon: <User size={18} />, path: "/dashboard/profile" },
    { label: "Attendance", icon: <ClipboardList size={18} />, path: "/dashboard/attendance" },
    { label: "Leaves", icon: <CheckSquare size={18} />, path: "/dashboard/leaves" },
    { label: "Tasks", icon: <ClipboardList size={18} />, path: "/dashboard/tasks" },
    { label: "Notifications", icon: <Bell size={18} />, path: "/dashboard/notifications" },
    { label: "Daily Updates", icon: <FileText size={18} />, path: "/dashboard/daily-updates" },
  ],

  tl: [
    {
      label: "Team",
      icon: <Users size={18} />,
      children: [
        { label: "View Team", path: "/team" },
        { label: "Create Team", path: "/create-team" },
      ],
    },
  ],

  hr: [
    {
      label: "HR Panel",
      icon: <Users size={18} />,
      children: [
        { label: "User Management", path: "/dashboard/user-management" },
        { label: "Mark Attendance", path: "/dashboard/mark-attendance" },
        { label: "Policies", path: "/dashboard/policies" },
        { label: "Leaves Approval", path: "/dashboard/leaves-approval" },
        { label: "Administration", path: "/dashboard/administration" },
      ],
    },
  ],

  admin: [
    {
      label: "Admin Panel",
      icon: <Settings size={18} />,
      children: [
        { label: "User Management", path: "/dashboard/user-management" },
        { label: "Attendance", path: "/dashboard/attendance-admin" },
        { label: "Policies", path: "/dashboard/policies" },
        { label: "Leaves", path: "/dashboard/leaves-admin" },
        { label: "Add User", path: "/dashboard/add-user" },
        { label: "Sales", path: "/dashboard/sales" },
        { label: "Administration", path: "/dashboard/administration" },
      ],
    },
  ],
};

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("authUser"));
  const role = user?.role || "employee";

  // Store which menus are open
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const menuItems = [...menuConfig.common, ...(menuConfig[role] || [])];

  return (
    <div className="w-64 h-screen bg-gray-900 text-white fixed left-0 top-0 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <img
            src="https://res.cloudinary.com/dt4ohfuwc/image/upload/v1750671563/DevNexus_qqt3p3.png"
            alt="Logo"
            className="w-16"
          />
          <div className="flex-col items-start">
            <h1 className="text-md font-bold">Devnexus Solutions</h1>
            <p className="text-sm text-gray-400">{role.toUpperCase()} Portal</p>
          </div>
        </div>
      </div>

      {/* Scrollable Menu */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
        {menuItems.map((item, idx) =>
          item.children ? (
            <div key={idx} className="space-y-1">
              <button
                onClick={() => toggleMenu(item.label)}
                className="flex items-center justify-between w-full px-3 py-2 rounded-lg 
                           hover:bg-gray-700 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <span className="p-2 border-2 rounded-full border-gray-600 group-hover:border-blue-600 transition">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {openMenus[item.label] ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>

              {/* Submenu */}
              {openMenus[item.label] && (
                <div className="ml-8 mt-1 flex flex-col gap-1">
                  {item.children.map((child, cidx) => (
                    <NavLink
                      key={cidx}
                      to={child.path}
                      className={({ isActive }) =>
                        `px-3 py-1 rounded-md text-sm transition-all duration-200 ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : "hover:bg-gray-700 hover:text-blue-400"
                        }`
                      }
                    >
                      {child.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <NavLink
              key={idx}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-700 hover:text-blue-400"
                }`
              }
            >
              <span className="p-2 border-2 rounded-full border-blue-600 transition-all duration-200">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </NavLink>
          )
        )}
      </nav>

      {/* Footer - User Info & Logout */}
      <div className="p-4 border-t border-gray-700 flex items-center justify-between">
        <div className="flex gap-3 items-center">
          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium">{user.username}</p>
            <p className="text-xs text-gray-400">{role.toUpperCase()}</p>
          </div>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("authUser");
            window.location.href = "/";
          }}
          className="bg-red-600 hover:bg-red-700 transition-all duration-200 text-white p-2 rounded-lg text-lg font-medium flex items-center justify-center"
        >
          <FaPowerOff />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
