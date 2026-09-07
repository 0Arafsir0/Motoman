const Brand = require("../models/Brand");

// Add a new brand
const addBrand = async (req, res) => {
    try {
        const { name, logo, description } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Brand name is required"
            });
        }

        const existingBrand = await Brand.findOne({ name });

        if (existingBrand) {
            return res.status(400).json({
                message: "Brand already exists"
            });
        }

        const brand = await Brand.create({
            name,
            logo,
            description
        });

        res.status(201).json({
            message: "Brand added successfully",
            brand
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// Get all brands
const getBrands = async (req, res) => {
    try {
        const brands = await Brand.find().sort({ createdAt: -1 });

        res.status(200).json({
            count: brands.length,
            brands
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// Get single brand
const getBrand = async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);

        if (!brand) {
            return res.status(404).json({
                message: "Brand not found"
            });
        }

        res.status(200).json(brand);

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// Update brand
const updateBrand = async (req, res) => {
    try {
        const { name, logo, description } = req.body;

        const brand = await Brand.findById(req.params.id);

        if (!brand) {
            return res.status(404).json({
                message: "Brand not found"
            });
        }

        brand.name = name ?? brand.name;
        brand.logo = logo ?? brand.logo;
        brand.description = description ?? brand.description;

        await brand.save();

        res.status(200).json({
            message: "Brand updated successfully",
            brand
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// Delete brand
const deleteBrand = async (req, res) => {
    try {
        const brand = await Brand.findById(req.params.id);

        if (!brand) {
            return res.status(404).json({
                message: "Brand not found"
            });
        }

        await brand.deleteOne();

        res.status(200).json({
            message: "Brand deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


module.exports = {
    addBrand,
    getBrands,
    getBrand,
    updateBrand,
    deleteBrand
};