import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { useAuth } from "../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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

        if (!formData.username || !formData.password) {
            setError("Username and password are required.");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/auth/login`,
                formData
            );

            const { token, user } = response.data;

            login(user, token);

            navigate("/");
        } catch (error) {
            if (error.response) {
                setError(
                    error.response.data.message ||
                    "Login failed."
                );
            } else {
                setError(
                    "Unable to connect to the server."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

            <div className="w-full max-w-md">

                {/* Login Card */}
                <div className="bg-white rounded-xl shadow-lg p-8">

                    {/* Header */}
                    <div className="text-center mb-8">

                        <h1 className="text-3xl font-bold text-gray-800">
                            MotoMan
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Motorcycle Shop Management System
                        </p>

                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-5 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit}>

                        {/* Username */}
                        <div className="mb-5">

                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Username
                            </label>

                            <input
                                id="username"
                                name="username"
                                type="text"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Enter username"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                        </div>

                        {/* Password */}
                        <div className="mb-5">

                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center mb-6">

                            <input
                                id="rememberMe"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) =>
                                    setRememberMe(e.target.checked)
                                }
                                className="h-4 w-4 rounded border-gray-300"
                            />

                            <label
                                htmlFor="rememberMe"
                                className="ml-2 text-sm text-gray-600"
                            >
                                Remember me
                            </label>

                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>

                    </form>

                </div>

                {/* Footer */}
                <p className="text-center text-sm text-gray-500 mt-6">
                    © 2026 MotoMan. All rights reserved.
                </p>

            </div>

        </div>
    );
};

export default Login;