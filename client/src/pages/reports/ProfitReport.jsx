import { useEffect, useState } from "react";
import {
    FaChartLine,
    FaFilter,
    FaSyncAlt,
    FaPrint
} from "react-icons/fa";

import api from "../../services/api";

const ProfitReport = () => {
    const [report, setReport] = useState({
        summary: {
            revenue: 0,
            cogs: 0,
            grossProfit: 0,
            totalExpenses: 0,
            netProfit: 0,
            profitMargin: 0
        },
        sales: [],
        expenses: []
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

            const response = await api.get("/reports/profit", {
                params
            });

            setReport(response.data);
        } catch (error) {
            console.error("Profit report error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load profit report"
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

    const netProfitClass =
        report.summary.netProfit >= 0
            ? "text-green-600"
            : "text-red-600";

    const grossProfitClass =
        report.summary.grossProfit >= 0
            ? "text-green-600"
            : "text-red-600";

    return (
        <div className="profit-report-page space-y-6">

            {/* Print Header */}
            <div className="hidden print-header mb-6">
                <h1 className="text-2xl font-bold">
                    MotoMan
                </h1>

                <h2 className="text-xl font-semibold mt-2">
                    Profit Report
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
                        Profit Report
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Analyze revenue, cost, expenses and profitability.
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <p className="text-sm text-gray-500">
                        Revenue
                    </p>

                    <h2 className="text-2xl font-bold text-blue-600 mt-2">
                        {formatCurrency(report.summary.revenue)}
                    </h2>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <p className="text-sm text-gray-500">
                        Cost of Goods Sold
                    </p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-2">
                        {formatCurrency(report.summary.cogs)}
                    </h2>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <p className="text-sm text-gray-500">
                        Gross Profit
                    </p>

                    <h2 className={`text-2xl font-bold mt-2 ${grossProfitClass}`}>
                        {formatCurrency(report.summary.grossProfit)}
                    </h2>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <p className="text-sm text-gray-500">
                        Total Expenses
                    </p>

                    <h2 className="text-2xl font-bold text-red-600 mt-2">
                        {formatCurrency(report.summary.totalExpenses)}
                    </h2>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <p className="text-sm text-gray-500">
                        Net Profit
                    </p>

                    <h2 className={`text-2xl font-bold mt-2 ${netProfitClass}`}>
                        {formatCurrency(report.summary.netProfit)}
                    </h2>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                    <p className="text-sm text-gray-500">
                        Profit Margin
                    </p>

                    <h2 className={`text-2xl font-bold mt-2 ${netProfitClass}`}>
                        {Number(
                            report.summary.profitMargin || 0
                        ).toFixed(2)}
                        %
                    </h2>
                </div>

            </div>

            {/* Calculation Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">

                <div className="flex items-center gap-2 mb-5">

                    <FaChartLine className="text-blue-600" />

                    <h2 className="font-semibold text-gray-800">
                        Profit Calculation
                    </h2>

                </div>

                <div className="space-y-3 text-sm">

                    <div className="flex justify-between">
                        <span className="text-gray-600">
                            Revenue
                        </span>

                        <span className="font-medium">
                            {formatCurrency(report.summary.revenue)}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-600">
                            Less: Cost of Goods Sold
                        </span>

                        <span className="font-medium text-red-600">
                            - {formatCurrency(report.summary.cogs)}
                        </span>
                    </div>

                    <div className="border-t border-gray-200 pt-3 flex justify-between">
                        <span className="font-semibold">
                            Gross Profit
                        </span>

                        <span className={`font-bold ${grossProfitClass}`}>
                            {formatCurrency(report.summary.grossProfit)}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-600">
                            Less: Operating Expenses
                        </span>

                        <span className="font-medium text-red-600">
                            - {formatCurrency(report.summary.totalExpenses)}
                        </span>
                    </div>

                    <div className="border-t border-gray-200 pt-3 flex justify-between">
                        <span className="font-semibold">
                            Net Profit
                        </span>

                        <span className={`font-bold ${netProfitClass}`}>
                            {formatCurrency(report.summary.netProfit)}
                        </span>
                    </div>

                </div>

            </div>

            {/* Sales Used for Calculation */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

                <div className="p-5 border-b border-gray-200">
                    <h2 className="font-semibold text-gray-800">
                        Sales Used in Calculation
                    </h2>
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

                                <th className="text-right px-5 py-3 font-semibold text-gray-600">
                                    Revenue
                                </th>

                                <th className="text-right px-5 py-3 font-semibold text-gray-600">
                                    COGS
                                </th>

                                <th className="text-right px-5 py-3 font-semibold text-gray-600">
                                    Gross Profit
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
                                        colSpan="6"
                                        className="text-center py-10 text-gray-500"
                                    >
                                        No sales found for the selected period.
                                    </td>
                                </tr>
                            ) : (
                                report.sales.map((sale) => {

                                    const saleRevenue =
                                        Number(sale.grandTotal || 0);

                                    const saleCogs =
                                        sale.items.reduce(
                                            (sum, item) =>
                                                sum +
                                                Number(
                                                    item.purchasePrice || 0
                                                ) *
                                                Number(item.quantity || 0),
                                            0
                                        );

                                    const saleProfit =
                                        saleRevenue - saleCogs;

                                    return (
                                        <tr
                                            key={sale._id}
                                            className="hover:bg-gray-50"
                                        >

                                            <td className="px-5 py-4 font-medium">
                                                {sale.invoiceNumber}
                                            </td>

                                            <td className="px-5 py-4">
                                                {sale.customerName ||
                                                    "Walk-in Customer"}
                                            </td>

                                            <td className="px-5 py-4 text-right">
                                                {formatCurrency(
                                                    saleRevenue
                                                )}
                                            </td>

                                            <td className="px-5 py-4 text-right text-red-600">
                                                {formatCurrency(
                                                    saleCogs
                                                )}
                                            </td>

                                            <td
                                                className={`px-5 py-4 text-right font-medium ${
                                                    saleProfit >= 0
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                {formatCurrency(
                                                    saleProfit
                                                )}
                                            </td>

                                            <td className="px-5 py-4 text-gray-600">
                                                {formatDate(
                                                    sale.saleDate
                                                )}
                                            </td>

                                        </tr>
                                    );
                                })
                            )}

                        </tbody>

                    </table>

                </div>

            </div>

            {/* Expenses Used in Calculation */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

                <div className="p-5 border-b border-gray-200">
                    <h2 className="font-semibold text-gray-800">
                        Expenses Used in Calculation
                    </h2>
                </div>

                <div className="overflow-x-auto">

                    <table className="w-full text-sm">

                        <thead className="bg-gray-50">
                            <tr>

                                <th className="text-left px-5 py-3 font-semibold text-gray-600">
                                    Title
                                </th>

                                <th className="text-left px-5 py-3 font-semibold text-gray-600">
                                    Category
                                </th>

                                <th className="text-right px-5 py-3 font-semibold text-gray-600">
                                    Amount
                                </th>

                                <th className="text-left px-5 py-3 font-semibold text-gray-600">
                                    Date
                                </th>

                                <th className="text-left px-5 py-3 font-semibold text-gray-600">
                                    Description
                                </th>

                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">

                            {report.expenses.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="text-center py-10 text-gray-500"
                                    >
                                        No expenses found for the selected period.
                                    </td>
                                </tr>
                            ) : (
                                report.expenses.map((expense) => (
                                    <tr
                                        key={expense._id}
                                        className="hover:bg-gray-50"
                                    >

                                        <td className="px-5 py-4 font-medium">
                                            {expense.title}
                                        </td>

                                        <td className="px-5 py-4">
                                            {expense.category}
                                        </td>

                                        <td className="px-5 py-4 text-right text-red-600 font-medium">
                                            {formatCurrency(
                                                expense.amount
                                            )}
                                        </td>

                                        <td className="px-5 py-4 text-gray-600">
                                            {formatDate(
                                                expense.expenseDate
                                            )}
                                        </td>

                                        <td className="px-5 py-4 text-gray-600">
                                            {expense.description || "-"}
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

export default ProfitReport;

