import { useEffect, useState } from "react";
import {
    FaPlus,
    FaSearch,
    FaEdit,
    FaTrash,
    FaSyncAlt
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const formatCurrency = (value) => {
    return `৳${Number(value || 0).toLocaleString("en-BD", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
};

const ManageExpenses = () => {
    const navigate = useNavigate();

    const [expenses, setExpenses] = useState([]);
    const [totalExpense, setTotalExpense] = useState(0);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editingExpense, setEditingExpense] = useState(null);
    const [editForm, setEditForm] = useState({
        title: "",
        category: "",
        amount: "",
        expenseDate: "",
        description: ""
    });

    const fetchExpenses = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/expenses");

            setExpenses(response.data.expenses || []);
            setTotalExpense(response.data.totalExpense || 0);

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to load expenses."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this expense?"
        );

        if (!confirmed) return;

        try {
            await api.delete(`/expenses/${id}`);

            fetchExpenses();

        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to delete expense."
            );
        }
    };

    const openEditModal = (expense) => {
        setEditingExpense(expense);

        setEditForm({
            title: expense.title,
            category: expense.category,
            amount: expense.amount,
            expenseDate: new Date(expense.expenseDate)
                .toISOString()
                .split("T")[0],
            description: expense.description || ""
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;

        setEditForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            await api.put(
                `/expenses/${editingExpense._id}`,
                {
                    ...editForm,
                    amount: Number(editForm.amount)
                }
            );

            setEditingExpense(null);

            fetchExpenses();

        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to update expense."
            );
        }
    };

    const filteredExpenses = expenses.filter((expense) => {
        const text = search.toLowerCase();

        return (
            expense.title.toLowerCase().includes(text) ||
            expense.category.toLowerCase().includes(text) ||
            expense.description?.toLowerCase().includes(text)
        );
    });

    return (
        <div className="space-y-6">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Manage Expenses
                    </h1>

                    <p className="text-gray-500 mt-1">
                        View, edit and manage business expenses.
                    </p>
                </div>

                <button
                    onClick={() => navigate("/expenses/add")}
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700"
                >
                    <FaPlus />
                    Add Expense
                </button>

            </div>


            {/* Summary */}

            <div className="bg-white rounded-xl shadow-sm border p-5">

                <p className="text-sm text-gray-500">
                    Total Expenses
                </p>

                <h2 className="text-3xl font-bold text-gray-800 mt-2">
                    {formatCurrency(totalExpense)}
                </h2>

            </div>


            {/* Search */}

            <div className="bg-white rounded-xl shadow-sm border p-4 flex flex-col sm:flex-row gap-3">

                <div className="relative flex-1">

                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search expense..."
                        className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 outline-none focus:ring-2 focus:ring-blue-500"
                    />

                </div>

                <button
                    onClick={fetchExpenses}
                    className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
                >
                    <FaSyncAlt />
                    Refresh
                </button>

            </div>


            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}


            {/* Table */}

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">

                {loading ? (
                    <div className="p-10 text-center text-gray-500">
                        Loading expenses...
                    </div>
                ) : filteredExpenses.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">
                        No expenses found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">

                        <table className="w-full text-sm">

                            <thead className="bg-gray-50 border-b">

                                <tr>

                                    <th className="text-left px-5 py-3">
                                        Title
                                    </th>

                                    <th className="text-left px-5 py-3">
                                        Category
                                    </th>

                                    <th className="text-right px-5 py-3">
                                        Amount
                                    </th>

                                    <th className="text-left px-5 py-3">
                                        Date
                                    </th>

                                    <th className="text-left px-5 py-3">
                                        Description
                                    </th>

                                    <th className="text-center px-5 py-3">
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            <tbody className="divide-y">

                                {filteredExpenses.map((expense) => (

                                    <tr
                                        key={expense._id}
                                        className="hover:bg-gray-50"
                                    >

                                        <td className="px-5 py-4 font-medium">
                                            {expense.title}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                                                {expense.category}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4 text-right font-medium">
                                            {formatCurrency(
                                                expense.amount
                                            )}
                                        </td>

                                        <td className="px-5 py-4">
                                            {new Date(
                                                expense.expenseDate
                                            ).toLocaleDateString()}
                                        </td>

                                        <td className="px-5 py-4 max-w-xs truncate">
                                            {expense.description || "—"}
                                        </td>

                                        <td className="px-5 py-4">

                                            <div className="flex justify-center gap-2">

                                                <button
                                                    onClick={() =>
                                                        openEditModal(
                                                            expense
                                                        )
                                                    }
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                    title="Edit"
                                                >
                                                    <FaEdit />
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            expense._id
                                                        )
                                                    }
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                    title="Delete"
                                                >
                                                    <FaTrash />
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>


            {/* Edit Modal */}

            {editingExpense && (

                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

                        <div className="p-5 border-b">

                            <h2 className="text-lg font-semibold">
                                Edit Expense
                            </h2>

                        </div>


                        <form
                            onSubmit={handleUpdate}
                            className="p-5 space-y-4"
                        >

                            <div>

                                <label className="block text-sm font-medium mb-1">
                                    Title
                                </label>

                                <input
                                    type="text"
                                    name="title"
                                    value={editForm.title}
                                    onChange={handleEditChange}
                                    required
                                    className="w-full border rounded-lg px-3 py-2"
                                />

                            </div>


                            <div>

                                <label className="block text-sm font-medium mb-1">
                                    Category
                                </label>

                                <select
                                    name="category"
                                    value={editForm.category}
                                    onChange={handleEditChange}
                                    required
                                    className="w-full border rounded-lg px-3 py-2 bg-white"
                                >
                                    <option value="Rent">Rent</option>
                                    <option value="Salary">Salary</option>
                                    <option value="Utilities">Utilities</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Transportation">
                                        Transportation
                                    </option>
                                    <option value="Marketing">
                                        Marketing
                                    </option>
                                    <option value="Office">Office</option>
                                    <option value="Other">Other</option>
                                </select>

                            </div>


                            <div>

                                <label className="block text-sm font-medium mb-1">
                                    Amount
                                </label>

                                <input
                                    type="number"
                                    name="amount"
                                    value={editForm.amount}
                                    onChange={handleEditChange}
                                    min="0"
                                    step="0.01"
                                    required
                                    className="w-full border rounded-lg px-3 py-2"
                                />

                            </div>


                            <div>

                                <label className="block text-sm font-medium mb-1">
                                    Expense Date
                                </label>

                                <input
                                    type="date"
                                    name="expenseDate"
                                    value={editForm.expenseDate}
                                    onChange={handleEditChange}
                                    required
                                    className="w-full border rounded-lg px-3 py-2"
                                />

                            </div>


                            <div>

                                <label className="block text-sm font-medium mb-1">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={editForm.description}
                                    onChange={handleEditChange}
                                    rows="3"
                                    className="w-full border rounded-lg px-3 py-2 resize-none"
                                />

                            </div>


                            <div className="flex justify-end gap-3 pt-3 border-t">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setEditingExpense(null)
                                    }
                                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Update Expense
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
};

export default ManageExpenses;