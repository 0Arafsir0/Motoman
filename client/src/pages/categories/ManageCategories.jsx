import { useEffect, useState } from "react";
import {
    FaEdit,
    FaPlus,
    FaSearch,
    FaTrash
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const ManageCategories = () => {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editingCategory, setEditingCategory] = useState(null);

    const [editForm, setEditForm] = useState({
        name: "",
        status: "Active",
        description: "",
        image: ""
    });

    const [saving, setSaving] = useState(false);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/categories");

            setCategories(response.data.categories || []);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load categories."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this category?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/categories/${id}`);

            setCategories((prev) =>
                prev.filter(
                    (category) => category._id !== id
                )
            );

        } catch (error) {
            window.alert(
                error.response?.data?.message ||
                "Failed to delete category."
            );
        }
    };

    const handleEditClick = (category) => {
        setEditingCategory(category);

        setEditForm({
            name: category.name || "",
            status: category.status || "Active",
            description: category.description || "",
            image: category.image || ""
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

        if (!editForm.name.trim()) {
            window.alert("Category name is required.");
            return;
        }

        try {
            setSaving(true);

            const response = await api.put(
                `/categories/${editingCategory._id}`,
                {
                    name: editForm.name.trim(),
                    status: editForm.status,
                    description: editForm.description.trim(),
                    image: editForm.image.trim()
                }
            );

            setCategories((prev) =>
                prev.map((category) =>
                    category._id === editingCategory._id
                        ? response.data.category
                        : category
                )
            );

            setEditingCategory(null);

        } catch (error) {
            window.alert(
                error.response?.data?.message ||
                "Failed to update category."
            );
        } finally {
            setSaving(false);
        }
    };

    const filteredCategories = categories.filter(
        (category) =>
            category.name
                .toLowerCase()
                .includes(search.toLowerCase())
    );

    return (
        <div>

            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Manage Categories
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        View, edit and delete product categories.
                    </p>
                </div>

                <button
                    onClick={() =>
                        navigate("/categories/add")
                    }
                    className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                    <FaPlus />
                    Add Category
                </button>

            </div>

            {/* Main Card */}
            <div className="rounded-xl bg-white shadow-sm">

                {/* Search */}
                <div className="border-b border-gray-100 p-5">

                    <div className="relative max-w-md">

                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search categories..."
                            className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                    </div>

                </div>

                {/* Error */}
                {error && (
                    <div className="m-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Content */}
                {loading ? (
                    <div className="p-10 text-center text-gray-500">
                        Loading categories...
                    </div>
                ) : filteredCategories.length === 0 ? (
                    <div className="p-10 text-center">

                        <p className="text-gray-500">
                            {search
                                ? "No categories found."
                                : "No categories have been added yet."}
                        </p>

                        {!search && (
                            <button
                                onClick={() =>
                                    navigate(
                                        "/categories/add"
                                    )
                                }
                                className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700"
                            >
                                Add your first category
                            </button>
                        )}

                    </div>
                ) : (
                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[850px]">

                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50 text-left">

                                    <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                                        #
                                    </th>

                                    <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                                        Image
                                    </th>

                                    <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                                        Category Name
                                    </th>

                                    <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                                        Status
                                    </th>

                                    <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                                        Description
                                    </th>

                                    <th className="px-5 py-4 text-right text-sm font-semibold text-gray-600">
                                        Actions
                                    </th>

                                </tr>
                            </thead>

                            <tbody>

                                {filteredCategories.map(
                                    (category, index) => (
                                        <tr
                                            key={category._id}
                                            className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                                        >

                                            <td className="px-5 py-4 text-sm text-gray-500">
                                                {index + 1}
                                            </td>

                                            <td className="px-5 py-4">

                                                {category.image ? (
                                                    <img
                                                        src={
                                                            category.image
                                                        }
                                                        alt={
                                                            category.name
                                                        }
                                                        className="h-10 w-10 rounded-lg border border-gray-200 object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                                                        N/A
                                                    </div>
                                                )}

                                            </td>

                                            <td className="px-5 py-4 text-sm font-semibold text-gray-800">
                                                {category.name}
                                            </td>

                                            <td className="px-5 py-4">

                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                        category.status ===
                                                        "Active"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-gray-100 text-gray-600"
                                                    }`}
                                                >
                                                    {
                                                        category.status
                                                    }
                                                </span>

                                            </td>

                                            <td className="max-w-md px-5 py-4 text-sm text-gray-500">
                                                {
                                                    category.description
                                                }
                                            </td>

                                            <td className="px-5 py-4">

                                                <div className="flex justify-end gap-2">

                                                    <button
                                                        onClick={() =>
                                                            handleEditClick(
                                                                category
                                                            )
                                                        }
                                                        className="rounded-lg border border-blue-200 bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                                                        title="Edit"
                                                    >
                                                        <FaEdit />
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                category._id
                                                            )
                                                        }
                                                        className="rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 hover:bg-red-100"
                                                        title="Delete"
                                                    >
                                                        <FaTrash />
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>
                                    )
                                )}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

            {/* Edit Modal */}
            {editingCategory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

                    <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">

                        <div className="border-b border-gray-100 px-6 py-5">

                            <h2 className="text-xl font-bold text-gray-800">
                                Edit Category
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Update category information.
                            </p>

                        </div>

                        <form onSubmit={handleUpdate}>

                            <div className="space-y-5 p-6">

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Category Name
                                    </label>

                                    <input
                                        name="name"
                                        value={editForm.name}
                                        onChange={handleEditChange}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Status
                                    </label>

                                    <select
                                        name="status"
                                        value={
                                            editForm.status
                                        }
                                        onChange={
                                            handleEditChange
                                        }
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

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Image URL
                                    </label>

                                    <input
                                        name="image"
                                        value={editForm.image}
                                        onChange={handleEditChange}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        rows="4"
                                        value={
                                            editForm.description
                                        }
                                        onChange={
                                            handleEditChange
                                        }
                                        className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>

                            </div>

                            <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setEditingCategory(
                                            null
                                        )
                                    }
                                    className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {saving
                                        ? "Updating..."
                                        : "Update Category"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
};

export default ManageCategories;