// App.jsx
import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Auth/Login";
import ProtectedRoute from "./Auth/ProtectedRoute";
import Dashboard from "./Pages/Dashboard";
import Navbar from "./Component/Navbar";
import Profile from "./Pages/Profile";
import DailyUpdates from "./Pages/DailyUpadates";
import UserManagement from "./Pages/UserManagement";
import AddUser from "./Pages/AddUser";
import Notifications from "./Pages/Notifications";
import Attendance from "./Pages/Attendance";
import MarkAttendance from "./Pages/MarkAttendance";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route path="/" element={<Login />} />

        {/* Protected Dashboard (common for all roles) */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <div className="flex">
                {/* Sidebar */}
                <Navbar />
                {/* Main content */}
                <div className="flex-1 ml-64 p-1">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="daily-updates" element={<DailyUpdates />} />
                    <Route path="user-management" element={<UserManagement />} />
                    <Route path="add-user" element={<AddUser />} />
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="attendance" element={<Attendance />} />
                    <Route path="mark-attendance/:id" element={<MarkAttendance />} />
                    <Route path="*" element={<div>Page Not Found</div>} />
                  </Routes>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
