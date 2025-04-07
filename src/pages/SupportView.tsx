"use client"

import type React from "react"
import type { RootState } from "../stores/store"
import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { motion } from "framer-motion"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import {
    ArrowLeft,
    Send,
    Paperclip,
    Clock,
    User,
    Tag,
    AlertCircle,
    CheckCircle,
    Clock8,
    X,
    ChevronDown,
    MessageSquare,
    FileText,
    Download,
    Plus,
    Edit,
    Save,
    Trash2,
} from "lucide-react"
import LazyLoading from "../components/LazyLoading"

type TicketStatus = "open" | "in-progress" | "resolved" | "closed"
type TicketPriority = "low" | "medium" | "high" | "urgent"

interface Message {
    id: string
    sender: "user" | "support"
    senderName: string
    content: string
    timestamp: string
    attachments?: {
        name: string
        size: string
        url: string
    }[]
}

interface Ticket {
    _id: string
    identifier: string
    subject: string
    status: TicketStatus
    priority: TicketPriority
    category: string
    message: string
    createdAt: string
    lastUpdated: string
    assignedTo?: string
    messages?: Message[]
    description?: string
}

const API_URL = "http://localhost:3001/api/tickets"

interface MessageResponse {
    id: string
    sender: "user" | "support"
    senderName: string
    content: string
    timestamp: string
    attachments?: {
        name: string
        size: string
        url: string
    }[]
}

const SupportView: React.FC = () => {
    const navigate = useNavigate()
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)
    const { ticketId } = useParams<{ ticketId: string }>()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [replyText, setReplyText] = useState("")
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
    const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false)
    const [isAddingNote, setIsAddingNote] = useState(false)
    const [noteText, setNoteText] = useState("")
    const [isEditingTicket, setIsEditingTicket] = useState(false)
    const [editedSubject, setEditedSubject] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Notification state
    const [showNotification, setShowNotification] = useState(false)
    const [notificationMessage, setNotificationMessage] = useState("")
    const [notificationType, setNotificationType] = useState<"success" | "error">("success")

    // Delete confirmation modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    // Ticket state
    const [ticket, setTicket] = useState<Ticket | null>(null)
    const [ticketMessages, setTicketMessages] = useState<Message[]>([])

    // Track if description has been added
    const [hasDescription, setHasDescription] = useState(false)

    // Store the original createdAt date to preserve it
    const [originalCreatedAt, setOriginalCreatedAt] = useState<string>("")

    // Update the getStatusBadge function to use English text
    const getStatusBadge = (status: TicketStatus) => {
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

    // Update the getPriorityBadge function to use English text
    const getPriorityBadge = (priority: TicketPriority) => {
        switch (priority) {
            case "low":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                        Low
                    </span>
                )
            case "medium":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                        Medium
                    </span>
                )
            case "high":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                        High
                    </span>
                )
            case "urgent":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                        Urgent
                    </span>
                )
        }
    }

    const formatDateFromISO = (dateString: string) => {
        try {
            // Try to create a valid date object
            const date = new Date(dateString)

            // Check if the date is valid
            if (isNaN(date.getTime())) {
                console.warn("Invalid date format:", dateString)
                // Return the original date string instead of "Date unavailable"
                return dateString
            }

            // Format the date
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            })
        } catch (error) {
            console.error("Error formatting date:", error)
            // Return the original date string instead of "Date unavailable"
            return dateString
        }
    }

    // Update useEffect to add description as first message and capitalize category
    useEffect(() => {
        const fetchTicket = async () => {
            try {
                if (!isAuthenticated || !user?.userId) {
                    setIsLoading(false)
                    return
                }

                setIsLoading(true)
                if (!ticketId) return

                const response = await fetch(`${API_URL}/${ticketId}`, {
                    method: "GET",
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        Authorization: `Bearer ${user.accessToken}`,
                    },
                })

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`)
                }

                const data = await response.json()

                // Capitalize first letter of category
                const category = data.category
                const capitalizedCategory = category.charAt(0).toUpperCase() + category.slice(1)

                // Format dates for display
                const formattedCreatedAt = formatDateFromISO(data.createdAt)

                // Store the original formatted createdAt date
                setOriginalCreatedAt(formattedCreatedAt)

                const ticketData = {
                    ...data,
                    category: capitalizedCategory,
                    createdAt: formattedCreatedAt,
                    lastUpdated: formatDateFromISO(data.lastUpdated),
                    messages: data.messages.map((msg: MessageResponse) => ({
                        ...msg,
                        timestamp: formatDateFromISO(msg.timestamp),
                    })),
                }

                // Check if we already have a description message
                const hasExistingDescription = ticketData.messages.some((msg: Message) => msg.id === "description")
                setHasDescription(hasExistingDescription)

                // Add description as first message if it exists and hasn't been added yet
                if (data.description && data.description.trim() !== "" && !hasExistingDescription) {
                    // Create a description message that will appear first
                    const descriptionMessage: Message = {
                        id: "description",
                        sender: "user",
                        senderName: "Description",
                        content: data.description,
                        timestamp: ticketData.createdAt,
                    }

                    // Add the description message at the beginning of the messages array
                    ticketData.messages = [descriptionMessage, ...ticketData.messages]
                    setHasDescription(true)
                }

                setTicket(ticketData)
                setTicketMessages(ticketData.messages || [])
                setError(null)
            } catch (err) {
                console.error("Error fetching ticket:", err)
                setError("Error loading the ticket. Please try again later.")
                showNotificationMessage("error", "Failed to load ticket. Please try again later.")
            } finally {
                setIsLoading(false)
            }
        }

        if (ticketId) {
            fetchTicket()
        }
    }, [ticketId, isAuthenticated, user])

    const showNotificationMessage = (type: "success" | "error", message: string) => {
        setNotificationType(type)
        setNotificationMessage(message)
        setShowNotification(true)

        // Auto-hide notification after 5 seconds
        setTimeout(() => {
            setShowNotification(false)
        }, 5000)
    }

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files)
            setSelectedFiles([...selectedFiles, ...filesArray])
        }
    }

    const handleRemoveFile = (index: number) => {
        const newFiles = [...selectedFiles]
        newFiles.splice(index, 1)
        setSelectedFiles(newFiles)
    }

    const getCurrentISODate = () => {
        return new Date().toISOString()
    }

    // Get messages without description for API calls
    const getMessagesForAPI = () => {
        // Only filter out the description message if it exists
        return hasDescription ? ticketMessages.filter((msg) => msg.id !== "description") : ticketMessages
    }

    // Update the handleAddNote function to use "Internal Note" in English
    const handleAddNote = async () => {
        if (!ticket || noteText.trim() === "") return

        try {
            if (!isAuthenticated || !user?.userId) {
                setIsLoading(false)
                return
            }

            // Create new note message
            const newMessage: Message = {
                id: `msg-${Date.now()}`, // Use timestamp for unique ID
                sender: "support",
                senderName: "Internal Note",
                content: noteText,
                timestamp: getCurrentISODate(), // Use ISO format for the API
            }

            const formattedMessage = {
                ...newMessage,
                timestamp: formatDateFromISO(newMessage.timestamp),
            }

            // Add the new message to the local state
            const updatedMessages = [...ticketMessages, formattedMessage]
            setTicketMessages(updatedMessages)

            // Prepare messages for API (without description)
            const apiMessages = [...getMessagesForAPI(), newMessage]

            // Update the ticket on the server
            const response = await fetch(`${API_URL}/${ticketId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    Authorization: `Bearer ${user.accessToken}`,
                },
                body: JSON.stringify({
                    ...ticket,
                    lastUpdated: new Date().toISOString(),
                    messages: apiMessages,
                }),
            })

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`)
            }

            setNoteText("")
            setIsAddingNote(false)

            showNotificationMessage("success", "Internal note added")
        } catch (err) {
            console.error("Error adding note:", err)
            showNotificationMessage("error", "Failed to add note. Please try again later.")
        }
    }

    const handleSendReply = async () => {
        if (!ticket || replyText.trim() === "") return

        try {
            if (!isAuthenticated || !user?.userId) {
                setIsLoading(false)
                return
            }

            // Create new message object
            const newMessage: Message = {
                id: `msg-${Date.now()}`, // Use timestamp for unique ID
                sender: "support",
                senderName: "Support Agent",
                content: replyText,
                timestamp: getCurrentISODate(), // Use ISO format for the API
                attachments: selectedFiles.length
                    ? selectedFiles.map((file) => ({
                        name: file.name,
                        size: `${(file.size / 1024).toFixed(1)} KB`,
                        url: "#attachment",
                    }))
                    : undefined,
            }

            // Format the timestamp for display
            const formattedMessage = {
                ...newMessage,
                timestamp: formatDateFromISO(newMessage.timestamp),
            }

            // Add the message to the local state
            const updatedMessages = [...ticketMessages, formattedMessage]
            setTicketMessages(updatedMessages)

            // Prepare messages for API (without description)
            const apiMessages = [...getMessagesForAPI(), newMessage]

            // Update the ticket on the server
            const response = await fetch(`${API_URL}/${ticketId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    Authorization: `Bearer ${user.accessToken}`,
                },
                body: JSON.stringify({
                    ...ticket,
                    lastUpdated: new Date().toISOString(),
                    messages: apiMessages,
                }),
            })

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`)
            }

            // Update the ticket with the response data
            const data = await response.json()
            if (data) {
                const updatedTicket = {
                    ...data,
                    // Use the stored original createdAt date to preserve formatting
                    createdAt: originalCreatedAt,
                    lastUpdated: formatDateFromISO(data.lastUpdated),
                }

                // Make sure we don't lose our local messages with the description
                setTicket(updatedTicket)
            }

            // Reset form
            setReplyText("")
            setSelectedFiles([])

            showNotificationMessage("success", "Reply sent successfully")
        } catch (error) {
            console.error("Error sending reply:", error)
            showNotificationMessage("error", "Failed to send reply. Please try again.")
        }
    }

    const handleStatusChange = async (status: TicketStatus) => {
        if (!ticket) return

        try {
            if (!isAuthenticated || !user?.userId) {
                setIsLoading(false)
                return
            }

            const updatedTicket = {
                ...ticket,
                status,
                lastUpdated: new Date().toISOString(),
            }

            // Prepare messages for API (without description)
            const apiMessages = getMessagesForAPI()

            const response = await fetch(`${API_URL}/${ticketId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    Authorization: `Bearer ${user.accessToken}`,
                },
                body: JSON.stringify({
                    ...updatedTicket,
                    messages: apiMessages,
                }),
            })

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`)
            }

            // Update with the response data
            const data = await response.json()
            if (data) {
                setTicket({
                    ...data,
                    // Preserve the original createdAt date
                    createdAt: originalCreatedAt,
                    lastUpdated: formatDateFromISO(data.lastUpdated),
                })
            } else {
                setTicket({
                    ...updatedTicket,
                    lastUpdated: formatDateFromISO(updatedTicket.lastUpdated),
                })
            }

            setIsStatusDropdownOpen(false)

            showNotificationMessage("success", `Ticket status updated to ${status}`)
        } catch (error) {
            console.error("Error updating ticket status:", error)
            showNotificationMessage("error", "Failed to update ticket status. Please try again.")
        }
    }

    const handlePriorityChange = async (priority: TicketPriority) => {
        if (!ticket) return

        try {
            if (!isAuthenticated || !user?.userId) {
                setIsLoading(false)
                return
            }

            const updatedTicket = {
                ...ticket,
                priority,
                lastUpdated: new Date().toISOString(),
            }

            // Prepare messages for API (without description)
            const apiMessages = getMessagesForAPI()

            const response = await fetch(`${API_URL}/${ticketId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    Authorization: `Bearer ${user.accessToken}`,
                },
                body: JSON.stringify({
                    ...updatedTicket,
                    messages: apiMessages,
                }),
            })

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`)
            }

            // Update with the response data
            const data = await response.json()
            if (data) {
                setTicket({
                    ...data,
                    // Preserve the original createdAt date
                    createdAt: originalCreatedAt,
                    lastUpdated: formatDateFromISO(data.lastUpdated),
                })
            } else {
                setTicket({
                    ...updatedTicket,
                    lastUpdated: formatDateFromISO(updatedTicket.lastUpdated),
                })
            }

            setIsPriorityDropdownOpen(false)

            showNotificationMessage("success", `Ticket priority updated to ${priority}`)
        } catch (error) {
            console.error("Error updating ticket priority:", error)
            showNotificationMessage("error", "Failed to update ticket priority. Please try again.")
        }
    }

    const handleSaveTicketEdit = async () => {
        if (editedSubject.trim() === "" || !ticket) return

        try {
            if (!isAuthenticated || !user?.userId) {
                setIsLoading(false)
                return
            }

            const updatedTicket = {
                ...ticket,
                subject: editedSubject,
                lastUpdated: new Date().toISOString(),
            }

            // Prepare messages for API (without description)
            const apiMessages = getMessagesForAPI()

            const response = await fetch(`${API_URL}/${ticketId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    Authorization: `Bearer ${user.accessToken}`,
                },
                body: JSON.stringify({
                    ...updatedTicket,
                    messages: apiMessages,
                }),
            })

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`)
            }

            // Update with the response data
            const data = await response.json()
            if (data) {
                setTicket({
                    ...data,
                    // Preserve the original createdAt date
                    createdAt: originalCreatedAt,
                    lastUpdated: formatDateFromISO(data.lastUpdated),
                })
            } else {
                setTicket({
                    ...updatedTicket,
                    lastUpdated: formatDateFromISO(updatedTicket.lastUpdated),
                })
            }

            setIsEditingTicket(false)

            showNotificationMessage("success", "Ticket subject updated")
        } catch (error) {
            console.error("Error updating ticket subject:", error)
            showNotificationMessage("error", "Failed to update ticket subject. Please try again.")
        }
    }

    const handleDeleteTicket = async () => {
        try {
            if (!isAuthenticated || !user?.userId) {
                setIsLoading(false)
                return
            }

            const response = await fetch(`${API_URL}/${ticketId}`, {
                method: "DELETE",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    Authorization: `Bearer ${user.accessToken}`,
                },
            })

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`)
            }

            showNotificationMessage("success", "Ticket deleted successfully")

            // Redirect to the support page after a short delay
            setTimeout(() => {
                navigate("/support")
            }, 1500)
        } catch (error) {
            console.error("Error deleting ticket:", error)
            showNotificationMessage("error", "Failed to delete ticket. Please try again.")
        } finally {
            setIsDeleteModalOpen(false)
        }
    }

    // Update loading state text to English
    if (isLoading) {
        return <LazyLoading />
    }

    // Update error state text to English
    if (error || !ticket) {
        return (
            <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a]">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
                        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Ticket</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">{error || "Ticket not found"}</p>
                        <button
                            onClick={() => navigate("/support")}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Back to Support
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a]">
            <Navbar />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Breadcrumb */}

                <div className="pt-8 mb-6">
                    <button
                        onClick={() => navigate("/support")}
                        className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back to Support
                    </button>
                </div>

                {/* Ticket Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl mb-8"
                >
                    <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                            <div className="flex-grow">
                                {isEditingTicket ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={editedSubject}
                                            onChange={(e) => setEditedSubject(e.target.value)}
                                            className="w-full px-3 py-2 text-xl font-bold rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Ticket subject"
                                        />
                                        <button
                                            onClick={handleSaveTicketEdit}
                                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                        >
                                            <Save className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => setIsEditingTicket(false)}
                                            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">{ticket.subject}</h1>
                                        <button
                                            onClick={() => {
                                                setEditedSubject(ticket.subject)
                                                setIsEditingTicket(true)
                                            }}
                                            className="p-1 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}

                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Ticket ID: {ticket.identifier} • Created on {ticket.createdAt}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2 relative">
                                <div className="relative">
                                    <button
                                        onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-black dark:text-white transition-colors"
                                    >
                                        Status: {getStatusBadge(ticket.status)}
                                        <ChevronDown className="h-4 w-4" />
                                    </button>
                                    {isStatusDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                                            <div className="py-1">
                                                <button
                                                    onClick={() => handleStatusChange("open")}
                                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                                                >
                                                    {getStatusBadge("open")}
                                                    <span className="ml-2">Open</span>
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange("in-progress")}
                                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                                                >
                                                    {getStatusBadge("in-progress")}
                                                    <span className="ml-2">In Progress</span>
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange("resolved")}
                                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                                                >
                                                    {getStatusBadge("resolved")}
                                                    <span className="ml-2">Resolved</span>
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange("closed")}
                                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                                                >
                                                    {getStatusBadge("closed")}
                                                    <span className="ml-2">Closed</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="relative">
                                    <button
                                        onClick={() => setIsPriorityDropdownOpen(!isPriorityDropdownOpen)}
                                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-black dark:text-white transition-colors"
                                    >
                                        Priority: {getPriorityBadge(ticket.priority || "medium")}
                                        <ChevronDown className="h-4 w-4" />
                                    </button>
                                    {isPriorityDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                                            <div className="py-1">
                                                <button
                                                    onClick={() => handlePriorityChange("low")}
                                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50"
                                                >
                                                    {getPriorityBadge("low")}
                                                    <span className="ml-2">Low</span>
                                                </button>
                                                <button
                                                    onClick={() => handlePriorityChange("medium")}
                                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50"
                                                >
                                                    {getPriorityBadge("medium")}
                                                    <span className="ml-2">Medium</span>
                                                </button>
                                                <button
                                                    onClick={() => handlePriorityChange("high")}
                                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50"
                                                >
                                                    {getPriorityBadge("high")}
                                                    <span className="ml-2">High</span>
                                                </button>
                                                <button
                                                    onClick={() => handlePriorityChange("urgent")}
                                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50"
                                                >
                                                    {getPriorityBadge("urgent")}
                                                    <span className="ml-2">Urgent</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <Tag className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                <span className="text-gray-600 dark:text-gray-400">Category:</span>
                                <span className="font-medium text-gray-900 dark:text-white">{ticket.category}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
                                <span className="font-medium text-gray-900 dark:text-white">{ticket.lastUpdated}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                <span className="text-gray-600 dark:text-gray-400">Assigned To:</span>
                                <span className="font-medium text-gray-900 dark:text-white">{ticket.assignedTo || "Not assigned"}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Conversation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8"
                >
                    <div className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Conversation History</h2>
                        <div className="space-y-6">
                            {ticketMessages.map((message) => (
                                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-start" : "justify-end"}`}>
                                    <div
                                        className={`max-w-3xl rounded-lg p-4 w-full md:w-auto ${message.sender === "user"
                                            ? "bg-gray-100 dark:bg-gray-700/50"
                                            : message.senderName === "Internal Note"
                                                ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
                                                : "bg-blue-50 dark:bg-blue-900/20"
                                            }`}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <span
                                                className={`font-medium ${message.sender === "user"
                                                    ? "text-gray-900 dark:text-white"
                                                    : message.senderName === "Internal Note"
                                                        ? "text-yellow-700 dark:text-yellow-400"
                                                        : "text-blue-700 dark:text-blue-400"
                                                    }`}
                                            >
                                                {message.senderName}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">{message.timestamp}</span>
                                        </div>
                                        <div className="whitespace-pre-line text-gray-700 dark:text-gray-300 break-words overflow-wrap-anywhere">
                                            {message.content}
                                        </div>
                                        {message.attachments && message.attachments.length > 0 && (
                                            <div className="mt-3 space-y-2">
                                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Attachments:</p>
                                                {message.attachments.map((attachment, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-2 p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                                                    >
                                                        <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                                        <div className="flex-grow">
                                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{attachment.name}</p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">{attachment.size}</p>
                                                        </div>
                                                        <a
                                                            href={attachment.url}
                                                            className="p-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                                                        >
                                                            <Download className="h-4 w-4" />
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Reply Box */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8"
                >
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Reply</h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setIsAddingNote(!isAddingNote)}
                                    className={`flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${isAddingNote
                                        ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                                        }`}
                                >
                                    {isAddingNote ? (
                                        <>
                                            <X className="h-4 w-4" />
                                            <span>Cancel</span>
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="h-4 w-4" />
                                            <span>Internal Note</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                        {isAddingNote ? (
                            <div className="space-y-4">
                                <textarea
                                    value={noteText}
                                    onChange={(e) => setNoteText(e.target.value)}
                                    placeholder="Add internal note (visible only to support staff)..."
                                    className="w-full px-4 py-3 rounded-lg border border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 text-gray-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                                    rows={4}
                                ></textarea>
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleAddNote}
                                        className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors"
                                    >
                                        <MessageSquare className="h-4 w-4" />
                                        <span>Add Note</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Your reply..."
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    rows={4}
                                ></textarea>
                                <div className="flex flex-wrap gap-2 items-center">
                                    {selectedFiles.map((file, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm"
                                        >
                                            <FileText className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                            <span className="text-gray-700 dark:text-gray-300 max-w-[150px] truncate">{file.name}</span>
                                            <button
                                                onClick={() => handleRemoveFile(index)}
                                                className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        <Paperclip className="h-4 w-4" />
                                        <span>Attach File</span>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileInputChange}
                                            className="hidden"
                                            multiple
                                        />
                                    </button>
                                    <button
                                        onClick={handleSendReply}
                                        disabled={replyText.trim() === ""}
                                        className={`flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium transition-all hover:shadow-lg ${replyText.trim() === "" ? "opacity-50 cursor-not-allowed" : ""
                                            }`}
                                    >
                                        <Send className="h-4 w-4" />
                                        <span>Send Reply</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Ticket Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
                >
                    <div className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ticket Actions</h2>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => handleStatusChange("resolved")}
                                className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-800/30 transition-colors"
                            >
                                <CheckCircle className="h-4 w-4" />
                                <span>Mark as Resolved</span>
                            </button>
                            <button
                                onClick={() => handleStatusChange("closed")}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                <X className="h-4 w-4" />
                                <span>Close Ticket</span>
                            </button>
                            <button
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/30 transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                                <span>Delete Ticket</span>
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Notification */}
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

            {/* Delete Confirmation Modal */}
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
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">Delete Ticket</h3>
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
                                onClick={handleDeleteTicket}
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

export default SupportView

