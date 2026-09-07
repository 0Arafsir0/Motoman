const Product = require("../models/product");
const Brand = require("../models/Brand");
const Category = require("../models/category");
const Sale = require("../models/sale");

const getDashboard = async (req, res) => {
    try {
        // Total products
        const totalProducts = await Product.countDocuments();

        // Total brands
        const totalBrands = await Brand.countDocuments();

        // Total categories
        const totalCategories = await Category.countDocuments();

        // Low stock products
        const lowStockProducts = await Product.find({
            $expr: {
                $lte: ["$currentStock", "$alertStockQuantity"]
            }
        })
            .select("name productCode currentStock alertStockQuantity")
            .populate("brand", "name")
            .populate("category", "name");

        // Start of today
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        // Start of tomorrow
        const startOfTomorrow = new Date(startOfToday);
        startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);

        // Today's sales
        const salesToday = await Sale.find({
            saleDate: {
                $gte: startOfToday,
                $lt: startOfTomorrow
            }
        });

        // Calculate today's sales amount
        const salesTodayAmount = salesToday.reduce(
            (total, sale) => total + sale.grandTotal,
            0
        );

        // Total sales
        const totalSalesResult = await Sale.aggregate([
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$grandTotal"
                    }
                }
            }
        ]);

        const totalSales =
            totalSalesResult.length > 0
                ? totalSalesResult[0].total
                : 0;

        // Total due
        const totalDueResult = await Sale.aggregate([
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$dueAmount"
                    }
                }
            }
        ]);

        const totalDue =
            totalDueResult.length > 0
                ? totalDueResult[0].total
                : 0;

        // Recent sales
        const recentSales = await Sale.find()
            .sort({ saleDate: -1 })
            .limit(10)
            .select(
                "invoiceNumber customerName grandTotal paidAmount dueAmount paymentStatus saleDate"
            );

        res.status(200).json({
            success: true,

            summary: {
                totalProducts,
                salesToday: salesTodayAmount,
                lowStock: lowStockProducts.length,
                totalSales,
                totalBrands,
                totalCategories,
                totalDue
            },

            lowStockProducts,

            recentSales
        });

    } catch (error) {
        console.error("Dashboard error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load dashboard",
            error: error.message
        });
    }
};

module.exports = {
    getDashboard
};