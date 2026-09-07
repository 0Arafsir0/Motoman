import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSave, FaArrowLeft } from "react-icons/fa";
import api from "../../services/api";

const AddBrand = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        logo: "",
        description: ""
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
            setError("Brand name is required.");
            return;
        }

        try {
            setLoading(true);

            await api.post("/brands", {
                name: formData.name.trim(),
                logo: formData.logo.trim(),
                description: formData.description.trim()
            });

            setSuccess("Brand added successfully.");

            setFormData({
                name: "",
                logo: "",
                description: ""
            });

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to add brand."
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
                        Add Brand
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Add a new motorcycle brand.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/brands")}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
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
                        <label
                            htmlFor="name"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Brand Name <span className="text-red-500">*</span>
                        </label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter brand name"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div className="mb-5">
                        <label
                            htmlFor="logo"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Logo URL
                        </label>

                        <input
                            id="logo"
                            name="logo"
                            type="text"
                            value={formData.logo}
                            onChange={handleChange}
                            placeholder="Enter logo URL"
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                        <p className="mt-1 text-xs text-gray-400">
                            Optional. Enter a publicly accessible image URL.
                        </p>
                    </div>

                    <div className="mb-6">
                        <label
                            htmlFor="description"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Description
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter brand description"
                            className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    <div className="flex justify-end gap-3">

                        <button
                            type="button"
                            onClick={() => navigate("/brands")}
                            className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <FaSave />

                            {loading
                                ? "Saving..."
                                : "Save Brand"}
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddBrand;