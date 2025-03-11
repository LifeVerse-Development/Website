"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import type { RootState } from "../../stores/store"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import { login } from "../../stores/authSlice"
import LazyLoading from "../../components/LazyLoading"
import { Save, Lock, User, Bell, Shield, Globe, Trash2, AlertTriangle, CheckCircle, X, Eye, EyeOff, LogOut } from 'lucide-react'

interface SettingsState {
    email: string
    username: string
    currentPassword: string
    newPassword: string
    confirmPassword: string
    language: string
    theme: string
    emailNotifications: boolean
    pushNotifications: boolean
    twoFactorAuth: boolean
    privacySettings: {
        profileVisibility: "public" | "followers" | "private"
        showOnlineStatus: boolean
        showActivity: boolean
    }
}

const Settings: React.FC = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isAuthenticated, user, csrfToken } = useSelector((state: RootState) => state.auth)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [activeTab, setActiveTab] = useState("account")
    const [showPassword, setShowPassword] = useState(false)
    const [notification, setNotification] = useState<{
        type: "success" | "error" | null
        message: string
    }>({ type: null, message: "" })
    const [deleteConfirmation, setDeleteConfirmation] = useState("")
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const [settings, setSettings] = useState<SettingsState>({
        email: "",
        username: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        language: "en",
        theme: "system",
        emailNotifications: true,
        pushNotifications: true,
        twoFactorAuth: false,
        privacySettings: {
            profileVisibility: "public",
            showOnlineStatus: true,
            showActivity: true,
        },
    })

    useEffect(() => {
        if (!isAuthenticated || !user?.userId) {
            setLoading(false)
            return
        }

        // Initialize settings with user data
        setSettings((prev) => ({
            ...prev,
            email: user.email || "",
            username: user.username || "",
        }))

        // Simulate loading user settings
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }, [isAuthenticated, user])

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a]">
                <Navbar />
                <div className="relative overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900/30 rounded-full filter blur-3xl opacity-30"></div>
                        <div className="absolute top-60 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-900/30 rounded-full filter blur-3xl opacity-30"></div>
                    </div>
                    <div className="relative z-10 min-h-[70vh] flex flex-col items-center justify-center px-4">
                        <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-6 text-center">
                            Authentication Required
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md text-center mb-8">
                            Please log in to access your account settings.
                        </p>
                        <a
                            href="/login"
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                            Go to Login
                        </a>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a]">
                <Navbar />
                <div className="flex items-center justify-center min-h-[80vh]">
                    <LazyLoading />
                </div>
                <Footer />
            </div>
        )
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked
            setSettings((prev) => ({
                ...prev,
                [name]: checked,
            }))
        } else {
            setSettings((prev) => ({
                ...prev,
                [name]: value,
            }))
        }
    }

    const handlePrivacyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked
            setSettings((prev) => ({
                ...prev,
                privacySettings: {
                    ...prev.privacySettings,
                    [name]: checked,
                },
            }))
        } else {
            setSettings((prev) => ({
                ...prev,
                privacySettings: {
                    ...prev.privacySettings,
                    [name]: value,
                },
            }))
        }
    }

    const handleSaveSettings = async () => {
        setSaving(true)

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000))

            // Password validation
            if (activeTab === "security" && settings.newPassword) {
                if (!settings.currentPassword) {
                    throw new Error("Current password is required")
                }

                if (settings.newPassword !== settings.confirmPassword) {
                    throw new Error("New passwords don't match")
                }

                if (settings.newPassword.length < 8) {
                    throw new Error("Password must be at least 8 characters")
                }
            }

            // Update user in Redux store if account info changed
            if (activeTab === "account") {
                // Make sure all required fields from User interface are provided as non-undefined values
                if (user) {
                    const updatedUser = {
                        identifier: user.identifier || "",
                        socketId: user.socketId || "",
                        accessToken: user.accessToken || "",
                        refreshToken: user.refreshToken || "",
                        userId: user.userId || "",
                        username: settings.username,
                        email: settings.email,
                        role: user.role || "",
                        titlePicture: user.titlePicture,
                        profilePicture: user.profilePicture,
                        bio: user.bio,
                        follower: user.follower || [],
                        following: user.following || [],
                        posts: user.posts || [],
                        createdAt: user.createdAt || new Date(),
                        updatedAt: user.updatedAt || new Date(),
                    }

                    dispatch(
                        login({
                            user: updatedUser,
                            csrfToken: csrfToken || "",
                        })
                    )
                }
            }

            setNotification({
                type: "success",
                message: "Settings saved successfully!",
            })

            // Clear passwords after successful save
            if (activeTab === "security") {
                setSettings((prev) => ({
                    ...prev,
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                }))
            }
        } catch (error) {
            setNotification({
                type: "error",
                message: error instanceof Error ? error.message : "Failed to save settings",
            })
        } finally {
            setSaving(false)

            // Auto-hide notification after 5 seconds
            setTimeout(() => {
                setNotification({ type: null, message: "" })
            }, 5000)
        }
    }

    const handleDeleteAccount = async () => {
        if (deleteConfirmation !== user?.username) {
            setNotification({
                type: "error",
                message: "Username doesn't match",
            })
            return
        }

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500))

            // Redirect to logout
            navigate("/logout")
        } catch (error) {
            setNotification({
                type: "error",
                message: "Failed to delete account",
            })
        } finally {
            setShowDeleteModal(false)
            setDeleteConfirmation("")
        }
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a]">
            <Navbar />

            {/* Hero Section with Blob */}
            <div className="relative overflow-hidden pt-12">
                <div className="absolute inset-0 z-0">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900/30 rounded-full filter blur-3xl opacity-30"></div>
                    <div className="absolute top-60 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-900/30 rounded-full filter blur-3xl opacity-30"></div>
                </div>

                {/* Settings Header */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">Manage your account preferences and settings</p>
                </div>
            </div>

            {/* Settings Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Settings Navigation */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden sticky top-24">
                            <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                            <div className="p-4">
                                <nav className="space-y-1">
                                    <button
                                        onClick={() => setActiveTab("account")}
                                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === "account"
                                                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                            }`}
                                    >
                                        <User className="mr-3 h-5 w-5" />
                                        <span>Account</span>
                                    </button>

                                    <button
                                        onClick={() => setActiveTab("security")}
                                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === "security"
                                                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                            }`}
                                    >
                                        <Lock className="mr-3 h-5 w-5" />
                                        <span>Security</span>
                                    </button>

                                    <button
                                        onClick={() => setActiveTab("notifications")}
                                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === "notifications"
                                                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                            }`}
                                    >
                                        <Bell className="mr-3 h-5 w-5" />
                                        <span>Notifications</span>
                                    </button>

                                    <button
                                        onClick={() => setActiveTab("privacy")}
                                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === "privacy"
                                                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                            }`}
                                    >
                                        <Shield className="mr-3 h-5 w-5" />
                                        <span>Privacy</span>
                                    </button>

                                    <button
                                        onClick={() => setActiveTab("preferences")}
                                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === "preferences"
                                                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                            }`}
                                    >
                                        <Globe className="mr-3 h-5 w-5" />
                                        <span>Preferences</span>
                                    </button>

                                    <button
                                        onClick={() => setActiveTab("danger")}
                                        className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${activeTab === "danger"
                                                ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                            }`}
                                    >
                                        <AlertTriangle className="mr-3 h-5 w-5" />
                                        <span>Danger Zone</span>
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>

                    {/* Settings Form */}
                    <div className="lg:col-span-3">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
                            <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                            <div className="p-6">
                                {/* Account Settings */}
                                {activeTab === "account" && (
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Account Information</h2>
                                        <div className="space-y-6">
                                            <div>
                                                <label
                                                    htmlFor="username"
                                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                                >
                                                    Username
                                                </label>
                                                <input
                                                    type="text"
                                                    id="username"
                                                    name="username"
                                                    value={settings.username}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="email"
                                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                                >
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={settings.email}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>

                                            <div className="pt-4">
                                                <button
                                                    onClick={handleSaveSettings}
                                                    disabled={saving}
                                                    className="flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                                                >
                                                    {saving ? (
                                                        <>
                                                            <svg
                                                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                                                            Saving...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Save className="mr-2 h-4 w-4" />
                                                            Save Changes
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Security Settings */}
                                {activeTab === "security" && (
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Security Settings</h2>
                                        <div className="space-y-6">
                                            <div>
                                                <label
                                                    htmlFor="currentPassword"
                                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                                >
                                                    Current Password
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        id="currentPassword"
                                                        name="currentPassword"
                                                        value={settings.currentPassword}
                                                        onChange={handleInputChange}
                                                        className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                    <button
                                                        type="button"
                                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                    >
                                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="newPassword"
                                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                                >
                                                    New Password
                                                </label>
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    id="newPassword"
                                                    name="newPassword"
                                                    value={settings.newPassword}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="confirmPassword"
                                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                                >
                                                    Confirm New Password
                                                </label>
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    value={settings.confirmPassword}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>

                                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                                    Two-Factor Authentication
                                                </h3>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-gray-700 dark:text-gray-300">Protect your account with 2FA</p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                            Add an extra layer of security to your account
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                name="twoFactorAuth"
                                                                checked={settings.twoFactorAuth}
                                                                onChange={handleInputChange}
                                                                className="sr-only peer"
                                                            />
                                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-4">
                                                <button
                                                    onClick={handleSaveSettings}
                                                    disabled={saving}
                                                    className="flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                                                >
                                                    {saving ? (
                                                        <>
                                                            <svg
                                                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                                                            Saving...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Save className="mr-2 h-4 w-4" />
                                                            Save Changes
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Notification Settings */}
                                {activeTab === "notifications" && (
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                                            Notification Preferences
                                        </h2>
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-gray-700 dark:text-gray-300">Email Notifications</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                        Receive notifications about activity via email
                                                    </p>
                                                </div>
                                                <div className="flex items-center">
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            name="emailNotifications"
                                                            checked={settings.emailNotifications}
                                                            onChange={handleInputChange}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-gray-700 dark:text-gray-300">Push Notifications</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                        Receive notifications on your device
                                                    </p>
                                                </div>
                                                <div className="flex items-center">
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            name="pushNotifications"
                                                            checked={settings.pushNotifications}
                                                            onChange={handleInputChange}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="pt-4">
                                                <button
                                                    onClick={handleSaveSettings}
                                                    disabled={saving}
                                                    className="flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                                                >
                                                    {saving ? (
                                                        <>
                                                            <svg
                                                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                                                            Saving...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Save className="mr-2 h-4 w-4" />
                                                            Save Changes
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Privacy Settings */}
                                {activeTab === "privacy" && (
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Privacy Settings</h2>
                                        <div className="space-y-6">
                                            <div>
                                                <label
                                                    htmlFor="profileVisibility"
                                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                                >
                                                    Profile Visibility
                                                </label>
                                                <select
                                                    id="profileVisibility"
                                                    name="profileVisibility"
                                                    value={settings.privacySettings.profileVisibility}
                                                    onChange={handlePrivacyChange}
                                                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    <option value="public">Public - Anyone can view</option>
                                                    <option value="followers">Followers Only</option>
                                                    <option value="private">Private - Only you</option>
                                                </select>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-gray-700 dark:text-gray-300">Show Online Status</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                        Let others see when you're online
                                                    </p>
                                                </div>
                                                <div className="flex items-center">
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            name="showOnlineStatus"
                                                            checked={settings.privacySettings.showOnlineStatus}
                                                            onChange={handlePrivacyChange}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-gray-700 dark:text-gray-300">Show Activity</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                        Let others see your recent activity
                                                    </p>
                                                </div>
                                                <div className="flex items-center">
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            name="showActivity"
                                                            checked={settings.privacySettings.showActivity}
                                                            onChange={handlePrivacyChange}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="pt-4">
                                                <button
                                                    onClick={handleSaveSettings}
                                                    disabled={saving}
                                                    className="flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                                                >
                                                    {saving ? (
                                                        <>
                                                            <svg
                                                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                                                            Saving...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Save className="mr-2 h-4 w-4" />
                                                            Save Changes
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Preferences Settings */}
                                {activeTab === "preferences" && (
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Preferences</h2>
                                        <div className="space-y-6">
                                            <div>
                                                <label
                                                    htmlFor="language"
                                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                                >
                                                    Language
                                                </label>
                                                <select
                                                    id="language"
                                                    name="language"
                                                    value={settings.language}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    <option value="en">English</option>
                                                    <option value="de">Deutsch</option>
                                                    <option value="fr">Français</option>
                                                    <option value="es">Español</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="theme"
                                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                                >
                                                    Theme
                                                </label>
                                                <select
                                                    id="theme"
                                                    name="theme"
                                                    value={settings.theme}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    <option value="light">Light</option>
                                                    <option value="dark">Dark</option>
                                                    <option value="system">System Default</option>
                                                </select>
                                            </div>

                                            <div className="pt-4">
                                                <button
                                                    onClick={handleSaveSettings}
                                                    disabled={saving}
                                                    className="flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                                                >
                                                    {saving ? (
                                                        <>
                                                            <svg
                                                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                                                            Saving...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Save className="mr-2 h-4 w-4" />
                                                            Save Changes
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Danger Zone */}
                                {activeTab === "danger" && (
                                    <div>
                                        <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-6">Danger Zone</h2>
                                        <div className="space-y-6">
                                            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                                                <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">Delete Account</h3>
                                                <p className="text-red-700 dark:text-red-300 mb-4">
                                                    Once you delete your account, there is no going back. Please be certain.
                                                </p>
                                                <button
                                                    onClick={() => setShowDeleteModal(true)}
                                                    className="flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete Account
                                                </button>
                                            </div>

                                            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
                                                <h3 className="text-lg font-medium text-amber-800 dark:text-amber-300 mb-2">
                                                    Log Out Everywhere
                                                </h3>
                                                <p className="text-amber-700 dark:text-amber-300 mb-4">
                                                    This will log you out from all devices except this one.
                                                </p>
                                                <button
                                                    onClick={() => {
                                                        // Simulate API call
                                                        setNotification({
                                                            type: "success",
                                                            message: "Logged out from all other devices",
                                                        })
                                                    }}
                                                    className="flex items-center justify-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors"
                                                >
                                                    <LogOut className="mr-2 h-4 w-4" />
                                                    Log Out Everywhere
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Notification */}
                        {notification.type && (
                            <div
                                className={`mt-4 p-4 rounded-xl flex items-start ${notification.type === "success"
                                        ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                                        : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300"
                                    }`}
                            >
                                {notification.type === "success" ? (
                                    <CheckCircle className="h-5 w-5 mr-3 flex-shrink-0" />
                                ) : (
                                    <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0" />
                                )}
                                <span>{notification.message}</span>
                                <button onClick={() => setNotification({ type: null, message: "" })} className="ml-auto">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
                        </div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                            &#8203;
                        </span>

                        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="h-2 bg-red-500"></div>
                            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                                        <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Delete Account</h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                This action cannot be undone. This will permanently delete your account and remove your data
                                                from our servers.
                                            </p>
                                            <div className="mt-4">
                                                <label
                                                    htmlFor="confirmDelete"
                                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                                >
                                                    Please type <span className="font-semibold">{user?.username}</span> to confirm
                                                </label>
                                                <input
                                                    type="text"
                                                    id="confirmDelete"
                                                    value={deleteConfirmation}
                                                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                                                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={handleDeleteAccount}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Delete Account
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteModal(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    )
}

export default Settings