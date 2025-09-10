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
                    <Route path="*" element={<div>Page Not Found</div>} />
                    <Route path="daily-updates" element={<DailyUpdates/>} />
                    <Route path="user-management" element={<UserManagement/>} />
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
