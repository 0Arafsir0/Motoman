import { useEffect, useMemo, useState } from "react";
import {
    FaEdit,
    FaPlus,
    FaSearch,
    FaTrash
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const ManageProducts = () => {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);

    const [search, setSearch] = useState("");
    const [brandFilter, setBrandFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editingProduct, setEditingProduct] = useState(null);

    const [editForm, setEditForm] = useState({
        name: "",
        productCode: "",
        brand: "",
        category: "",
        unit: "",
        purchasePrice: "",
        sellingPrice: "",
        rackNumber: "",
        alertStockQuantity: "",
        status: "Active",
        image: "",
        description: ""
    });

    const [saving, setSaving] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            const [
                productResponse,
                brandResponse,
                categoryResponse
            ] = await Promise.all([
                api.get("/products"),
                api.get("/brands"),
                api.get("/categories")
            ]);

            setProducts(productResponse.data.products || []);
            setBrands(brandResponse.data.brands || []);
            setCategories(categoryResponse.data.categories || []);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load products."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/products/${id}`);

            setProducts((prev) =>
                prev.filter(
                    (product) => product._id !== id
                )
            );

        } catch (error) {
            window.alert(
                error.response?.data?.message ||
                "Failed to delete product."
            );
        }
    };

    const handleEditClick = (product) => {
        setEditingProduct(product);

        setEditForm({
            name: product.name || "",
            productCode: product.productCode || "",
            brand: product.brand?._id || "",
            category: product.category?._id || "",
            unit: product.unit || "",
            purchasePrice: product.purchasePrice ?? "",
            sellingPrice: product.sellingPrice ?? "",
            rackNumber: product.rackNumber || "",
            alertStockQuantity:
                product.alertStockQuantity ?? "",
            status: product.status || "Active",
            image: product.image || "",
            description: product.description || ""
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

        if (
            !editForm.name.trim() ||
            !editForm.productCode.trim() ||
            !editForm.brand ||
            !editForm.category ||
            !editForm.unit.trim()
        ) {
            window.alert(
                "Name, product code, brand, category and unit are required."
            );
            return;
        }

        try {
            setSaving(true);

            const response = await api.put(
                `/products/${editingProduct._id}`,
                {
                    name: editForm.name.trim(),
                    productCode:
                        editForm.productCode.trim(),
                    brand: editForm.brand,
                    category: editForm.category,
                    unit: editForm.unit.trim(),
                    purchasePrice:
                        Number(editForm.purchasePrice),
                    sellingPrice:
                        Number(editForm.sellingPrice),
                    rackNumber:
                        editForm.rackNumber.trim(),
                    alertStockQuantity:
                        Number(editForm.alertStockQuantity),
                    status: editForm.status,
                    image: editForm.image.trim(),
                    description:
                        editForm.description.trim()
                }
            );

            setProducts((prev) =>
                prev.map((product) =>
                    product._id === editingProduct._id
                        ? response.data.product
                        : product
                )
            );

            setEditingProduct(null);

        } catch (error) {
            window.alert(
                error.response?.data?.message ||
                "Failed to update product."
            );
        } finally {
            setSaving(false);
        }
    };

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {

            const searchText =
                search.toLowerCase();

            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(searchText) ||
                product.productCode
                    .toLowerCase()
                    .includes(searchText);

            const matchesBrand =
                !brandFilter ||
                product.brand?._id === brandFilter;

            const matchesCategory =
                !categoryFilter ||
                product.category?._id === categoryFilter;

            return (
                matchesSearch &&
                matchesBrand &&
                matchesCategory
            );
        });
    }, [
        products,
        search,
        brandFilter,
        categoryFilter
    ]);

    return (
        <div>

            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Manage Products
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        View and manage your product inventory.
                    </p>
                </div>

                <button
                    onClick={() => navigate("/products/add")}
                    className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                    <FaPlus />
                    Add Product
                </button>

            </div>

            {/* Filters */}
            <div className="mb-5 rounded-xl bg-white p-5 shadow-sm">

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                    <div className="relative">

                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                        <input
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search product or code..."
                            className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                    </div>

                    <select
                        value={brandFilter}
                        onChange={(e) =>
                            setBrandFilter(e.target.value)
                        }
                        className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                        <option value="">
                            All Brands
                        </option>

                        {brands.map((brand) => (
                            <option
                                key={brand._id}
                                value={brand._id}
                            >
                                {brand.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={categoryFilter}
                        onChange={(e) =>
                            setCategoryFilter(e.target.value)
                        }
                        className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                        <option value="">
                            All Categories
                        </option>

                        {categories.map((category) => (
                            <option
                                key={category._id}
                                value={category._id}
                            >
                                {category.name}
                            </option>
                        ))}
                    </select>

                </div>

            </div>

            {/* Product Table */}
            <div className="rounded-xl bg-white shadow-sm">

                {error && (
                    <div className="m-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="p-10 text-center text-gray-500">
                        Loading products...
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="p-10 text-center">

                        <p className="text-gray-500">
                            {search ||
                            brandFilter ||
                            categoryFilter
                                ? "No matching products found."
                                : "No products have been added yet."}
                        </p>

                        {!search &&
                            !brandFilter &&
                            !categoryFilter && (
                                <button
                                    onClick={() =>
                                        navigate(
                                            "/products/add"
                                        )
                                    }
                                    className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700"
                                >
                                    Add your first product
                                </button>
                            )}

                    </div>
                ) : (
                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[1200px]">

                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50 text-left">

                                    <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                                        #
                                    </th>

                                    <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                                        Product
                                    </th>

                                    <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                                        Code
                                    </th>

                                    <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                                        Brand
                                    </th>

                                    <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                                        Category
                                    </th>

                                    <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                                        Purchase
                                    </th>

                                    <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                                        Selling
                                    </th>

                                    <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                                        Stock
                                    </th>

                                    <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                                        Status
                                    </th>

                                    <th className="px-5 py-4 text-right text-sm font-semibold text-gray-600">
                                        Actions
                                    </th>

                                </tr>
                            </thead>

                            <tbody>

                                {filteredProducts.map(
                                    (product, index) => {

                                        const lowStock =
                                            product.currentStock <=
                                            product.alertStockQuantity;

                                        return (
                                            <tr
                                                key={product._id}
                                                className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                                            >

                                                <td className="px-5 py-4 text-sm text-gray-500">
                                                    {index + 1}
                                                </td>

                                                <td className="px-5 py-4">

                                                    <div className="flex items-center gap-3">

                                                        {product.image ? (
                                                            <img
                                                                src={
                                                                    product.image
                                                                }
                                                                alt={
                                                                    product.name
                                                                }
                                                                className="h-10 w-10 rounded-lg border border-gray-200 object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
                                                                N/A
                                                            </div>
                                                        )}

                                                        <span className="font-medium text-gray-800">
                                                            {
                                                                product.name
                                                            }
                                                        </span>

                                                    </div>

                                                </td>

                                                <td className="px-5 py-4 text-sm text-gray-600">
                                                    {
                                                        product.productCode
                                                    }
                                                </td>

                                                <td className="px-5 py-4 text-sm text-gray-600">
                                                    {
                                                        product.brand
                                                            ?.name ||
                                                        "—"
                                                    }
                                                </td>

                                                <td className="px-5 py-4 text-sm text-gray-600">
                                                    {
                                                        product.category
                                                            ?.name ||
                                                        "—"
                                                    }
                                                </td>

                                                <td className="px-5 py-4 text-sm text-gray-600">
                                                    ৳{" "}
                                                    {Number(
                                                        product.purchasePrice
                                                    ).toLocaleString(
                                                        "en-BD"
                                                    )}
                                                </td>

                                                <td className="px-5 py-4 text-sm font-medium text-gray-800">
                                                    ৳{" "}
                                                    {Number(
                                                        product.sellingPrice
                                                    ).toLocaleString(
                                                        "en-BD"
                                                    )}
                                                </td>

                                                <td className="px-5 py-4">

                                                    <div>
                                                        <span
                                                            className={`font-semibold ${
                                                                lowStock
                                                                    ? "text-red-600"
                                                                    : "text-gray-800"
                                                            }`}
                                                        >
                                                            {
                                                                product.currentStock
                                                            }
                                                        </span>

                                                        <span className="ml-1 text-xs text-gray-400">
                                                            {
                                                                product.unit
                                                            }
                                                        </span>
                                                    </div>

                                                    {lowStock && (
                                                        <span className="text-xs text-red-500">
                                                            Low stock
                                                        </span>
                                                    )}

                                                </td>

                                                <td className="px-5 py-4">

                                                    <span
                                                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                            product.status ===
                                                            "Active"
                                                                ? "bg-green-100 text-green-700"
                                                                : "bg-gray-100 text-gray-600"
                                                        }`}
                                                    >
                                                        {
                                                            product.status
                                                        }
                                                    </span>

                                                </td>

                                                <td className="px-5 py-4">

                                                    <div className="flex justify-end gap-2">

                                                        <button
                                                            onClick={() =>
                                                                handleEditClick(
                                                                    product
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
                                                                    product._id
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
                                        );
                                    }
                                )}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

            {/* Edit Modal */}
            {editingProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-xl">

                        <div className="border-b border-gray-100 px-6 py-5">

                            <h2 className="text-xl font-bold text-gray-800">
                                Edit Product
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Update product information.
                            </p>

                        </div>

                        <form onSubmit={handleUpdate}>

                            <div className="space-y-5 p-6">

                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Product Name
                                        </label>

                                        <input
                                            name="name"
                                            value={
                                                editForm.name
                                            }
                                            onChange={
                                                handleEditChange
                                            }
                                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Product Code
                                        </label>

                                        <input
                                            name="productCode"
                                            value={
                                                editForm.productCode
                                            }
                                            onChange={
                                                handleEditChange
                                            }
                                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Brand
                                        </label>

                                        <select
                                            name="brand"
                                            value={
                                                editForm.brand
                                            }
                                            onChange={
                                                handleEditChange
                                            }
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        >
                                            <option value="">
                                                Select brand
                                            </option>

                                            {brands.map(
                                                (brand) => (
                                                    <option
                                                        key={
                                                            brand._id
                                                        }
                                                        value={
                                                            brand._id
                                                        }
                                                    >
                                                        {
                                                            brand.name
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Category
                                        </label>

                                        <select
                                            name="category"
                                            value={
                                                editForm.category
                                            }
                                            onChange={
                                                handleEditChange
                                            }
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        >
                                            <option value="">
                                                Select category
                                            </option>

                                            {categories.map(
                                                (category) => (
                                                    <option
                                                        key={
                                                            category._id
                                                        }
                                                        value={
                                                            category._id
                                                        }
                                                    >
                                                        {
                                                            category.name
                                                        }
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Unit
                                        </label>

                                        <input
                                            name="unit"
                                            value={
                                                editForm.unit
                                            }
                                            onChange={
                                                handleEditChange
                                            }
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
                                            Purchase Price
                                        </label>

                                        <input
                                            name="purchasePrice"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={
                                                editForm.purchasePrice
                                            }
                                            onChange={
                                                handleEditChange
                                            }
                                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Selling Price
                                        </label>

                                        <input
                                            name="sellingPrice"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={
                                                editForm.sellingPrice
                                            }
                                            onChange={
                                                handleEditChange
                                            }
                                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Rack Number
                                        </label>

                                        <input
                                            name="rackNumber"
                                            value={
                                                editForm.rackNumber
                                            }
                                            onChange={
                                                handleEditChange
                                            }
                                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            Alert Stock Quantity
                                        </label>

                                        <input
                                            name="alertStockQuantity"
                                            type="number"
                                            min="0"
                                            value={
                                                editForm.alertStockQuantity
                                            }
                                            onChange={
                                                handleEditChange
                                            }
                                            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>

                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Image URL
                                    </label>

                                    <input
                                        name="image"
                                        value={
                                            editForm.image
                                        }
                                        onChange={
                                            handleEditChange
                                        }
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

                                <div className="rounded-lg bg-gray-50 p-4">

                                    <p className="text-sm text-gray-500">
                                        Current Stock
                                    </p>

                                    <p className="mt-1 text-xl font-bold text-gray-800">
                                        {
                                            editingProduct.currentStock
                                        }{" "}
                                        {
                                            editingProduct.unit
                                        }
                                    </p>

                                    <p className="mt-1 text-xs text-gray-400">
                                        Current stock is managed through sales and cannot be directly edited here.
                                    </p>

                                </div>

                            </div>

                            <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">

                                <button
                                    type="button"
                                    onClick={() =>
                                        setEditingProduct(
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
                                        : "Update Product"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>
            )}

        </div>
    );
};

export default ManageProducts;