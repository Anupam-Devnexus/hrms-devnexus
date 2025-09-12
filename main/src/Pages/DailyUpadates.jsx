import React, { useState } from "react";

const DailyUpdates = () => {
    const user = JSON.parse(localStorage.getItem("authUser")) || {};
    const { username, role } = user;

    const token = user.accessToken;
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [images, setImages] = useState([]);
    const [preview, setPreview] = useState([]);

    const [showConfirm, setShowConfirm] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Handle file selection
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
        setPreview(files.map((file) => URL.createObjectURL(file)));
    };

    // Show confirmation modal
    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!title || !description) {
            alert("Title and Description are required!");
            return;
        }
        setShowConfirm(true);
    };

    // Actual API submit
    const confirmSubmit = async () => {
        setSubmitting(true);
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        images.forEach((img) => formData.append("images", img));

        try {
            const res = await fetch("https://hrms-backend2.onrender.com/api", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                alert("Update posted successfully!");
                setTitle("");
                setDescription("");
                setImages([]);
                setPreview([]);
                setShowConfirm(false);
            } else {
                alert("Failed to post update.");
            }
        } catch (error) {
            console.error(error);
            alert("Error posting update.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-4 min-h-md max-w-5xl mx-auto bg-gray-100 rounded-xl shadow-md">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 border-b pb-3">
                <h2 className="text-2xl font-bold text-blue-700">Daily Updates</h2>
                <p className="text-gray-600">
                    Logged in as{" "}
                    <span className="font-semibold text-gray-800">{user?.isExists?.FirstName}</span> (
                    {user?.isExists?.Role})
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="space-y-5">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        className="mt-1 block w-full border-b outline-none  p-2 "
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter title"
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        rows="4"
                        className="mt-1 block w-full border-b outline-none  p-2 "
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Write your update here..."
                        required
                    ></textarea>
                </div>

                {/* Images */}
                <div className="flex items-center justify-between gap-2">
                    <label className="block text-sm ">
                        Upload Images (optional)
                    </label>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="block text-sm border-2 p-2 rounded-2xl cursor-pointer w-1/4 font-medium text-gray-700"

                        onChange={handleImageChange}
                    />
                </div>
                {preview.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                        {preview.map((src, idx) => (
                            <img
                                key={idx}
                                src={src}
                                alt="preview"
                                className="w-full h-full object-cover rounded-lg border"
                            />
                        ))}
                    </div>
                )}

                {/* Submit */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    disabled={submitting}
                >
                    {submitting ? "Posting..." : "Post Update"}
                </button>
            </form>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
                        <h3 className="text-lg font-semibold mb-4">Confirm Your Update</h3>
                        <p className="mb-2">
                            <strong>Title:</strong> {title}
                        </p>
                        <p className="mb-2">
                            <strong>Description:</strong> {description}
                        </p>
                        {preview.length > 0 && (
                            <div className="flex gap-2 flex-wrap mb-4">
                                {preview.map((src, idx) => (
                                    <img
                                        key={idx}
                                        src={src}
                                        alt="preview"
                                        className="w-16 h-16 object-cover rounded-lg border"
                                    />
                                ))}
                            </div>
                        )}

                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                                onClick={() => setShowConfirm(false)}
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                onClick={confirmSubmit}
                                disabled={submitting}
                            >
                                {submitting ? "Submitting..." : "Confirm & Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DailyUpdates;
