import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

import {
    FaTachometerAlt,
    FaTags,
    FaLayerGroup,
    FaBox,
    FaShoppingCart,
    FaChevronDown,
    FaSignOutAlt,
    FaBars
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";

const MainLayout = () => {
    const [openMenu, setOpenMenu] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const toggleMenu = (menu) => {
        setOpenMenu(
            openMenu === menu ? null : menu
        );
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const navLinkClass = ({ isActive }) =>
        `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
            isActive
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }`;

    return (
        <div className="min-h-screen bg-gray-100">

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 ${
                    sidebarOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0"
                }`}
            >

                {/* Logo */}
                <div className="flex h-20 items-center border-b border-gray-200 px-6">
                    <div>
                        <h1 className="text-2xl font-bold text-blue-600">
                            MotoMan
                        </h1>

                        <p className="text-xs text-gray-400">
                            Management System
                        </p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto px-4 py-6">

                    {/* Dashboard */}
                    <NavLink
                        to="/"
                        end
                        className={navLinkClass}
                        onClick={() => setSidebarOpen(false)}
                    >
                        <FaTachometerAlt />
                        Dashboard
                    </NavLink>

                    {/* Brand */}
                    <div className="mt-2">

                        <button
                            type="button"
                            onClick={() => toggleMenu("brand")}
                            className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                        >
                            <span className="flex items-center gap-3">
                                <FaTags />
                                Brand
                            </span>

                            <FaChevronDown
                                className={`text-xs transition-transform ${
                                    openMenu === "brand"
                                        ? "rotate-180"
                                        : ""
                                }`}
                            />
                        </button>

                        {openMenu === "brand" && (
                            <div className="ml-10 mt-1 space-y-1">

                                <NavLink
                                    to="/brands/add"
                                    className={navLinkClass}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    Add Brand
                                </NavLink>

                                <NavLink
                                    to="/brands"
                                    end
                                    className={navLinkClass}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    Manage Brands
                                </NavLink>

                            </div>
                        )}

                    </div>

                    {/* Category */}
                    <div className="mt-2">

                        <button
                            type="button"
                            onClick={() => toggleMenu("category")}
                            className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                        >
                            <span className="flex items-center gap-3">
                                <FaLayerGroup />
                                Category
                            </span>

                            <FaChevronDown
                                className={`text-xs transition-transform ${
                                    openMenu === "category"
                                        ? "rotate-180"
                                        : ""
                                }`}
                            />
                        </button>

                        {openMenu === "category" && (
                            <div className="ml-10 mt-1 space-y-1">

                                <NavLink
                                    to="/categories/add"
                                    className={navLinkClass}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    Add Category
                                </NavLink>

                                <NavLink
                                    to="/categories"
                                    end
                                    className={navLinkClass}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    Manage Categories
                                </NavLink>

                            </div>
                        )}

                    </div>

                    {/* Product */}
                    <div className="mt-2">

                        <button
                            type="button"
                            onClick={() => toggleMenu("product")}
                            className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                        >
                            <span className="flex items-center gap-3">
                                <FaBox />
                                Product
                            </span>

                            <FaChevronDown
                                className={`text-xs transition-transform ${
                                    openMenu === "product"
                                        ? "rotate-180"
                                        : ""
                                }`}
                            />
                        </button>

                        {openMenu === "product" && (
                            <div className="ml-10 mt-1 space-y-1">

                                <NavLink
                                    to="/products/add"
                                    className={navLinkClass}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    Add Product
                                </NavLink>

                                <NavLink
                                    to="/products"
                                    end
                                    className={navLinkClass}
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    Manage Products
                                </NavLink>

                            </div>
                        )}

                    </div>

                    {/* Sales */}
                    <div>
                        <button
                            onClick={() =>
                                setOpenMenu(
                                    openMenu === "sales"
                                        ? null
                                        : "sales"
                                )
                            }
                            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
                        >
                            <span className="flex items-center gap-3">
                                <FaShoppingCart />
                                Sales
                            </span>

                            <FaChevronDown
                                className={`text-xs transition-transform ${
                                    openMenu === "sales"
                                        ? "rotate-180"
                                        : ""
                                }`}
                            />
                        </button>

                        {openMenu === "sales" && (
                            <div className="ml-8 mt-1 space-y-1">

                                <NavLink
                                    to="/sales/new"
                                    className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
                                >
                                    New Sale
                                </NavLink>

                                <NavLink
                                    to="/sales"
                                    className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
                                >
                                    Sales History
                                </NavLink>

                            </div>
                        )}
                    </div>

                </nav>

                {/* Logout */}
                <div className="border-t border-gray-200 p-4">

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-red-50 hover:text-red-600"
                    >
                        <FaSignOutAlt />
                        Logout
                    </button>

                </div>

            </aside>

            {/* Main area */}
            <div className="lg:ml-64">

                {/* Header */}
                <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6">

                    <button
                        type="button"
                        onClick={() => setSidebarOpen(true)}
                        className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
                    >
                        <FaBars />
                    </button>

                    <div className="hidden lg:block">
                        <h2 className="text-xl font-semibold text-gray-800">
                            MotoMan Dashboard
                        </h2>
                    </div>

                    {/* User */}
                    <div className="ml-auto flex items-center gap-3">

                        <div className="hidden text-right sm:block">
                            <p className="text-sm font-semibold text-gray-800">
                                {user?.username || "Admin"}
                            </p>

                            <p className="text-xs capitalize text-gray-500">
                                {user?.role || "admin"}
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
                            {(user?.username || "A")
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                    </div>

                </header>

                {/* Page content */}
                <main className="p-4 sm:p-6">
                    <Outlet />
                </main>

            </div>

        </div>
    );
};

export default MainLayout;