// Login.jsx
import React, { useState } from "react";
import { mockUsers } from "../DataStore/Mockuser";
import bcrypt from "bcryptjs";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const user = mockUsers.find((u) => u.username === username);

    if (!user) {
      setError("Invalid username or password");
      return;
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);

    if (!isPasswordValid) {
      setError("Invalid username or password");
      return;
    }

    // Create mock token
    const token = btoa(`${user.username}:${Date.now()}`);

    // Store in localStorage
    localStorage.setItem(
      "authUser",
      JSON.stringify({
        id: user.id,
        username: user.username,
        role: user.role,
        token,
      })
    );

    // ✅ Redirect to single dashboard route
    navigate("/dashboard");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-lg p-8 w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-3 py-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
