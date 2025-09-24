// Adminisration.jsx
import React, { useState, useEffect } from "react";
import Data from "../DataStore/Miscellaneous.json"; // You can merge Devices and EmployeeExpenses here as well

const Adminisration = () => {
  const [devices, setDevices] = useState([]);
  const [employeeExpenses, setEmployeeExpenses] = useState([]);
  const [miscExpenses, setMiscExpenses] = useState([]);
  const [deviceFilter, setDeviceFilter] = useState("All");
  const [employeeExpenseFilter, setEmployeeExpenseFilter] = useState("All");
  const [miscExpenseFilter, setMiscExpenseFilter] = useState("All");

  // Load data
  useEffect(() => {
    setDevices(Data.devices || []);
    setEmployeeExpenses(Data.employeeExpenses || []);
    setMiscExpenses(Data.miscExpenses || []);
  }, []);

  // Filtered data
  const filteredDevices =
    deviceFilter === "All"
      ? devices
      : devices.filter((d) => d.status === deviceFilter);

  const filteredEmployeeExpenses =
    employeeExpenseFilter === "All"
      ? employeeExpenses
      : employeeExpenses.filter((e) => e.status === employeeExpenseFilter);

  const filteredMiscExpenses =
    miscExpenseFilter === "All"
      ? miscExpenses
      : miscExpenses.filter((m) => m.category === miscExpenseFilter);

  // Extract unique categories/statuses
  const deviceStatuses = ["All", ...new Set(devices.map((d) => d.status))];
  const employeeExpenseStatuses = [
    "All",
    ...new Set(employeeExpenses.map((e) => e.status)),
  ];
  const miscCategories = ["All", ...new Set(miscExpenses.map((m) => m.category))];

  // Calculate totals
  const totalDevice = filteredDevices.length;
  const totalEmployeeExpenses = filteredEmployeeExpenses.reduce(
    (sum, e) => sum + e.amount,
    0
  );
  const totalMiscExpenses = filteredMiscExpenses.reduce((sum, m) => sum + m.amount, 0);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-12">
      <h1 className="text-3xl font-bold mb-4">Administration Dashboard</h1>

      {/* ---------------- DEVICES ---------------- */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">Devices Assigned</h2>
        <div className="flex justify-between mb-2">
          <div>
            <label className="mr-2 font-semibold">Filter by Status:</label>
            <select
              value={deviceFilter}
              onChange={(e) => setDeviceFilter(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
            >
              {deviceStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="font-semibold text-gray-700">
            Total Devices: <span className="text-blue-600">{totalDevice}</span>
          </div>
        </div>
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Device Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Type</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Assigned To</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Assign Date</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Return Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDevices.length > 0 ? (
                filteredDevices.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{d.name}</td>
                    <td className="px-4 py-2">{d.type}</td>
                    <td className="px-4 py-2">{d.assignedTo || "Unassigned"}</td>
                    <td className="px-4 py-2">{d.status}</td>
                    <td className="px-4 py-2">{d.assignDate || "-"}</td>
                    <td className="px-4 py-2">{d.returnDate || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500 font-medium">
                    No devices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ---------------- EMPLOYEE EXPENSES ---------------- */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">Employee Expenses</h2>
        <div className="flex justify-between mb-2">
          <div>
            <label className="mr-2 font-semibold">Filter by Status:</label>
            <select
              value={employeeExpenseFilter}
              onChange={(e) => setEmployeeExpenseFilter(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
            >
              {employeeExpenseStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
          <div className="font-semibold text-gray-700">
            Total Amount: <span className="text-blue-600">${totalEmployeeExpenses.toFixed(2)}</span>
          </div>
        </div>
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Employee ID</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Category</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Amount ($)</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Description</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Submitted On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmployeeExpenses.length > 0 ? (
                filteredEmployeeExpenses.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{e.employeeId}</td>
                    <td className="px-4 py-2">{e.category}</td>
                    <td className="px-4 py-2">{e.amount.toFixed(2)}</td>
                    <td className="px-4 py-2">{e.description}</td>
                    <td className="px-4 py-2">{e.status}</td>
                    <td className="px-4 py-2">{e.submittedOn}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500 font-medium">
                    No employee expenses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ---------------- MISC EXPENSES ---------------- */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">Miscellaneous Expenses</h2>
        <div className="flex justify-between mb-2">
          <div>
            <label className="mr-2 font-semibold">Filter by Category:</label>
            <select
              value={miscExpenseFilter}
              onChange={(e) => setMiscExpenseFilter(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1"
            >
              {miscCategories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="font-semibold text-gray-700">
            Total Amount: <span className="text-blue-600">${totalMiscExpenses.toFixed(2)}</span>
          </div>
        </div>
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Category</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Amount ($)</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Description</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Submitted By</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Submitted On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMiscExpenses.length > 0 ? (
                filteredMiscExpenses.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{m.category}</td>
                    <td className="px-4 py-2">{m.amount.toFixed(2)}</td>
                    <td className="px-4 py-2">{m.description}</td>
                    <td className="px-4 py-2">{m.submittedBy}</td>
                    <td className="px-4 py-2">{m.submittedOn}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500 font-medium">
                    No miscellaneous expenses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Adminisration;
