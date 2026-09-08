const Sale = require("../models/Sale");
const Expense = require("../models/Expense");

const getDateFilter = (startDate, endDate) => {
    const filter = {};

    if (startDate || endDate) {
        filter.saleDate = {};

        if (startDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            filter.saleDate.$gte = start;
        }

        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            filter.saleDate.$lte = end;
        }
    }

    return filter;
};


// ===============================
// SALES REPORT
// ===============================

const getSalesReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const filter = getDateFilter(startDate, endDate);

        const sales = await Sale.find(filter)
            .sort({ saleDate: -1 });

        const totalTransactions = sales.length;

        const totalItems = sales.reduce(
            (sum, sale) =>
                sum +
                sale.items.reduce(
                    (itemSum, item) => itemSum + item.quantity,
                    0
                ),
            0
        );

        const totalSales = sales.reduce(
            (sum, sale) => sum + sale.grandTotal,
            0
        );

        const totalPaid = sales.reduce(
            (sum, sale) => sum + sale.paidAmount,
            0
        );

        const totalDue = sales.reduce(
            (sum, sale) => sum + sale.dueAmount,
            0
        );

        res.status(200).json({
            success: true,
            summary: {
                totalTransactions,
                totalItems,
                totalSales,
                totalPaid,
                totalDue
            },
            sales
        });

    } catch (error) {
        console.error("Sales report error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to generate sales report",
            error: error.message
        });
    }
};


// ===============================
// PROFIT REPORT
// ===============================

const getProfitReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const saleFilter = getDateFilter(startDate, endDate);

        const sales = await Sale.find(saleFilter)
            .sort({ saleDate: -1 });

        const revenue = sales.reduce(
            (sum, sale) => sum + sale.grandTotal,
            0
        );

        // Calculate COGS using the purchase price
        // stored inside each historical sale item.
        const cogs = sales.reduce((saleSum, sale) => {
            const saleCost = sale.items.reduce(
                (itemSum, item) => {
                    return itemSum +
                        (item.purchasePrice * item.quantity);
                },
                0
            );

            return saleSum + saleCost;
        }, 0);

        const grossProfit = revenue - cogs;

        // Expense date filtering
        const expenseFilter = {};

        if (startDate || endDate) {
            expenseFilter.expenseDate = {};

            if (startDate) {
                const start = new Date(startDate);
                start.setHours(0, 0, 0, 0);
                expenseFilter.expenseDate.$gte = start;
            }

            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                expenseFilter.expenseDate.$lte = end;
            }
        }

        const expenses = await Expense.find(expenseFilter)
            .sort({ expenseDate: -1 });

        const totalExpenses = expenses.reduce(
            (sum, expense) => sum + expense.amount,
            0
        );

        const netProfit = grossProfit - totalExpenses;

        const profitMargin =
            revenue > 0
                ? (netProfit / revenue) * 100
                : 0;

        res.status(200).json({
            success: true,

            summary: {
                revenue,
                cogs,
                grossProfit,
                totalExpenses,
                netProfit,
                profitMargin
            },

            sales,
            expenses
        });

    } catch (error) {
        console.error("Profit report error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to generate profit report",
            error: error.message
        });
    }
};


module.exports = {
    getSalesReport,
    getProfitReport
};