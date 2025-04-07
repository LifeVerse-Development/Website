"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { verifyTwoFactorAuth } from "../stores/authSlice"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { AlertCircle, Shield, Clock, ArrowRight } from "lucide-react"
import { config } from "../assets/config"
import type { RootState } from "../stores/store"
import { AnyAction } from "@reduxjs/toolkit"

const TwoFactorAuth: React.FC = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user, csrfToken, isAuthenticated } = useSelector((state: RootState) => state.auth)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [code, setCode] = useState<string[]>(Array(6).fill(""))
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    // Check if user is authenticated and has 2FA enabled
    useEffect(() => {
        // If user is not authenticated, redirect to login
        if (!isAuthenticated || !user) {
            navigate("/login", { replace: true })
            return
        }

        // If user doesn't have 2FA enabled, redirect to profile
        if (!user.twoFactorEnabled) {
            navigate(`/profile/${user.username}`, { replace: true })
        }
    }, [isAuthenticated, user, navigate])

    // Handle input change for verification code
    const handleInputChange = (index: number, value: string) => {
        if (value.length > 1) {
            value = value.slice(0, 1)
        }

        if (value && /^[0-9]$/.test(value)) {
            const newCode = [...code]
            newCode[index] = value
            setCode(newCode)

            // Auto-focus next input
            if (index < 5 && value) {
                inputRefs.current[index + 1]?.focus()
            }
        } else if (value === "") {
            const newCode = [...code]
            newCode[index] = ""
            setCode(newCode)
        }
    }

    // Handle key down for backspace navigation
    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        } else if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus()
        } else if (e.key === "ArrowRight" && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    // Handle paste event for the entire code
    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData("text")
        const pastedCode = pastedData.replace(/\D/g, "").slice(0, 6).split("")

        const newCode = [...code]
        pastedCode.forEach((digit, index) => {
            if (index < 6) {
                newCode[index] = digit
            }
        })

        setCode(newCode)

        // Focus the next empty input or the last input if all are filled
        const nextEmptyIndex = newCode.findIndex((digit) => digit === "")
        if (nextEmptyIndex !== -1) {
            inputRefs.current[nextEmptyIndex]?.focus()
        } else if (pastedCode.length > 0) {
            inputRefs.current[5]?.focus()
        }
    }

    const verifyCode = async () => {
        setIsLoading(true)
        setError(null)

        const verificationCode = code.join("")

        if (verificationCode.length !== 6) {
            setError("Please enter a complete 6-digit code")
            setIsLoading(false)
            return
        }

        try {
            const response = await fetch(`${config.apiUrl}/api/users/${user?.userId}/2fa/verify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user?.accessToken}`,
                    csrfToken: csrfToken || "",
                },
                body: JSON.stringify({
                    userId: user?.userId,
                    code: verificationCode,
                    secret: user?.authenticatorSetup?.secret || "",
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Invalid verification code")
            }

            setSuccess("Code verified successfully!")

            // Dispatch the verification success action to update Redux state
            dispatch(verifyTwoFactorAuth({
                user: data.user || user,
                token: data.token || user?.accessToken,
                csrfToken: data.csrfToken || csrfToken
            }) as unknown as AnyAction)

            // Get the original destination from sessionStorage or default to profile
            const redirectPath = sessionStorage.getItem("redirectAfter2FA") || `/profile/${user?.username}`
            sessionStorage.removeItem("redirectAfter2FA") // Clean up

            // Redirect after a short delay to show success message
            setTimeout(() => {
                navigate(redirectPath, { replace: true })
            }, 1500)
        } catch (error: any) {
            console.error("Verification error:", error)
            setError(error.message || "Invalid verification code. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    // If user data is not available yet, show loading
    if (!user) {
        return (
            <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
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
                            Two-Factor Authentication
                        </h1>
                        <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            Enter the 6-digit verification code from your authenticator app to complete the login process.
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
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Why Two-Factor Authentication?</h2>
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
                                            <h3 className="font-medium text-gray-900 dark:text-white">Enhanced Security</h3>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                Two-factor authentication adds an extra layer of security to your account, protecting it from
                                                unauthorized access.
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
                                            <h3 className="font-medium text-gray-900 dark:text-white">Prevent Unauthorized Access</h3>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                Even if someone has your password, they can't access your account without the verification code.
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
                                            <h3 className="font-medium text-gray-900 dark:text-white">Protect Your Data</h3>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                Safeguard your personal information and account data from potential security breaches.
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
                                        <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Authenticator App Tips</h2>
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
                                            <h3 className="font-medium text-gray-900 dark:text-white">Time-Based Codes</h3>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                Authenticator codes refresh every 30 seconds. Make sure to enter the current code.
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
                                            <h3 className="font-medium text-gray-900 dark:text-white">Recommended Apps</h3>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                We recommend using Google Authenticator, Microsoft Authenticator, or Authy.
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
                                            <h3 className="font-medium text-gray-900 dark:text-white">Recovery Codes</h3>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                If you can't access your authenticator app, you can use a recovery code from your account
                                                settings.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Verification Form */}
                    <div>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden sticky top-24">
                            <div className="h-2 bg-gradient-to-r from-[#5865F2] to-[#7289DA]"></div>
                            <div className="p-8">
                                <div className="flex items-center justify-center mb-8">
                                    <div className="w-20 h-20 flex items-center justify-center rounded-full bg-[#5865F2]/10 dark:bg-[#5865F2]/20">
                                        <Shield className="w-10 h-10 text-[#5865F2]" />
                                    </div>
                                </div>

                                <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-2">
                                    Verification Required
                                </h2>
                                <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
                                    Enter the 6-digit code from your authenticator app
                                </p>

                                {error && (
                                    <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 flex items-center">
                                        <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                {success && (
                                    <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 flex items-center">
                                        <svg
                                            className="h-5 w-5 mr-2 flex-shrink-0 text-green-500"
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
                                        <span>{success}</span>
                                    </div>
                                )}

                                <div className="mb-8">
                                    <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                        Verification Code
                                    </label>
                                    <div className="flex justify-center space-x-2 sm:space-x-4" onPaste={handlePaste}>
                                        {code.map((digit, index) => (
                                            <input
                                                key={index}
                                                ref={(el) => {
                                                    inputRefs.current[index] = el
                                                }}
                                                type="text"
                                                inputMode="numeric"
                                                maxLength={1}
                                                value={digit}
                                                onChange={(e) => handleInputChange(index, e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(index, e)}
                                                className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-[#5865F2] focus:ring-[#5865F2] focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all"
                                                aria-label={`Digit ${index + 1} of verification code`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={verifyCode}
                                    disabled={isLoading || code.join("").length !== 6}
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
                                            Verifying...
                                        </>
                                    ) : (
                                        <>
                                            Verify and Continue
                                            <ArrowRight className="ml-2 h-5 w-5" />
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

export default TwoFactorAuth

