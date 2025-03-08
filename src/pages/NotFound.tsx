"use client"

import type React from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Search, Home, ArrowLeft } from "lucide-react"

const NotFound: React.FC = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a]">
            <Navbar />

            {/* Main Content */}
            <div className="relative overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900/30 rounded-full filter blur-3xl opacity-30"></div>
                    <div className="absolute top-60 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-900/30 rounded-full filter blur-3xl opacity-30"></div>
                </div>

                <div className="relative z-10 min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden text-center p-8"
                    >
                        <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 absolute top-0 left-0 right-0"></div>
                        <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">404</h1>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Seite nicht gefunden</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-8">
                            Die von dir gesuchte Seite existiert nicht oder wurde verschoben. Überprüfe die URL oder kehre zur
                            Startseite zurück.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.button
                                whileHover={{ y: -3 }}
                                onClick={() => navigate(-1)}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-medium transition-colors hover:bg-gray-300 dark:hover:bg-gray-600"
                            >
                                <ArrowLeft className="h-5 w-5" />
                                <span>Zurück</span>
                            </motion.button>
                            <motion.button
                                whileHover={{ y: -3 }}
                                onClick={() => navigate("/")}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium transition-all hover:shadow-lg"
                            >
                                <Home className="h-5 w-5" />
                                <span>Zur Startseite</span>
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default NotFound

