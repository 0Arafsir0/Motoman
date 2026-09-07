import { useEffect, useState } from "react";
import {
    FaEye,
    FaPlus,
    FaSearch,
    FaTrash
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const SalesHistory = () => {
    const navigate = useNavigate();

    const [sales, setSales] = useState([]);
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedSale, setSelectedSale] = useState(null);

    const fetchSales = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/sales");

            setSales(response.data.sales || []);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load sales."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSales();
    }, []);

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Deleting this sale will restore the sold quantities to inventory. Continue?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await api.delete(`/sales/${id}`);

            setSales((prev) =>
                prev.filter(
                    (sale) => sale._id !== id
                )
            );

        } catch (error) {
            window.alert(
                error.response?.data?.message ||
                "Failed to delete sale."
            );
        }
    };

    const formatMoney = (amount) =>
        Number(amount).toLocaleString("en-BD", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    const formatDate = (date) => {
        return new Date(date).toLocaleString(
            "en-BD",
            {
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    };

    const filteredSales = sales.filter((sale) => {

        const query = search.toLowerCase();

        return (
            sale.invoiceNumber
                ?.toLowerCase()
                .includes(query) ||
            sale.customerName
                ?.toLowerCase()
                .includes(query) ||
            sale.customerPhone
                ?.toLowerCase()
                .includes(query)
        );
    });

    return (
        <div>

            {/* Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Sales History
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        View and manage completed sales.
                    </p>
                </div>

                <button
                    onClick={() => navigate("/sales/new")}
                    className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                >
                    <FaPlus />
                    New Sale
                </button>

            </div>

            {/* Main Card */}
            <div className="rounded-xl bg-white shadow-sm">

                {/* Search */}
                <div className="border-b border-gray-100 p-5">

                    <div className="relative max-w-md">

                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                        <input
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Search invoice or customer..."
                            className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                    </div>

                </div>

                {error && (
                    <div className="m-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="p-10 text-center text-gray-500">
                        Loading sales...
                    </div>
                ) : filteredSales.length === 0 ? (
                    <div className="p-10 text-center text-gray-500">
                        {search
                            ? "No matching sales found."
                            : "No sales have been recorded yet."}
                    </div>
                ) : (
                    <div className="overflow-x-auto">

                        <table className="w-full min-w-[1000px]">

                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50 text-left">

                                    <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                                        #
                                    </th>

                                    <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                                        Invoice
                                    </th>

                                    <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                                        Customer
                                    </th>

                                    <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                                        Items
                                    </th>

                                    <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                                        Total
                                    </th>

                                    <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                                        Paid
                                    </th>

                                    <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                                        Due
                                    </th>

                                    <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                                        Status
                                    </th>

                                    <th className="px-5 py-4 text-sm font-semibold text-gray-600">
                                        Date
                                    </th>

                                    <th className="px-5 py-4 text-right text-sm font-semibold text-gray-600">
                                        Actions
                                    </th>

                                </tr>
                            </thead>

                            <tbody>

                                {filteredSales.map(
                                    (sale, index) => (
                                        <tr
                                            key={sale._id}
                                            className="border-b border-gray-100 last:border-0 hover:bg-gray-50"
                                        >

                                            <td className="px-5 py-4 text-sm text-gray-500">
                                                {index + 1}
                                            </td>

                                            <td className="px-5 py-4 text-sm font-semibold text-gray-800">
                                                {
                                                    sale.invoiceNumber
                                                }
                                            </td>

                                            <td className="px-5 py-4">

                                                <p className="text-sm font-medium text-gray-800">
                                                    {
                                                        sale.customerName
                                                    }
                                                </p>

                                                {sale.customerPhone && (
                                                    <p className="text-xs text-gray-400">
                                                        {
                                                            sale.customerPhone
                                                        }
                                                    </p>
                                                )}

                                            </td>

                                            <td className="px-5 py-4 text-sm text-gray-600">
                                                {
                                                    sale.items
                                                        ?.length || 0
                                                }
                                            </td>

                                            <td className="px-5 py-4 text-sm font-semibold text-gray-800">
                                                ৳{" "}
                                                {formatMoney(
                                                    sale.grandTotal
                                                )}
                                            </td>

                                            <td className="px-5 py-4 text-sm text-green-600">
                                                ৳{" "}
                                                {formatMoney(
                                                    sale.paidAmount
                                                )}
                                            </td>

                                            <td className="px-5 py-4 text-sm text-red-600">
                                                ৳{" "}
                                                {formatMoney(
                                                    sale.dueAmount
                                                )}
                                            </td>

                                            <td className="px-5 py-4">

                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                                                        sale.paymentStatus ===
                                                        "Paid"
                                                            ? "bg-green-100 text-green-700"
                                                            : sale.paymentStatus ===
                                                              "Partial"
                                                                ? "bg-yellow-100 text-yellow-700"
                                                                : "bg-red-100 text-red-700"
                                                    }`}
                                                >
                                                    {
                                                        sale.paymentStatus
                                                    }
                                                </span>

                                            </td>

                                            <td className="px-5 py-4 text-sm text-gray-500">
                                                {formatDate(
                                                    sale.saleDate
                                                )}
                                            </td>

                                            <td className="px-5 py-4">

                                                <div className="flex justify-end gap-2">

                                                    <button
                                                        onClick={() =>
                                                            setSelectedSale(
                                                                sale
                                                            )
                                                        }
                                                        className="rounded-lg border border-blue-200 bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                                                        title="View"
                                                    >
                                                        <FaEye />
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                sale._id
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

            {/* Sale Details Modal */}
            {selectedSale && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

                    <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white shadow-xl">

                        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

                            <div>
                                <h2 className="text-xl font-bold text-gray-800">
                                    Sale Details
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    {
                                        selectedSale.invoiceNumber
                                    }
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    setSelectedSale(null)
                                }
                                className="text-2xl text-gray-400 hover:text-gray-600"
                            >
                                ×
                            </button>

                        </div>

                        <div className="p-6">

                            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">

                                <div>
                                    <p className="text-xs text-gray-400">
                                        Customer
                                    </p>

                                    <p className="mt-1 font-medium text-gray-800">
                                        {
                                            selectedSale.customerName
                                        }
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-400">
                                        Phone
                                    </p>

                                    <p className="mt-1 font-medium text-gray-800">
                                        {selectedSale.customerPhone ||
                                            "—"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-400">
                                        Date
                                    </p>

                                    <p className="mt-1 font-medium text-gray-800">
                                        {formatDate(
                                            selectedSale.saleDate
                                        )}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-gray-400">
                                        Payment Status
                                    </p>

                                    <p className="mt-1 font-medium text-gray-800">
                                        {
                                            selectedSale.paymentStatus
                                        }
                                    </p>
                                </div>

                            </div>

                            <div className="overflow-x-auto">

                                <table className="w-full min-w-[600px]">

                                    <thead>
                                        <tr className="border-b border-gray-200 text-left">

                                            <th className="pb-3 text-sm text-gray-500">
                                                Product
                                            </th>

                                            <th className="pb-3 text-sm text-gray-500">
                                                Qty
                                            </th>

                                            <th className="pb-3 text-sm text-gray-500">
                                                Unit Price
                                            </th>

                                            <th className="pb-3 text-right text-sm text-gray-500">
                                                Total
                                            </th>

                                        </tr>
                                    </thead>

                                    <tbody>

                                        {selectedSale.items?.map(
                                            (item, index) => (
                                                <tr
                                                    key={index}
                                                    className="border-b border-gray-100"
                                                >

                                                    <td className="py-3 text-sm font-medium text-gray-800">
                                                        {
                                                            item.productName
                                                        }
                                                    </td>

                                                    <td className="py-3 text-sm text-gray-600">
                                                        {
                                                            item.quantity
                                                        }
                                                    </td>

                                                    <td className="py-3 text-sm text-gray-600">
                                                        ৳{" "}
                                                        {formatMoney(
                                                            item.unitPrice
                                                        )}
                                                    </td>

                                                    <td className="py-3 text-right text-sm font-medium text-gray-800">
                                                        ৳{" "}
                                                        {formatMoney(
                                                            item.total
                                                        )}
                                                    </td>

                                                </tr>
                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                            <div className="mt-6 ml-auto max-w-sm space-y-3">

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">
                                        Subtotal
                                    </span>

                                    <span>
                                        ৳{" "}
                                        {formatMoney(
                                            selectedSale.subtotal
                                        )}
                                    </span>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">
                                        Discount
                                    </span>

                                    <span>
                                        ৳{" "}
                                        {formatMoney(
                                            selectedSale.discount
                                        )}
                                    </span>
                                </div>

                                <div className="flex justify-between border-t pt-3 font-semibold">
                                    <span>
                                        Grand Total
                                    </span>

                                    <span>
                                        ৳{" "}
                                        {formatMoney(
                                            selectedSale.grandTotal
                                        )}
                                    </span>
                                </div>

                                <div className="flex justify-between text-sm text-green-600">
                                    <span>
                                        Paid
                                    </span>

                                    <span>
                                        ৳{" "}
                                        {formatMoney(
                                            selectedSale.paidAmount
                                        )}
                                    </span>
                                </div>

                                <div className="flex justify-between text-sm font-semibold text-red-600">
                                    <span>
                                        Due
                                    </span>

                                    <span>
                                        ৳{" "}
                                        {formatMoney(
                                            selectedSale.dueAmount
                                        )}
                                    </span>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
};

export default SalesHistory;