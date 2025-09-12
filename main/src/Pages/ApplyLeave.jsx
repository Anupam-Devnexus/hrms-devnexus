import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

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

    const initialValues = {
        type: "",
        fromDate: "",
        toDate: "",
        reason: "",
    };

    const handleSubmit = async (values, { resetForm }) => {
        const payload = {
            EmployeeId: authUser?.EmployeeId,
            Name: `${authUser?.FirstName || ""} ${authUser?.LastName || ""}`,
            Role: authUser?.role || "Employee",
            Department: authUser?.Department || "N/A",
            Email: authUser?.Email,
            LeaveDetails: {
                Type: values.type,
                FromDate: values.fromDate,
                ToDate: values.toDate,
                Reason: values.reason,
                Status: "Pending", // default
                AppliedOn: new Date().toISOString(),
            },
        };

        try {
            console.log("📤 Posting Leave Payload:", payload);

            // ✅ Replace with your backend API endpoint
            const res = await fetch("https://your-backend.com/api/apply-leave", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to submit leave");

            const data = await res.json();
            console.log("✅ Leave Applied Successfully:", data);

            resetForm();
            alert("Leave application submitted successfully!");
        } catch (err) {
            console.error("❌ Error applying leave:", err);
            alert("Error submitting leave application. Try again.");
        }
    };

    return (
        <div className="p-2 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-4">

                <h1 className="text-3xl font-bold text-gray-800  text-center">
                    📝 Apply for Leave
                </h1>
                <button className="bg-blue-500 text-white"
                    onClick={() => window.history.back()}
                >Back</button>
            </div>

            {/* User Info Card */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-5 rounded-xl shadow-lg mb-6">
                <h2 className="text-lg font-semibold">Employee Details</h2>
                <p>👤 {authUser?.Name} {authUser?.LastName}</p>
                <p>📧 {authUser?.Email}</p>
                <p>🏢 {authUser?.Department}</p>
                <p>🎫 ID: {authUser?.EmployeeId}</p>
                <p>🛡 Role: {authUser?.role?.toUpperCase()}</p>
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
                                    <option value="Casual Leave">Casual Leave</option>
                                    <option value="Sick Leave">Sick Leave</option>
                                    <option value="Earned Leave">Earned Leave</option>
                                    <option value="Work From Home">Work From Home</option>
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
                                    disabled={isSubmitting}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg shadow-md transition font-medium"
                                >
                                    {isSubmitting ? "Submitting..." : "Apply Leave"}
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
