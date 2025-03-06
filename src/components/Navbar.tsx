"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../stores/authSlice";
import { RootState } from "../stores/store";

const Navbar: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    const hasRole = user?.role || '';

    const hasTeamRole = ['Supporter', 'Content', 'Developer', 'Moderator', 'Admin'].includes(hasRole);

    if (hasTeamRole) {
        navigate("/dashboard");
    }

    return (
        <nav className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-md z-50">
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
                <div className="relative flex items-center justify-between h-16">
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

                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="sm:ml-16 ml-10"
                    >
                        <img
                            src="/logo.png"
                            alt="LifeVerse Logo"
                            className="h-10 w-auto transition-transform duration-300 ease-in-out hover:rotate-180"
                        />
                    </motion.div>

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
                                    to={item.path}
                                    className="hover:scale-110 hover:animate-bounce px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-yellow-500 hover:text-white"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {!isAuthenticated ? (
                            <Link to={`/login`} className="hover:scale-110 hover:animate-bounce px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:bg-yellow-500 hover:text-white">
                                Login
                            </Link>
                        ) : (
                            <div className="relative">
                                <button className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium" onClick={toggleProfileMenu}>
                                    <img src={user?.profilePicture || "default-profile.jpg"} alt="Profile" className="w-8 h-8 rounded-full" />
                                    <span>{user?.username}</span>
                                </button>
                                {isProfileMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50">
                                        {hasTeamRole && (
                                            <Link to={`/dashboard`} className="block px-4 py-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-600">
                                                Dashboard
                                            </Link>
                                        )}
                                        <Link to={`/profile/${user?.username}`} className="block px-4 py-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-600">
                                            Profile
                                        </Link>
                                        <Link to={`/profile/${user?.username}/payment_history`} className="block px-4 py-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-600">
                                            Payment History
                                        </Link>
                                        <Link to={`/profile/${user?.username}/settings`} className="block px-4 py-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-600">
                                            Settings
                                        </Link>
                                        <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-600">
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                        <ThemeToggle />
                    </div>
                </div>
            </div>

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
                            to={item.path}
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
