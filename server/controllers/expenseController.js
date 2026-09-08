const Expense = require("../models/Expense");

const addExpense = async (req, res) => {
    try {
        const {
            title,
            category,
            amount,
            description,
            expenseDate
        } = req.body;

        if (!title || !category || amount === undefined) {
            return res.status(400).json({
                message: "Title, category and amount are required"
            });
        }

        if (Number(amount) <= 0) {
            return res.status(400).json({
                message: "Expense amount must be greater than 0"
            });
        }

        const expense = await Expense.create({
            title,
            category,
            amount: Number(amount),
            description,
            expenseDate: expenseDate || Date.now()
        });

        res.status(201).json({
            message: "Expense added successfully",
            expense
        });

    } catch (error) {
        console.error("Add expense error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find()
            .sort({ expenseDate: -1 });

        const totalExpense = expenses.reduce(
            (total, expense) =>
                total + expense.amount,
            0
        );

        res.status(200).json({
            count: expenses.length,
            totalExpense,
            expenses
        });

    } catch (error) {
        console.error("Get expenses error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


const getExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(
            req.params.id
        );

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.status(200).json(expense);

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


const updateExpense = async (req, res) => {
    try {
        const {
            title,
            category,
            amount,
            description,
            expenseDate
        } = req.body;

        const expense = await Expense.findById(
            req.params.id
        );

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        if (amount !== undefined && Number(amount) <= 0) {
            return res.status(400).json({
                message: "Expense amount must be greater than 0"
            });
        }

        expense.title =
            title ?? expense.title;

        expense.category =
            category ?? expense.category;

        expense.amount =
            amount !== undefined
                ? Number(amount)
                : expense.amount;

        expense.description =
            description ?? expense.description;

        expense.expenseDate =
            expenseDate ?? expense.expenseDate;

        await expense.save();

        res.status(200).json({
            message: "Expense updated successfully",
            expense
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findById(
            req.params.id
        );

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        await expense.deleteOne();

        res.status(200).json({
            message: "Expense deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


module.exports = {
    addExpense,
    getExpenses,
    getExpense,
    updateExpense,
    deleteExpense
};