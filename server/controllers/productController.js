const Product = require("../models/product");
const Brand = require("../models/Brand");
const Category = require("../models/category");


// Add a new product
const addProduct = async (req, res) => {
    try {
        const {
            name,
            productCode,
            brand,
            category,
            unit,
            purchasePrice,
            sellingPrice,
            initialStock,
            currentStock,
            rackNumber,
            alertStockQuantity,
            status,
            image,
            description
        } = req.body;


        // Required fields
        if (
            !name ||
            !productCode ||
            !brand ||
            !category ||
            !unit
        ) {
            return res.status(400).json({
                message: "Name, product code, brand, category and unit are required"
            });
        }


        // Check duplicate product code
        const existingProduct = await Product.findOne({
            productCode
        });

        if (existingProduct) {
            return res.status(400).json({
                message: "Product code already exists"
            });
        }


        // Check whether brand exists
        const existingBrand = await Brand.findById(brand);

        if (!existingBrand) {
            return res.status(404).json({
                message: "Brand not found"
            });
        }


        // Check whether category exists
        const existingCategory = await Category.findById(category);

        if (!existingCategory) {
            return res.status(404).json({
                message: "Category not found"
            });
        }


        // Create product
        const product = await Product.create({
            name,
            productCode,
            brand,
            category,
            unit,
            purchasePrice,
            sellingPrice,
            currentStock: initialStock,
            rackNumber,
            alertStockQuantity,
            status,
            image,
            description
        });


        // Populate brand and category
        const populatedProduct = await Product.findById(product._id)
            .populate("brand", "name")
            .populate("category", "name");


        res.status(201).json({
            message: "Product added successfully",
            product: populatedProduct
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};



// Get all products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .populate("brand", "name")
            .populate("category", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: products.length,
            products
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};



// Get single product
const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate("brand", "name")
            .populate("category", "name");

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(product);

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};



// Update product
const updateProduct = async (req, res) => {
    try {
        const {
            name,
            productCode,
            brand,
            category,
            unit,
            purchasePrice,
            sellingPrice,
            initialStock,
            currentStock,
            rackNumber,
            alertStockQuantity,
            status,
            image,
            description
        } = req.body;


        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }


        // Check duplicate product code
        if (productCode && productCode !== product.productCode) {
            const existingProduct = await Product.findOne({
                productCode,
                _id: { $ne: req.params.id }
            });

            if (existingProduct) {
                return res.status(400).json({
                    message: "Product code already exists"
                });
            }
        }


        // Validate brand if changed
        if (brand) {
            const existingBrand = await Brand.findById(brand);

            if (!existingBrand) {
                return res.status(404).json({
                    message: "Brand not found"
                });
            }
        }


        // Validate category if changed
        if (category) {
            const existingCategory = await Category.findById(category);

            if (!existingCategory) {
                return res.status(404).json({
                    message: "Category not found"
                });
            }
        }


        product.name = name ?? product.name;
        product.productCode = productCode ?? product.productCode;
        product.brand = brand ?? product.brand;
        product.category = category ?? product.category;
        product.unit = unit ?? product.unit;
        product.purchasePrice = purchasePrice ?? product.purchasePrice;
        product.sellingPrice = sellingPrice ?? product.sellingPrice;
        product.initialStock = initialStock ?? product.initialStock;
        product.currentStock = currentStock ?? product.currentStock;
        product.rackNumber = rackNumber ?? product.rackNumber;
        product.alertStockQuantity =
            alertStockQuantity ?? product.alertStockQuantity;
        product.status = status ?? product.status;
        product.image = image ?? product.image;
        product.description = description ?? product.description;


        await product.save();


        const updatedProduct = await Product.findById(product._id)
            .populate("brand", "name")
            .populate("category", "name");


        res.status(200).json({
            message: "Product updated successfully",
            product: updatedProduct
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};



// Delete product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        await product.deleteOne();

        res.status(200).json({
            message: "Product deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};



module.exports = {
    addProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
};