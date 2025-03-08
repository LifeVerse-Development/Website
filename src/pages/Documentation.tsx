"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Search, Book, Bookmark, ChevronRight, FileText, Code, Cpu, Database, Menu, X, ChevronDown } from 'lucide-react'

interface DocSection {
    id: string
    title: string
    icon: React.ElementType
    content: string
    subsections?: {
        id: string
        title: string
        content: string
    }[]
}

const Documentation: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("")
    const [activeSection, setActiveSection] = useState("getting-started")
    const [activeSubsection, setActiveSubsection] = useState<string | null>("gs-introduction")
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const docSections: DocSection[] = [
        {
            id: "getting-started",
            title: "Erste Schritte",
            icon: Book,
            content: "Willkommen bei LifeVerse! Diese Dokumentation hilft dir dabei, dich in der virtuellen Welt zurechtzufinden und dein neues Leben zu beginnen.",
            subsections: [
                {
                    id: "gs-introduction",
                    title: "Einführung",
                    content: "LifeVerse ist eine virtuelle Welt, in der du ein zweites Leben führen kannst. Du kannst einen Beruf ausüben, Beziehungen aufbauen, Eigentum erwerben und vieles mehr. Diese Dokumentation hilft dir, dich in der Welt von LifeVerse zurechtzufinden."
                },
                {
                    id: "gs-installation",
                    title: "Installation",
                    content: "Um LifeVerse zu spielen, musst du zunächst die Anwendung herunterladen und installieren. Folge den Anweisungen auf der Download-Seite, um die Version für dein Betriebssystem zu erhalten."
                },
                {
                    id: "gs-account",
                    title: "Konto erstellen",
                    content: "Bevor du in die Welt von LifeVerse eintauchen kannst, musst du ein Konto erstellen. Klicke auf 'Registrieren' und folge den Anweisungen, um dein Konto einzurichten."
                }
            ]
        },
        {
            id: "careers",
            title: "Karriere & Berufe",
            icon: Bookmark,
            content: "Entdecke die verschiedenen Karrierewege und Berufe in LifeVerse.",
            subsections: [
                {
                    id: "careers-overview",
                    title: "Überblick",
                    content: "In LifeVerse kannst du aus einer Vielzahl von Berufen wählen, von traditionellen Karrieren bis hin zu kreativen Berufen. Jeder Beruf bietet einzigartige Vorteile und Herausforderungen."
                },
                {
                    id: "careers-skills",
                    title: "Fähigkeiten",
                    content: "Jeder Beruf erfordert bestimmte Fähigkeiten, die du durch Übung und Erfahrung verbessern kannst. Je höher deine Fähigkeiten, desto erfolgreicher wirst du in deinem Beruf sein."
                }
            ]
        },
        {
            id: "economy",
            title: "Wirtschaft & Finanzen",
            icon: Database,
            content: "Verstehe das Wirtschaftssystem, Währungen und Finanzmechanismen.",
            subsections: [
                {
                    id: "economy-currency",
                    title: "Währung",
                    content: "Die Hauptwährung in LifeVerse ist der LifeCoin (LC). Du kannst LC durch Arbeit, Handel und andere Aktivitäten verdienen."
                },
                {
                    id: "economy-banking",
                    title: "Bankwesen",
                    content: "In LifeVerse gibt es ein umfassendes Bankensystem, in dem du Geld einzahlen, abheben und überweisen kannst. Du kannst auch Kredite aufnehmen und Zinsen auf deine Einlagen verdienen."
                }
            ]
        },
        {
            id: "relationships",
            title: "Beziehungen & Soziales",
            icon: FileText,
            content: "Lerne, wie du Beziehungen aufbaust und mit anderen interagierst.",
            subsections: [
                {
                    id: "relationships-friends",
                    title: "Freundschaften",
                    content: "Freundschaften sind ein wichtiger Teil von LifeVerse. Du kannst Freundschaften schließen, indem du mit anderen Spielern interagierst und gemeinsame Aktivitäten unternimmst."
                },
                {
                    id: "relationships-romance",
                    title: "Romantische Beziehungen",
                    content: "Romantische Beziehungen in LifeVerse entwickeln sich ähnlich wie im echten Leben. Du kannst andere Spieler daten, heiraten und sogar eine Familie gründen."
                }
            ]
        },
        {
            id: "property",
            title: "Immobilien & Besitz",
            icon: FileText,
            content: "Erfahre, wie du Eigentum erwerben und verwalten kannst.",
            subsections: [
                {
                    id: "property-buying",
                    title: "Immobilien kaufen",
                    content: "In LifeVerse kannst du verschiedene Arten von Immobilien kaufen, von kleinen Apartments bis hin zu luxuriösen Villen. Jede Immobilie hat ihre eigenen Vorteile und Kosten."
                },
                {
                    id: "property-customization",
                    title: "Anpassung",
                    content: "Nachdem du eine Immobilie erworben hast, kannst du sie nach deinen Wünschen anpassen. Du kannst Möbel kaufen, die Wände streichen und vieles mehr."
                }
            ]
        },
        {
            id: "api",
            title: "API-Dokumentation",
            icon: Code,
            content: "Technische Dokumentation für Entwickler, die mit der LifeVerse-API arbeiten.",
            subsections: [
                {
                    id: "api-overview",
                    title: "API-Überblick",
                    content: "Die LifeVerse-API ermöglicht es Entwicklern, mit der LifeVerse-Plattform zu interagieren und eigene Anwendungen zu erstellen."
                },
                {
                    id: "api-authentication",
                    title: "Authentifizierung",
                    content: "Um die LifeVerse-API zu nutzen, musst du dich authentifizieren. Wir verwenden OAuth 2.0 für die Authentifizierung."
                }
            ]
        },
        {
            id: "modding",
            title: "Modding & Erweiterungen",
            icon: Cpu,
            content: "Lerne, wie du eigene Inhalte und Erweiterungen für LifeVerse erstellen kannst.",
            subsections: [
                {
                    id: "modding-basics",
                    title: "Grundlagen",
                    content: "Modding in LifeVerse ermöglicht es dir, das Spiel mit eigenen Inhalten zu erweitern. Du kannst neue Objekte, Kleidung, Häuser und mehr erstellen."
                },
                {
                    id: "modding-tools",
                    title: "Werkzeuge",
                    content: "LifeVerse bietet verschiedene Werkzeuge für Modder, darunter den LifeVerse Creator, mit dem du 3D-Modelle erstellen und importieren kannst."
                }
            ]
        }
    ]

    const filteredSections = docSections.filter(
        (section) =>
            section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            section.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            section.subsections?.some(
                (subsection) =>
                    subsection.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    subsection.content.toLowerCase().includes(searchQuery.toLowerCase())
            )
    )

    const activeDoc = docSections.find(section => section.id === activeSection)
    const activeSubsectionContent = activeDoc?.subsections?.find(subsection => subsection.id === activeSubsection)

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
                            Dokumentation
                        </h1>
                        <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            Umfassende Anleitungen und Referenzen für LifeVerse.
                        </p>
                    </div>

                    {/* Search */}
                    <div className="mt-10 max-w-3xl mx-auto">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Suche in der Dokumentation..."
                                className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            />
                            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden sticky top-0 z-30 bg-[#f8fafc] dark:bg-[#0f172a] p-4 border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none"
                >
                    {mobileMenuOpen ? (
                        <>
                            <X className="w-5 h-5 mr-2" />
                            Dokumentation schließen
                        </>
                    ) : (
                        <>
                            <Menu className="w-5 h-5 mr-2" />
                            Dokumentation öffnen
                        </>
                    )}
                </button>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar / Table of Contents */}
                    <motion.aside
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className={`lg:w-64 flex-shrink-0 ${mobileMenuOpen ? 'block' : 'hidden'} lg:block`}
                    >
                        <div className="sticky top-4 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                            <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                            <div className="p-4">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Inhaltsverzeichnis</h2>
                                <nav className="space-y-1">
                                    {filteredSections.map((section) => (
                                        <div key={section.id} className="mb-2">
                                            <button
                                                onClick={() => {
                                                    setActiveSection(section.id)
                                                    if (section.subsections && section.subsections.length > 0) {
                                                        setActiveSubsection(section.subsections[0].id)
                                                    } else {
                                                        setActiveSubsection(null)
                                                    }
                                                    setMobileMenuOpen(false)
                                                }}
                                                className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeSection === section.id
                                                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                                                    }`}
                                            >
                                                <section.icon className="h-5 w-5 mr-2" />
                                                <span>{section.title}</span>
                                                {section.subsections && section.subsections.length > 0 && (
                                                    <ChevronDown className={`h-4 w-4 ml-auto transition-transform ${activeSection === section.id ? 'rotate-180' : ''}`} />
                                                )}
                                            </button>

                                            {activeSection === section.id && section.subsections && (
                                                <div className="mt-1 ml-5 pl-2 border-l border-gray-200 dark:border-gray-700 space-y-1">
                                                    {section.subsections.map((subsection) => (
                                                        <button
                                                            key={subsection.id}
                                                            onClick={() => {
                                                                setActiveSubsection(subsection.id)
                                                                setMobileMenuOpen(false)
                                                            }}
                                                            className={`block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${activeSubsection === subsection.id
                                                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                                                                }`}
                                                        >
                                                            {subsection.title}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </motion.aside>

                    {/* Main Documentation Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex-grow"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                            <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                            <div className="p-8">
                                {activeDoc && (
                                    <div>
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                                <activeDoc.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                            </div>
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{activeDoc.title}</h2>
                                        </div>

                                        <div className="prose prose-blue max-w-none text-gray-600 dark:text-gray-300">
                                            <p>{activeDoc.content}</p>

                                            {activeSubsectionContent && (
                                                <div className="mt-8">
                                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{activeSubsectionContent.title}</h3>
                                                    <p>{activeSubsectionContent.content}</p>

                                                    {/* Example content for demonstration */}
                                                    {activeSubsection === 'gs-introduction' && (
                                                        <div className="mt-6">
                                                            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Was ist LifeVerse?</h4>
                                                            <p className="mb-4">
                                                                LifeVerse ist eine immersive virtuelle Welt, in der du ein zweites Leben führen kannst.
                                                                Du kannst einen Avatar erstellen, der dich repräsentiert, und mit ihm die Welt erkunden,
                                                                Freundschaften schließen, eine Karriere verfolgen und vieles mehr.
                                                            </p>

                                                            <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 my-6">
                                                                <p className="text-sm text-blue-700 dark:text-blue-300">
                                                                    <strong>Hinweis:</strong> LifeVerse befindet sich in ständiger Weiterentwicklung.
                                                                    Neue Features und Verbesserungen werden regelmäßig hinzugefügt.
                                                                </p>
                                                            </div>

                                                            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Systemanforderungen</h4>
                                                            <ul className="list-disc pl-5 space-y-1 mb-4">
                                                                <li>Betriebssystem: Windows 10/11, macOS 12+, Linux</li>
                                                                <li>Prozessor: Intel Core i5 oder AMD Ryzen 5</li>
                                                                <li>Arbeitsspeicher: 16 GB RAM</li>
                                                                <li>Grafikkarte: NVIDIA GTX 1060 oder AMD RX 580</li>
                                                                <li>Speicherplatz: 50 GB</li>
                                                            </ul>
                                                        </div>
                                                    )}

                                                    {activeSubsection === 'api-overview' && (
                                                        <div className="mt-6">
                                                            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">API-Endpunkte</h4>
                                                            <p className="mb-4">
                                                                Die LifeVerse-API bietet verschiedene Endpunkte für den Zugriff auf Daten und Funktionen.
                                                            </p>

                                                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 font-mono text-sm overflow-x-auto mb-6">
                                                                <pre className="text-gray-800 dark:text-gray-300">
                                                                    GET /api/v1/users/{'{userId}'} <br />
                                                                    GET /api/v1/properties <br />
                                                                    POST /api/v1/transactions <br />
                                                                    PUT /api/v1/profiles/{'{profileId}'}
                                                                </pre>
                                                            </div>

                                                            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Beispielanfrage</h4>
                                                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                                                                <pre className="text-gray-800 dark:text-gray-300">
                                                                    {`fetch('https://api.lifeverse-game.com/v1/users/123', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data));`}
                                                                </pre>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Navigation between sections */}
                                        <div className="mt-12 flex justify-between">
                                            <button
                                                onClick={() => {
                                                    const currentIndex = filteredSections.findIndex(s => s.id === activeSection)
                                                    if (currentIndex > 0) {
                                                        const prevSection = filteredSections[currentIndex - 1]
                                                        setActiveSection(prevSection.id)
                                                        if (prevSection.subsections && prevSection.subsections.length > 0) {
                                                            setActiveSubsection(prevSection.subsections[0].id)
                                                        } else {
                                                            setActiveSubsection(null)
                                                        }
                                                    }
                                                }}
                                                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${filteredSections.findIndex(s => s.id === activeSection) > 0
                                                        ? 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                                                        : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                                    }`}
                                                disabled={filteredSections.findIndex(s => s.id === activeSection) <= 0}
                                            >
                                                <ChevronRight className="h-4 w-4 mr-1 rotate-180" />
                                                Vorheriger Abschnitt
                                            </button>

                                            <button
                                                onClick={() => {
                                                    const currentIndex = filteredSections.findIndex(s => s.id === activeSection)
                                                    if (currentIndex < filteredSections.length - 1) {
                                                        const nextSection = filteredSections[currentIndex + 1]
                                                        setActiveSection(nextSection.id)
                                                        if (nextSection.subsections && nextSection.subsections.length > 0) {
                                                            setActiveSubsection(nextSection.subsections[0].id)
                                                        } else {
                                                            setActiveSubsection(null)
                                                        }
                                                    }
                                                }}
                                                className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${filteredSections.findIndex(s => s.id === activeSection) < filteredSections.length - 1
                                                        ? 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                                                        : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                                    }`}
                                                disabled={filteredSections.findIndex(s => s.id === activeSection) >= filteredSections.length - 1}
                                            >
                                                Nächster Abschnitt
                                                <ChevronRight className="h-4 w-4 ml-1" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default Documentation
