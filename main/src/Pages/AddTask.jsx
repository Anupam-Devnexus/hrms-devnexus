import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddTask = () => {
    const authuser = JSON.parse(localStorage.getItem("authUser"));
    const name = authuser?.user?.FirstName || "User";
    const role = authuser?.user?.Role || "Employee";

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        dueDate: "",
        assignedTo: role === "Employee" ? name : "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting Task:", formData);

        try {
            const res = await fetch("https://hrms-backend-9qzj.onrender.com/api/task/add-task", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            console.log(res)
            if (!res.ok) throw new Error("Failed to add task");

            console.log("Task added successfully");
            setFormData({
                title: "",
                description: "",
                dueDate: "",
                priority: "Normal",
                assignedTo: role === "Employee" ? name : "",
            });
        } catch (err) {
            console.error("Error adding task:", err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-6">
            <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
                <div className="flex items-center justify-between">

                    <h1 className="text-2xl font-bold mb-6 text-gray-800">
                        Add Task ({role})
                    </h1>

                    <button
                        className="px-3 py-1 bg-gray-500 text-white font-semibold"
                        onClick={() => navigate('/dashboard/tasks')}>
                        Back
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Task Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Due Date */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">
                            Due Date
                        </label>
                        <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Priority (Only for Admin/HR/Manager) */}
                    {(role === "ADMIN" || role === "HR" || role === "MANAGER") && (
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">
                                Priority
                            </label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Low">Low</option>
                                <option value="Normal">Normal</option>
                                <option value="High">High</option>
                                <option value="Urgent">Urgent</option>
                            </select>
                        </div>
                    )}

                    {/* Assigned To (Only for Admin/HR/Manager) */}
                    {(role === "ADMIN" || role === "HR" || role === "MANAGER") && (
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">
                                Assign To
                            </label>
                            <input
                                type="text"
                                name="assignedTo"
                                value={formData.assignedTo}
                                onChange={handleChange}
                                placeholder="Enter employee name or ID"
                                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    )}

                    {/* Employees: Auto assigned to self */}
                    {role === "Employee" && (
                        <p className="text-sm text-gray-500">
                            Task will be assigned to <span className="font-semibold">{name}</span>.
                        </p>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Add Task
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTask;
