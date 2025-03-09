"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../../stores/store"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import LazyLoading from "../../components/LazyLoading"
import {
    Clock,
    MessageSquare,
    Heart,
    Share2,
    ShoppingBag,
    LogIn,
    UserPlus,
    Award,
    Filter,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Search,
} from "lucide-react"

interface HistoryItem {
    id: string
    type: "share" | "post" | "comment" | "like" | "follow" | "purchase" | "login" | "achievement"
    title: string
    description?: string
    timestamp: string
    icon: React.ReactNode
    iconBg: string
    iconColor: string
    link?: string
    metadata?: {
        [key: string]: any
    }
}

const History: React.FC = () => {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)
    const [loading, setLoading] = useState(true)
    const [historyItems, setHistoryItems] = useState<HistoryItem[]>([])
    const [filteredItems, setFilteredItems] = useState<HistoryItem[]>([])
    const [activeFilters, setActiveFilters] = useState<string[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [showFilters, setShowFilters] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    // Generate mock history data
    useEffect(() => {
        if (!isAuthenticated || !user?.userId) {
            setLoading(false)
            return
        }

        // Simulate API call to fetch history
        setTimeout(() => {
            const mockHistory: HistoryItem[] = [
                {
                    id: "hist-1",
                    type: "post",
                    title: "Created a new post",
                    description: "You shared a post: 'Just reached level 50 in the game! #milestone'",
                    timestamp: "2025-03-08T14:32:00Z",
                    icon: <MessageSquare size={18} />,
                    iconBg: "bg-blue-100 dark:bg-blue-900/30",
                    iconColor: "text-blue-600 dark:text-blue-400",
                    link: "/posts/123",
                },
                {
                    id: "hist-2",
                    type: "login",
                    title: "New login detected",
                    description: "You logged in from a new device in Berlin, Germany",
                    timestamp: "2025-03-07T09:15:00Z",
                    icon: <LogIn size={18} />,
                    iconBg: "bg-amber-100 dark:bg-amber-900/30",
                    iconColor: "text-amber-600 dark:text-amber-400",
                    link: "/login",
                },
                {
                    id: "hist-3",
                    type: "purchase",
                    title: "Completed purchase",
                    description: "You purchased 'Premium Pass' for €29.99",
                    timestamp: "2025-03-05T18:22:00Z",
                    icon: <ShoppingBag size={18} />,
                    iconBg: "bg-green-100 dark:bg-green-900/30",
                    iconColor: "text-green-600 dark:text-green-400",
                    link: "/purchases/456",
                    metadata: {
                        amount: 29.99,
                        currency: "EUR",
                        item: "Premium Pass",
                    },
                },
                {
                    id: "hist-4",
                    type: "like",
                    title: "Liked a post",
                    description: "You liked @johndoe's post",
                    timestamp: "2025-03-04T12:05:00Z",
                    icon: <Heart size={18} />,
                    iconBg: "bg-red-100 dark:bg-red-900/30",
                    iconColor: "text-red-600 dark:text-red-400",
                    link: "/posts/789",
                },
                {
                    id: "hist-5",
                    type: "follow",
                    title: "Followed a user",
                    description: "You started following @sarahsmith",
                    timestamp: "2025-03-03T16:48:00Z",
                    icon: <UserPlus size={18} />,
                    iconBg: "bg-purple-100 dark:bg-purple-900/30",
                    iconColor: "text-purple-600 dark:text-purple-400",
                    link: "/profile/sarahsmith",
                },
                {
                    id: "hist-6",
                    type: "achievement",
                    title: "Earned an achievement",
                    description: "You earned the 'Early Adopter' badge",
                    timestamp: "2025-03-02T10:30:00Z",
                    icon: <Award size={18} />,
                    iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
                    iconColor: "text-yellow-600 dark:text-yellow-400",
                    link: "/achievements",
                },
                {
                    id: "hist-7",
                    type: "comment",
                    title: "Left a comment",
                    description: "You commented on @mike's post: 'Great job on reaching level 100!'",
                    timestamp: "2025-03-01T20:15:00Z",
                    icon: <MessageSquare size={18} />,
                    iconBg: "bg-blue-100 dark:bg-blue-900/30",
                    iconColor: "text-blue-600 dark:text-blue-400",
                    link: "/posts/101112",
                },
                {
                    id: "hist-8",
                    type: "purchase",
                    title: "Completed purchase",
                    description: "You purchased 'Character Skin Bundle' for €14.99",
                    timestamp: "2025-02-28T13:40:00Z",
                    icon: <ShoppingBag size={18} />,
                    iconBg: "bg-green-100 dark:bg-green-900/30",
                    iconColor: "text-green-600 dark:text-green-400",
                    link: "/purchases/131415",
                    metadata: {
                        amount: 14.99,
                        currency: "EUR",
                        item: "Character Skin Bundle",
                    },
                },
                {
                    id: "hist-9",
                    type: "login",
                    title: "New login detected",
                    description: "You logged in from a new device in Paris, France",
                    timestamp: "2025-02-25T08:20:00Z",
                    icon: <LogIn size={18} />,
                    iconBg: "bg-amber-100 dark:bg-amber-900/30",
                    iconColor: "text-amber-600 dark:text-amber-400",
                },
                {
                    id: "hist-10",
                    type: "share",
                    title: "Shared a post",
                    description: "You shared @gamedev's post about the upcoming update",
                    timestamp: "2025-02-22T19:05:00Z",
                    icon: <Share2 size={18} />,
                    iconBg: "bg-indigo-100 dark:bg-indigo-900/30",
                    iconColor: "text-indigo-600 dark:text-indigo-400",
                    link: "/posts/161718",
                },
                {
                    id: "hist-11",
                    type: "achievement",
                    title: "Earned an achievement",
                    description: "You earned the 'Social Butterfly' badge for connecting with 10 users",
                    timestamp: "2025-02-20T14:30:00Z",
                    icon: <Award size={18} />,
                    iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
                    iconColor: "text-yellow-600 dark:text-yellow-400",
                    link: "/achievements",
                },
                {
                    id: "hist-12",
                    type: "follow",
                    title: "Followed a user",
                    description: "You started following @gamergirl",
                    timestamp: "2025-02-18T11:15:00Z",
                    icon: <UserPlus size={18} />,
                    iconBg: "bg-purple-100 dark:bg-purple-900/30",
                    iconColor: "text-purple-600 dark:text-purple-400",
                    link: "/profile/gamergirl",
                },
                {
                    id: "hist-13",
                    type: "like",
                    title: "Liked a post",
                    description: "You liked @techguru's post about gaming setups",
                    timestamp: "2025-02-15T16:40:00Z",
                    icon: <Heart size={18} />,
                    iconBg: "bg-red-100 dark:bg-red-900/30",
                    iconColor: "text-red-600 dark:text-red-400",
                    link: "/posts/192021",
                },
                {
                    id: "hist-14",
                    type: "post",
                    title: "Created a new post",
                    description: "You shared a post: 'Looking for teammates for the weekend tournament!'",
                    timestamp: "2025-02-12T09:25:00Z",
                    icon: <MessageSquare size={18} />,
                    iconBg: "bg-blue-100 dark:bg-blue-900/30",
                    iconColor: "text-blue-600 dark:text-blue-400",
                    link: "/posts/222324",
                },
                {
                    id: "hist-15",
                    type: "purchase",
                    title: "Completed purchase",
                    description: "You purchased 'In-Game Currency (5,000 Coins)' for €4.99",
                    timestamp: "2025-02-10T20:10:00Z",
                    icon: <ShoppingBag size={18} />,
                    iconBg: "bg-green-100 dark:bg-green-900/30",
                    iconColor: "text-green-600 dark:text-green-400",
                    link: "/purchases/252627",
                    metadata: {
                        amount: 4.99,
                        currency: "EUR",
                        item: "In-Game Currency (5,000 Coins)",
                    },
                },
            ]

            setHistoryItems(mockHistory)
            setFilteredItems(mockHistory)
            setLoading(false)
        }, 1500)
    }, [isAuthenticated, user])

    // Filter history items
    useEffect(() => {
        let filtered = [...historyItems]

        // Apply type filters
        if (activeFilters.length > 0) {
            filtered = filtered.filter((item) => activeFilters.includes(item.type))
        }

        // Apply search
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(
                (item) =>
                    item.title.toLowerCase().includes(query) ||
                    (item.description && item.description.toLowerCase().includes(query)),
            )
        }

        setFilteredItems(filtered)
        setCurrentPage(1) // Reset to first page when filters change
    }, [historyItems, activeFilters, searchQuery])

    const toggleFilter = (type: string) => {
        setActiveFilters((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
    }

    const clearFilters = () => {
        setActiveFilters([])
        setSearchQuery("")
    }

    // Pagination
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
    const currentItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date)
    }

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
                            Please log in to view your activity history.
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

            {/* Hero Section with Blob */}
            <div className="relative overflow-hidden pt-20">
                <div className="absolute inset-0 z-0">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900/30 rounded-full filter blur-3xl opacity-30"></div>
                    <div className="absolute top-60 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-900/30 rounded-full filter blur-3xl opacity-30"></div>
                </div>

                {/* History Header */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Activity History</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">View your recent activity and interactions</p>
                </div>
            </div>

            {/* History Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                {/* Filters and Search */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative w-full md:w-64">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search history..."
                                className="w-full px-4 py-2 pl-10 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                            >
                                <Filter className="h-4 w-4" />
                                <span>Filter</span>
                                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
                            </button>

                            {activeFilters.length > 0 && (
                                <button
                                    onClick={clearFilters}
                                    className="px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors"
                                >
                                    Clear filters ({activeFilters.length})
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filter Options */}
                    {showFilters && (
                        <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Filter by activity type</h3>
                            <div className="flex flex-wrap gap-2">
                                {["post", "comment", "like", "follow", "purchase", "login", "achievement", "share"].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => toggleFilter(type)}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-full capitalize ${activeFilters.includes(type)
                                                ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                                                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* History Timeline */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
                    <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>

                    {filteredItems.length > 0 ? (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {currentItems.map((item) => (
                                <div key={item.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div
                                            className={`flex-shrink-0 w-10 h-10 ${item.iconBg} rounded-full flex items-center justify-center`}
                                        >
                                            <span className={item.iconColor}>{item.icon}</span>
                                        </div>

                                        <div className="flex-grow">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                <h3 className="text-base font-medium text-gray-900 dark:text-white">{item.title}</h3>
                                                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                                    <Clock className="h-3.5 w-3.5 mr-1" />
                                                    {formatDate(item.timestamp)}
                                                </span>
                                            </div>

                                            {item.description && <p className="mt-1 text-gray-600 dark:text-gray-300">{item.description}</p>}

                                            {item.link && (
                                                <a
                                                    href={item.link}
                                                    className="mt-2 inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                                                >
                                                    View details
                                                    <ChevronRight className="ml-1 h-3.5 w-3.5" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center">
                            <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No activity found</h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                {activeFilters.length > 0 || searchQuery
                                    ? "Try changing your filters or search query"
                                    : "You don't have any activity yet"}
                            </p>

                            {(activeFilters.length > 0 || searchQuery) && (
                                <button
                                    onClick={clearFilters}
                                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                    )}

                    {/* Pagination */}
                    {filteredItems.length > 0 && totalPages > 1 && (
                        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 flex items-center justify-between">
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                                <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredItems.length)}</span> of{" "}
                                <span className="font-medium">{filteredItems.length}</span> results
                            </div>

                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>

                                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                    const pageNumber = i + 1
                                    return (
                                        <button
                                            key={pageNumber}
                                            onClick={() => setCurrentPage(pageNumber)}
                                            className={`w-8 h-8 rounded-lg ${currentPage === pageNumber
                                                    ? "bg-blue-600 text-white"
                                                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                                }`}
                                        >
                                            {pageNumber}
                                        </button>
                                    )
                                })}

                                {totalPages > 5 && (
                                    <>
                                        <span className="text-gray-500 dark:text-gray-400">...</span>
                                        <button
                                            onClick={() => setCurrentPage(totalPages)}
                                            className={`w-8 h-8 rounded-lg ${currentPage === totalPages
                                                    ? "bg-blue-600 text-white"
                                                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                                }`}
                                        >
                                            {totalPages}
                                        </button>
                                    </>
                                )}

                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default History

