// Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "EMPLOYEE"
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      console.log("Sending request:", {
        Email: formData.email,
        Password: formData.password,
        Role: formData.role,
      });

      const res = await fetch(
        "https://hrms-backend-9qzj.onrender.com/api/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Email: formData.email,
            Password: formData.password,
            Role: formData.role,
          }),
        }
      );
      console.log("Response status:", res);

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }
      console.log("Login successful:", data);

      localStorage.setItem("authUser", JSON.stringify(data));
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen"
      style={{
        backgroundImage:
          'url("https://images.pexels.com/photos/4391612/pexels-photo-4391612.jpeg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <form
        onSubmit={handleLogin}
        className="backdrop-blur-md bg-white/30 shadow-2xl rounded-2xl p-8 w-96 border border-white/40"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 drop-shadow">
          Login
        </h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Role Dropdown */}
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 rounded-lg border border-white/50 bg-white/40 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="HR">HR</option>
          <option value="ADMIN">Admin</option>
          <option value="TL">TL</option>
          <option value="EMPLOYEE">Employee</option>
        </select>

        {/* Email Input */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 rounded-lg border border-white/50 bg-white/40 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        {/* Password Input with Show/Hide */}
        <div className="relative w-full mb-6">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-white/50 bg-white/40 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600/90 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md ${loading ? "cursor-not-allowed opacity-70" : ""
            }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
