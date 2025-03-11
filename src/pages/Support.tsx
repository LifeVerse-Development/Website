"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import {
    MessageSquare,
    Mail,
    Phone,
    Clock,
    Send,
    HelpCircle,
    Book,
    Plus,
    X,
    ChevronRight,
    AlertCircle,
    CheckCircle,
    Clock8,
    MessageCircle,
} from "lucide-react"

interface Ticket {
    id: string
    subject: string
    status: "open" | "in-progress" | "resolved" | "closed"
    category: string
    createdAt: string
    lastUpdated: string
}

const Support: React.FC = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [subject, setSubject] = useState("")
    const [message, setMessage] = useState("")
    const [category, setCategory] = useState("account")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isLoggedIn] = useState(true)
    const [userTickets] = useState<Ticket[]>([
        {
            id: "T-12345",
            subject: "Problem mit der Spielinstallation",
            status: "in-progress",
            category: "Technische Probleme",
            createdAt: "05.03.2025",
            lastUpdated: "07.03.2025",
        },
        {
            id: "T-12346",
            subject: "Frage zur Premium-Mitgliedschaft",
            status: "open",
            category: "Abonnement & Zahlungen",
            createdAt: "02.03.2025",
            lastUpdated: "02.03.2025",
        },
        {
            id: "T-12290",
            subject: "Passwort zurücksetzen",
            status: "resolved",
            category: "Konto & Profil",
            createdAt: "15.02.2025",
            lastUpdated: "16.02.2025",
        },
    ])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle form submission logic here
        console.log({ name, email, subject, message, category })
        // Reset form
        setName("")
        setEmail("")
        setSubject("")
        setMessage("")
        setCategory("account")
        // Show success message
        alert("Deine Nachricht wurde erfolgreich gesendet. Wir werden uns so schnell wie möglich bei dir melden.")
    }

    const handleTicketSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Handle ticket creation logic here
        console.log({ subject, category, message })
        // Close modal and reset form
        setIsModalOpen(false)
        setSubject("")
        setMessage("")
        setCategory("account")
        // Show success message
        alert("Dein Support-Ticket wurde erfolgreich erstellt. Du erhältst in Kürze eine Bestätigung per E-Mail.")
    }

    const getStatusBadge = (status: Ticket["status"]) => {
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
                            Support & Hilfe
                        </h1>
                        <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            Wir sind für dich da. Finde Antworten auf deine Fragen oder kontaktiere unser Support-Team.
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
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Unser Support-Prozess</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">1</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Ticket erstellen</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Erstelle ein Support-Ticket mit einer detaillierten Beschreibung deines Anliegens. Je mehr
                                    Informationen du angibst, desto schneller können wir dir helfen.
                                </p>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">2</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Bearbeitung</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Unser Support-Team bearbeitet dein Ticket und meldet sich innerhalb von 24 Stunden bei dir. Bei
                                    komplexeren Problemen kann die Bearbeitung etwas länger dauern.
                                </p>
                            </div>
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">3</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Lösung</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Sobald dein Problem gelöst ist, markieren wir das Ticket als gelöst. Du kannst das Ticket jederzeit
                                    wieder öffnen, falls weitere Fragen aufkommen.
                                </p>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-center">
                            <motion.button
                                whileHover={{ y: -3 }}
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium transition-all hover:shadow-lg"
                            >
                                <Plus className="h-5 w-5" />
                                <span>Neues Ticket erstellen</span>
                            </motion.button>
                        </div>
                    </div>
                </motion.div>

                {/* User Tickets (if logged in) */}
                {isLoggedIn && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-12"
                    >
                        <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Deine Support-Tickets</h2>
                                <motion.button
                                    whileHover={{ y: -3 }}
                                    onClick={() => setIsModalOpen(true)}
                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg font-medium transition-all hover:bg-blue-200 dark:hover:bg-blue-800/30"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>Neues Ticket</span>
                                </motion.button>
                            </div>

                            {userTickets.length > 0 ? (
                                <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-800">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                                >
                                                    Ticket-ID
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                                >
                                                    Betreff
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                                                >
                                                    Kategorie
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
                                                    Letzte Aktualisierung
                                                </th>
                                                <th scope="col" className="relative px-6 py-3">
                                                    <span className="sr-only">Aktionen</span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                            {userTickets.map((ticket) => (
                                                <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                        {ticket.id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                        {ticket.subject}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                        {ticket.category}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{getStatusBadge(ticket.status)}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                                        {ticket.lastUpdated}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <a
                                                            href={`/support/${ticket.id}`}
                                                            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                                                        >
                                                            Ansehen
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-600 dark:text-gray-400">Du hast noch keine Support-Tickets erstellt.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Support Options */}
                    <div className="lg:col-span-1">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Kontaktmöglichkeiten</h2>
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
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Live-Chat</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Chatte direkt mit unserem Support-Team</p>
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
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">E-Mail</h3>
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
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Telefon</h3>
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
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Servicezeiten</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Mo-Fr: 9:00 - 18:00 Uhr
                                            <br />
                                            Sa-So: 10:00 - 16:00 Uhr
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        <div className="mt-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Weitere Ressourcen</h2>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.4 }}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
                            >
                                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                    <a href="/faq" className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                            <span className="text-gray-900 dark:text-white">Häufig gestellte Fragen (FAQ)</span>
                                            <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
                                        </div>
                                    </a>
                                    <a
                                        href="/forum"
                                        className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <MessageCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                            <span className="text-gray-900 dark:text-white">Forum</span>
                                            <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
                                        </div>
                                    </a>
                                    <a
                                        href="/docs"
                                        className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Book className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                            <span className="text-gray-900 dark:text-white">Dokumentation</span>
                                            <ChevronRight className="h-4 w-4 ml-auto text-gray-400" />
                                        </div>
                                    </a>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                            <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                            <div className="p-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Kontaktformular</h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="email"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                            >
                                                E-Mail
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="category"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                        >
                                            Kategorie
                                        </label>
                                        <select
                                            id="category"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="account">Konto & Profil</option>
                                            <option value="payment">Zahlungen & Abonnements</option>
                                            <option value="technical">Technische Probleme</option>
                                            <option value="gameplay">Spielmechaniken</option>
                                            <option value="other">Sonstiges</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="subject"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                        >
                                            Betreff
                                        </label>
                                        <input
                                            type="text"
                                            id="subject"
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="message"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                        >
                                            Nachricht
                                        </label>
                                        <textarea
                                            id="message"
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            rows={6}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        ></textarea>
                                    </div>
                                    <div>
                                        <motion.button
                                            whileHover={{ y: -3 }}
                                            type="submit"
                                            className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium transition-all hover:shadow-lg"
                                        >
                                            <Send className="h-5 w-5" />
                                            <span>Nachricht senden</span>
                                        </motion.button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">

                    {/* Hintergrund, aber ohne die Klicks zu blockieren */}
                    <div className="fixed inset-0 bg-gray-500 dark:bg-gray-800 opacity-50 pointer-events-none"></div>

                    {/* Modal-Container mit höherem z-Index */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative z-50 bg-white dark:bg-gray-800 rounded-2xl text-left shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full"
                    >
                        <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                        <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                                            Neues Support-Ticket erstellen
                                        </h3>
                                        <button
                                            type="button"
                                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                            onClick={() => setIsModalOpen(false)}
                                        >
                                            <X className="h-6 w-6" />
                                        </button>
                                    </div>
                                    <form onSubmit={handleTicketSubmit} className="space-y-4">
                                        <div>
                                            <label htmlFor="modal-category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Kategorie
                                            </label>
                                            <select
                                                id="modal-category"
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="account">Konto & Profil</option>
                                                <option value="payment">Zahlungen & Abonnements</option>
                                                <option value="technical">Technische Probleme</option>
                                                <option value="gameplay">Spielmechaniken</option>
                                                <option value="other">Sonstiges</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="modal-subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Betreff
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
                                            <label htmlFor="modal-message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Beschreibung
                                            </label>
                                            <textarea
                                                id="modal-message"
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
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
                                Ticket erstellen
                            </motion.button>
                            <motion.button
                                whileHover={{ y: -2 }}
                                type="button"
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Abbrechen
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

