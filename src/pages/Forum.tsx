"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "../stores/store"
import {
    MessageSquare,
    Users,
    MessageCircle,
    Star,
    AlertCircle,
    Search,
    Plus,
    Clock,
    Eye,
    PinIcon,
    LockIcon,
    Tag,
    Filter,
    CheckCircle2,
    X,
    Loader2,
} from "lucide-react"
import { motion } from "framer-motion"
import Footer from "../components/Footer"
import Navbar from "../components/Navbar"

// Types
interface ForumCategory {
    id: string
    name: string
    description: string
    icon: React.ReactNode
    topics: number
    posts: number
    lastPost?: {
        title: string
        author: string
        date: string
        authorAvatar: string
    }
}

interface ForumTopic {
    id: string
    title: string
    categoryId: string
    author: string
    authorAvatar: string
    createdAt: string
    views: number
    replies: number
    isPinned: boolean
    isLocked: boolean
    isSolved?: boolean
    lastReply?: {
        author: string
        authorAvatar: string
        date: string
    }
    tags: string[]
}

// Main Forum Component
const Forum: React.FC = () => {
    const navigate = useNavigate()
    const { isAuthenticated } = useSelector((state: RootState) => state.auth)

    const [activeCategory, setActiveCategory] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [sortBy, setSortBy] = useState<"newest" | "popular" | "unanswered">("newest")
    const [isCreateTopicModalOpen, setIsCreateTopicModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Form state for new topic
    const [newTopicTitle, setNewTopicTitle] = useState("")
    const [newTopicCategory, setNewTopicCategory] = useState("")
    const [newTopicContent, setNewTopicContent] = useState("")
    const [newTopicTags, setNewTopicTags] = useState("")

    // Sample data - in a real app, this would come from an API
    const categories: ForumCategory[] = [
        {
            id: "general",
            name: "Allgemeine Diskussion",
            description: "Diskussionen über alles rund um LifeVerse",
            icon: <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
            topics: 124,
            posts: 1872,
            lastPost: {
                title: "Neue Features in Version 2.5",
                author: "MaxMustermann",
                date: "Heute, 14:32",
                authorAvatar: "/placeholder.svg?height=40&width=40",
            },
        },
        {
            id: "gameplay",
            name: "Gameplay & Strategien",
            description: "Tipps, Tricks und Strategien für LifeVerse",
            icon: <Users className="h-6 w-6 text-green-600 dark:text-green-400" />,
            topics: 87,
            posts: 1243,
            lastPost: {
                title: "Beste Strategie für Anfänger",
                author: "GameMaster42",
                date: "Gestern, 18:15",
                authorAvatar: "/placeholder.svg?height=40&width=40",
            },
        },
        {
            id: "technical",
            name: "Technischer Support",
            description: "Hilfe bei technischen Problemen und Bugs",
            icon: <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />,
            topics: 56,
            posts: 782,
            lastPost: {
                title: "Spiel stürzt nach Update ab",
                author: "TechGuru",
                date: "08.03.2025, 09:45",
                authorAvatar: "/placeholder.svg?height=40&width=40",
            },
        },
        {
            id: "suggestions",
            name: "Vorschläge & Feedback",
            description: "Teile deine Ideen zur Verbesserung des Spiels",
            icon: <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />,
            topics: 93,
            posts: 1105,
            lastPost: {
                title: "Vorschlag: Neues Crafting-System",
                author: "CreativePlayer",
                date: "07.03.2025, 22:10",
                authorAvatar: "/placeholder.svg?height=40&width=40",
            },
        },
        {
            id: "offtopic",
            name: "Off-Topic",
            description: "Diskussionen, die nicht direkt mit LifeVerse zu tun haben",
            icon: <MessageCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
            topics: 45,
            posts: 687,
            lastPost: {
                title: "Welche anderen Spiele spielt ihr?",
                author: "GamerGirl99",
                date: "06.03.2025, 16:30",
                authorAvatar: "/placeholder.svg?height=40&width=40",
            },
        },
    ]

    const topics: ForumTopic[] = [
        {
            id: "topic1",
            title: "Willkommen im LifeVerse Forum - Bitte lesen!",
            categoryId: "general",
            author: "Admin",
            authorAvatar: "/placeholder.svg?height=40&width=40",
            createdAt: "01.01.2025",
            views: 15243,
            replies: 87,
            isPinned: true,
            isLocked: false,
            lastReply: {
                author: "NewUser123",
                authorAvatar: "/placeholder.svg?height=40&width=40",
                date: "Heute, 10:15",
            },
            tags: ["Wichtig", "Regeln"],
        },
        {
            id: "topic2",
            title: "Neue Features in Version 2.5 - Diskussion",
            categoryId: "general",
            author: "MaxMustermann",
            authorAvatar: "/placeholder.svg?height=40&width=40",
            createdAt: "09.03.2025",
            views: 1243,
            replies: 42,
            isPinned: true,
            isLocked: false,
            lastReply: {
                author: "GameFan22",
                authorAvatar: "/placeholder.svg?height=40&width=40",
                date: "Heute, 14:32",
            },
            tags: ["Update", "Features"],
        },
        {
            id: "topic3",
            title: "Probleme mit dem Login nach dem Update",
            categoryId: "technical",
            author: "TechGuru",
            authorAvatar: "/placeholder.svg?height=40&width=40",
            createdAt: "08.03.2025",
            views: 876,
            replies: 23,
            isPinned: false,
            isLocked: false,
            isSolved: true,
            lastReply: {
                author: "SupportTeam",
                authorAvatar: "/placeholder.svg?height=40&width=40",
                date: "Heute, 12:45",
            },
            tags: ["Bug", "Login"],
        },
        {
            id: "topic4",
            title: "Beste Strategie für Anfänger im Jahr 2025",
            categoryId: "gameplay",
            author: "GameMaster42",
            authorAvatar: "/placeholder.svg?height=40&width=40",
            createdAt: "07.03.2025",
            views: 2145,
            replies: 67,
            isPinned: false,
            isLocked: false,
            lastReply: {
                author: "Newbie001",
                authorAvatar: "/placeholder.svg?height=40&width=40",
                date: "Gestern, 18:15",
            },
            tags: ["Guide", "Anfänger"],
        },
        {
            id: "topic5",
            title: "Vorschlag: Neues Crafting-System für Ressourcen",
            categoryId: "suggestions",
            author: "CreativePlayer",
            authorAvatar: "/placeholder.svg?height=40&width=40",
            createdAt: "07.03.2025",
            views: 987,
            replies: 34,
            isPinned: false,
            isLocked: false,
            lastReply: {
                author: "DevTeamMember",
                authorAvatar: "/placeholder.svg?height=40&width=40",
                date: "07.03.2025, 22:10",
            },
            tags: ["Vorschlag", "Crafting"],
        },
        {
            id: "topic6",
            title: "Welche anderen Spiele spielt ihr neben LifeVerse?",
            categoryId: "offtopic",
            author: "GamerGirl99",
            authorAvatar: "/placeholder.svg?height=40&width=40",
            createdAt: "06.03.2025",
            views: 765,
            replies: 89,
            isPinned: false,
            isLocked: false,
            lastReply: {
                author: "GameCollector",
                authorAvatar: "/placeholder.svg?height=40&width=40",
                date: "06.03.2025, 16:30",
            },
            tags: ["Off-Topic", "Gaming"],
        },
    ]

    // Filter topics based on active category and search query
    const filteredTopics = topics.filter((topic) => {
        // Filter by category if one is selected
        if (activeCategory && topic.categoryId !== activeCategory) {
            return false
        }

        // Filter by search query if one exists
        if (searchQuery) {
            return (
                topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                topic.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
            )
        }

        return true
    })

    // Sort topics based on selected sort option
    const sortedTopics = [...filteredTopics].sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1
        if (!a.isPinned && b.isPinned) return 1

        if (sortBy === "newest") {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        } else if (sortBy === "popular") {
            return b.views - a.views
        } else if (sortBy === "unanswered") {
            return a.replies - b.replies
        }
        return 0
    })

    // Get category name by ID
    const getCategoryName = (categoryId: string): string => {
        const category = categories.find((cat) => cat.id === categoryId)
        return category ? category.name : "Unbekannte Kategorie"
    }

    // Handle creating a new topic
    const handleCreateTopic = (e: React.FormEvent) => {
        e.preventDefault()

        if (!isAuthenticated) {
            navigate("/login?redirect=forum")
            return
        }

        setIsLoading(true)

        // Simulate API call
        setTimeout(() => {
            // In a real app, you would send this data to your backend
            console.log({
                title: newTopicTitle,
                categoryId: newTopicCategory,
                content: newTopicContent,
                tags: newTopicTags.split(",").map((tag) => tag.trim()),
            })

            // Reset form and close modal
            setNewTopicTitle("")
            setNewTopicCategory("")
            setNewTopicContent("")
            setNewTopicTags("")
            setIsCreateTopicModalOpen(false)
            setIsLoading(false)

            navigate(`/forum/topic/:topicId`)
        }, 1000)
    }

    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-16">
                {/* Background Elements */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-300/10 dark:bg-blue-900/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-12 -left-24 w-64 h-64 bg-purple-300/10 dark:bg-purple-900/10 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Forum Header */}
                    <div className="mb-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                                    Community Forum
                                </h1>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">Diskutiere mit anderen Spielern über LifeVerse</p>
                            </div>
                            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Suchen..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full sm:w-64 px-4 py-2 pl-10 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                </div>
                                <button
                                    onClick={() => setIsCreateTopicModalOpen(true)}
                                    className="flex items-center justify-center px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Neues Thema
                                </button>
                            </div>
                        </div>

                        {/* Category Pills */}
                        <div className="mt-6 flex flex-wrap gap-2">
                            <button
                                onClick={() => setActiveCategory(null)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${activeCategory === null
                                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                    }`}
                            >
                                Alle Kategorien
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setActiveCategory(category.id)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${activeCategory === category.id
                                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                                        }`}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Left Column - Categories */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
                                <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                                <div className="p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Kategorien</h2>
                                    <div className="space-y-3">
                                        {categories.map((category) => (
                                            <button
                                                key={category.id}
                                                onClick={() => setActiveCategory(category.id)}
                                                className={`w-full flex items-center p-3 rounded-xl transition-colors duration-200 ${activeCategory === category.id
                                                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                                        : "hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300"
                                                    }`}
                                            >
                                                <div className="flex-shrink-0 mr-3">{category.icon}</div>
                                                <div className="text-left">
                                                    <p className="font-medium">{category.name}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                        {category.topics} Themen • {category.posts} Beiträge
                                                    </p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Forum Stats */}
                            <div className="mt-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
                                <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500"></div>
                                <div className="p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Forum Statistik</h2>
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Themen</span>
                                            <span className="font-medium text-gray-900 dark:text-white">{topics.length}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Beiträge</span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {topics.reduce((sum, topic) => sum + topic.replies, 0)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Mitglieder</span>
                                            <span className="font-medium text-gray-900 dark:text-white">1,245</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">Neuestes Mitglied</span>
                                            <span className="font-medium text-blue-600 dark:text-blue-400">GameFan99</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Topics */}
                        <div className="lg:col-span-3">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden">
                                <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>

                                {/* Topics Header */}
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            {activeCategory ? getCategoryName(activeCategory) : "Alle Themen"}
                                        </h2>
                                        <div className="mt-3 sm:mt-0 flex items-center space-x-3">
                                            <div className="flex items-center space-x-2">
                                                <Filter className="h-4 w-4 text-gray-400" />
                                                <select
                                                    value={sortBy}
                                                    onChange={(e) => setSortBy(e.target.value as "newest" | "popular" | "unanswered")}
                                                    className="text-sm bg-transparent border-none text-gray-700 dark:text-gray-300 focus:ring-0 focus:outline-none cursor-pointer"
                                                >
                                                    <option value="newest">Neueste</option>
                                                    <option value="popular">Beliebteste</option>
                                                    <option value="unanswered">Unbeantwortet</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Topics List */}
                                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {sortedTopics.length === 0 ? (
                                        <div className="py-12 text-center">
                                            <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                                            <p className="text-gray-500 dark:text-gray-400">Keine Themen gefunden</p>
                                            <button
                                                onClick={() => setIsCreateTopicModalOpen(true)}
                                                className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors duration-200"
                                            >
                                                Erstelle das erste Thema
                                            </button>
                                        </div>
                                    ) : (
                                        sortedTopics.map((topic) => (
                                            <div
                                                key={topic.id}
                                                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors duration-200"
                                            >
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 mr-4">
                                                        <img
                                                            src={topic.authorAvatar || "/placeholder.svg"}
                                                            alt={topic.author}
                                                            className="h-10 w-10 rounded-full object-cover"
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement
                                                                target.src = "/placeholder.svg?height=40&width=40"
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <Link to={`/forum/topic/${topic.id}`} className="group">
                                                            <div className="flex items-center">
                                                                {topic.isPinned && (
                                                                    <PinIcon className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-1.5" />
                                                                )}
                                                                {topic.isLocked && (
                                                                    <LockIcon className="h-4 w-4 text-amber-600 dark:text-amber-400 mr-1.5" />
                                                                )}
                                                                {topic.isSolved && (
                                                                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mr-1.5" />
                                                                )}
                                                                <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                                                                    {topic.title}
                                                                </h3>
                                                            </div>
                                                            <div className="mt-1 flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400">
                                                                <span className="mr-4 flex items-center">
                                                                    <Clock className="h-3.5 w-3.5 mr-1" />
                                                                    {topic.createdAt}
                                                                </span>
                                                                <span className="mr-4 flex items-center">
                                                                    <MessageCircle className="h-3.5 w-3.5 mr-1" />
                                                                    {topic.replies} Antworten
                                                                </span>
                                                                <span className="flex items-center">
                                                                    <Eye className="h-3.5 w-3.5 mr-1" />
                                                                    {topic.views} Aufrufe
                                                                </span>
                                                                <span className="ml-auto text-blue-600 dark:text-blue-400 font-medium">
                                                                    {getCategoryName(topic.categoryId)}
                                                                </span>
                                                            </div>
                                                        </Link>

                                                        {/* Tags */}
                                                        {topic.tags.length > 0 && (
                                                            <div className="mt-2 flex flex-wrap gap-2">
                                                                {topic.tags.map((tag, index) => (
                                                                    <span
                                                                        key={index}
                                                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                                                                    >
                                                                        <Tag className="h-3 w-3 mr-1" />
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Last Reply */}
                                                {topic.lastReply && (
                                                    <div className="mt-4 flex items-center">
                                                        <div className="flex-1"></div>
                                                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                            <span className="mr-2">Letzte Antwort von</span>
                                                            <img
                                                                src={topic.lastReply.authorAvatar || "/placeholder.svg"}
                                                                alt={topic.lastReply.author}
                                                                className="h-5 w-5 rounded-full object-cover mr-1"
                                                                onError={(e) => {
                                                                    const target = e.target as HTMLImageElement
                                                                    target.src = "/placeholder.svg?height=20&width=20"
                                                                }}
                                                            />
                                                            <span className="font-medium text-gray-900 dark:text-white mr-2">
                                                                {topic.lastReply.author}
                                                            </span>
                                                            <span>{topic.lastReply.date}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Create Topic Modal */}
                {isCreateTopicModalOpen && (
                    <div className="fixed inset-0 z-50 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                            {/* Background overlay */}
                            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                                <div className="absolute inset-0 bg-gray-500 dark:bg-gray-800 opacity-75"></div>
                            </div>

                            {/* This element is to trick the browser into centering the modal contents. */}
                            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                                &#8203;
                            </span>

                            {/* Modal panel */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative z-50"
                            >
                                <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                                                    Neues Thema erstellen
                                                </h3>
                                                <button
                                                    type="button"
                                                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                                    onClick={() => setIsCreateTopicModalOpen(false)}
                                                >
                                                    <span className="sr-only">Schließen</span>
                                                    <X className="h-6 w-6" />
                                                </button>
                                            </div>
                                            <form onSubmit={handleCreateTopic} className="space-y-4">
                                                <div>
                                                    <label
                                                        htmlFor="topic-title"
                                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                                    >
                                                        Titel
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="topic-title"
                                                        value={newTopicTitle}
                                                        onChange={(e) => setNewTopicTitle(e.target.value)}
                                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label
                                                        htmlFor="topic-category"
                                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                                    >
                                                        Kategorie
                                                    </label>
                                                    <select
                                                        id="topic-category"
                                                        value={newTopicCategory}
                                                        onChange={(e) => setNewTopicCategory(e.target.value)}
                                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                    >
                                                        <option value="">Kategorie wählen</option>
                                                        {categories.map((category) => (
                                                            <option key={category.id} value={category.id}>
                                                                {category.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label
                                                        htmlFor="topic-content"
                                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                                    >
                                                        Inhalt
                                                    </label>
                                                    <textarea
                                                        id="topic-content"
                                                        value={newTopicContent}
                                                        onChange={(e) => setNewTopicContent(e.target.value)}
                                                        rows={6}
                                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                    ></textarea>
                                                </div>
                                                <div>
                                                    <label
                                                        htmlFor="topic-tags"
                                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                                    >
                                                        Tags (durch Komma getrennt)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="topic-tags"
                                                        value={newTopicTags}
                                                        onChange={(e) => setNewTopicTags(e.target.value)}
                                                        placeholder="z.B. Hilfe, Anfänger, Update"
                                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <motion.button
                                        whileHover={{ y: -2 }}
                                        type="button"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-base font-medium text-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={handleCreateTopic}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                                                Wird erstellt...
                                            </>
                                        ) : (
                                            "Thema erstellen"
                                        )}
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ y: -2 }}
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={() => setIsCreateTopicModalOpen(false)}
                                        disabled={isLoading}
                                    >
                                        Abbrechen
                                    </motion.button>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    )
}

export default Forum

