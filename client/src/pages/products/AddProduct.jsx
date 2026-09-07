import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import api from "../../services/api";

const AddProduct = () => {
    const navigate = useNavigate();

    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        productCode: "",
        brand: "",
        category: "",
        unit: "",
        purchasePrice: "",
        sellingPrice: "",
        initialStock: "",
        rackNumber: "",
        alertStockQuantity: "",
        status: "Active",
        image: "",
        description: ""
    });

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoadingData(true);

                const [brandResponse, categoryResponse] =
                    await Promise.all([
                        api.get("/brands"),
                        api.get("/categories")
                    ]);

                setBrands(brandResponse.data.brands || []);
                setCategories(categoryResponse.data.categories || []);

            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load brands and categories."
                );
            } finally {
                setLoadingData(false);
            }
        };

        loadData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (
            !formData.name.trim() ||
            !formData.productCode.trim() ||
            !formData.brand ||
            !formData.category ||
            !formData.unit.trim()
        ) {
            setError(
                "Name, product code, brand, category and unit are required."
            );
            return;
        }

        if (
            formData.purchasePrice === "" ||
            formData.sellingPrice === ""
        ) {
            setError(
                "Purchase price and selling price are required."
            );
            return;
        }

        if (Number(formData.purchasePrice) < 0) {
            setError("Purchase price cannot be negative.");
            return;
        }

        if (Number(formData.sellingPrice) < 0) {
            setError("Selling price cannot be negative.");
            return;
        }

        try {
            setLoading(true);

            await api.post("/products", {
                name: formData.name.trim(),
                productCode: formData.productCode.trim(),
                brand: formData.brand,
                category: formData.category,
                unit: formData.unit.trim(),
                purchasePrice: Number(formData.purchasePrice),
                sellingPrice: Number(formData.sellingPrice),
                initialStock:
                    formData.initialStock === ""
                        ? 0
                        : Number(formData.initialStock),
                rackNumber: formData.rackNumber.trim(),
                alertStockQuantity:
                    formData.alertStockQuantity === ""
                        ? 0
                        : Number(formData.alertStockQuantity),
                status: formData.status,
                image: formData.image.trim(),
                description: formData.description.trim()
            });

            setSuccess("Product added successfully.");

            setFormData({
                name: "",
                productCode: "",
                brand: "",
                category: "",
                unit: "",
                purchasePrice: "",
                sellingPrice: "",
                initialStock: "",
                rackNumber: "",
                alertStockQuantity: "",
                status: "Active",
                image: "",
                description: ""
            });

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to add product."
            );
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return (
            <div className="p-10 text-center text-gray-500">
                Loading product form...
            </div>
        );
    }

    return (
        <div>

            {/* Header */}
            <div className="mb-6 flex items-center justify-between">

                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Add Product
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Add a new motorcycle product to inventory.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/products")}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    <FaArrowLeft />
                    Back
                </button>

            </div>

            {/* Form Card */}
            <div className="rounded-xl bg-white p-6 shadow-sm">

                {error && (
                    <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-600">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    {/* Basic Information */}
                    <div className="mb-8">

                        <h2 className="mb-4 text-lg font-semibold text-gray-800">
                            Basic Information
                        </h2>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Product Name <span className="text-red-500">*</span>
                                </label>

                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. NGK Spark Plug"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Product Code <span className="text-red-500">*</span>
                                </label>

                                <input
                                    name="productCode"
                                    value={formData.productCode}
                                    onChange={handleChange}
                                    placeholder="e.g. SP-001"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Brand <span className="text-red-500">*</span>
                                </label>

                                <select
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="">
                                        Select brand
                                    </option>

                                    {brands.map((brand) => (
                                        <option
                                            key={brand._id}
                                            value={brand._id}
                                        >
                                            {brand.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Category <span className="text-red-500">*</span>
                                </label>

                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="">
                                        Select category
                                    </option>

                                    {categories.map((category) => (
                                        <option
                                            key={category._id}
                                            value={category._id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Unit <span className="text-red-500">*</span>
                                </label>

                                <input
                                    name="unit"
                                    value={formData.unit}
                                    onChange={handleChange}
                                    placeholder="e.g. Piece, Set, Liter"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Status
                                </label>

                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                >
                                    <option value="Active">
                                        Active
                                    </option>

                                    <option value="Inactive">
                                        Inactive
                                    </option>
                                </select>
                            </div>

                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="mb-8">

                        <h2 className="mb-4 text-lg font-semibold text-gray-800">
                            Pricing
                        </h2>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Purchase Price <span className="text-red-500">*</span>
                                </label>

                                <input
                                    name="purchasePrice"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.purchasePrice}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Selling Price <span className="text-red-500">*</span>
                                </label>

                                <input
                                    name="sellingPrice"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.sellingPrice}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                        </div>
                    </div>

                    {/* Inventory */}
                    <div className="mb-8">

                        <h2 className="mb-4 text-lg font-semibold text-gray-800">
                            Inventory
                        </h2>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Initial Stock
                                </label>

                                <input
                                    name="initialStock"
                                    type="number"
                                    min="0"
                                    value={formData.initialStock}
                                    onChange={handleChange}
                                    placeholder="0"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />

                                <p className="mt-1 text-xs text-gray-400">
                                    Current stock starts from this value.
                                </p>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Rack Number
                                </label>

                                <input
                                    name="rackNumber"
                                    value={formData.rackNumber}
                                    onChange={handleChange}
                                    placeholder="e.g. R-01"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Alert Stock Quantity
                                </label>

                                <input
                                    name="alertStockQuantity"
                                    type="number"
                                    min="0"
                                    value={formData.alertStockQuantity}
                                    onChange={handleChange}
                                    placeholder="5"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />

                                <p className="mt-1 text-xs text-gray-400">
                                    Dashboard marks products at or below this quantity as low stock.
                                </p>
                            </div>

                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="mb-8">

                        <h2 className="mb-4 text-lg font-semibold text-gray-800">
                            Additional Information
                        </h2>

                        <div className="space-y-5">

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Image URL
                                </label>

                                <input
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    placeholder="Enter product image URL"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    rows="4"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Enter product description"
                                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            </div>

                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 border-t border-gray-100 pt-6">

                        <button
                            type="button"
                            onClick={() => navigate("/products")}
                            className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <FaSave />

                            {loading
                                ? "Saving..."
                                : "Save Product"}
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddProduct;