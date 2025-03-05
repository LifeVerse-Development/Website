"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<{ name: string; profilePicture: string } | null>(null);
    const navigate = useNavigate();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleLogin = () => {
        navigate("/login");
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUser(null);
        navigate("/");
    };

    return (
        <nav className="bg-gray-800 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                <div className="relative flex items-center justify-between h-16">
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white"
                            aria-controls="mobile-menu"
                            aria-expanded={isMobileMenuOpen ? "true" : "false"}
                            onClick={toggleMobileMenu}
                        >
                            <span className="sr-only">Open main menu</span>
                            <svg
                                className="block h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex-shrink-0"
                        >
                            <h1 className="text-2xl font-bold text-white">LifeVerse</h1>
                        </motion.div>
                        <div className="hidden sm:block sm:ml-6">
                            <div className="flex space-x-4">
                                <Link
                                    to="/"
                                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Home
                                </Link>
                                <Link
                                    to="/store"
                                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Store
                                </Link>
                                <Link
                                    to="/news"
                                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    News
                                </Link>
                                <Link
                                    to="/about"
                                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    About
                                </Link>
                                <Link
                                    to="/contact"
                                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Contact
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        {!isLoggedIn ? (
                            <button
                                onClick={handleLogin}
                                className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Login
                            </button>
                        ) : (
                            <div className="relative">
                                <button
                                    className="flex items-center space-x-2 text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                    id="user-menu-button"
                                    aria-expanded="false"
                                    aria-haspopup="true"
                                >
                                    <img
                                        src={user?.profilePicture}
                                        alt="Profile"
                                        className="w-8 h-8 rounded-full"
                                    />
                                    <span>{user?.name}</span>
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="py-1">
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                                        >
                                            Profile
                                        </Link>
                                        <Link
                                            to="/settings"
                                            className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                                        >
                                            Settings
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div
                className={`sm:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}
                id="mobile-menu"
            >
                <div className="space-y-1 px-2 pt-2 pb-3">
                    <Link
                        to="/"
                        className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    >
                        Home
                    </Link>
                    <Link
                        to="/store"
                        className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    >
                        Store
                    </Link>
                    <Link
                        to="/blog"
                        className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    >
                        Blog
                    </Link>
                    <Link
                        to="/about"
                        className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    >
                        About
                    </Link>
                    <Link
                        to="/contact"
                        className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    >
                        Contact
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
