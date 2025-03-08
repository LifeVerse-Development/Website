"use client"

import type React from "react"
import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { ArrowLeft, Send, Paperclip, Clock, User, Tag, AlertCircle, CheckCircle, Clock8, X, ChevronDown, MessageSquare, FileText, Download, Plus, Edit, Save, Trash2 } from 'lucide-react'

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

interface TicketDetails {
    id: string
    subject: string
    status: TicketStatus
    priority: TicketPriority
    category: string
    createdAt: string
    lastUpdated: string
    assignedTo?: string
    messages: Message[]
}

const SupportView: React.FC = () => {
    const navigate = useNavigate()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [replyText, setReplyText] = useState("")
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
    const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false)
    const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false)
    const [isAddingNote, setIsAddingNote] = useState(false)
    const [noteText, setNoteText] = useState("")
    const [isEditingTicket, setIsEditingTicket] = useState(false)
    const [editedSubject, setEditedSubject] = useState("")

    // Mock ticket data
    const [ticket, setTicket] = useState<TicketDetails>({
        id: "T-12345",
        subject: "Problem mit der Spielinstallation auf Windows 11",
        status: "in-progress",
        priority: "medium",
        category: "Technische Probleme",
        createdAt: "05.03.2025, 14:32 Uhr",
        lastUpdated: "07.03.2025, 10:15 Uhr",
        assignedTo: "Sarah Müller",
        messages: [
            {
                id: "msg-1",
                sender: "user",
                senderName: "Max Mustermann",
                content:
                    "Hallo Support-Team, ich habe Probleme bei der Installation von LifeVerse auf meinem Windows 11 PC. Der Installer bleibt bei 67% hängen und zeigt dann eine Fehlermeldung an: 'Error code: LV-3042'. Ich habe bereits versucht, den Installer als Administrator auszuführen und meine Antivirensoftware zu deaktivieren, aber das Problem besteht weiterhin. Könnt ihr mir helfen?",
                timestamp: "05.03.2025, 14:32 Uhr",
            },
            {
                id: "msg-2",
                sender: "support",
                senderName: "Sarah Müller",
                content:
                    "Hallo Max, vielen Dank für deine Nachricht. Der Fehlercode LV-3042 deutet auf ein Problem mit den Zugriffsrechten auf dem Installationsverzeichnis hin. Könntest du bitte folgende Schritte durchführen und mir die Ergebnisse mitteilen?\n\n1. Öffne die Eingabeaufforderung als Administrator\n2. Führe den Befehl 'sfc /scannow' aus\n3. Starte deinen Computer neu\n4. Versuche die Installation in einem anderen Verzeichnis (z.B. D:\\Games\\LifeVerse)\n\nZusätzlich wäre es hilfreich, wenn du mir die Installationslogs senden könntest. Diese findest du unter C:\\Users\\[DeinBenutzername]\\AppData\\Local\\LifeVerse\\Logs\\",
                timestamp: "05.03.2025, 16:45 Uhr",
            },
            {
                id: "msg-3",
                sender: "user",
                senderName: "Max Mustermann",
                content:
                    "Hallo Sarah, ich habe alle Schritte durchgeführt, aber leider besteht das Problem weiterhin. Ich habe die Logs als Anhang beigefügt. Außerdem habe ich bemerkt, dass mein Windows ein austehendes Update hat. Könnte das das Problem sein?",
                timestamp: "06.03.2025, 09:12 Uhr",
                attachments: [
                    {
                        name: "installation_log.txt",
                        size: "1.2 MB",
                        url: "#log",
                    },
                ],
            },
            {
                id: "msg-4",
                sender: "support",
                senderName: "Sarah Müller",
                content:
                    "Hallo Max, danke für die Logs. Nach Durchsicht kann ich bestätigen, dass das ausstehende Windows-Update tatsächlich das Problem verursachen könnte. In den Logs sehe ich, dass einige wichtige DirectX-Komponenten nicht auf dem neuesten Stand sind, die für LifeVerse benötigt werden.\n\nBitte führe das Windows-Update durch und versuche danach die Installation erneut. Falls das Problem weiterhin besteht, könntest du bitte auch deine Grafikkartentreiber aktualisieren? Diese scheinen ebenfalls veraltet zu sein.\n\nIch bleibe an deinem Fall dran und warte auf deine Rückmeldung.",
                timestamp: "06.03.2025, 11:30 Uhr",
            },
            {
                id: "msg-5",
                sender: "user",
                senderName: "Max Mustermann",
                content:
                    "Hallo Sarah, ich habe das Windows-Update durchgeführt und auch meine Grafikkartentreiber aktualisiert. Die Installation läuft jetzt! Vielen Dank für deine Hilfe. Das Spiel wird gerade installiert und ist bei 45%.",
                timestamp: "07.03.2025, 10:15 Uhr",
            },
        ],
    })

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

    const handleSendReply = () => {
        if (replyText.trim() === "") return

        const newMessage: Message = {
            id: `msg-${ticket.messages.length + 1}`,
            sender: "support",
            senderName: "Support-Mitarbeiter",
            content: replyText,
            timestamp: new Date().toLocaleString("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }) + " Uhr",
            attachments: selectedFiles.length
                ? selectedFiles.map((file) => ({
                    name: file.name,
                    size: `${(file.size / 1024).toFixed(1)} KB`,
                    url: "#attachment",
                }))
                : undefined,
        }

        setTicket({
            ...ticket,
            messages: [...ticket.messages, newMessage],
            lastUpdated: newMessage.timestamp,
        })

        setReplyText("")
        setSelectedFiles([])
    }

    const handleStatusChange = (status: TicketStatus) => {
        setTicket({
            ...ticket,
            status,
            lastUpdated: new Date().toLocaleString("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }) + " Uhr",
        })
        setIsStatusDropdownOpen(false)
    }

    const handlePriorityChange = (priority: TicketPriority) => {
        setTicket({
            ...ticket,
            priority,
            lastUpdated: new Date().toLocaleString("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }) + " Uhr",
        })
        setIsPriorityDropdownOpen(false)
    }

    const handleAddNote = () => {
        if (noteText.trim() === "") return

        const newMessage: Message = {
            id: `msg-${ticket.messages.length + 1}`,
            sender: "support",
            senderName: "Interne Notiz",
            content: noteText,
            timestamp: new Date().toLocaleString("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }) + " Uhr",
        }

        setTicket({
            ...ticket,
            messages: [...ticket.messages, newMessage],
            lastUpdated: newMessage.timestamp,
        })

        setNoteText("")
        setIsAddingNote(false)
    }

    const handleSaveTicketEdit = () => {
        if (editedSubject.trim() === "") return

        setTicket({
            ...ticket,
            subject: editedSubject,
            lastUpdated: new Date().toLocaleString("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }) + " Uhr",
        })

        setIsEditingTicket(false)
    }

    const getStatusBadge = (status: TicketStatus) => {
        switch (status) {
            case "open":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Offen
                    </span>
                )
            case "in-progress":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                        <Clock8 className="w-3 h-3 mr-1" />
                        In Bearbeitung
                    </span>
                )
            case "resolved":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Gelöst
                    </span>
                )
            case "closed":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                        <X className="w-3 h-3 mr-1" />
                        Geschlossen
                    </span>
                )
        }
    }

    const getPriorityBadge = (priority: TicketPriority) => {
        switch (priority) {
            case "low":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                        Niedrig
                    </span>
                )
            case "medium":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                        Mittel
                    </span>
                )
            case "high":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                        Hoch
                    </span>
                )
            case "urgent":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                        Dringend
                    </span>
                )
        }
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a]">
            <Navbar />

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate("/support")}
                        className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Zurück zur Übersicht
                    </button>
                </div>

                {/* Ticket Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8"
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
                                            placeholder="Betreff des Tickets"
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
                                    Ticket-ID: {ticket.id} • Erstellt am {ticket.createdAt}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <div className="relative">
                                    <button
                                        onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                        Status: {getStatusBadge(ticket.status)}
                                        <ChevronDown className="h-4 w-4" />
                                    </button>
                                    {isStatusDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                                            <div className="py-1">
                                                <button
                                                    onClick={() => handleStatusChange("open")}
                                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                                                >
                                                    {getStatusBadge("open")}
                                                    <span className="ml-2">Offen</span>
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange("in-progress")}
                                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                                                >
                                                    {getStatusBadge("in-progress")}
                                                    <span className="ml-2">In Bearbeitung</span>
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange("resolved")}
                                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                                                >
                                                    {getStatusBadge("resolved")}
                                                    <span className="ml-2">Gelöst</span>
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange("closed")}
                                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                                                >
                                                    {getStatusBadge("closed")}
                                                    <span className="ml-2">Geschlossen</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="relative">
                                    <button
                                        onClick={() => setIsPriorityDropdownOpen(!isPriorityDropdownOpen)}
                                        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                        Priorität: {getPriorityBadge(ticket.priority)}
                                        <ChevronDown className="h-4 w-4" />
                                    </button>
                                    {isPriorityDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                                            <div className="py-1">
                                                <button
                                                    onClick={() => handlePriorityChange("low")}
                                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                                                >
                                                    {getPriorityBadge("low")}
                                                    <span className="ml-2">Niedrig</span>
                                                </button>
                                                <button
                                                    onClick={() => handlePriorityChange("medium")}
                                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                                                >
                                                    {getPriorityBadge("medium")}
                                                    <span className="ml-2">Mittel</span>
                                                </button>
                                                <button
                                                    onClick={() => handlePriorityChange("high")}
                                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                                                >
                                                    {getPriorityBadge("high")}
                                                    <span className="ml-2">Hoch</span>
                                                </button>
                                                <button
                                                    onClick={() => handlePriorityChange("urgent")}
                                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                                                >
                                                    {getPriorityBadge("urgent")}
                                                    <span className="ml-2">Dringend</span>
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
                                <span className="text-gray-600 dark:text-gray-400">Kategorie:</span>
                                <span className="font-medium text-gray-900 dark:text-white">{ticket.category}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                <span className="text-gray-600 dark:text-gray-400">Letzte Aktualisierung:</span>
                                <span className="font-medium text-gray-900 dark:text-white">{ticket.lastUpdated}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                <span className="text-gray-600 dark:text-gray-400">Zugewiesen an:</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {ticket.assignedTo || "Nicht zugewiesen"}
                                </span>
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
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Konversationsverlauf</h2>
                        <div className="space-y-6">
                            {ticket.messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.sender === "user" ? "justify-start" : "justify-end"}`}
                                >
                                    <div
                                        className={`max-w-3xl rounded-lg p-4 ${message.sender === "user"
                                                ? "bg-gray-100 dark:bg-gray-700/50"
                                                : message.senderName === "Interne Notiz"
                                                    ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
                                                    : "bg-blue-50 dark:bg-blue-900/20"
                                            }`}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <span
                                                className={`font-medium ${message.sender === "user"
                                                        ? "text-gray-900 dark:text-white"
                                                        : message.senderName === "Interne Notiz"
                                                            ? "text-yellow-700 dark:text-yellow-400"
                                                            : "text-blue-700 dark:text-blue-400"
                                                    }`}
                                            >
                                                {message.senderName}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">{message.timestamp}</span>
                                        </div>
                                        <div className="whitespace-pre-line text-gray-700 dark:text-gray-300">{message.content}</div>
                                        {message.attachments && message.attachments.length > 0 && (
                                            <div className="mt-3 space-y-2">
                                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Anhänge:</p>
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
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Antworten</h2>
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
                                            <span>Abbrechen</span>
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="h-4 w-4" />
                                            <span>Interne Notiz</span>
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
                                    placeholder="Interne Notiz hinzufügen (nur für Support-Mitarbeiter sichtbar)..."
                                    className="w-full px-4 py-3 rounded-lg border border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 text-gray-900 dark:text-yellow-800 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                                    rows={4}
                                ></textarea>
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleAddNote}
                                        className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors"
                                    >
                                        <MessageSquare className="h-4 w-4" />
                                        <span>Notiz hinzufügen</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Deine Antwort..."
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
                                        <span>Datei anhängen</span>
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
                                        <span>Antwort senden</span>
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
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Ticket-Aktionen</h2>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => handleStatusChange("resolved")}
                                className="flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-800/30 transition-colors"
                            >
                                <CheckCircle className="h-4 w-4" />
                                <span>Als gelöst markieren</span>
                            </button>
                            <button
                                onClick={() => handleStatusChange("closed")}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                <X className="h-4 w-4" />
                                <span>Ticket schließen</span>
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/30 transition-colors">
                                <Trash2 className="h-4 w-4" />
                                <span>Ticket löschen</span>
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>

            <Footer />
        </div>
    )
}

export default SupportView
