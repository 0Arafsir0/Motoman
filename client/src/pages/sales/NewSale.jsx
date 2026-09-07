import { useEffect, useMemo, useState } from "react";
import { FaArrowLeft, FaPlus, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const NewSale = () => {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);

    const [customer, setCustomer] = useState({
        name: "",
        phone: ""
    });

    const [selectedProduct, setSelectedProduct] = useState("");
    const [quantity, setQuantity] = useState(1);

    const [items, setItems] = useState([]);

    const [discount, setDiscount] = useState(0);
    const [paidAmount, setPaidAmount] = useState("");

    const [loadingProducts, setLoadingProducts] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoadingProducts(true);

                const response = await api.get("/products");

                const activeProducts =
                    (response.data.products || []).filter(
                        (product) =>
                            product.status === "Active"
                    );

                setProducts(activeProducts);

            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load products."
                );
            } finally {
                setLoadingProducts(false);
            }
        };

        fetchProducts();
    }, []);

    const selectedProductData = products.find(
        (product) => product._id === selectedProduct
    );

    const addItem = () => {
        setError("");

        if (!selectedProduct) {
            setError("Please select a product.");
            return;
        }

        const qty = Number(quantity);

        if (!qty || qty < 1) {
            setError("Quantity must be at least 1.");
            return;
        }

        const product = selectedProductData;

        if (!product) {
            setError("Selected product was not found.");
            return;
        }

        const existingItem = items.find(
            (item) => item.product === product._id
        );

        const existingQuantity = existingItem
            ? existingItem.quantity
            : 0;

        if (
            existingQuantity + qty >
            product.currentStock
        ) {
            setError(
                `Only ${product.currentStock} ${product.unit} available for ${product.name}.`
            );
            return;
        }

        if (existingItem) {
            setItems((prev) =>
                prev.map((item) =>
                    item.product === product._id
                        ? {
                              ...item,
                              quantity:
                                  item.quantity + qty,
                              total:
                                  (item.quantity + qty) *
                                  item.unitPrice
                          }
                        : item
                )
            );
        } else {
            setItems((prev) => [
                ...prev,
                {
                    product: product._id,
                    productName: product.name,
                    quantity: qty,
                    unitPrice: product.sellingPrice,
                    total:
                        qty * product.sellingPrice,
                    stock: product.currentStock,
                    unit: product.unit
                }
            ]);
        }

        setSelectedProduct("");
        setQuantity(1);
    };

    const updateQuantity = (productId, newQuantity) => {
        const qty = Number(newQuantity);

        const item = items.find(
            (item) => item.product === productId
        );

        if (!item) {
            return;
        }

        if (!qty || qty < 1) {
            return;
        }

        if (qty > item.stock) {
            setError(
                `Only ${item.stock} ${item.unit} available for ${item.productName}.`
            );
            return;
        }

        setError("");

        setItems((prev) =>
            prev.map((currentItem) =>
                currentItem.product === productId
                    ? {
                          ...currentItem,
                          quantity: qty,
                          total:
                              qty *
                              currentItem.unitPrice
                      }
                    : currentItem
            )
        );
    };

    const removeItem = (productId) => {
        setItems((prev) =>
            prev.filter(
                (item) => item.product !== productId
            )
        );
    };

    const subtotal = useMemo(() => {
        return items.reduce(
            (total, item) => total + item.total,
            0
        );
    }, [items]);

    const discountAmount = Math.max(
        0,
        Number(discount) || 0
    );

    const grandTotal = Math.max(
        0,
        subtotal - discountAmount
    );

    const paid = Math.max(
        0,
        Number(paidAmount) || 0
    );

    const dueAmount = Math.max(
        0,
        grandTotal - paid
    );

    const paymentStatus =
        paid >= grandTotal
            ? "Paid"
            : paid > 0
                ? "Partial"
                : "Due";

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (items.length === 0) {
            setError(
                "Please add at least one product."
            );
            return;
        }

        if (discountAmount > subtotal) {
            setError(
                "Discount cannot be greater than subtotal."
            );
            return;
        }

        if (paid > grandTotal) {
            setError(
                "Paid amount cannot be greater than the grand total."
            );
            return;
        }

        try {
            setSaving(true);

            const response = await api.post("/sales", {
                customerName:
                    customer.name.trim() ||
                    "Walk-in Customer",

                customerPhone:
                    customer.phone.trim(),

                items: items.map((item) => ({
                    product: item.product,
                    quantity: item.quantity
                })),

                discount: discountAmount,
                paidAmount: paid
            });

            setSuccess(
                `Sale created successfully. Invoice: ${response.data.sale.invoiceNumber}`
            );

            setItems([]);
            setCustomer({
                name: "",
                phone: ""
            });
            setDiscount(0);
            setPaidAmount("");

            const productResponse =
                await api.get("/products");

            setProducts(
                (productResponse.data.products || []).filter(
                    (product) =>
                        product.status === "Active"
                )
            );

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to create sale."
            );
        } finally {
            setSaving(false);
        }
    };

    const formatMoney = (amount) =>
        Number(amount).toLocaleString("en-BD", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    if (loadingProducts) {
        return (
            <div className="p-10 text-center text-gray-500">
                Loading products...
            </div>
        );
    }

    return (
        <div>

            {/* Header */}
            <div className="mb-6 flex items-center justify-between">

                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        New Sale
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Create a new customer sale.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/sales")}
                    className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    <FaArrowLeft />
                    Sales History
                </button>

            </div>

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

                {/* Customer */}
                <div className="mb-5 rounded-xl bg-white p-6 shadow-sm">

                    <h2 className="mb-5 text-lg font-semibold text-gray-800">
                        Customer Information
                    </h2>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Customer Name
                            </label>

                            <input
                                type="text"
                                value={customer.name}
                                onChange={(e) =>
                                    setCustomer((prev) => ({
                                        ...prev,
                                        name: e.target.value
                                    }))
                                }
                                placeholder="Walk-in Customer"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                Customer Phone
                            </label>

                            <input
                                type="text"
                                value={customer.phone}
                                onChange={(e) =>
                                    setCustomer((prev) => ({
                                        ...prev,
                                        phone: e.target.value
                                    }))
                                }
                                placeholder="01XXXXXXXXX"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                        </div>

                    </div>

                </div>

                {/* Add Product */}
                <div className="mb-5 rounded-xl bg-white p-6 shadow-sm">

                    <h2 className="mb-5 text-lg font-semibold text-gray-800">
                        Add Products
                    </h2>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_180px_auto]">

                        <select
                            value={selectedProduct}
                            onChange={(e) =>
                                setSelectedProduct(
                                    e.target.value
                                )
                            }
                            className="rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        >
                            <option value="">
                                Select product
                            </option>

                            {products.map((product) => (
                                <option
                                    key={product._id}
                                    value={product._id}
                                    disabled={
                                        product.currentStock <=
                                        0
                                    }
                                >
                                    {product.name} — ৳
                                    {formatMoney(
                                        product.sellingPrice
                                    )} — Stock:{" "}
                                    {product.currentStock}
                                </option>
                            ))}
                        </select>

                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) =>
                                setQuantity(
                                    e.target.value
                                )
                            }
                            placeholder="Quantity"
                            className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                        <button
                            type="button"
                            onClick={addItem}
                            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                        >
                            <FaPlus />
                            Add
                        </button>

                    </div>

                </div>

                {/* Items */}
                <div className="mb-5 rounded-xl bg-white shadow-sm">

                    <div className="border-b border-gray-100 px-6 py-5">

                        <h2 className="text-lg font-semibold text-gray-800">
                            Sale Items
                        </h2>

                    </div>

                    {items.length === 0 ? (
                        <div className="p-10 text-center text-gray-500">
                            No products added to this sale.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">

                            <table className="w-full min-w-[750px]">

                                <thead>
                                    <tr className="border-b border-gray-100 bg-gray-50 text-left">

                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                                            Product
                                        </th>

                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                                            Unit Price
                                        </th>

                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                                            Quantity
                                        </th>

                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                                            Total
                                        </th>

                                        <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                                            Action
                                        </th>

                                    </tr>
                                </thead>

                                <tbody>

                                    {items.map((item) => (
                                        <tr
                                            key={item.product}
                                            className="border-b border-gray-100 last:border-0"
                                        >

                                            <td className="px-6 py-4">

                                                <p className="font-medium text-gray-800">
                                                    {
                                                        item.productName
                                                    }
                                                </p>

                                                <p className="text-xs text-gray-400">
                                                    Stock:{" "}
                                                    {
                                                        item.stock
                                                    }{" "}
                                                    {
                                                        item.unit
                                                    }
                                                </p>

                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                ৳{" "}
                                                {formatMoney(
                                                    item.unitPrice
                                                )}
                                            </td>

                                            <td className="px-6 py-4">

                                                <input
                                                    type="number"
                                                    min="1"
                                                    max={item.stock}
                                                    value={
                                                        item.quantity
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        updateQuantity(
                                                            item.product,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-24 rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                                                />

                                            </td>

                                            <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                                                ৳{" "}
                                                {formatMoney(
                                                    item.total
                                                )}
                                            </td>

                                            <td className="px-6 py-4 text-right">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeItem(
                                                            item.product
                                                        )
                                                    }
                                                    className="rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 hover:bg-red-100"
                                                    title="Remove"
                                                >
                                                    <FaTrash />
                                                </button>

                                            </td>

                                        </tr>
                                    ))}

                                </tbody>

                            </table>

                        </div>
                    )}

                </div>

                {/* Payment */}
                <div className="mb-5 rounded-xl bg-white p-6 shadow-sm">

                    <h2 className="mb-5 text-lg font-semibold text-gray-800">
                        Payment
                    </h2>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                        <div className="space-y-4">

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Discount
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={discount}
                                    onChange={(e) =>
                                        setDiscount(
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Paid Amount
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={paidAmount}
                                    onChange={(e) =>
                                        setPaidAmount(
                                            e.target.value
                                        )
                                    }
                                    placeholder="0.00"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
                                />
                            </div>

                        </div>

                        <div className="rounded-xl bg-gray-50 p-5">

                            <div className="flex justify-between border-b border-gray-200 pb-3">
                                <span className="text-gray-600">
                                    Subtotal
                                </span>

                                <span className="font-medium">
                                    ৳ {formatMoney(subtotal)}
                                </span>
                            </div>

                            <div className="flex justify-between border-b border-gray-200 py-3">
                                <span className="text-gray-600">
                                    Discount
                                </span>

                                <span className="font-medium text-red-600">
                                    - ৳{" "}
                                    {formatMoney(
                                        discountAmount
                                    )}
                                </span>
                            </div>

                            <div className="flex justify-between border-b border-gray-200 py-3">
                                <span className="font-semibold text-gray-800">
                                    Grand Total
                                </span>

                                <span className="text-xl font-bold text-gray-800">
                                    ৳{" "}
                                    {formatMoney(
                                        grandTotal
                                    )}
                                </span>
                            </div>

                            <div className="flex justify-between border-b border-gray-200 py-3">
                                <span className="text-gray-600">
                                    Paid
                                </span>

                                <span className="font-medium text-green-600">
                                    ৳ {formatMoney(paid)}
                                </span>
                            </div>

                            <div className="flex justify-between pt-3">
                                <span className="font-semibold text-gray-800">
                                    Due
                                </span>

                                <span
                                    className={`text-lg font-bold ${
                                        dueAmount > 0
                                            ? "text-red-600"
                                            : "text-green-600"
                                    }`}
                                >
                                    ৳{" "}
                                    {formatMoney(
                                        dueAmount
                                    )}
                                </span>
                            </div>

                            <div className="mt-4 text-right">

                                <span
                                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                                        paymentStatus ===
                                        "Paid"
                                            ? "bg-green-100 text-green-700"
                                            : paymentStatus ===
                                              "Partial"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    {paymentStatus}
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

                {/* Submit */}
                <div className="flex justify-end gap-3">

                    <button
                        type="button"
                        onClick={() => navigate("/sales")}
                        className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={
                            saving ||
                            items.length === 0
                        }
                        className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {saving
                            ? "Creating Sale..."
                            : "Complete Sale"}
                    </button>

                </div>

            </form>

        </div>
    );
};

export default NewSale;