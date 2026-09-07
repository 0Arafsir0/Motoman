import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";

import MainLayout from "../layouts/MainLayout";

import AddBrand from "../pages/brands/AddBrand";
import ManageBrands from "../pages/brands/ManageBrands";

import AddCategory from "../pages/categories/AddCategory";
import ManageCategories from "../pages/categories/ManageCategories";

import AddProduct from "../pages/products/AddProduct";
import ManageProducts from "../pages/products/ManageProducts";

import NewSale from "../pages/sales/NewSale";
import SalesHistory from "../pages/sales/SalesHistory";


const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};


const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>

                {/* Login */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* Protected Application */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }
                >
                    {/* Dashboard */}
                    <Route
                        index
                        element={<Dashboard />}
                    />

                    {/* Brand */}
                    <Route
                        path="brands/add"
                        element={<AddBrand />}
                    />

                    <Route
                        path="brands"
                        element={<ManageBrands />}
                    />

                    {/* Category */}
                    <Route
                        path="categories/add"
                        element={<AddCategory />}
                    />

                    <Route
                        path="categories"
                        element={<ManageCategories />}
                    />

                    {/* Product */}
                    <Route
                        path="products/add"
                        element={<AddProduct />}
                    />

                    <Route
                        path="products"
                        element={<ManageProducts />}
                    />

                    {/* Sales */}
                    <Route
                        path="sales"
                        element={<SalesHistory />}
                    />

                    <Route
                        path="sales/new"
                        element={<NewSale />}
                    />

                </Route>

                {/* Unknown URL */}
                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />

            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;