import React from "react";

const EmployeeCard = ({ employee  }) => {
  return (
    <div className="max-w-sm bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
      {/* Profile Image */}
      <div className="flex items-center justify-center">
        <img
          src={employee.Profile_url}
          alt={employee.FirstName + " " + employee.LastName}
          className="w-18 h-18 rounded-md border-2 border-indigo-500"
        />
      {/* Name and Role */}
      <div className="text-left px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {employee.FirstName} {employee.LastName}
        </h2>
        <p className="text-sm text-gray-500">{employee.Role}</p>
        <p className="text-sm text-gray-500">{employee.Designation}</p>
        <p className="text-sm text-gray-500">{employee.Department}</p>
      </div>
      </div>


      {/* Contact Info */}
      <div className="px-6 py-4 border-t border-gray-100">
        <h3 className="text-gray-700 font-medium">Contact</h3>
        <p className="text-sm text-gray-500">Email: {employee.Email}</p>
        <p className="text-sm text-gray-500">Phone: {employee.Phone}</p>
        <p className="text-sm text-gray-500">Address: {employee.Address}</p>
      </div>

      {/* Emergency Contact */}
      <div className="px-6 py-4 border-t border-gray-100">
        <h3 className="text-gray-700 font-medium">Emergency Contact</h3>
        <p className="text-sm text-gray-500">
          {employee.EmergencyName} ({employee.EmergencyRelation})
        </p>
        <p className="text-sm text-gray-500">Phone: {employee.EmergencyPhone}</p>
      </div>

      {/* Permissions */}
      <div className="px-6 py-4 border-t border-gray-100">
        <h3 className="text-gray-700 font-medium">Permissions</h3>
        <div className="flex flex-wrap gap-2 mt-2">
  {employee.Permissions && employee.Permissions.length > 0
    ? (Array.isArray(employee.Permissions[0])
        ? employee.Permissions[0]
        : (() => {
            try {
              return JSON.parse(employee.Permissions[0]);
            } catch {
              return [employee.Permissions[0]];
            }
          })()
      ).map((perm, index) => (
        <span
          key={index}
          className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-1 rounded"
        >
          {perm}
        </span>
      ))
    : "No permissions"}
</div>

      </div>

      {/* Dates */}
      <div className="px-6 py-4 border-t border-gray-100 text-gray-500 text-sm">
        <p>Joining Date: {new Date(employee.JoiningDate).toLocaleDateString()}</p>
        <p>DOB: {new Date(employee.Dob).toLocaleDateString()}</p>
      </div>
     
    </div>
  );
};

export default EmployeeCard;
