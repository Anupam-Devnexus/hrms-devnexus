import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Validation Schema
const validationSchema = Yup.object({
  FirstName: Yup.string().required("First Name is required"),
  LastName: Yup.string().required("Last Name is required"),
  Email: Yup.string().email("Invalid email").required("Email is required"),
  Phone: Yup.string().required("Phone is required"),
  Address: Yup.string().required("Address is required"),
  Role: Yup.string().required("Role is required"),
  Department: Yup.string().required("Department is required"),
  Designation: Yup.string().required("Designation is required"),
  EmergencyName: Yup.string().required("Emergency contact name is required"),
  EmergencyPhone: Yup.string().required("Emergency phone is required"),
  EmergencyRelation: Yup.string().required("Emergency relation is required"),
  Dob: Yup.date().required("Date of Birth is required"),
  JoiningDate: Yup.date().required("Joining Date is required"),
});

const roles = ["ADMIN", "HR", "EMPLOYEE", "TL"];
const departments = ["HR", "IT", "Finance", "Sales", "Operations"];
const designations = ["Manager", "HR", "Developer", "Team Lead", "Intern"];
const allPermissions = ["View Dashboard", "Manage Users", "Approve Leave", "Access Reports"];

const EditProfile = ({ employee, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://hrms-backend2.onrender.com/api/update-user/${employee._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) throw new Error("Failed to update profile");

      const updatedData = await response.json();
      if (onUpdate) onUpdate(updatedData);
      alert("✅ Profile updated successfully");
    } catch (error) {
      console.error(error);
      alert("❌ Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Profile</h2>

      <Formik
        initialValues={{
          FirstName: employee.FirstName || "",
          LastName: employee.LastName || "",
          Email: employee.Email || "",
          Phone: employee.Phone || "",
          Address: employee.Address || "",
          Role: employee.Role || "",
          Department: employee.Department || "",
          Designation: employee.Designation || "",
          EmergencyName: employee.EmergencyName || "",
          EmergencyPhone: employee.EmergencyPhone || "",
          EmergencyRelation: employee.EmergencyRelation || "",
          Dob: employee.Dob ? employee.Dob.split("T")[0] : "",
          JoiningDate: employee.JoiningDate ? employee.JoiningDate.split("T")[0] : "",
          Permissions:
            employee.Permissions && employee.Permissions.length > 0
              ? Array.isArray(employee.Permissions[0])
                ? employee.Permissions[0]
                : (() => {
                    try {
                      return JSON.parse(employee.Permissions[0]);
                    } catch {
                      return [employee.Permissions[0]];
                    }
                  })()
              : [],
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium">First Name</label>
              <Field
                name="FirstName"
                className="mt-1 w-full border rounded-lg px-3 py-2"
              />
              <ErrorMessage name="FirstName" className="text-red-500 text-xs" component="div" />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium">Last Name</label>
              <Field
                name="LastName"
                className="mt-1 w-full border rounded-lg px-3 py-2"
              />
              <ErrorMessage name="LastName" className="text-red-500 text-xs" component="div" />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium">Email</label>
              <Field
                type="email"
                name="Email"
                className="mt-1 w-full border rounded-lg px-3 py-2"
              />
              <ErrorMessage name="Email" className="text-red-500 text-xs" component="div" />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium">Phone</label>
              <Field
                name="Phone"
                className="mt-1 w-full border rounded-lg px-3 py-2"
              />
              <ErrorMessage name="Phone" className="text-red-500 text-xs" component="div" />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium">Address</label>
              <Field
                as="textarea"
                name="Address"
                rows="2"
                className="mt-1 w-full border rounded-lg px-3 py-2"
              />
              <ErrorMessage name="Address" className="text-red-500 text-xs" component="div" />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium">Role</label>
              <Field as="select" name="Role" className="mt-1 w-full border rounded-lg px-3 py-2">
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="Role" className="text-red-500 text-xs" component="div" />
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium">Department</label>
              <Field as="select" name="Department" className="mt-1 w-full border rounded-lg px-3 py-2">
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="Department" className="text-red-500 text-xs" component="div" />
            </div>

            {/* Designation */}
            <div>
              <label className="block text-sm font-medium">Designation</label>
              <Field as="select" name="Designation" className="mt-1 w-full border rounded-lg px-3 py-2">
                <option value="">Select Designation</option>
                {designations.map((desig) => (
                  <option key={desig} value={desig}>
                    {desig}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="Designation" className="text-red-500 text-xs" component="div" />
            </div>

            {/* DOB */}
            <div>
              <label className="block text-sm font-medium">Date of Birth</label>
              <Field type="date" name="Dob" className="mt-1 w-full border rounded-lg px-3 py-2" />
              <ErrorMessage name="Dob" className="text-red-500 text-xs" component="div" />
            </div>

            {/* Joining Date */}
            <div>
              <label className="block text-sm font-medium">Joining Date</label>
              <Field type="date" name="JoiningDate" className="mt-1 w-full border rounded-lg px-3 py-2" />
              <ErrorMessage name="JoiningDate" className="text-red-500 text-xs" component="div" />
            </div>

            {/* Permissions */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium">Permissions</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {allPermissions.map((perm) => (
                  <label key={perm} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={values.Permissions.includes(perm)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFieldValue("Permissions", [...values.Permissions, perm]);
                        } else {
                          setFieldValue(
                            "Permissions",
                            values.Permissions.filter((p) => p !== perm)
                          );
                        }
                      }}
                    />
                    <span className="text-sm">{perm}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <label className="block text-sm font-medium">Emergency Contact Name</label>
              <Field name="EmergencyName" className="mt-1 w-full border rounded-lg px-3 py-2" />
              <ErrorMessage name="EmergencyName" className="text-red-500 text-xs" component="div" />
            </div>

            <div>
              <label className="block text-sm font-medium">Emergency Phone</label>
              <Field name="EmergencyPhone" className="mt-1 w-full border rounded-lg px-3 py-2" />
              <ErrorMessage name="EmergencyPhone" className="text-red-500 text-xs" component="div" />
            </div>

            <div>
              <label className="block text-sm font-medium">Emergency Relation</label>
              <Field name="EmergencyRelation" className="mt-1 w-full border rounded-lg px-3 py-2" />
              <ErrorMessage name="EmergencyRelation" className="text-red-500 text-xs" component="div" />
            </div>

            {/* Submit */}
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default EditProfile;
