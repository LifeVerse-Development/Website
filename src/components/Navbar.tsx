"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

const Navbar: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<{ name: string; profilePicture: string } | null>(null);
    const navigate = useNavigate();

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const handleLogin = () => navigate("/login");
    const handleLogout = () => {
        setIsLoggedIn(false);
        setUser(null);
        navigate("/");
    };

    return (
        <nav className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-md">
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                <div className="relative flex items-center justify-between h-16">
                    {/* Mobile Menu Button (only on mobile) */}
                    <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <button onClick={toggleMobileMenu} className="p-2 rounded-md focus:outline-none">
                            <span className="sr-only">Open main menu</span>
                            <svg
                                className="w-6 h-6 text-gray-900 dark:text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>

                    {/* Logo (with hover animation to rotate) */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="sm:ml-16 ml-10"
                    >
                        <img
                            src="logo.png"
                            alt="LifeVerse Logo"
                            className="h-10 w-auto transition-transform duration-300 ease-in-out hover:rotate-180"
                        />
                    </motion.div>

                    {/* Navigation Links (Desktop version) */}
                    <div className="hidden sm:block sm:ml-6">
                        <div className="flex space-x-4">
                            {[ 
                                { name: "Home", path: "/" },
                                { name: "Store", path: "/store" },
                                { name: "News", path: "/news" },
                                { name: "About", path: "/about" },
                                { name: "Contact", path: "/contact" },
                            ].map((item) => (
                                <Link
                                    key={item.name}
                                    to={`${item.path}`}
                                    className="hover:scale-110 hover:animate-bounce px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-yellow-500 hover:text-white"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Theme Toggle & User Authentication */}
                    <div className="flex items-center space-x-4">
                        {!isLoggedIn ? (
                            <button onClick={handleLogin} className="hover:scale-110 hover:animate-bounce px-3 py-2 rounded-md hover:bg-yellow-500 hover:text-white text-sm font-medium transition-all duration-300">
                                Login
                            </button>
                        ) : (
                            <div className="relative">
                                <button className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium">
                                    <img src={user?.profilePicture} alt="Profile" className="w-8 h-8 rounded-full" />
                                    <span>{user?.name}</span>
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg">
                                    <Link to="/profile/:userId" className="block px-4 py-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-600">
                                        Profile
                                    </Link>
                                    <Link to="/profile/:userId/settings" className="block px-4 py-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-600">
                                        Settings
                                    </Link>
                                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-600">
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                        <ThemeToggle />
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="sm:hidden px-2 pt-2 pb-3">
                    {[ 
                        { name: "Home", path: "/" },
                        { name: "Store", path: "/store" },
                        { name: "News", path: "/news" },
                        { name: "About", path: "/about" },
                        { name: "Contact", path: "/contact" },
                    ].map((item) => (
                        <Link
                            key={item.name}
                            to={`${item.path}`}
                            className="block hover:scale-110 hover:animate-bounce px-3 py-2 rounded-md text-base font-medium transition-all duration-300 hover:bg-yellow-500 hover:text-white"
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
