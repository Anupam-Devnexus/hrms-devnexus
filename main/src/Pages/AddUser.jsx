import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import menuConfig from "../DataStore/NavBar.json";

// ----------------------------------
// Validation Schema with Yup
// ----------------------------------
const validationSchema = Yup.object({
  FirstName: Yup.string().required("First Name is required"),
  LastName: Yup.string().required("Last Name is required"),
  Email: Yup.string().email("Invalid email").required("Email is required"),
  Phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
    .required("Phone is required"),
  Dob: Yup.date().required("Date of Birth is required"),
  Department: Yup.string().required("Department is required"),
  Designation: Yup.string().required("Designation is required"),
  Role: Yup.string().required("Role is required"),
  Password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const roles = ["ADMIN", "HR", "TL", "EMPLOYEE"];
const departments = ["IT", "HR", "Finance", "Sales", "Marketing", "Support"];
const designations = [
  "Software Engineer",
  "Team Lead",
  "Manager",
  "HR Executive",
  "Finance Executive",
  "Sales Associate",
];

const AddUser = () => {
  const [preview, setPreview] = useState(null);

  const initialValues = {
    FirstName: "",
    LastName: "",
    Email: "",
    Phone: "",
    Dob: "",
    Department: "",
    Designation: "",
    Role: "",
    Permissions: [],
    Address: "",
    EmergencyPhone: "",
    EmergencyName: "",
    EmergencyRelation: "",
    Password: "",
    AllowedTabs: menuConfig.common.map((c) => c.label),
    Profile: null,
  };

  const getRoleMenu = (role) =>
    role ? menuConfig[role.toLowerCase()] || [] : [];

  const handleImageUpload = (e, setFieldValue) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      // Send Base64 string to backend
      setFieldValue("Profile", reader.result);
      setPreview(reader.result); // also use as preview
    };
    reader.readAsDataURL(file);
  }
};


  const handleSubmit = async (values, { resetForm }) => {
    const mergedTabs = [
      ...new Set([...values.AllowedTabs, ...menuConfig.common.map((c) => c.label)]),
    ];

    const finalPayload = { ...values, AllowedTabs: mergedTabs };

    console.log("📦 Final Payload before API:", finalPayload);

    try {
      const data = new FormData();
      Object.keys(finalPayload).forEach((key) => {
        if (key === "Permissions" || key === "AllowedTabs") {
          data.append(key, JSON.stringify(finalPayload[key]));
        } else if (key === "Profile" && finalPayload.Profile) {
          data.append("Profile", finalPayload.Profile);
        } else {
          data.append(key, finalPayload[key]);
        }
      });

      const response = await fetch(
        "https://hrms-backend2.onrender.com/api/add-employee",
        {
          method: "POST",
          body: data,
          headers:{
             "Content-Type": "application/json",
          }
        }
      );
console.log("API Response Status:", response);
      if (!response.ok) throw new Error("Failed to add employee");

      const result = await response.json();
      alert("Employee added successfully!");
      console.log("API Response:", result);

      resetForm();
      setPreview(null);
    } catch (err) {
      console.error("❌ Error:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-2">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add New Employee</h2>
          <button
            onClick={() => window.history.back()}
            className="text-blue-600 hover:underline"
          >
            Back
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Input Fields */}
              {[
                { label: "First Name *", name: "FirstName" },
                { label: "Last Name *", name: "LastName" },
                { label: "Email *", name: "Email", type: "email" },
                { label: "Phone *", name: "Phone" },
                { label: "Date of Birth *", name: "Dob", type: "date" },
              ].map((f) => (
                <div key={f.name} className="flex flex-col gap-1">
                  <label className="text-gray-700 font-medium">{f.label}</label>
                  <Field
                    type={f.type || "text"}
                    name={f.name}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name={f.name}
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>
              ))}

              {/* Department / Designation / Role */}
              <div className="flex flex-col gap-1">
                <label className="text-gray-700 font-medium">Department *</label>
                <Field
                  as="select"
                  name="Department"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Department</option>
                  {departments.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="Department"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-gray-700 font-medium">Designation *</label>
                <Field
                  as="select"
                  name="Designation"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Designation</option>
                  {designations.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="Designation"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-gray-700 font-medium">Role *</label>
                <Field
                  as="select"
                  name="Role"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Role</option>
                  {roles.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="Role"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Allowed Tabs */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2">
                  Allowed Tabs (Common)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {menuConfig.common.map((item) => (
                    <label key={item.label} className="flex items-center gap-2">
                      <Field
                        type="checkbox"
                        name="AllowedTabs"
                        value={item.label}
                        className="accent-blue-600"
                      />
                      {item.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Permissions */}
              {values.Role && (
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">
                    Permissions ({values.Role})
                  </label>
                  <div className="space-y-2">
                    {getRoleMenu(values.Role).map((item) => (
                      <div key={item.label} className="border rounded-lg p-3">
                        <label className="flex items-center gap-2 font-medium">
                          <Field
                            type="checkbox"
                            name="Permissions"
                            value={item.label}
                            className="accent-blue-600"
                          />
                          {item.label}
                        </label>
                        {item.children && (
                          <div className="ml-6 mt-2 space-y-1">
                            {item.children.map((child) => (
                              <label
                                key={child.label}
                                className="flex items-center gap-2"
                              >
                                <Field
                                  type="checkbox"
                                  name="Permissions"
                                  value={`${item.label} > ${child.label}`}
                                  className="accent-blue-600"
                                />
                                {child.label}
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Address */}
              <div className="md:col-span-2 flex flex-col gap-1">
                <label className="text-gray-700 font-medium">Address</label>
                <Field
                  as="textarea"
                  name="Address"
                  rows={2}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <h2 className="md:col-span-2 text-xl font-semibold text-gray-800 mt-4">
                Emergency Details
              </h2>

              {/* Emergency Info */}
              <Field name="Phone" placeholder=" Phone" className="p-2 border rounded-lg" />
              <Field name="Name" placeholder=" Nick Name" className="p-2 border rounded-lg" />
              <Field name="Relation" placeholder=" Relation" className="p-2 border rounded-lg" />

              {/* Password */}
              <div className="flex flex-col gap-1">
                <label className="text-gray-700 font-medium">Password *</label>
                <Field
                  type="password"
                  name="Password"
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="Password"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              {/* Image Upload */}
              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="text-gray-700 font-medium">Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, setFieldValue)}
                  className="border p-2 rounded-lg cursor-pointer"
                />
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-48 rounded-md object-cover border"
                  />
                )}
              </div>

              {/* Submit */}
              <div className="md:col-span-2 mt-3">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Add Employee
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddUser;
