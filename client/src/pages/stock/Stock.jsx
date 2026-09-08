import { useEffect, useMemo, useState } from "react";
import {
    FaBoxes,
    FaSearch,
    FaExclamationTriangle,
    FaCheckCircle,
    FaTimesCircle,
    FaSync
} from "react-icons/fa";

import api from "../../services/api";

const Stock = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/products");

            setProducts(response.data.products || []);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load stock information."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const getStockStatus = (product) => {
        if (product.currentStock === 0) {
            return "Out of Stock";
        }

        if (
            product.currentStock <=
            product.alertStockQuantity
        ) {
            return "Low Stock";
        }

        return "In Stock";
    };

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const searchText = search.toLowerCase();

            const matchesSearch =
                product.name?.toLowerCase().includes(searchText) ||
                product.productCode?.toLowerCase().includes(searchText) ||
                product.brand?.name?.toLowerCase().includes(searchText) ||
                product.category?.name?.toLowerCase().includes(searchText);

            const stockStatus = getStockStatus(product);

            const matchesFilter =
                filter === "All" ||
                stockStatus === filter;

            return matchesSearch && matchesFilter;
        });
    }, [products, search, filter]);

    const totalProducts = products.length;

    const totalUnits = products.reduce(
        (total, product) =>
            total + Number(product.currentStock || 0),
        0
    );

    const lowStockProducts = products.filter(
        (product) =>
            product.currentStock > 0 &&
            product.currentStock <=
                product.alertStockQuantity
    ).length;

    const outOfStockProducts = products.filter(
        (product) => product.currentStock === 0
    ).length;

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Stock
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Monitor current inventory and stock levels.
                    </p>
                </div>

                <button
                    onClick={fetchProducts}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                >
                    <FaSync
                        className={loading ? "animate-spin" : ""}
                    />
                    Refresh
                </button>

            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-gray-500">
                                Total Products
                            </p>

                            <h2 className="mt-2 text-2xl font-bold text-gray-800">
                                {totalProducts}
                            </h2>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <FaBoxes />
                        </div>

                    </div>
                </div>

                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-gray-500">
                                Total Units
                            </p>

                            <h2 className="mt-2 text-2xl font-bold text-gray-800">
                                {totalUnits}
                            </h2>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 text-green-600">
                            <FaCheckCircle />
                        </div>

                    </div>
                </div>

                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-gray-500">
                                Low Stock
                            </p>

                            <h2 className="mt-2 text-2xl font-bold text-orange-600">
                                {lowStockProducts}
                            </h2>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                            <FaExclamationTriangle />
                        </div>

                    </div>
                </div>

                <div className="rounded-xl bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">

                        <div>
                            <p className="text-sm text-gray-500">
                                Out of Stock
                            </p>

                            <h2 className="mt-2 text-2xl font-bold text-red-600">
                                {outOfStockProducts}
                            </h2>
                        </div>

                        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-red-50 text-red-600">
                            <FaTimesCircle />
                        </div>

                    </div>
                </div>

            </div>

            {/* Main Table */}
            <div className="rounded-xl bg-white shadow-sm">

                {/* Search + Filter */}
                <div className="flex flex-col gap-4 border-b border-gray-100 p-5 md:flex-row md:items-center md:justify-between">

                    <div className="relative w-full md:max-w-md">

                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search product, code, brand..."
                            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                    </div>

                    <select
                        value={filter}
                        onChange={(e) =>
                            setFilter(e.target.value)
                        }
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                        <option value="All">
                            All Stock
                        </option>

                        <option value="In Stock">
                            In Stock
                        </option>

                        <option value="Low Stock">
                            Low Stock
                        </option>

                        <option value="Out of Stock">
                            Out of Stock
                        </option>
                    </select>

                </div>

                {/* Error */}
                {error && (
                    <div className="m-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Loading */}
                {loading ? (
                    <div className="p-10 text-center text-sm text-gray-500">
                        Loading stock information...
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="p-10 text-center text-sm text-gray-500">
                        No products found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">

                        <table className="w-full text-left text-sm">

                            <thead className="bg-gray-50 text-xs uppercase text-gray-500">

                                <tr>
                                    <th className="px-5 py-4">
                                        Product
                                    </th>

                                    <th className="px-5 py-4">
                                        Brand
                                    </th>

                                    <th className="px-5 py-4">
                                        Category
                                    </th>

                                    <th className="px-5 py-4">
                                        Rack
                                    </th>

                                    <th className="px-5 py-4">
                                        Current Stock
                                    </th>

                                    <th className="px-5 py-4">
                                        Alert Level
                                    </th>

                                    <th className="px-5 py-4">
                                        Status
                                    </th>
                                </tr>

                            </thead>

                            <tbody className="divide-y divide-gray-100">

                                {filteredProducts.map((product) => {

                                    const stockStatus =
                                        getStockStatus(product);

                                    return (
                                        <tr
                                            key={product._id}
                                            className="hover:bg-gray-50"
                                        >

                                            <td className="px-5 py-4">

                                                <div>
                                                    <p className="font-medium text-gray-800">
                                                        {product.name}
                                                    </p>

                                                    <p className="mt-1 text-xs text-gray-400">
                                                        {product.productCode}
                                                    </p>
                                                </div>

                                            </td>

                                            <td className="px-5 py-4 text-gray-600">
                                                {product.brand?.name || "—"}
                                            </td>

                                            <td className="px-5 py-4 text-gray-600">
                                                {product.category?.name || "—"}
                                            </td>

                                            <td className="px-5 py-4 text-gray-600">
                                                {product.rackNumber || "—"}
                                            </td>

                                            <td className="px-5 py-4">

                                                <span
                                                    className={`font-semibold ${
                                                        stockStatus === "Out of Stock"
                                                            ? "text-red-600"
                                                            : stockStatus === "Low Stock"
                                                            ? "text-orange-600"
                                                            : "text-gray-800"
                                                    }`}
                                                >
                                                    {product.currentStock}
                                                </span>

                                                <span className="ml-1 text-xs text-gray-400">
                                                    {product.unit}
                                                </span>

                                            </td>

                                            <td className="px-5 py-4 text-gray-600">
                                                {product.alertStockQuantity}
                                            </td>

                                            <td className="px-5 py-4">

                                                {stockStatus === "In Stock" && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-600">
                                                        <FaCheckCircle />
                                                        In Stock
                                                    </span>
                                                )}

                                                {stockStatus === "Low Stock" && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600">
                                                        <FaExclamationTriangle />
                                                        Low Stock
                                                    </span>
                                                )}

                                                {stockStatus === "Out of Stock" && (
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
                                                        <FaTimesCircle />
                                                        Out of Stock
                                                    </span>
                                                )}

                                            </td>

                                        </tr>
                                    );
                                })}

                            </tbody>

                        </table>

                    </div>
                )}

                {/* Footer */}
                {!loading && filteredProducts.length > 0 && (
                    <div className="border-t border-gray-100 px-5 py-4 text-sm text-gray-500">
                        Showing {filteredProducts.length} of{" "}
                        {products.length} products
                    </div>
                )}

            </div>

        </div>
    );
};

export default Stock;