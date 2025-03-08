"use client"

import React, { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useDispatch } from "react-redux"
import { login } from "../stores/authSlice"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { AlertCircle, Shield, Users, Zap } from 'lucide-react'

const LOGIN_API_URL = "http://localhost:3001/api/auth/discord"

const Login: React.FC = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const storedAuth = localStorage.getItem("authState")
        if (storedAuth) {
            const authState = JSON.parse(storedAuth)
            if (authState.isAuthenticated && authState.user) {
                dispatch(login(authState))
                navigate(`/profile/${authState.user.username}`)
            }
        }
    }, [dispatch, navigate])

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const userParam = urlParams.get("user")
        const errorParam = urlParams.get("error")

        if (errorParam) {
            setError(decodeURIComponent(errorParam))
        }

        if (userParam) {
            try {
                const userData = JSON.parse(decodeURIComponent(userParam))

                const authState = {
                    isAuthenticated: true,
                    user: userData,
                    csrfToken: "",
                }

                localStorage.setItem("authState", JSON.stringify(authState))
                dispatch(login(authState))

                navigate(`/profile/${userData.username}`)
            } catch (error) {
                console.error("Error parsing user data:", error)
                setError("Failed to process login information. Please try again.")
            }
        }
    }, [location.search, dispatch, navigate])

    const handleDiscordLogin = () => {
        setIsLoading(true)
        window.location.href = LOGIN_API_URL
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a]">
            <Navbar />

            {/* Hero Section with Blob */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900/30 rounded-full filter blur-3xl opacity-30"></div>
                    <div className="absolute top-60 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-900/30 rounded-full filter blur-3xl opacity-30"></div>
                </div>

                <div className="relative z-10 px-4 py-20 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                            Welcome Back
                        </h1>
                        <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Sign in to your account to access your profile, history, and personalized features.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content - Two Column Layout */}
            <div className="px-4 py-12 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Left Column - Information */}
                    <div className="space-y-8">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                            <div className="h-2 bg-gradient-to-r from-teal-500 to-emerald-500"></div>
                            <div className="p-8">
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="flex-shrink-0 p-3 bg-teal-100 dark:bg-teal-900/30 rounded-xl">
                                        <Shield className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Why Sign In With Discord?</h2>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0 mt-1">
                                            <svg
                                                className="w-5 h-5 text-green-500"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-white">Seamless Integration</h3>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                Connect your Discord account for a seamless experience between our platform and Discord community.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0 mt-1">
                                            <svg
                                                className="w-5 h-5 text-green-500"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-white">Enhanced Security</h3>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                Benefit from Discord's robust security features, including two-factor authentication.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0 mt-1">
                                            <svg
                                                className="w-5 h-5 text-green-500"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-white">Special Roles & Permissions</h3>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                Unlock special roles and permissions based on your Discord status and membership.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                            <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                            <div className="p-8">
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="flex-shrink-0 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                                        <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Community Benefits</h2>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0 mt-1">
                                            <svg
                                                className="w-5 h-5 text-blue-500"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-white">Access Exclusive Content</h3>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                Get access to exclusive content, events, and features only available to members.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0 mt-1">
                                            <svg
                                                className="w-5 h-5 text-blue-500"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-white">Connect With Others</h3>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                Join a thriving community of like-minded individuals and make new connections.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0 mt-1">
                                            <svg
                                                className="w-5 h-5 text-blue-500"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-white">Stay Updated</h3>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                Receive the latest news, updates, and announcements directly through Discord.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                            <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                            <div className="p-8">
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="flex-shrink-0 p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                                        <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quick Start Guide</h2>
                                </div>

                                <ol className="space-y-4 list-decimal list-inside text-gray-600 dark:text-gray-300">
                                    <li>
                                        <span className="font-medium">Click the Discord login button</span>
                                        <p className="mt-1 ml-6 text-sm text-gray-500 dark:text-gray-400">
                                            You'll be redirected to Discord's secure authentication page.
                                        </p>
                                    </li>
                                    <li>
                                        <span className="font-medium">Authorize the application</span>
                                        <p className="mt-1 ml-6 text-sm text-gray-500 dark:text-gray-400">
                                            Review and approve the permissions requested by our application.
                                        </p>
                                    </li>
                                    <li>
                                        <span className="font-medium">Complete your profile</span>
                                        <p className="mt-1 ml-6 text-sm text-gray-500 dark:text-gray-400">
                                            After logging in, you'll be prompted to complete your profile if it's your first time.
                                        </p>
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Login Form */}
                    <div>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden sticky top-24">
                            <div className="h-2 bg-gradient-to-r from-[#5865F2] to-[#7289DA]"></div>
                            <div className="p-8">
                                <div className="flex items-center justify-center mb-8">
                                    <div className="w-20 h-20 flex items-center justify-center rounded-full bg-[#5865F2]/10 dark:bg-[#5865F2]/20">
                                        <svg
                                            className="w-10 h-10 text-[#5865F2]"
                                            fill="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                                        </svg>
                                    </div>
                                </div>

                                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
                                    Sign in with Discord
                                </h2>
                                <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
                                    Use your Discord account to access all features
                                </p>

                                {error && (
                                    <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 flex items-center">
                                        <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={handleDiscordLogin}
                                    disabled={isLoading}
                                    className="w-full inline-flex justify-center items-center px-6 py-4 border border-transparent text-lg font-medium rounded-xl text-white bg-[#5865F2] hover:bg-[#4752c4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5865F2] shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg
                                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Connecting to Discord...
                                        </>
                                    ) : (
                                        <>
                                            Continue with Discord
                                        </>
                                    )}
                                </button>

                                <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-center space-x-6">
                                        <a
                                            href="/legal/privacy_policy"
                                            className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                                        >
                                            Privacy Policy
                                        </a>
                                        <a
                                            href="/legal/terms_of_service"
                                            className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                                        >
                                            Terms of Service
                                        </a>
                                        <a
                                            href="/support"
                                            className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                                        >
                                            Help Center
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Login
