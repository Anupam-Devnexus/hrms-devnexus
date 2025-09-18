import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// --------------------
// Validation Schema
// --------------------
const validationSchema = Yup.object({
    type: Yup.string().required("Leave type is required"),
    fromDate: Yup.date().required("Start date is required"),
    toDate: Yup.date()
        .required("End date is required")
        .min(Yup.ref("fromDate"), "End date cannot be before start date"),
    reason: Yup.string().required("Reason is required"),
});

const ApplyLeave = () => {
    const authUser = JSON.parse(localStorage.getItem("authUser"));
    const token = authUser?.accessToken;

    const [loading, setLoading] = useState(false);

    // --------------------
    // Initial Form Values
    // --------------------
    const initialValues = {
        type: "",
        fromDate: "",
        toDate: "",
        reason: "",
    };

    // --------------------
    // Submit Handler
    // --------------------
    const handleSubmit = async (values, { resetForm }) => {
        const payload = {
            leaveType: values.type,
            from: values.fromDate,
            to: values.toDate,
            reason: values.reason,
        };

        try {
            setLoading(true);
            console.log("📤 Posting Leave Payload:", payload);

            const res = await fetch(
                "https://hrms-backend-9qzj.onrender.com/api/leave/apply-leave",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );

            const data = await res.json();
            console.log("📥 Backend Response:", data);

            if (!res.ok) {
                throw new Error(data.message || "Failed to submit leave");
            }

            resetForm();
            alert("✅ Leave application submitted successfully!");
        } catch (err) {
            console.error("❌ Error applying leave:", err);
            alert(err.message || "Error submitting leave application. Try again.");
        } finally {
            setLoading(false);
        }
    };

    // --------------------
    // If user is not logged in
    // --------------------
    if (!authUser) {
        return (
            <div className="p-6 text-center text-red-500 font-semibold">
                You must be logged in to apply for leave.
            </div>
        );
    }

    return (
        <div className="p-2 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-100 text-center">
                    Apply for Leave
                </h1>
                <button
                    className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 transition"
                    onClick={() => window.history.back()}
                >
                    Back
                </button>
            </div>

            {/* User Info */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-5 grid grid-cols-1 md:grid-cols-2 rounded-xl shadow-lg mb-6">
                <h2 className="text-lg font-semibold">Employee Details</h2>
                <p>👤 {authUser?.user?.FirstName} {authUser?.user?.LastName}</p>
                <p>📧 {authUser?.user?.Email}</p>
                <p>🏢 {authUser?.user?.Department}</p>
                <p>🎫 ID: {authUser?.user?.EmployeeId}</p>
                <p>🛡 Role: {authUser?.user?.Role?.toUpperCase()}</p>
            </div>

            {/* Leave Form */}
            <div className="bg-white shadow-lg rounded-2xl p-6">
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-5">
                            {/* Leave Type */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">
                                    Leave Type <span className="text-red-500">*</span>
                                </label>
                                <Field
                                    as="select"
                                    name="type"
                                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                                >
                                    <option value="">Select leave type</option>
                                    <option value="Sick">Sick</option>
                                    <option value="Casual">Casual</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Unpaid">Unpaid</option>
                                    <option value="Maternity">Maternity</option>
                                    <option value="Other">Other</option>
                                </Field>
                                <ErrorMessage
                                    name="type"
                                    component="p"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>

                            {/* From Date */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">
                                    From Date <span className="text-red-500">*</span>
                                </label>
                                <Field
                                    type="date"
                                    name="fromDate"
                                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                                />
                                <ErrorMessage
                                    name="fromDate"
                                    component="p"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>

                            {/* To Date */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">
                                    To Date <span className="text-red-500">*</span>
                                </label>
                                <Field
                                    type="date"
                                    name="toDate"
                                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                                />
                                <ErrorMessage
                                    name="toDate"
                                    component="p"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>

                            {/* Reason */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-1">
                                    Reason <span className="text-red-500">*</span>
                                </label>
                                <Field
                                    as="textarea"
                                    name="reason"
                                    rows="3"
                                    placeholder="Enter reason for leave..."
                                    className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                                />
                                <ErrorMessage
                                    name="reason"
                                    component="p"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </div>

                            {/* Submit */}
                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    disabled={isSubmitting || loading}
                                    className={`px-6 py-2 rounded-lg shadow-md transition font-medium text-white ${loading
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-indigo-600 hover:bg-indigo-700"
                                        }`}
                                >
                                    {loading ? "Submitting..." : "Apply Leave"}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default ApplyLeave;
