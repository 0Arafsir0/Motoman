import { useState } from "react";
import { FaSave, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const AddExpense = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        category: "",
        amount: "",
        expenseDate: new Date().toISOString().split("T")[0],
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

        if (
            !formData.title ||
            !formData.category ||
            !formData.amount
        ) {
            setError("Title, category and amount are required.");
            return;
        }

        if (Number(formData.amount) <= 0) {
            setError("Amount must be greater than 0.");
            return;
        }

        try {
            setLoading(true);

            await api.post("/expenses", {
                title: formData.title,
                category: formData.category,
                amount: Number(formData.amount),
                expenseDate: formData.expenseDate,
                description: formData.description
            });

            setSuccess("Expense added successfully.");

            setFormData({
                title: "",
                category: "",
                amount: "",
                expenseDate: new Date()
                    .toISOString()
                    .split("T")[0],
                description: ""
            });

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to add expense."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">

            <div className="flex items-center gap-3">

                <button
                    onClick={() => navigate("/expenses")}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                    <FaArrowLeft />
                </button>

                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Add Expense
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Record a new business expense.
                    </p>
                </div>

            </div>


            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">

                {error && (
                    <div className="mb-5 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-5 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
                        {success}
                    </div>
                )}


                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Expense Title
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Shop Rent"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>


                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                            </label>

                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">
                                    Select Category
                                </option>

                                <option value="Rent">
                                    Rent
                                </option>

                                <option value="Salary">
                                    Salary
                                </option>

                                <option value="Utilities">
                                    Utilities
                                </option>

                                <option value="Maintenance">
                                    Maintenance
                                </option>

                                <option value="Transportation">
                                    Transportation
                                </option>

                                <option value="Marketing">
                                    Marketing
                                </option>

                                <option value="Office">
                                    Office
                                </option>

                                <option value="Other">
                                    Other
                                </option>
                            </select>
                        </div>


                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Amount
                            </label>

                            <input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>


                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Expense Date
                            </label>

                            <input
                                type="date"
                                name="expenseDate"
                                value={formData.expenseDate}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                    </div>


                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Optional description..."
                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>


                    <div className="flex justify-end gap-3 pt-3 border-t">

                        <button
                            type="button"
                            onClick={() => navigate("/expenses")}
                            className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            <FaSave />

                            {loading
                                ? "Saving..."
                                : "Save Expense"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default AddExpense;