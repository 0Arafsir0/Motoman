import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import api from "../../services/api";

const AddCategory = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        status: "Active",
        description: "",
        image: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!formData.name.trim()) {
            setError("Category name is required.");
            return;
        }

        try {
            setLoading(true);

            await api.post("/categories", {
                name: formData.name.trim(),
                status: formData.status,
                description: formData.description.trim(),
                image: formData.image.trim()
            });

            setSuccess("Category added successfully.");

            setFormData({
                name: "",
                status: "Active",
                description: "",
                image: ""
            });

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to add category."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl">

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Add Category
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Add a new product category.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/categories")}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    <FaArrowLeft />
                    Back
                </button>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">

                {error && (
                    <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="mb-5">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Category Name <span className="text-red-500">*</span>
                        </label>

                        <input
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter category name"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div className="mb-5">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Status
                        </label>

                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="Active">
                                Active
                            </option>

                            <option value="Inactive">
                                Inactive
                            </option>
                        </select>
                    </div>

                    <div className="mb-5">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Image URL
                        </label>

                        <input
                            name="image"
                            type="text"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="Enter image URL"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                        <p className="mt-1 text-xs text-gray-400">
                            Optional. Enter a publicly accessible image URL.
                        </p>
                    </div>

                    <div className="mb-6">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Description
                        </label>

                        <textarea
                            name="description"
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter category description"
                            className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div className="flex justify-end gap-3">

                        <button
                            type="button"
                            onClick={() => navigate("/categories")}
                            className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <FaSave />

                            {loading
                                ? "Saving..."
                                : "Save Category"}
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
};

export default AddCategory;