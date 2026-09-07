import { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const ManageBrands = () => {
    const navigate = useNavigate();

    const [brands, setBrands] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editingBrand, setEditingBrand] = useState(null);
    const [editForm, setEditForm] = useState({
        name: "",
        logo: "",
        description: ""
    });

    const [saving, setSaving] = useState(false);

    const fetchBrands = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/brands");

            setBrands(response.data.brands || []);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load brands."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrands();
    }, []);

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this brand?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/brands/${id}`);

            setBrands((prev) =>
                prev.filter((brand) => brand._id !== id)
            );

        } catch (error) {
            window.alert(
                error.response?.data?.message ||
                "Failed to delete brand."
            );
        }
    };

    const handleEditClick = (brand) => {
        setEditingBrand(brand);

        setEditForm({
            name: brand.name || "",
            logo: brand.logo || "",
            description: brand.description || ""
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
            window.alert("Brand name is required.");
            return;
        }

        try {
            setSaving(true);

            const response = await api.put(
                `/brands/${editingBrand._id}`,
                {
                    name: editForm.name.trim(),
                    logo: editForm.logo.trim(),
                    description: editForm.description.trim()
                }
            );

            setBrands((prev) =>
                prev.map((brand) =>
                    brand._id === editingBrand._id
                        ? response.data.brand
                        : brand
                )
            );

            setEditingBrand(null);

        } catch (error) {
            window.alert(
                error.response?.data?.message ||
                "Failed to update brand."
            );
        } finally {
            setSaving(false);
        }
    };

    const filteredBrands = brands.filter((brand) =>
        brand.name
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <div>

            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Manage Brands
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        View, edit and delete motorcycle brands.
                    </p>
                </div>

                <button
                    onClick={() => navigate("/brands/add")}
                    className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                    <FaPlus />
                    Add Brand
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
                            placeholder="Search brands..."
                            className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                    </div>

                </div>

                {/* Error */}
                {error && (
                    <div className="m-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Loading */}
                {loading ? (
                    <div className="p-10 text-center text-gray-500">
                        Loading brands...
                    </div>
                ) : filteredBrands.length === 0 ? (
                    <div className="p-10 text-center">

                        <p className="text-gray-500">
                            {search
                                ? "No brands found."
                                : "No brands have been added yet."}
                        </p>

                        {!search && (
                            <button
                                onClick={() =>
                                    navigate("/brands/add")
                                }
                                className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700"
                            >
                                Add your first brand
                            </button>
                        )}

                    </div>
                ) : (
                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[700px]">

                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50 text-left">

                                    <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                                        #
                                    </th>

                                    <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                                        Logo
                                    </th>

                                    <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                                        Brand Name
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

                                {filteredBrands.map((brand, index) => (
                                    <tr
                                        key={brand._id}
                                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                                    >

                                        <td className="px-5 py-4 text-sm text-gray-500">
                                            {index + 1}
                                        </td>

                                        <td className="px-5 py-4">

                                            {brand.logo ? (
                                                <img
                                                    src={brand.logo}
                                                    alt={brand.name}
                                                    className="h-10 w-10 rounded-lg border border-gray-200 object-contain"
                                                />
                                            ) : (
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                                                    N/A
                                                </div>
                                            )}

                                        </td>

                                        <td className="px-5 py-4 text-sm font-semibold text-gray-800">
                                            {brand.name}
                                        </td>

                                        <td className="max-w-md px-5 py-4 text-sm text-gray-500">
                                            {brand.description || "—"}
                                        </td>

                                        <td className="px-5 py-4">

                                            <div className="flex justify-end gap-2">

                                                <button
                                                    onClick={() =>
                                                        handleEditClick(
                                                            brand
                                                        )
                                                    }
                                                    className="rounded-lg border border-blue-200 bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
                                                    title="Edit"
                                                >
                                                    <FaEdit />
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            brand._id
                                                        )
                                                    }
                                                    className="rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
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
            {editingBrand && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

                    <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">

                        <div className="border-b border-gray-100 px-6 py-5">

                            <h2 className="text-xl font-bold text-gray-800">
                                Edit Brand
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Update brand information.
                            </p>

                        </div>

                        <form onSubmit={handleUpdate}>

                            <div className="space-y-5 p-6">

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Brand Name
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
                                        Logo URL
                                    </label>

                                    <input
                                        name="logo"
                                        value={editForm.logo}
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
                                        value={editForm.description}
                                        onChange={handleEditChange}
                                        className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>

                            </div>

                            <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setEditingBrand(null)
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
                                        : "Update Brand"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
};

export default ManageBrands;