const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        productCode: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        brand: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Brand",
            required: true
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },

        unit: {
            type: String,
            required: true,
            trim: true
        },

        purchasePrice: {
            type: Number,
            required: true,
            min: 0
        },

        sellingPrice: {
            type: Number,
            required: true,
            min: 0
        },

        initialStock: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },

        currentStock: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },

        rackNumber: {
            type: String,
            trim: true,
            default: ""
        },

        alertStockQuantity: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        },

        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active"
        },

        image: {
            type: String,
            default: null
        },

        description: {
            type: String,
            trim: true,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports =
    mongoose.models.Product || mongoose.model("Product", productSchema);