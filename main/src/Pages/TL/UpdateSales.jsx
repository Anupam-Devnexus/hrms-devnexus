import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const UpdateSales = () => {
  const [formData, setFormData] = useState({
    leadName: "",
    company: "",
    email: "",
    phone: "",
    stage: "",
    expectedRevenue: "",
    closingDate: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
const navigate = useNavigate();
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validate form
  const validate = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key].trim()) {
        newErrors[key] = "This field is required";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await fetch("https://your-backend.com/api/sales-funnel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to create sales funnel");

      const data = await response.json();
      console.log("Funnel created:", data);
      alert("Sales funnel created successfully!");

      // Reset form
      setFormData({
        leadName: "",
        company: "",
        email: "",
        phone: "",
        stage: "",
        expectedRevenue: "",
        closingDate: "",
        notes: "",
      });
      setErrors({});
    } catch (error) {
      console.error(error);
      alert("❌ Failed to create sales funnel.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-gray-900 p-3 rounded-lg shadow-lg text-white">
      <h2 className="text-2xl font-bold mb-6">Create Sales Funnel</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Lead Name */}
        <div>
          <label className="block mb-1">Lead Name</label>
          <input
            type="text"
            name="leadName"
            value={formData.leadName}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-600 bg-gray-800"
          />
          {errors.leadName && <p className="text-red-400 text-sm">{errors.leadName}</p>}
        </div>

        {/* Company */}
        <div>
          <label className="block mb-1">Company</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-600 bg-gray-800"
          />
          {errors.company && <p className="text-red-400 text-sm">{errors.company}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-600 bg-gray-800"
          />
          {errors.email && <p className="text-red-400 text-sm">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-600 bg-gray-800"
          />
          {errors.phone && <p className="text-red-400 text-sm">{errors.phone}</p>}
        </div>

        {/* Stage */}
        <div>
          <label className="block mb-1">Stage</label>
          <select
            name="stage"
            value={formData.stage}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-600 bg-gray-800"
          >
            <option value="">-- Select Stage --</option>
            <option value="Prospecting">Prospecting</option>
            <option value="Qualification">Qualification</option>
            <option value="Proposal">Proposal</option>
            <option value="Negotiation">Negotiation</option>
            <option value="Closed Won">Closed Won</option>
            <option value="Closed Lost">Closed Lost</option>
          </select>
          {errors.stage && <p className="text-red-400 text-sm">{errors.stage}</p>}
        </div>

        {/* Expected Revenue */}
        <div>
          <label className="block mb-1">Expected Revenue ($)</label>
          <input
            type="number"
            name="expectedRevenue"
            value={formData.expectedRevenue}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-600 bg-gray-800"
          />
          {errors.expectedRevenue && <p className="text-red-400 text-sm">{errors.expectedRevenue}</p>}
        </div>

        {/* Closing Date */}
        <div>
          <label className="block mb-1">Closing Date</label>
          <input
            type="date"
            name="closingDate"
            value={formData.closingDate}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-600 bg-gray-800"
          />
          {errors.closingDate && <p className="text-red-400 text-sm">{errors.closingDate}</p>}
        </div>

        {/* Notes (Full width) */}
        <div className="md:col-span-2">
          <label className="block mb-1">Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-600 bg-gray-800"
            rows={3}
          ></textarea>
          {errors.notes && <p className="text-red-400 text-sm">{errors.notes}</p>}
        </div>

        {/* Submit (Full width) */}
        <div className="md:col-span-1 grid grid-cols-2 gap-4 justify-between items-center">
          <button
          onClick={() => navigate(-1)}
          className="w-full py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
          >Back</button>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Create Funnel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateSales;
