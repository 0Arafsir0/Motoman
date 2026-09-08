import { useEffect, useState } from "react";
import {
    FaFileInvoiceDollar,
    FaFilter,
    FaSyncAlt,
    FaPrint
} from "react-icons/fa";

import api from "../../services/api";

const SalesReport = () => {
    const [report, setReport] = useState({
        summary: {
            totalTransactions: 0,
            totalItems: 0,
            totalSales: 0,
            totalPaid: 0,
            totalDue: 0
        },
        sales: []
    });

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchReport = async () => {
        try {
            setLoading(true);
            setError("");

            const params = {};

            if (startDate) {
                params.startDate = startDate;
            }

            if (endDate) {
                params.endDate = endDate;
            }

            const response = await api.get("/reports/sales", {
                params
            });

            setReport(response.data);
        } catch (error) {
            console.error("Sales report error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load sales report"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
    }, []);

    const formatCurrency = (amount) => {
        return `৳${Number(amount || 0).toLocaleString("en-BD", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    const formatDate = (date) => {
        if (!date) return "-";

        return new Date(date).toLocaleDateString("en-BD", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    const getStatusClass = (status) => {
        if (status === "Paid") {
            return "bg-green-100 text-green-700";
        }

        if (status === "Partial") {
            return "bg-yellow-100 text-yellow-700";
        }

        return "bg-red-100 text-red-700";
    };

    const handleFilter = (e) => {
        e.preventDefault();
        fetchReport();
    };

    const handleClearFilter = () => {
        setStartDate("");
        setEndDate("");

        setTimeout(() => {
            fetchReport();
        }, 0);
    };

    return (
        <div className="sales-report-page space-y-6">

            {/* Print Header */}
            <div className="hidden print-header mb-6">
                <h1 className="text-2xl font-bold">
                    MotoMan
                </h1>

                <h2 className="text-xl font-semibold mt-2">
                    Sales Report
                </h2>

                <p className="text-sm mt-1">
                    Report Period:{" "}
                    {startDate || "All Time"}{" "}
                    to{" "}
                    {endDate || "Present"}
                </p>

                <p className="text-sm mt-1">
                    Generated: {new Date().toLocaleString()}
                </p>
            </div>

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Sales Report
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Analyze sales transactions and payment information.
                    </p>
                </div>

                <div className="flex gap-2 no-print">
                    <button
                        onClick={fetchReport}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50"
                    >
                        <FaSyncAlt
                            className={loading ? "animate-spin" : ""}
                        />
                        Refresh
                    </button>

                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                    >
                        <FaPrint />
                        Print Report
                    </button>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Filters */}
            <form
                onSubmit={handleFilter}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 no-print"
            >
                <div className="flex items-center gap-2 mb-4">
                    <FaFilter className="text-gray-500" />

                    <h2 className="font-semibold text-gray-800">
                        Filter Report
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date
                        </label>

                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) =>
                                setStartDate(e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Date
                        </label>

                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) =>
                                setEndDate(e.target.value)
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex items-end gap-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            Apply Filter
                        </button>

                        <button
                            type="button"
                            onClick={handleClearFilter}
                            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Clear
                        </button>
                    </div>
                </div>
            </form>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <p className="text-sm text-gray-500">
                        Transactions
                    </p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-2">
                        {report.summary.totalTransactions}
                    </h2>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <p className="text-sm text-gray-500">
                        Items Sold
                    </p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-2">
                        {report.summary.totalItems}
                    </h2>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <p className="text-sm text-gray-500">
                        Total Sales
                    </p>

                    <h2 className="text-2xl font-bold text-blue-600 mt-2">
                        {formatCurrency(report.summary.totalSales)}
                    </h2>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <p className="text-sm text-gray-500">
                        Total Paid
                    </p>

                    <h2 className="text-2xl font-bold text-green-600 mt-2">
                        {formatCurrency(report.summary.totalPaid)}
                    </h2>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <p className="text-sm text-gray-500">
                        Total Due
                    </p>

                    <h2 className="text-2xl font-bold text-red-600 mt-2">
                        {formatCurrency(report.summary.totalDue)}
                    </h2>
                </div>

            </div>

            {/* Sales Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

                <div className="p-5 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <FaFileInvoiceDollar className="text-blue-600" />

                        <h2 className="font-semibold text-gray-800">
                            Sales Transactions
                        </h2>
                    </div>
                </div>

                <div className="overflow-x-auto">

                    <table className="w-full text-sm">

                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left px-5 py-3 font-semibold text-gray-600">
                                    Invoice
                                </th>

                                <th className="text-left px-5 py-3 font-semibold text-gray-600">
                                    Customer
                                </th>

                                <th className="text-center px-5 py-3 font-semibold text-gray-600">
                                    Items
                                </th>

                                <th className="text-right px-5 py-3 font-semibold text-gray-600">
                                    Total
                                </th>

                                <th className="text-right px-5 py-3 font-semibold text-gray-600">
                                    Paid
                                </th>

                                <th className="text-right px-5 py-3 font-semibold text-gray-600">
                                    Due
                                </th>

                                <th className="text-center px-5 py-3 font-semibold text-gray-600">
                                    Status
                                </th>

                                <th className="text-left px-5 py-3 font-semibold text-gray-600">
                                    Date
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">

                            {report.sales.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="8"
                                        className="text-center py-10 text-gray-500"
                                    >
                                        No sales found for the selected period.
                                    </td>
                                </tr>
                            ) : (
                                report.sales.map((sale) => (
                                    <tr
                                        key={sale._id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-5 py-4 font-medium text-gray-800">
                                            {sale.invoiceNumber}
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="font-medium text-gray-700">
                                                {sale.customerName || "Walk-in Customer"}
                                            </div>

                                            {sale.customerPhone && (
                                                <div className="text-xs text-gray-400">
                                                    {sale.customerPhone}
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-5 py-4 text-center">
                                            {sale.items.reduce(
                                                (sum, item) =>
                                                    sum + item.quantity,
                                                0
                                            )}
                                        </td>

                                        <td className="px-5 py-4 text-right font-medium">
                                            {formatCurrency(sale.grandTotal)}
                                        </td>

                                        <td className="px-5 py-4 text-right text-green-600">
                                            {formatCurrency(sale.paidAmount)}
                                        </td>

                                        <td className="px-5 py-4 text-right text-red-600">
                                            {formatCurrency(sale.dueAmount)}
                                        </td>

                                        <td className="px-5 py-4 text-center">
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClass(
                                                    sale.paymentStatus
                                                )}`}
                                            >
                                                {sale.paymentStatus}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4 text-gray-600">
                                            {formatDate(sale.saleDate)}
                                        </td>
                                    </tr>
                                ))
                            )}

                        </tbody>

                    </table>

                </div>
            </div>

        </div>
    );
};

export default SalesReport;

