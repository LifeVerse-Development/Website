import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faInstagram,
    faTiktok,
    faYoutube,
    faTwitch,
    faDiscord,
    faTwitter,
} from "@fortawesome/free-brands-svg-icons";

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white py-10 shadow-top z-50">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Logo and Social Icons */}
                    <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start mb-4">
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center"
                            >
                                <img
                                    src="/logo.png"
                                    alt="Logo"
                                    className="h-10 w-13 mr-3 transition-all duration-300 transform hover:scale-110 hover:animate-bounce"
                                />
                            </motion.div>
                            <span className="text-xl font-bold">LifeVerse Studios</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 text-center md:text-left">
                            The first realism game which covers the real life.
                        </p>
                        <div className="flex space-x-4 mt-4 justify-center md:justify-start">
                            <a
                                href="/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-300 transform hover:scale-110 hover:animate-bounce"
                            >
                                <FontAwesomeIcon icon={faInstagram} size="lg" />
                            </a>
                            <a
                                href="/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-300 transform hover:scale-110 hover:animate-bounce"
                            >
                                <FontAwesomeIcon icon={faTiktok} size="lg" />
                            </a>
                            <a
                                href="/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-300 transform hover:scale-110 hover:animate-bounce"
                            >
                                <FontAwesomeIcon icon={faYoutube} size="lg" />
                            </a>
                            <a
                                href="/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-300 transform hover:scale-110 hover:animate-bounce"
                            >
                                <FontAwesomeIcon icon={faTwitch} size="lg" />
                            </a>
                            <a
                                href="/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-300 transform hover:scale-110 hover:animate-bounce"
                            >
                                <FontAwesomeIcon icon={faDiscord} size="lg" />
                            </a>
                            <a
                                href="/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-300 transform hover:scale-110 hover:animate-bounce"
                            >
                                <FontAwesomeIcon icon={faTwitter} size="lg" />
                            </a>
                        </div>
                    </div>

                    {/* Important Links */}
                    <div className="text-center md:text-left">
                        <h4 className="font-semibold mb-4">Important Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/news" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                    News
                                </Link>
                            </li>
                            <li>
                                <Link to="/forum" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                    Forum
                                </Link>
                            </li>
                            <li>
                                <Link to="/support" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                    Support
                                </Link>
                            </li>
                            <li>
                                <Link to="/documentation" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                    Docs
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Downloads Links */}
                    <div className="text-center md:text-left">
                        <h4 className="font-semibold mb-4">Downloads</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="/downloads/api" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                    Download API
                                </a>
                            </li>
                            <li>
                                <a href="/downloads/discord_bot" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                    Download Discord Bot
                                </a>
                            </li>
                            <li>
                                <a href="/downloads/software" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                    Download Software
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div className="text-center md:text-left">
                        <h4 className="font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="/legal/imprint" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                    Imprint
                                </a>
                            </li>
                            <li>
                                <a href="/legal/privacy_policy" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="/legal/general_terms_and_conditions" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                    General Terms and Conditions
                                </a>
                            </li>
                            <li>
                                <a href="/legal/terms_of_service" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                                    Terms of Service
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright Line */}
                <div className="text-center mt-10 text-sm text-gray-600 dark:text-gray-400">
                    <p>&copy; {new Date().getFullYear()} <strong><a href="/">LifeVerse Studios</a></strong>. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
