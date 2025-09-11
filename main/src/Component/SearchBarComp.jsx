import React, { useState, useEffect, useRef } from "react";
import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";
import { CiSettings } from "react-icons/ci";
import { Home, User, ClipboardList, CheckSquare, FileText, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { mockNotifications } from "../DataStore/mockNotifications";

const SearchBarComp = () => {
  const navigate = useNavigate();
  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const role = authUser?.role || "employee";

  const [menuItems, setMenuItems] = useState([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const notificationRef = useRef();
  const settingsRef = useRef();

  const mockNotifications = [
    { id: 1, text: "New leave request from John" },
    { id: 2, text: "Task completed by Alice" },
    { id: 3, text: "System maintenance at 5 PM" },
  ];

  const menuConfig = {
    common: [
      { label: "Dashboard", icon: <Home size={18} />, path: "/dashboard" },
      { label: "Profile", icon: <User size={18} />, path: "/dashboard/profile" },
      { label: "Attendance", icon: <ClipboardList size={18} />, path: "/dashboard/attendance" },
      { label: "Leaves", icon: <CheckSquare size={18} />, path: "/dashboard/leaves" },
      { label: "Tasks", icon: <ClipboardList size={18} />, path: "/dashboard/tasks" },
      { label: "Notifications", icon: <FaBell size={18} />, path: "/dashboard/notifications" },
      { label: "Daily Updates", icon: <FileText size={18} />, path: "/dashboard/daily-updates" },
    ],
    tl: [
      { label: "Team", icon: <Users size={18} />, children: [{ label: "View Team", path: "/team" }, { label: "Create Team", path: "/create-team" }] },
    ],
    hr: [
      {
        label: "HR Panel", icon: <Users size={18} />, children: [
          { label: "User Management", path: "/user-management" },
          { label: "Mark Attendance", path: "/mark-attendance" },
          { label: "Policies", path: "/policies" },
          { label: "Leaves Approval", path: "/leaves-approval" },
          { label: "Administration", path: "/administration" },
        ]
      },
    ],
    admin: [
      {
        label: "Admin Panel", icon: <CiSettings size={18} />, children: [
          { label: "User Management", path: "/dashboard/user-management" },
          { label: "Attendance", path: "/dashboard/attendance-admin" },
          { label: "Policies", path: "/dashboard/policies" },
          { label: "Leaves", path: "/dashboard/leaves-admin" },
          { label: "Add User", path: "/dashboard/add-user" },
          { label: "Sales", path: "/dashboard/sales" },
          { label: "Administration", path: "/dashboard/administration" },
        ]
      },
    ],
  };

  // Merge common + role-specific menu
  useEffect(() => {
    const roleMenus = menuConfig[role] || [];
    setMenuItems([...menuConfig.common, ...roleMenus]);
  }, [role]);

  // Filter menu items based on query
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    const filterItems = (items) => {
      return items
        .map((item) => {
          if (item.children) {
            const filteredChildren = filterItems(item.children);
            if (filteredChildren.length > 0) return { ...item, children: filteredChildren };
          }
          if (item.label.toLowerCase().includes(query.toLowerCase())) return item;
          return null;
        })
        .filter(Boolean);
    };
    setResults(filterItems(menuItems));
  }, [query, menuItems]);

  const handleNavigate = (path) => {
    navigate(path);
    setQuery("");
  };

  const renderResults = (items) =>
    items.map((item, index) => (
      <div key={index} className="p-2 hover:bg-gray-100 cursor-pointer rounded"
        onClick={() => item.path && handleNavigate(item.path)}>
        <div className="flex items-center gap-2">
          {item.icon && <span>{item.icon}</span>}
          <span>{item.label}</span>
        </div>
        {item.children && <div className="ml-4 mt-1">{renderResults(item.children)}</div>}
      </div>
    ));

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) setShowNotifications(false);
      if (settingsRef.current && !settingsRef.current.contains(e.target)) setShowSettings(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-between w-full px-3   rounded-md bg-white ">
      {/* Search */}
      <div className="relative flex-1 p-2 max-w-full">
        <div className="flex items-center border-2 rounded-2xl border-blue-300  px-3 py-2 ">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search menu..."
            className="w-full outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {results.length > 0 && (
          <div className="absolute z-50 w-full bg-white border rounded shadow mt-1 max-h-64 overflow-y-auto">
            {renderResults(results)}
          </div>
        )}
      </div>

      {/* Icons */}
      <div className="flex items-center gap-4 ml-4">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <FaBell className="text-blue-700 cursor-pointer" size={20} onClick={() => setShowNotifications(!showNotifications)} />
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg z-50">
              <h3 className="font-bold p-2 border-b">Notifications</h3>
              <div className="max-h-48 overflow-y-auto">
                {mockNotifications.map((notif) => (
                  <div key={notif.id} className="p-2 hover:bg-gray-100 cursor-pointer">
                    {notif.text}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="relative" ref={settingsRef}>
          <CiSettings className="text-blue-700 cursor-pointer" size={22} onClick={() => setShowSettings(!showSettings)} />
          {showSettings && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-50">
              <div className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => navigate("/dashboard/profile")}>
                Profile
              </div>
              <div className="p-2 hover:bg-gray-100 cursor-pointer" onClick={() => {

                navigate("/settings");
              }}>
                Settings
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBarComp;
