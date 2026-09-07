import { useEffect, useState } from "react";

import {
    FaBox,
    FaShoppingCart,
    FaExclamationTriangle,
    FaDollarSign,
    FaTags,
    FaLayerGroup,
    FaMoneyBillWave,
    FaArrowRight
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import api from "../services/api";


const Dashboard = () => {
    const navigate = useNavigate();

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    const fetchDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/dashboard");

            setDashboard(response.data);

        } catch (error) {
            console.error("Dashboard error:", error);

            if (error.response) {
                setError(
                    error.response.data.message ||
                    "Failed to load dashboard."
                );
            } else {
                setError(
                    "Unable to connect to the server."
                );
            }

        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchDashboard();
    }, []);


    const formatCurrency = (amount) => {
        return `৳${Number(amount || 0).toLocaleString(
            "en-BD",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        )}`;
    };


    const formatDate = (date) => {
        return new Date(date).toLocaleDateString(
            "en-BD",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
    };


    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-gray-500">
                    Loading dashboard...
                </div>
            </div>
        );
    }


    if (error) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                <h2 className="font-semibold text-red-700">
                    Failed to load dashboard
                </h2>

                <p className="mt-2 text-sm text-red-600">
                    {error}
                </p>

                <button
                    onClick={fetchDashboard}
                    className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                    Try Again
                </button>
            </div>
        );
    }


    const summary = dashboard?.summary || {};

    const statCards = [
        {
            title: "Total Products",
            value: summary.totalProducts,
            icon: FaBox,
            link: "/products"
        },
        {
            title: "Sales Today",
            value: formatCurrency(
                summary.salesToday
            ),
            icon: FaShoppingCart,
            link: "/sales"
        },
        {
            title: "Low Stock",
            value: summary.lowStock,
            icon: FaExclamationTriangle,
            link: "/products"
        },
        {
            title: "Total Sales",
            value: formatCurrency(
                summary.totalSales
            ),
            icon: FaDollarSign,
            link: "/sales"
        },
        {
            title: "Total Brands",
            value: summary.totalBrands,
            icon: FaTags,
            link: "/brands"
        },
        {
            title: "Total Categories",
            value: summary.totalCategories,
            icon: FaLayerGroup,
            link: "/categories"
        },
        {
            title: "Total Due",
            value: formatCurrency(
                summary.totalDue
            ),
            icon: FaMoneyBillWave,
            link: "/sales"
        }
    ];


    return (
        <div>

            {/* Page Header */}
            <div className="mb-6">

                <h1 className="text-2xl font-bold text-gray-800">
                    Dashboard
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Overview of your motorcycle shop
                </p>

            </div>


            {/* Statistics */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

                {statCards.map((card) => {

                    const Icon = card.icon;

                    return (
                        <div
                            key={card.title}
                            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                        >

                            <div className="flex items-start justify-between">

                                <div>

                                    <p className="text-sm font-medium text-gray-500">
                                        {card.title}
                                    </p>

                                    <h2 className="mt-2 text-2xl font-bold text-gray-800">
                                        {card.value}
                                    </h2>

                                </div>

                                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                    <Icon />
                                </div>

                            </div>

                        </div>
                    );

                })}

            </div>


            {/* Main Dashboard Sections */}
            <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">


                {/* Low Stock */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

                    <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">

                        <div>

                            <h2 className="font-semibold text-gray-800">
                                Low Stock Products
                            </h2>

                            <p className="mt-1 text-xs text-gray-500">
                                Products that need restocking
                            </p>

                        </div>

                        <button
                            onClick={() =>
                                navigate("/products")
                            }
                            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                            See More
                            <FaArrowRight className="text-xs" />
                        </button>

                    </div>


                    {dashboard?.lowStockProducts?.length === 0 ? (

                        <div className="px-5 py-10 text-center text-sm text-gray-500">
                            No low-stock products.
                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full text-left text-sm">

                                <thead className="bg-gray-50 text-xs uppercase text-gray-500">

                                    <tr>

                                        <th className="px-5 py-3">
                                            Product
                                        </th>

                                        <th className="px-5 py-3">
                                            Stock
                                        </th>

                                        <th className="px-5 py-3">
                                            Alert Level
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {dashboard.lowStockProducts
                                        .slice(0, 5)
                                        .map((product) => (

                                            <tr
                                                key={product._id}
                                                className="border-t border-gray-100"
                                            >

                                                <td className="px-5 py-4">

                                                    <p className="font-medium text-gray-800">
                                                        {product.name}
                                                    </p>

                                                    <p className="text-xs text-gray-500">
                                                        {product.productCode}
                                                    </p>

                                                </td>

                                                <td className="px-5 py-4">

                                                    <span className="font-semibold text-red-600">
                                                        {product.currentStock}
                                                    </span>

                                                </td>

                                                <td className="px-5 py-4 text-gray-600">
                                                    {product.alertStockQuantity}
                                                </td>

                                            </tr>

                                        ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>


                {/* Recent Sales */}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm">

                    <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">

                        <div>

                            <h2 className="font-semibold text-gray-800">
                                Recent Sales
                            </h2>

                            <p className="mt-1 text-xs text-gray-500">
                                Latest transactions
                            </p>

                        </div>

                        <button
                            onClick={() =>
                                navigate("/sales")
                            }
                            className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                            See More
                            <FaArrowRight className="text-xs" />
                        </button>

                    </div>


                    {dashboard?.recentSales?.length === 0 ? (

                        <div className="px-5 py-10 text-center text-sm text-gray-500">
                            No sales found.
                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full text-left text-sm">

                                <thead className="bg-gray-50 text-xs uppercase text-gray-500">

                                    <tr>

                                        <th className="px-5 py-3">
                                            Invoice
                                        </th>

                                        <th className="px-5 py-3">
                                            Customer
                                        </th>

                                        <th className="px-5 py-3">
                                            Amount
                                        </th>

                                        <th className="px-5 py-3">
                                            Status
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {dashboard.recentSales
                                        .slice(0, 5)
                                        .map((sale) => (

                                            <tr
                                                key={sale._id}
                                                className="border-t border-gray-100"
                                            >

                                                <td className="px-5 py-4">

                                                    <p className="font-medium text-gray-800">
                                                        {sale.invoiceNumber}
                                                    </p>

                                                    <p className="text-xs text-gray-500">
                                                        {formatDate(
                                                            sale.saleDate
                                                        )}
                                                    </p>

                                                </td>

                                                <td className="px-5 py-4 text-gray-600">
                                                    {sale.customerName}
                                                </td>

                                                <td className="px-5 py-4 font-semibold text-gray-800">
                                                    {formatCurrency(
                                                        sale.grandTotal
                                                    )}
                                                </td>

                                                <td className="px-5 py-4">

                                                    <span
                                                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                                            sale.paymentStatus === "Paid"
                                                                ? "bg-green-100 text-green-700"
                                                                : sale.paymentStatus === "Partial"
                                                                ? "bg-yellow-100 text-yellow-700"
                                                                : "bg-red-100 text-red-700"
                                                        }`}
                                                    >
                                                        {sale.paymentStatus}
                                                    </span>

                                                </td>

                                            </tr>

                                        ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
};

export default Dashboard;