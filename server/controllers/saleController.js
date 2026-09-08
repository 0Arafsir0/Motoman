const mongoose = require("mongoose");
const Sale = require("../models/Sale");
const Product = require("../models/Product");


// Generate invoice number
const generateInvoiceNumber = () => {
    const timestamp = Date.now();

    return `INV-${timestamp}`;
};


// Create a new sale
const createSale = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        const {
            customerName,
            customerPhone,
            items,
            discount = 0,
            paidAmount = 0
        } = req.body;


        // Validate items
        if (!items || !Array.isArray(items) || items.length === 0) {
            await session.abortTransaction();

            return res.status(400).json({
                message: "At least one product is required"
            });
        }


        // Validate discount
        if (discount < 0) {
            await session.abortTransaction();

            return res.status(400).json({
                message: "Discount cannot be negative"
            });
        }


        // Validate paid amount
        if (paidAmount < 0) {
            await session.abortTransaction();

            return res.status(400).json({
                message: "Paid amount cannot be negative"
            });
        }


        let subtotal = 0;
        const saleItems = [];


        // Process every product
        for (const item of items) {

            if (!item.product || !item.quantity) {
                await session.abortTransaction();

                return res.status(400).json({
                    message: "Product and quantity are required for every item"
                });
            }


            if (item.quantity <= 0) {
                await session.abortTransaction();

                return res.status(400).json({
                    message: "Quantity must be greater than zero"
                });
            }


            // Find product
            const product = await Product.findById(item.product)
                .session(session);

            if (!product) {
                await session.abortTransaction();

                return res.status(404).json({
                    message: `Product not found: ${item.product}`
                });
            }


            // Check product status
            if (product.status !== "Active") {
                await session.abortTransaction();

                return res.status(400).json({
                    message: `${product.name} is inactive`
                });
            }


            // Check stock
            if (product.currentStock < item.quantity) {
                await session.abortTransaction();

                return res.status(400).json({
                    message: `Insufficient stock for ${product.name}. Available stock: ${product.currentStock}`
                });
            }


            // Calculate item total
            const itemTotal =
                product.sellingPrice * item.quantity;

            subtotal += itemTotal;


            // Add sale item
            saleItems.push({
                product: product._id,
                productName: product.name,
                quantity: item.quantity,
                unitPrice: product.sellingPrice,
                purchasePrice: product.purchasePrice,
                total: itemTotal
            });


            // Reduce stock
            product.currentStock -= item.quantity;

            await product.save({ session });
        }


        // Calculate grand total
        const grandTotal = Math.max(
            subtotal - discount,
            0
        );


        // Check paid amount
        if (paidAmount > grandTotal) {
            await session.abortTransaction();

            return res.status(400).json({
                message: "Paid amount cannot be greater than grand total"
            });
        }


        // Calculate due
        const dueAmount =
            grandTotal - paidAmount;


        // Determine payment status
        let paymentStatus = "Due";

        if (paidAmount === grandTotal) {
            paymentStatus = "Paid";
        } else if (paidAmount > 0) {
            paymentStatus = "Partial";
        }


        // Create sale
        const sale = await Sale.create(
            [
                {
                    invoiceNumber: generateInvoiceNumber(),

                    customerName:
                        customerName || "Walk-in Customer",

                    customerPhone:
                        customerPhone || "",

                    items: saleItems,

                    subtotal,

                    discount,

                    grandTotal,

                    paidAmount,

                    dueAmount,

                    paymentStatus
                }
            ],
            { session }
        );


        // Commit transaction
        await session.commitTransaction();


        res.status(201).json({
            message: "Sale created successfully",
            sale: sale[0]
        });

    } catch (error) {

        await session.abortTransaction();

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    } finally {
        session.endSession();
    }
};



// Get all sales
const getSales = async (req, res) => {
    try {

        const sales = await Sale.find()
            .sort({ saleDate: -1 });

        res.status(200).json({
            count: sales.length,
            sales
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};



// Get single sale
const getSale = async (req, res) => {
    try {

        const sale = await Sale.findById(req.params.id);

        if (!sale) {
            return res.status(404).json({
                message: "Sale not found"
            });
        }

        res.status(200).json(sale);

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};



// Delete sale
const deleteSale = async (req, res) => {
    const session = await mongoose.startSession();

    try {

        session.startTransaction();


        const sale = await Sale.findById(req.params.id)
            .session(session);


        if (!sale) {
            await session.abortTransaction();

            return res.status(404).json({
                message: "Sale not found"
            });
        }


        // Restore product stock
        for (const item of sale.items) {

            const product = await Product.findById(item.product)
                .session(session);

            if (product) {
                product.currentStock += item.quantity;

                await product.save({ session });
            }
        }


        // Delete sale
        await sale.deleteOne({ session });


        await session.commitTransaction();


        res.status(200).json({
            message: "Sale deleted and stock restored successfully"
        });

    } catch (error) {

        await session.abortTransaction();

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    } finally {

        session.endSession();

    }
};



module.exports = {
    createSale,
    getSales,
    getSale,
    deleteSale
};