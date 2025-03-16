"use client"

import type React from "react"
import type { RootState } from "../stores/store"
import { useState, useEffect, useCallback } from "react"
import { useSelector } from "react-redux"
import { motion } from "framer-motion"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import {
    MessageSquare,
    Mail,
    Phone,
    Clock,
    Plus,
    X,
    ChevronRight,
    AlertCircle,
    CheckCircle,
    Clock8,
    MessageCircle,
    Book,
    HelpCircle,
    Trash2,
    Edit,
} from "lucide-react"

interface Ticket {
    _id: string
    identifier: string
    subject: string
    description: string
    status: "open" | "in-progress" | "resolved" | "closed"
    category: string
    message: string
    createdAt: string
    lastUpdated: string
}

const API_URL = "http://localhost:3001/api/tickets"

const Support: React.FC = () => {
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)
    const [subject, setSubject] = useState("")
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("")
    const [category, setCategory] = useState("account")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [currentTicketId, setCurrentTicketId] = useState<string | null>(null)
    const [userTickets, setUserTickets] = useState<Ticket[]>([])
    const [isLoading, setIsLoading] = useState(false)

    // Add notification state variables
    const [showNotification, setShowNotification] = useState(false)
    const [notificationMessage, setNotificationMessage] = useState("")
    const [notificationType, setNotificationType] = useState<"success" | "error">("success")

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [ticketToDelete, setTicketToDelete] = useState<string | null>(null)

    // Fetch tickets when component mounts
    const fetchUserTickets = useCallback(async () => {
        if (!isAuthenticated || !user?.userId) {
            setIsLoading(false)
            return
        }
        setIsLoading(true)
        try {
            const response = await fetch(API_URL, {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    Authorization: `Bearer ${user.accessToken}`,
                },
            })
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`)
            }
            const data = await response.json()

            // In a real app, you would filter tickets by user ID
            // Here we're assuming all tickets belong to the current user
            setUserTickets(data)
        } catch (error) {
            console.error("Error fetching tickets:", error)
            showNotificationMessage("error", "Failed to load your tickets. Please try again later.")
        } finally {
            setIsLoading(false)
        }
    }, [isAuthenticated, user])

    useEffect(() => {
        if (isAuthenticated) {
            fetchUserTickets()
        }
    }, [isAuthenticated, fetchUserTickets])

    const openModal = (ticketId?: string) => {
        if (ticketId) {
            setIsEditMode(true)
            setCurrentTicketId(ticketId)

            // Find the ticket to edit
            const ticketToEdit = userTickets.find((ticket) => ticket._id === ticketId)
            if (ticketToEdit) {
                setCategory(ticketToEdit.category)
                setSubject(ticketToEdit.subject)
                setDescription(ticketToEdit.description)
                setMessage(ticketToEdit.message)
            }
        } else {
            // Create mode
            setIsEditMode(false)
            setCurrentTicketId(null)
            setCategory("account")
            setSubject("")
            setDescription("")
            setMessage("")
        }

        setIsModalOpen(true)
        document.body.style.overflow = "hidden" // Prevent scrolling when modal is open
    }

    const closeModal = () => {
        setIsModalOpen(false)
        document.body.style.overflow = "unset" // Restore scrolling
    }

    const showNotificationMessage = (type: "success" | "error", message: string) => {
        setNotificationType(type)
        setNotificationMessage(message)
        setShowNotification(true)

        // Auto-hide notification after 5 seconds
        setTimeout(() => {
            setShowNotification(false)
        }, 5000)
    }

    const handleTicketSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            if (!isAuthenticated || !user?.userId) {
                setIsLoading(false)
                return
            }

            // Prepare ticket data
            const ticketData = {
                category,
                subject,
                description,
                message,
                status: "open",
                userId: user.userId
            }

            let response

            if (isEditMode && currentTicketId) {
                // Update existing ticket
                response = await fetch(`${API_URL}/${currentTicketId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        Authorization: `Bearer ${user.accessToken}`,
                    },
                    body: JSON.stringify(ticketData),
                })
            } else {
                // Create new ticket
                response = await fetch(API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        Authorization: `Bearer ${user.accessToken}`,
                    },
                    body: JSON.stringify(ticketData),
                })
            }

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`)
            }

            const result = await response.json()
            console.log(isEditMode ? "Ticket updated:" : "Ticket created:", result)

            closeModal()
            setSubject("")
            setDescription("")
            setMessage("")
            setCategory("account")

            fetchUserTickets()

            showNotificationMessage(
                "success",
                isEditMode
                    ? "Your support ticket has been successfully updated."
                    : "Your support ticket has been successfully created. You will receive a confirmation email shortly.",
            )
        } catch (error) {
            console.error(isEditMode ? "Error updating ticket:" : "Error creating ticket:", error)

            showNotificationMessage(
                "error",
                isEditMode
                    ? "There was a problem updating your ticket. Please try again later."
                    : "There was a problem creating your ticket. Please try again later.",
            )
        }
    }

    const handleDeleteTicket = (ticketId: string) => {
        setTicketToDelete(ticketId)
        setIsDeleteModalOpen(true)
    }

    const confirmDeleteTicket = async () => {
        if (!ticketToDelete) return

        try {
            if (!isAuthenticated || !user?.userId) {
                setIsLoading(false)
                return
            }

            const response = await fetch(`${API_URL}/${ticketToDelete}`, {
                method: "DELETE",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    Authorization: `Bearer ${user.accessToken} ${user.role || ""}`,
                }
            })

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`)
            }

            fetchUserTickets()

            showNotificationMessage("success", "Your support ticket has been successfully deleted.")
        } catch (error) {
            console.error("Error deleting ticket:", error)

            showNotificationMessage("error", "There was a problem deleting your ticket. Please try again later.")
        } finally {
            setIsDeleteModalOpen(false)
            setTicketToDelete(null)
        }
    }

    const getStatusBadge = (status: Ticket["status"]) => {
        switch (status) {
            case "open":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Open
                    </span>
                )
            case "in-progress":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                        <Clock8 className="w-3 h-3 mr-1" />
                        In Progress
                    </span>
                )
            case "resolved":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Resolved
                    </span>
                )
            case "closed":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                        <X className="w-3 h-3 mr-1" />
                        Closed
                    </span>
                )
        }
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a]">
            <Navbar />

            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Background Blobs */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900/30 rounded-full filter blur-3xl opacity-30"></div>
                    <div className="absolute top-60 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-900/30 rounded-full filter blur-3xl opacity-30"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                            Support & Help
                        </h1>
                        <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            We're here for you. Find answers to your questions or contact our support team.
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                {/* Support Process Explanation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-12"
                >
                    <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    <div className="p-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Our Support Process</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">1</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Create a Ticket</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Create a support ticket with a detailed description of your issue. The more information you provide,
                                    the faster we can help you.
                                </p>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">2</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Processing</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Our support team processes your ticket and will get back to you within 24 hours. For more complex
                                    issues, processing may take a bit longer.
                                </p>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">3</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Resolution</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Once your issue is resolved, we'll mark the ticket as resolved. You can reopen the ticket at any time
                                    if you have further questions.
                                </p>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-center">
                            {isAuthenticated && (
                                <motion.button
                                    whileHover={{ y: -3 }}
                                    onClick={() => openModal()}
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium transition-all hover:shadow-lg"
                                >
                                    <Plus className="h-5 w-5" />
                                    <span>Create New Ticket</span>
                                </motion.button>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* User Tickets (if logged in) */}
                {isAuthenticated && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-12"
                    >
                        <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Support Tickets</h2>
                                <motion.button
                                    whileHover={{ y: -3 }}
                                    onClick={() => openModal()}
                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg font-medium transition-all hover:bg-blue-200 dark:hover:bg-blue-800/30"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>New Ticket</span>
                                </motion.button>
                            </div>

                            {isLoading ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-600 dark:text-gray-400">Loading your tickets...</p>
                                </div>
                            ) : userTickets.length > 0 ? (
                                <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-800">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                                >
                                                    Ticket ID
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                                >
                                                    Subject
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                                >
                                                    Category
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                                >
                                                    Status
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                                >
                                                    Last Updated
                                                </th>
                                                <th scope="col" className="relative px-6 py-3">
                                                    <span className="sr-only">Actions</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                            {userTickets.map((ticket) => (
                                                <tr key={ticket._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                        {ticket.identifier}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                        {ticket.subject}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                        {ticket.category}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{getStatusBadge(ticket.status)}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                        {new Date(ticket.lastUpdated).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex items-center justify-end space-x-3">
                                                            <button
                                                                onClick={() => openModal(ticket._id)}
                                                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteTicket(ticket._id)}
                                                                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                            <a
                                                                href={`/support/${ticket._id}`}
                                                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                                                            >
                                                                View
                                                            </a>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-600 dark:text-gray-400">You haven't created any support tickets yet.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Support Options */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Contact Options</h2>
                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                        <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Live Chat</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Chat directly with our support team</p>
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                        <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Email</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">support@lifeverse-game.com</p>
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                        <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Phone</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">+49 (0) 123 456789</p>
                                    </div>
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                        <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Service Hours</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Mon-Fri: 9:00 AM - 6:00 PM
                                            <br />
                                            Sat-Sun: 10:00 AM - 4:00 PM
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Additional Resources */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Additional Resources</h2>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mb-8"
                        >
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                <a href="/faq" className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        <span className="text-gray-900 dark:text-white">Frequently Asked Questions (FAQ)</span>
                                        <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
                                    </div>
                                </a>
                                <a href="/forum" className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <MessageCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        <span className="text-gray-900 dark:text-white">Forum</span>
                                        <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
                                    </div>
                                </a>
                                <a href="/docs" className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Book className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        <span className="text-gray-900 dark:text-white">Documentation</span>
                                        <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
                                    </div>
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                    {/* Background overlay */}
                    <div className="fixed inset-0 bg-gray-500 dark:bg-gray-800 opacity-75"></div>

                    {/* Modal container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative z-50 bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full"
                    >
                        <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                        <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                                            {isEditMode ? "Update Support Ticket" : "Create New Support Ticket"}
                                        </h3>
                                        <button
                                            type="button"
                                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                            onClick={closeModal}
                                        >
                                            <X className="h-6 w-6" />
                                        </button>
                                    </div>
                                    <form onSubmit={handleTicketSubmit} className="space-y-4">
                                        <div>
                                            <label
                                                htmlFor="modal-category"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                            >
                                                Category
                                            </label>
                                            <select
                                                id="modal-category"
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="account">Account & Profile</option>
                                                <option value="payment">Payments & Subscriptions</option>
                                                <option value="technical">Technical Issues</option>
                                                <option value="gameplay">Game Mechanics</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="modal-subject"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                            >
                                                Subject
                                            </label>
                                            <input
                                                type="text"
                                                id="modal-subject"
                                                value={subject}
                                                onChange={(e) => setSubject(e.target.value)}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="modal-description"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                            >
                                                Description
                                            </label>
                                            <textarea
                                                id="modal-description"
                                                value={description}
                                                onChange={(e) => setDescription(e.target.value)}
                                                rows={6}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            ></textarea>
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
                                onClick={handleTicketSubmit}
                            >
                                {isEditMode ? "Update Ticket" : "Create Ticket"}
                            </motion.button>
                            <motion.button
                                whileHover={{ y: -2 }}
                                type="button"
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                onClick={closeModal}
                            >
                                Cancel
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}

            {showNotification && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className={`fixed bottom-5 right-5 p-4 rounded-lg shadow-lg z-50 flex items-center gap-3 ${notificationType === "success"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-l-4 border-green-500"
                        : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-l-4 border-red-500"
                        }`}
                >
                    {notificationType === "success" ? (
                        <CheckCircle className="h-5 w-5 flex-shrink-0" />
                    ) : (
                        <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    )}
                    <div>
                        <p className="font-medium">{notificationMessage}</p>
                    </div>
                    <button
                        onClick={() => setShowNotification(false)}
                        className="ml-auto text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </motion.div>
            )}

            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                    {/* Background overlay */}
                    <div className="fixed inset-0 bg-gray-500 dark:bg-gray-800 opacity-75"></div>

                    {/* Modal container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative z-50 bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-md sm:w-full"
                    >
                        <div className="h-2 bg-gradient-to-r from-red-500 to-pink-500"></div>
                        <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                                    <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                                </div>
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Delete Support Ticket</h3>
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Are you sure you want to delete this ticket? This action cannot be undone.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <motion.button
                                whileHover={{ y: -2 }}
                                type="button"
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                onClick={confirmDeleteTicket}
                            >
                                Delete
                            </motion.button>
                            <motion.button
                                whileHover={{ y: -2 }}
                                type="button"
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                onClick={() => setIsDeleteModalOpen(false)}
                            >
                                Cancel
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}

            <Footer />
        </div>
    )
}

export default Support

