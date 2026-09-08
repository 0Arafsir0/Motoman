const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true
        },

        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active"
        },

        description: {
            type: String,
            trim: true,
            default: ""
        },

        image: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Category", categorySchema);