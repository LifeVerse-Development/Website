"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../../stores/store"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import LazyLoading from "../../components/LazyLoading"
import {
    Bot,
    MessageSquare,
    AlertTriangle,
    Save,
    Plus,
    Trash2,
    Check,
    X,
    Info,
    RefreshCw,
    Server,
    Users,
    Shield,
    Eye,
    EyeOff,
    ChevronRight,
    Hash,
    Zap,
    Sliders,
} from "lucide-react"

// Define types for bot configuration
interface WelcomeConfig {
    enabled: boolean
    channelId: string
    message: string
    withImage: boolean
    withMemberCount: boolean
    withServerIcon: boolean
}

interface AntiLinkConfig {
    enabled: boolean
    whitelistedChannels: string[]
    whitelistedRoles: string[]
    whitelistedDomains: string[]
    punishment: "none" | "delete" | "warn" | "timeout" | "kick" | "ban"
    timeoutDuration: number
    logChannelId: string
}

interface TicketConfig {
    enabled: boolean
    categoryId: string
    supportRoleIds: string[]
    welcomeMessage: string
    closeMessage: string
    logChannelId: string
    buttonColor: string
    buttonLabel: string
}

interface WarnConfig {
    enabled: boolean
    logChannelId: string
    maxWarnings: number
    punishments: {
        count: number
        action: "none" | "timeout" | "kick" | "ban"
        duration?: number
    }[]
}

interface AutoModConfig {
    enabled: boolean
    filterProfanity: boolean
    filterSpam: boolean
    filterMassMention: boolean
    filterMassEmoji: boolean
    filterMassCaps: boolean
    logChannelId: string
}

interface BotConfig {
    serverId: string
    prefix: string
    welcomeConfig: WelcomeConfig
    antiLinkConfig: AntiLinkConfig
    ticketConfig: TicketConfig
    warnConfig: WarnConfig
    autoModConfig: AutoModConfig
}

interface ServerChannel {
    id: string
    name: string
    type: "text" | "voice" | "category" | "announcement" | "forum"
}

interface ServerRole {
    id: string
    name: string
    color: string
}

const ControlPanel: React.FC = () => {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [activeTab, setActiveTab] = useState("welcome")
    const [botStatus, setBotStatus] = useState<"online" | "offline" | "idle">("online")
    const [serverChannels, setServerChannels] = useState<ServerChannel[]>([])
    const [serverRoles, setServerRoles] = useState<ServerRole[]>([])
    const [showPreview, setShowPreview] = useState(true)
    const [notification, setNotification] = useState<{
        type: "success" | "error" | null
        message: string
    }>({ type: null, message: "" })

    // Bot configuration state
    const [config, setConfig] = useState<BotConfig>({
        serverId: "",
        prefix: "!",
        welcomeConfig: {
            enabled: true,
            channelId: "",
            message: "Welcome to the server, {user}! You are our {count}th member!",
            withImage: true,
            withMemberCount: true,
            withServerIcon: true,
        },
        antiLinkConfig: {
            enabled: true,
            whitelistedChannels: [],
            whitelistedRoles: [],
            whitelistedDomains: ["discord.gg", "discord.com"],
            punishment: "delete",
            timeoutDuration: 5,
            logChannelId: "",
        },
        ticketConfig: {
            enabled: true,
            categoryId: "",
            supportRoleIds: [],
            welcomeMessage: "Thank you for creating a ticket. Support will be with you shortly.",
            closeMessage: "This ticket has been closed. If you have further questions, please open a new ticket.",
            logChannelId: "",
            buttonColor: "#5865F2",
            buttonLabel: "Create Ticket",
        },
        warnConfig: {
            enabled: true,
            logChannelId: "",
            maxWarnings: 3,
            punishments: [
                { count: 1, action: "none" },
                { count: 2, action: "timeout", duration: 60 },
                { count: 3, action: "kick" },
            ],
        },
        autoModConfig: {
            enabled: true,
            filterProfanity: true,
            filterSpam: true,
            filterMassMention: true,
            filterMassEmoji: false,
            filterMassCaps: false,
            logChannelId: "",
        },
    })

    // Load bot configuration and server data
    useEffect(() => {
        if (!isAuthenticated || !user?.userId) {
            setLoading(false)
            return
        }

        // Simulate API call to fetch bot configuration and server data
        setTimeout(() => {
            // Mock server channels
            const mockChannels: ServerChannel[] = [
                { id: "ch1", name: "general", type: "text" },
                { id: "ch2", name: "welcome", type: "text" },
                { id: "ch3", name: "announcements", type: "announcement" },
                { id: "ch4", name: "bot-commands", type: "text" },
                { id: "ch5", name: "support", type: "text" },
                { id: "ch6", name: "logs", type: "text" },
                { id: "ch7", name: "voice-chat", type: "voice" },
                { id: "ch8", name: "Support Tickets", type: "category" },
            ]

            // Mock server roles
            const mockRoles: ServerRole[] = [
                { id: "r1", name: "Admin", color: "#FF0000" },
                { id: "r2", name: "Moderator", color: "#00FF00" },
                { id: "r3", name: "Support", color: "#0000FF" },
                { id: "r4", name: "Member", color: "#808080" },
                { id: "r5", name: "Bot", color: "#800080" },
            ]

            // Set mock data
            setServerChannels(mockChannels)
            setServerRoles(mockRoles)

            // Update config with mock channel IDs
            setConfig((prev) => ({
                ...prev,
                welcomeConfig: {
                    ...prev.welcomeConfig,
                    channelId: mockChannels.find((ch) => ch.name === "welcome")?.id || "",
                },
                antiLinkConfig: {
                    ...prev.antiLinkConfig,
                    logChannelId: mockChannels.find((ch) => ch.name === "logs")?.id || "",
                },
                ticketConfig: {
                    ...prev.ticketConfig,
                    categoryId: mockChannels.find((ch) => ch.name === "Support Tickets")?.id || "",
                    logChannelId: mockChannels.find((ch) => ch.name === "logs")?.id || "",
                    supportRoleIds: [mockRoles.find((r) => r.name === "Support")?.id || ""],
                },
                warnConfig: {
                    ...prev.warnConfig,
                    logChannelId: mockChannels.find((ch) => ch.name === "logs")?.id || "",
                },
                autoModConfig: {
                    ...prev.autoModConfig,
                    logChannelId: mockChannels.find((ch) => ch.name === "logs")?.id || "",
                },
            }))

            setLoading(false)
        }, 1500)
    }, [isAuthenticated, user])

    // Handle input changes for welcome config
    const handleWelcomeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked
            setConfig((prev) => ({
                ...prev,
                welcomeConfig: {
                    ...prev.welcomeConfig,
                    [name]: checked,
                },
            }))
        } else {
            setConfig((prev) => ({
                ...prev,
                welcomeConfig: {
                    ...prev.welcomeConfig,
                    [name]: value,
                },
            }))
        }
    }

    // Handle input changes for anti-link config
    const handleAntiLinkChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked
            setConfig((prev) => ({
                ...prev,
                antiLinkConfig: {
                    ...prev.antiLinkConfig,
                    [name]: checked,
                },
            }))
        } else {
            setConfig((prev) => ({
                ...prev,
                antiLinkConfig: {
                    ...prev.antiLinkConfig,
                    [name]: value,
                },
            }))
        }
    }

    // Handle input changes for ticket config
    const handleTicketChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked
            setConfig((prev) => ({
                ...prev,
                ticketConfig: {
                    ...prev.ticketConfig,
                    [name]: checked,
                },
            }))
        } else {
            setConfig((prev) => ({
                ...prev,
                ticketConfig: {
                    ...prev.ticketConfig,
                    [name]: value,
                },
            }))
        }
    }

    // Handle input changes for warn config
    const handleWarnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked
            setConfig((prev) => ({
                ...prev,
                warnConfig: {
                    ...prev.warnConfig,
                    [name]: checked,
                },
            }))
        } else if (name === "maxWarnings") {
            setConfig((prev) => ({
                ...prev,
                warnConfig: {
                    ...prev.warnConfig,
                    [name]: Number.parseInt(value) || 3,
                },
            }))
        } else {
            setConfig((prev) => ({
                ...prev,
                warnConfig: {
                    ...prev.warnConfig,
                    [name]: value,
                },
            }))
        }
    }

    // Handle input changes for automod config
    const handleAutoModChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked
            setConfig((prev) => ({
                ...prev,
                autoModConfig: {
                    ...prev.autoModConfig,
                    [name]: checked,
                },
            }))
        } else {
            setConfig((prev) => ({
                ...prev,
                autoModConfig: {
                    ...prev.autoModConfig,
                    [name]: value,
                },
            }))
        }
    }

    // Handle punishment change for warn system
    const handlePunishmentChange = (index: number, field: string, value: any) => {
        setConfig((prev) => {
            const newPunishments = [...prev.warnConfig.punishments]
            newPunishments[index] = {
                ...newPunishments[index],
                [field]: field === "count" || field === "duration" ? Number.parseInt(value) || 0 : value,
            }
            return {
                ...prev,
                warnConfig: {
                    ...prev.warnConfig,
                    punishments: newPunishments,
                },
            }
        })
    }

    // Add new punishment
    const addPunishment = () => {
        setConfig((prev) => {
            const lastPunishment = prev.warnConfig.punishments[prev.warnConfig.punishments.length - 1]
            const newCount = lastPunishment ? lastPunishment.count + 1 : 1
            return {
                ...prev,
                warnConfig: {
                    ...prev.warnConfig,
                    punishments: [...prev.warnConfig.punishments, { count: newCount, action: "none" }],
                },
            }
        })
    }

    // Remove punishment
    const removePunishment = (index: number) => {
        setConfig((prev) => {
            const newPunishments = [...prev.warnConfig.punishments]
            newPunishments.splice(index, 1)
            return {
                ...prev,
                warnConfig: {
                    ...prev.warnConfig,
                    punishments: newPunishments,
                },
            }
        })
    }

    // Add whitelisted domain
    const addWhitelistedDomain = (domain: string) => {
        if (!domain || config.antiLinkConfig.whitelistedDomains.includes(domain)) return

        setConfig((prev) => ({
            ...prev,
            antiLinkConfig: {
                ...prev.antiLinkConfig,
                whitelistedDomains: [...prev.antiLinkConfig.whitelistedDomains, domain],
            },
        }))
    }

    // Remove whitelisted domain
    const removeWhitelistedDomain = (domain: string) => {
        setConfig((prev) => ({
            ...prev,
            antiLinkConfig: {
                ...prev.antiLinkConfig,
                whitelistedDomains: prev.antiLinkConfig.whitelistedDomains.filter((d) => d !== domain),
            },
        }))
    }

    // Toggle channel in whitelist
    const toggleWhitelistedChannel = (channelId: string) => {
        setConfig((prev) => {
            const channels = [...prev.antiLinkConfig.whitelistedChannels]
            if (channels.includes(channelId)) {
                return {
                    ...prev,
                    antiLinkConfig: {
                        ...prev.antiLinkConfig,
                        whitelistedChannels: channels.filter((id) => id !== channelId),
                    },
                }
            } else {
                return {
                    ...prev,
                    antiLinkConfig: {
                        ...prev.antiLinkConfig,
                        whitelistedChannels: [...channels, channelId],
                    },
                }
            }
        })
    }

    // Toggle role in whitelist
    const toggleWhitelistedRole = (roleId: string) => {
        setConfig((prev) => {
            const roles = [...prev.antiLinkConfig.whitelistedRoles]
            if (roles.includes(roleId)) {
                return {
                    ...prev,
                    antiLinkConfig: {
                        ...prev.antiLinkConfig,
                        whitelistedRoles: roles.filter((id) => id !== roleId),
                    },
                }
            } else {
                return {
                    ...prev,
                    antiLinkConfig: {
                        ...prev.antiLinkConfig,
                        whitelistedRoles: [...roles, roleId],
                    },
                }
            }
        })
    }

    // Toggle support role
    const toggleSupportRole = (roleId: string) => {
        setConfig((prev) => {
            const roles = [...prev.ticketConfig.supportRoleIds]
            if (roles.includes(roleId)) {
                return {
                    ...prev,
                    ticketConfig: {
                        ...prev.ticketConfig,
                        supportRoleIds: roles.filter((id) => id !== roleId),
                    },
                }
            } else {
                return {
                    ...prev,
                    ticketConfig: {
                        ...prev.ticketConfig,
                        supportRoleIds: [...roles, roleId],
                    },
                }
            }
        })
    }

    // Save configuration
    const saveConfig = async () => {
        setSaving(true)

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500))

            setNotification({
                type: "success",
                message: "Bot configuration saved successfully!",
            })
        } catch (error) {
            setNotification({
                type: "error",
                message: "Failed to save bot configuration. Please try again.",
            })
        } finally {
            setSaving(false)

            // Auto-hide notification after 5 seconds
            setTimeout(() => {
                setNotification({ type: null, message: "" })
            }, 5000)
        }
    }

    // Restart bot
    const restartBot = async () => {
        try {
            setBotStatus("idle")

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 2000))

            setBotStatus("online")
            setNotification({
                type: "success",
                message: "Bot restarted successfully!",
            })
        } catch (error) {
            setBotStatus("offline")
            setNotification({
                type: "error",
                message: "Failed to restart bot. Please try again.",
            })
        } finally {
            // Auto-hide notification after 5 seconds
            setTimeout(() => {
                setNotification({ type: null, message: "" })
            }, 5000)
        }
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a]">
                <Navbar />
                <div className="relative overflow-hidden pt-20">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900/30 rounded-full filter blur-3xl opacity-30"></div>
                        <div className="absolute top-60 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-900/30 rounded-full filter blur-3xl opacity-30"></div>
                    </div>
                    <div className="relative z-10 min-h-[70vh] flex flex-col items-center justify-center px-4">
                        <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-6 text-center">
                            Authentication Required
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md text-center mb-8">
                            Please log in to access the Discord bot control panel.
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

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a]">
            <Navbar />

            {/* Control Panel Header */}
            <div className="relative overflow-hidden pt-20">
                <div className="absolute inset-0 z-0">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900/30 rounded-full filter blur-3xl opacity-30"></div>
                    <div className="absolute top-60 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-900/30 rounded-full filter blur-3xl opacity-30"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center">
                            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl mr-4">
                                <Bot className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Discord Bot Control Panel</h1>
                                <div className="flex items-center mt-1">
                                    <div
                                        className={`h-2.5 w-2.5 rounded-full mr-2 ${botStatus === "online" ? "bg-green-500" : botStatus === "idle" ? "bg-amber-500" : "bg-red-500"
                                            }`}
                                    ></div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Status: <span className="font-medium capitalize">{botStatus}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={restartBot}
                                className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Restart Bot
                            </button>
                            <button
                                onClick={saveConfig}
                                disabled={saving}
                                className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
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
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Configuration
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Server Info */}
                    <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex items-center">
                                <Server className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    Server: <span className="font-medium">Your Discord Server</span>
                                </span>
                            </div>
                            <div className="flex items-center">
                                <Users className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    Members: <span className="font-medium">1,234</span>
                                </span>
                            </div>
                            <div className="flex items-center">
                                <Hash className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    Channels: <span className="font-medium">{serverChannels.length}</span>
                                </span>
                            </div>
                            <div className="flex items-center">
                                <Shield className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    Roles: <span className="font-medium">{serverRoles.length}</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Control Panel Tabs */}
                    <div className="mt-8 border-b border-gray-200 dark:border-gray-700">
                        <nav className="flex flex-wrap space-x-2 sm:space-x-8">
                            <button
                                onClick={() => setActiveTab("welcome")}
                                className={`pb-4 px-1 font-medium text-sm border-b-2 ${activeTab === "welcome"
                                        ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                                        : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                    }`}
                            >
                                Welcome Messages
                            </button>
                            <button
                                onClick={() => setActiveTab("antilink")}
                                className={`pb-4 px-1 font-medium text-sm border-b-2 ${activeTab === "antilink"
                                        ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                                        : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                    }`}
                            >
                                Anti-Link System
                            </button>
                            <button
                                onClick={() => setActiveTab("ticket")}
                                className={`pb-4 px-1 font-medium text-sm border-b-2 ${activeTab === "ticket"
                                        ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                                        : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                    }`}
                            >
                                Ticket System
                            </button>
                            <button
                                onClick={() => setActiveTab("warn")}
                                className={`pb-4 px-1 font-medium text-sm border-b-2 ${activeTab === "warn"
                                        ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                                        : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                    }`}
                            >
                                Warning System
                            </button>
                            <button
                                onClick={() => setActiveTab("automod")}
                                className={`pb-4 px-1 font-medium text-sm border-b-2 ${activeTab === "automod"
                                        ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                                        : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                    }`}
                            >
                                Auto Moderation
                            </button>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Control Panel Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Configuration Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
                            <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>

                            {/* Welcome Messages Configuration */}
                            {activeTab === "welcome" && (
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Welcome Messages</h2>
                                        <div className="flex items-center">
                                            <span className="text-sm text-gray-500 dark:text-gray-400 mr-3">Enabled</span>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name="enabled"
                                                    checked={config.welcomeConfig.enabled}
                                                    onChange={handleWelcomeChange}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label
                                                htmlFor="welcomeChannel"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                            >
                                                Welcome Channel
                                            </label>
                                            <select
                                                id="welcomeChannel"
                                                name="channelId"
                                                value={config.welcomeConfig.channelId}
                                                onChange={handleWelcomeChange}
                                                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            >
                                                <option value="">Select a channel</option>
                                                {serverChannels
                                                    .filter((channel) => channel.type === "text" || channel.type === "announcement")
                                                    .map((channel) => (
                                                        <option key={channel.id} value={channel.id}>
                                                            # {channel.name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="welcomeMessage"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                            >
                                                Welcome Message
                                            </label>
                                            <div className="mb-1">
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    Available variables: {"{user}"} - mentions the user, {"{username}"} - user's name,{" "}
                                                    {"{server}"} - server name, {"{count}"} - member count
                                                </span>
                                            </div>
                                            <textarea
                                                id="welcomeMessage"
                                                name="message"
                                                value={config.welcomeConfig.message}
                                                onChange={handleWelcomeChange}
                                                rows={4}
                                                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="Enter welcome message..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="withImage"
                                                    name="withImage"
                                                    checked={config.welcomeConfig.withImage}
                                                    onChange={handleWelcomeChange}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                />
                                                <label htmlFor="withImage" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                                    Include welcome image
                                                </label>
                                            </div>

                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="withMemberCount"
                                                    name="withMemberCount"
                                                    checked={config.welcomeConfig.withMemberCount}
                                                    onChange={handleWelcomeChange}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                />
                                                <label
                                                    htmlFor="withMemberCount"
                                                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                                                >
                                                    Show member count
                                                </label>
                                            </div>

                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="withServerIcon"
                                                    name="withServerIcon"
                                                    checked={config.welcomeConfig.withServerIcon}
                                                    onChange={handleWelcomeChange}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                />
                                                <label htmlFor="withServerIcon" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                                    Include server icon
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Anti-Link System Configuration */}
                            {activeTab === "antilink" && (
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Anti-Link System</h2>
                                        <div className="flex items-center">
                                            <span className="text-sm text-gray-500 dark:text-gray-400 mr-3">Enabled</span>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name="enabled"
                                                    checked={config.antiLinkConfig.enabled}
                                                    onChange={handleAntiLinkChange}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label
                                                htmlFor="punishment"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                            >
                                                Punishment for Posting Links
                                            </label>
                                            <select
                                                id="punishment"
                                                name="punishment"
                                                value={config.antiLinkConfig.punishment}
                                                onChange={handleAntiLinkChange}
                                                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            >
                                                <option value="none">None (just delete message)</option>
                                                <option value="warn">Warn User</option>
                                                <option value="timeout">Timeout User</option>
                                                <option value="kick">Kick User</option>
                                                <option value="ban">Ban User</option>
                                            </select>
                                        </div>

                                        {config.antiLinkConfig.punishment === "timeout" && (
                                            <div>
                                                <label
                                                    htmlFor="timeoutDuration"
                                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                                >
                                                    Timeout Duration (minutes)
                                                </label>
                                                <input
                                                    type="number"
                                                    id="timeoutDuration"
                                                    name="timeoutDuration"
                                                    value={config.antiLinkConfig.timeoutDuration}
                                                    onChange={handleAntiLinkChange}
                                                    min="1"
                                                    max="10080" // 7 days in minutes
                                                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                />
                                            </div>
                                        )}

                                        <div>
                                            <label
                                                htmlFor="logChannel"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                            >
                                                Log Channel
                                            </label>
                                            <select
                                                id="logChannel"
                                                name="logChannelId"
                                                value={config.antiLinkConfig.logChannelId}
                                                onChange={handleAntiLinkChange}
                                                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            >
                                                <option value="">Select a channel</option>
                                                {serverChannels
                                                    .filter((channel) => channel.type === "text")
                                                    .map((channel) => (
                                                        <option key={channel.id} value={channel.id}>
                                                            # {channel.name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Whitelisted Domains
                                            </label>
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {config.antiLinkConfig.whitelistedDomains.map((domain) => (
                                                    <div
                                                        key={domain}
                                                        className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full"
                                                    >
                                                        <span className="text-sm text-gray-700 dark:text-gray-300">{domain}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeWhitelistedDomain(domain)}
                                                            className="ml-2 text-gray-500 hover:text-red-500"
                                                        >
                                                            <X className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex">
                                                <input
                                                    type="text"
                                                    id="newDomain"
                                                    placeholder="example.com"
                                                    className="flex-grow px-4 py-2 rounded-l-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const input = document.getElementById("newDomain") as HTMLInputElement
                                                        addWhitelistedDomain(input.value)
                                                        input.value = ""
                                                    }}
                                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-r-xl"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Whitelisted Channels
                                            </label>
                                            <div className="max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-xl p-2">
                                                {serverChannels
                                                    .filter((channel) => channel.type === "text" || channel.type === "announcement")
                                                    .map((channel) => (
                                                        <div key={channel.id} className="flex items-center py-1">
                                                            <input
                                                                type="checkbox"
                                                                id={`channel-${channel.id}`}
                                                                checked={config.antiLinkConfig.whitelistedChannels.includes(channel.id)}
                                                                onChange={() => toggleWhitelistedChannel(channel.id)}
                                                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                            />
                                                            <label
                                                                htmlFor={`channel-${channel.id}`}
                                                                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                                                            >
                                                                # {channel.name}
                                                            </label>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Whitelisted Roles
                                            </label>
                                            <div className="max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-xl p-2">
                                                {serverRoles.map((role) => (
                                                    <div key={role.id} className="flex items-center py-1">
                                                        <input
                                                            type="checkbox"
                                                            id={`role-${role.id}`}
                                                            checked={config.antiLinkConfig.whitelistedRoles.includes(role.id)}
                                                            onChange={() => toggleWhitelistedRole(role.id)}
                                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                        />
                                                        <label htmlFor={`role-${role.id}`} className="ml-2 flex items-center text-sm">
                                                            <span
                                                                className="w-3 h-3 rounded-full mr-1.5"
                                                                style={{ backgroundColor: role.color }}
                                                            ></span>
                                                            {role.name}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Ticket System Configuration */}
                            {activeTab === "ticket" && (
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Ticket System</h2>
                                        <div className="flex items-center">
                                            <span className="text-sm text-gray-500 dark:text-gray-400 mr-3">Enabled</span>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name="enabled"
                                                    checked={config.ticketConfig.enabled}
                                                    onChange={handleTicketChange}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label
                                                htmlFor="categoryId"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                            >
                                                Tickets Category
                                            </label>
                                            <select
                                                id="categoryId"
                                                name="categoryId"
                                                value={config.ticketConfig.categoryId}
                                                onChange={handleTicketChange}
                                                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            >
                                                <option value="">Select a category</option>
                                                {serverChannels
                                                    .filter((channel) => channel.type === "category")
                                                    .map((channel) => (
                                                        <option key={channel.id} value={channel.id}>
                                                            {channel.name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="logChannelId"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                            >
                                                Log Channel
                                            </label>
                                            <select
                                                id="logChannelId"
                                                name="logChannelId"
                                                value={config.ticketConfig.logChannelId}
                                                onChange={handleTicketChange}
                                                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            >
                                                <option value="">Select a channel</option>
                                                {serverChannels
                                                    .filter((channel) => channel.type === "text")
                                                    .map((channel) => (
                                                        <option key={channel.id} value={channel.id}>
                                                            # {channel.name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Support Roles
                                            </label>
                                            <div className="max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-xl p-2">
                                                {serverRoles.map((role) => (
                                                    <div key={role.id} className="flex items-center py-1">
                                                        <input
                                                            type="checkbox"
                                                            id={`support-role-${role.id}`}
                                                            checked={config.ticketConfig.supportRoleIds.includes(role.id)}
                                                            onChange={() => toggleSupportRole(role.id)}
                                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                        />
                                                        <label htmlFor={`support-role-${role.id}`} className="ml-2 flex items-center text-sm">
                                                            <span
                                                                className="w-3 h-3 rounded-full mr-1.5"
                                                                style={{ backgroundColor: role.color }}
                                                            ></span>
                                                            {role.name}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="welcomeMessage"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                            >
                                                Ticket Welcome Message
                                            </label>
                                            <textarea
                                                id="welcomeMessage"
                                                name="welcomeMessage"
                                                value={config.ticketConfig.welcomeMessage}
                                                onChange={handleTicketChange}
                                                rows={3}
                                                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="Enter ticket welcome message..."
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="closeMessage"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                            >
                                                Ticket Close Message
                                            </label>
                                            <textarea
                                                id="closeMessage"
                                                name="closeMessage"
                                                value={config.ticketConfig.closeMessage}
                                                onChange={handleTicketChange}
                                                rows={3}
                                                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                placeholder="Enter ticket close message..."
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label
                                                    htmlFor="buttonLabel"
                                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                                >
                                                    Button Label
                                                </label>
                                                <input
                                                    type="text"
                                                    id="buttonLabel"
                                                    name="buttonLabel"
                                                    value={config.ticketConfig.buttonLabel}
                                                    onChange={handleTicketChange}
                                                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                    placeholder="Create Ticket"
                                                />
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="buttonColor"
                                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                                >
                                                    Button Color
                                                </label>
                                                <div className="flex">
                                                    <input
                                                        type="color"
                                                        id="buttonColor"
                                                        name="buttonColor"
                                                        value={config.ticketConfig.buttonColor}
                                                        onChange={handleTicketChange}
                                                        className="h-10 w-10 rounded-l-lg border border-gray-300 dark:border-gray-600"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={config.ticketConfig.buttonColor}
                                                        onChange={handleTicketChange}
                                                        name="buttonColor"
                                                        className="flex-grow px-4 py-2 rounded-r-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Warning System Configuration */}
                            {activeTab === "warn" && (
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Warning System</h2>
                                        <div className="flex items-center">
                                            <span className="text-sm text-gray-500 dark:text-gray-400 mr-3">Enabled</span>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name="enabled"
                                                    checked={config.warnConfig.enabled}
                                                    onChange={handleWarnChange}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label
                                                htmlFor="logChannelId"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                            >
                                                Log Channel
                                            </label>
                                            <select
                                                id="logChannelId"
                                                name="logChannelId"
                                                value={config.warnConfig.logChannelId}
                                                onChange={handleWarnChange}
                                                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            >
                                                <option value="">Select a channel</option>
                                                {serverChannels
                                                    .filter((channel) => channel.type === "text")
                                                    .map((channel) => (
                                                        <option key={channel.id} value={channel.id}>
                                                            # {channel.name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="maxWarnings"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                            >
                                                Maximum Warnings
                                            </label>
                                            <input
                                                type="number"
                                                id="maxWarnings"
                                                name="maxWarnings"
                                                value={config.warnConfig.maxWarnings}
                                                onChange={handleWarnChange}
                                                min="1"
                                                max="10"
                                                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Warning Punishments
                                                </label>
                                                <button
                                                    type="button"
                                                    onClick={addPunishment}
                                                    className="flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                                                >
                                                    <Plus className="h-4 w-4 mr-1" />
                                                    Add Punishment
                                                </button>
                                            </div>

                                            <div className="space-y-3">
                                                {config.warnConfig.punishments.map((punishment, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                                                    >
                                                        <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                            <div>
                                                                <label
                                                                    htmlFor={`punishment-count-${index}`}
                                                                    className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1"
                                                                >
                                                                    Warning Count
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    id={`punishment-count-${index}`}
                                                                    value={punishment.count}
                                                                    onChange={(e) => handlePunishmentChange(index, "count", e.target.value)}
                                                                    min="1"
                                                                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                                />
                                                            </div>

                                                            <div>
                                                                <label
                                                                    htmlFor={`punishment-action-${index}`}
                                                                    className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1"
                                                                >
                                                                    Action
                                                                </label>
                                                                <select
                                                                    id={`punishment-action-${index}`}
                                                                    value={punishment.action}
                                                                    onChange={(e) => handlePunishmentChange(index, "action", e.target.value)}
                                                                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                                >
                                                                    <option value="none">None</option>
                                                                    <option value="timeout">Timeout</option>
                                                                    <option value="kick">Kick</option>
                                                                    <option value="ban">Ban</option>
                                                                </select>
                                                            </div>

                                                            {punishment.action === "timeout" && (
                                                                <div>
                                                                    <label
                                                                        htmlFor={`punishment-duration-${index}`}
                                                                        className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1"
                                                                    >
                                                                        Duration (minutes)
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        id={`punishment-duration-${index}`}
                                                                        value={punishment.duration || 5}
                                                                        onChange={(e) => handlePunishmentChange(index, "duration", e.target.value)}
                                                                        min="1"
                                                                        max="10080" // 7 days in minutes
                                                                        className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>

                                                        <button
                                                            type="button"
                                                            onClick={() => removePunishment(index)}
                                                            className="flex-shrink-0 p-1.5 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg"
                                                            disabled={config.warnConfig.punishments.length <= 1}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Auto Moderation Configuration */}
                            {activeTab === "automod" && (
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Auto Moderation</h2>
                                        <div className="flex items-center">
                                            <span className="text-sm text-gray-500 dark:text-gray-400 mr-3">Enabled</span>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name="enabled"
                                                    checked={config.autoModConfig.enabled}
                                                    onChange={handleAutoModChange}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label
                                                htmlFor="logChannelId"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                            >
                                                Log Channel
                                            </label>
                                            <select
                                                id="logChannelId"
                                                name="logChannelId"
                                                value={config.autoModConfig.logChannelId}
                                                onChange={handleAutoModChange}
                                                className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            >
                                                <option value="">Select a channel</option>
                                                {serverChannels
                                                    .filter((channel) => channel.type === "text")
                                                    .map((channel) => (
                                                        <option key={channel.id} value={channel.id}>
                                                            # {channel.name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                                <div className="flex items-center">
                                                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg mr-3">
                                                        <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Filter Profanity</h3>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            Detect and remove messages with profanity
                                                        </p>
                                                    </div>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        name="filterProfanity"
                                                        checked={config.autoModConfig.filterProfanity}
                                                        onChange={handleAutoModChange}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                                                </label>
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                                <div className="flex items-center">
                                                    <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg mr-3">
                                                        <Zap className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Filter Spam</h3>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">Detect and remove spam messages</p>
                                                    </div>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        name="filterSpam"
                                                        checked={config.autoModConfig.filterSpam}
                                                        onChange={handleAutoModChange}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                                                </label>
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                                <div className="flex items-center">
                                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                                                        <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Filter Mass Mentions</h3>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            Detect messages with too many mentions
                                                        </p>
                                                    </div>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        name="filterMassMention"
                                                        checked={config.autoModConfig.filterMassMention}
                                                        onChange={handleAutoModChange}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                                                </label>
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                                <div className="flex items-center">
                                                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-3">
                                                        <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Filter Mass Emoji</h3>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            Detect messages with too many emojis
                                                        </p>
                                                    </div>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        name="filterMassEmoji"
                                                        checked={config.autoModConfig.filterMassEmoji}
                                                        onChange={handleAutoModChange}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                                                </label>
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                                <div className="flex items-center">
                                                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mr-3">
                                                        <Sliders className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Filter Mass Caps</h3>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            Detect messages with too many capital letters
                                                        </p>
                                                    </div>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        name="filterMassCaps"
                                                        checked={config.autoModConfig.filterMassCaps}
                                                        onChange={handleAutoModChange}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Preview Panel */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden sticky top-24">
                            <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Preview</h2>
                                    <button
                                        onClick={() => setShowPreview(!showPreview)}
                                        className="p-1.5 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>

                                {showPreview ? (
                                    <div className="space-y-6">
                                        {activeTab === "welcome" && (
                                            <div className="space-y-4">
                                                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
                                                    <div className="flex items-center mb-3">
                                                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                                                            D
                                                        </div>
                                                        <div className="ml-2">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">Discord Bot</div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">Today at 12:34 PM</div>
                                                        </div>
                                                    </div>
                                                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                                                        <p className="text-sm text-gray-800 dark:text-gray-200">
                                                            {config.welcomeConfig.message
                                                                .replace("{user}", "@NewUser")
                                                                .replace("{username}", "NewUser")
                                                                .replace("{server}", "Your Discord Server")
                                                                .replace("{count}", "1,235")}
                                                        </p>
                                                        {config.welcomeConfig.withImage && (
                                                            <div className="mt-3 bg-gray-200 dark:bg-gray-600 rounded-lg h-32 flex items-center justify-center">
                                                                <span className="text-sm text-gray-500 dark:text-gray-400">Welcome Image</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    <p>
                                                        <span className="font-medium">Channel:</span>{" "}
                                                        {serverChannels.find((ch) => ch.id === config.welcomeConfig.channelId)?.name || "Not set"}
                                                    </p>
                                                    <p className="mt-1">
                                                        <span className="font-medium">Features:</span>{" "}
                                                        {[
                                                            config.welcomeConfig.withImage && "Welcome Image",
                                                            config.welcomeConfig.withMemberCount && "Member Count",
                                                            config.welcomeConfig.withServerIcon && "Server Icon",
                                                        ]
                                                            .filter(Boolean)
                                                            .join(", ")}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === "antilink" && (
                                            <div className="space-y-4">
                                                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
                                                    <div className="flex items-center mb-3">
                                                        <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold">
                                                            S
                                                        </div>
                                                        <div className="ml-2">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">System</div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">Today at 12:34 PM</div>
                                                        </div>
                                                    </div>
                                                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                                                        <p className="text-sm text-gray-800 dark:text-gray-200">
                                                            <span className="text-red-500 font-medium">Link Detected:</span> A message containing a
                                                            link was{" "}
                                                            {config.antiLinkConfig.punishment === "none"
                                                                ? "deleted"
                                                                : `deleted and user was ${config.antiLinkConfig.punishment}ed`}
                                                            .
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    <p>
                                                        <span className="font-medium">Punishment:</span>{" "}
                                                        {config.antiLinkConfig.punishment === "none"
                                                            ? "Delete message only"
                                                            : `${config.antiLinkConfig.punishment} user${config.antiLinkConfig.punishment === "timeout"
                                                                ? ` for ${config.antiLinkConfig.timeoutDuration} minutes`
                                                                : ""
                                                            }`}
                                                    </p>
                                                    <p className="mt-1">
                                                        <span className="font-medium">Whitelisted Domains:</span>{" "}
                                                        {config.antiLinkConfig.whitelistedDomains.join(", ") || "None"}
                                                    </p>
                                                    <p className="mt-1">
                                                        <span className="font-medium">Whitelisted Channels:</span>{" "}
                                                        {config.antiLinkConfig.whitelistedChannels.length > 0
                                                            ? config.antiLinkConfig.whitelistedChannels
                                                                .map((id) => `#${serverChannels.find((ch) => ch.id === id)?.name || "unknown"}`)
                                                                .join(", ")
                                                            : "None"}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === "ticket" && (
                                            <div className="space-y-4">
                                                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
                                                    <div className="flex items-center mb-3">
                                                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                                                            D
                                                        </div>
                                                        <div className="ml-2">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">Discord Bot</div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">Today at 12:34 PM</div>
                                                        </div>
                                                    </div>
                                                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                                                        <p className="text-sm text-gray-800 dark:text-gray-200">
                                                            {config.ticketConfig.welcomeMessage}
                                                        </p>
                                                        <div className="mt-3 flex">
                                                            <button
                                                                style={{ backgroundColor: config.ticketConfig.buttonColor }}
                                                                className="px-4 py-2 text-white text-sm font-medium rounded-lg"
                                                            >
                                                                {config.ticketConfig.buttonLabel}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    <p>
                                                        <span className="font-medium">Category:</span>{" "}
                                                        {serverChannels.find((ch) => ch.id === config.ticketConfig.categoryId)?.name || "Not set"}
                                                    </p>
                                                    <p className="mt-1">
                                                        <span className="font-medium">Support Roles:</span>{" "}
                                                        {config.ticketConfig.supportRoleIds.length > 0
                                                            ? config.ticketConfig.supportRoleIds
                                                                .map((id) => serverRoles.find((r) => r.id === id)?.name || "unknown")
                                                                .join(", ")
                                                            : "None"}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === "warn" && (
                                            <div className="space-y-4">
                                                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
                                                    <div className="flex items-center mb-3">
                                                        <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold">
                                                            W
                                                        </div>
                                                        <div className="ml-2">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">Warning System</div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">Today at 12:34 PM</div>
                                                        </div>
                                                    </div>
                                                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                                                        <p className="text-sm text-gray-800 dark:text-gray-200">
                                                            <span className="text-amber-500 font-medium">@User</span> has been warned by{" "}
                                                            <span className="text-blue-500 font-medium">@Moderator</span>. This is warning 2/
                                                            {config.warnConfig.maxWarnings}.
                                                        </p>
                                                        <p className="text-sm text-gray-800 dark:text-gray-200 mt-1">
                                                            Reason: Inappropriate language
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    <p>
                                                        <span className="font-medium">Max Warnings:</span> {config.warnConfig.maxWarnings}
                                                    </p>
                                                    <p className="mt-1">
                                                        <span className="font-medium">Punishments:</span>
                                                    </p>
                                                    <ul className="mt-1 ml-4 list-disc space-y-1">
                                                        {config.warnConfig.punishments.map((punishment, index) => (
                                                            <li key={index}>
                                                                Warning {punishment.count}:{" "}
                                                                {punishment.action === "none" ? "No action" : punishment.action}
                                                                {punishment.action === "timeout" && punishment.duration
                                                                    ? ` for ${punishment.duration} minutes`
                                                                    : ""}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === "automod" && (
                                            <div className="space-y-4">
                                                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
                                                    <div className="flex items-center mb-3">
                                                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                                                            A
                                                        </div>
                                                        <div className="ml-2">
                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">AutoMod</div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">Today at 12:34 PM</div>
                                                        </div>
                                                    </div>
                                                    <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                                                        <p className="text-sm text-gray-800 dark:text-gray-200">
                                                            <span className="text-green-500 font-medium">AutoMod:</span> Message from{" "}
                                                            <span className="text-blue-500 font-medium">@User</span> was deleted for containing{" "}
                                                            {config.autoModConfig.filterProfanity
                                                                ? "profanity"
                                                                : config.autoModConfig.filterSpam
                                                                    ? "spam"
                                                                    : "prohibited content"}
                                                            .
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    <p>
                                                        <span className="font-medium">Active Filters:</span>
                                                    </p>
                                                    <ul className="mt-1 ml-4 list-disc space-y-1">
                                                        {config.autoModConfig.filterProfanity && <li>Profanity Filter</li>}
                                                        {config.autoModConfig.filterSpam && <li>Spam Filter</li>}
                                                        {config.autoModConfig.filterMassMention && <li>Mass Mention Filter</li>}
                                                        {config.autoModConfig.filterMassEmoji && <li>Mass Emoji Filter</li>}
                                                        {config.autoModConfig.filterMassCaps && <li>Mass Caps Filter</li>}
                                                    </ul>
                                                </div>
                                            </div>
                                        )}

                                        <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                                            <div className="flex items-start">
                                                <Info className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-0.5 mr-3 flex-shrink-0" />
                                                <div>
                                                    <h3 className="text-sm font-medium text-indigo-800 dark:text-indigo-300">Help & Tips</h3>
                                                    <p className="mt-1 text-xs text-indigo-700 dark:text-indigo-400">
                                                        {activeTab === "welcome" &&
                                                            "Welcome messages help new members feel at home. Include a friendly greeting and useful information about your server."}
                                                        {activeTab === "antilink" &&
                                                            "The anti-link system helps prevent spam and unwanted advertisements. Whitelist channels where links are allowed, like #resources."}
                                                        {activeTab === "ticket" &&
                                                            "Ticket systems streamline support requests. Make sure to assign dedicated support roles to handle tickets efficiently."}
                                                        {activeTab === "warn" &&
                                                            "A warning system helps maintain order. Set up escalating punishments for repeat offenders to discourage rule-breaking."}
                                                        {activeTab === "automod" &&
                                                            "Auto moderation reduces the workload on human moderators. Enable only the filters you need to avoid false positives."}
                                                    </p>
                                                    <a
                                                        href="/about"
                                                        className="mt-2 inline-flex items-center text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                                                    >
                                                        Learn more
                                                        <ChevronRight className="ml-1 h-3 w-3" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8">
                                        <Eye className="h-12 w-12 text-gray-400 mb-3" />
                                        <p className="text-gray-500 dark:text-gray-400 text-center">
                                            Preview is hidden. Click the eye icon to show the preview.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notification */}
            {notification.type && (
                <div className="fixed bottom-4 right-4 max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className={`h-1 ${notification.type === "success" ? "bg-green-500" : "bg-red-500"}`}></div>
                    <div className="p-4 flex items-start">
                        {notification.type === "success" ? (
                            <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        ) : (
                            <X className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                        )}
                        <div className="flex-grow">
                            <h3
                                className={`text-sm font-medium ${notification.type === "success" ? "text-green-800 dark:text-green-300" : "text-red-800 dark:text-red-300"}`}
                            >
                                {notification.type === "success" ? "Success" : "Error"}
                            </h3>
                            <p
                                className={`mt-1 text-sm ${notification.type === "success" ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"}`}
                            >
                                {notification.message}
                            </p>
                        </div>
                        <button
                            onClick={() => setNotification({ type: null, message: "" })}
                            className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    )
}

export default ControlPanel

