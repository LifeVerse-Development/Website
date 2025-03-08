"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { ChevronDown, ChevronUp, Search } from "lucide-react"

interface FAQItem {
  question: string
  answer: string
  category: string
}

const FAQ: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    if (openItems.includes(index)) {
      setOpenItems(openItems.filter((item) => item !== index))
    } else {
      setOpenItems([...openItems, index])
    }
  }

  const faqItems: FAQItem[] = [
    {
      question: "Was ist LifeVerse?",
      answer:
        "LifeVerse ist ein revolutionäres 1:1-Spiel zum echten Leben, in dem du eine virtuelle Existenz führen kannst. Du kannst verschiedene Karrierewege einschlagen, Beziehungen aufbauen, Eigentum erwerben und vieles mehr - alles in einer detaillierten, immersiven Welt.",
      category: "Allgemein",
    },
    {
      question: "Wie kann ich LifeVerse spielen?",
      answer:
        "LifeVerse ist für Windows, macOS, Android und iOS verfügbar. Du kannst das Spiel von unserer Download-Seite herunterladen und installieren. Nach der Installation musst du ein Konto erstellen oder dich mit deinem bestehenden Konto anmelden.",
      category: "Allgemein",
    },
    {
      question: "Ist LifeVerse kostenlos?",
      answer:
        "LifeVerse bietet ein Freemium-Modell. Du kannst das Grundspiel kostenlos spielen, aber es gibt Premium-Inhalte und -Funktionen, die durch ein Abonnement oder In-App-Käufe freigeschaltet werden können.",
      category: "Abonnement & Zahlungen",
    },
    {
      question: "Wie funktioniert das Wirtschaftssystem in LifeVerse?",
      answer:
        "Das Wirtschaftssystem in LifeVerse basiert auf realen wirtschaftlichen Prinzipien. Du kannst Geld verdienen, indem du arbeitest, Geschäfte gründest, investierst oder handelst. Es gibt verschiedene Währungen und Märkte, die von Angebot und Nachfrage beeinflusst werden.",
      category: "Gameplay",
    },
    {
      question: "Kann ich mein eigenes Unternehmen in LifeVerse gründen?",
      answer:
        "Ja, LifeVerse bietet umfangreiche Möglichkeiten zur Unternehmensgründung. Du kannst aus verschiedenen Branchen wählen, Mitarbeiter einstellen, Produkte oder Dienstleistungen anbieten und dein Unternehmen ausbauen.",
      category: "Gameplay",
    },
    {
      question: "Wie funktionieren Beziehungen in LifeVerse?",
      answer:
        "Beziehungen in LifeVerse sind dynamisch und entwickeln sich basierend auf deinen Interaktionen mit anderen Spielern oder NPCs. Du kannst Freundschaften schließen, romantische Beziehungen eingehen, heiraten und sogar eine Familie gründen.",
      category: "Gameplay",
    },
    {
      question: "Gibt es Seasons oder regelmäßige Updates?",
      answer:
        "Ja, LifeVerse wird regelmäßig mit neuen Inhalten, Features und Verbesserungen aktualisiert. Wir planen vierteljährliche große Updates und kleinere monatliche Updates, um das Spielerlebnis kontinuierlich zu verbessern.",
      category: "Updates & Entwicklung",
    },
    {
      question: "Wie kann ich mein Passwort zurücksetzen?",
      answer:
        "Du kannst dein Passwort zurücksetzen, indem du auf der Anmeldeseite auf 'Passwort vergessen' klickst. Gib deine E-Mail-Adresse ein, und wir senden dir einen Link zum Zurücksetzen deines Passworts.",
      category: "Konto & Profil",
    },
    {
      question: "Kann ich mein Abonnement kündigen?",
      answer:
        "Ja, du kannst dein Abonnement jederzeit in den Kontoeinstellungen kündigen. Die Kündigung wird am Ende deiner aktuellen Abrechnungsperiode wirksam, und du behältst bis dahin Zugriff auf alle Premium-Funktionen.",
      category: "Abonnement & Zahlungen",
    },
    {
      question: "Welche Systemanforderungen hat LifeVerse?",
      answer:
        "Die Systemanforderungen variieren je nach Plattform. Für PC und Mac empfehlen wir mindestens 16 GB RAM, 4 GB VRAM und 50 GB freien Speicherplatz. Für mobile Geräte empfehlen wir neuere Modelle mit mindestens 8 GB RAM und 15 GB freiem Speicherplatz.",
      category: "Technisch",
    },
  ]

  const categories = Array.from(new Set(faqItems.map((item) => item.category)))

  const filteredItems = faqItems.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true
    return matchesSearch && matchesCategory
  })

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
              Häufig gestellte Fragen
            </h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Finde Antworten auf die häufigsten Fragen zu LifeVerse.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mt-10 max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Suche nach Fragen..."
                  className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              </div>
              <div className="flex-shrink-0">
                <select
                  value={selectedCategory || ""}
                  onChange={(e) => setSelectedCategory(e.target.value || null)}
                  className="w-full md:w-auto px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="">Alle Kategorien</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {filteredItems.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredItems.map((item, index) => (
                <div key={index} className="p-6">
                  <button
                    onClick={() => toggleItem(index)}
                    className="flex justify-between items-center w-full text-left"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.question}</h3>
                    <div className="ml-2 flex-shrink-0">
                      {openItems.includes(index) ? (
                        <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      )}
                    </div>
                  </button>
                  {openItems.includes(index) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                      className="mt-4"
                    >
                      <p className="text-gray-600 dark:text-gray-300">{item.answer}</p>
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                          {item.category}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8 text-center">
            <div className="flex justify-center mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Keine Ergebnisse gefunden</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Versuche andere Suchbegriffe oder wähle eine andere Kategorie.
            </p>
            <button
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory(null)
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Filter zurücksetzen
            </button>
          </div>
        )}

        {/* Contact Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-12 md:p-12 text-center">
            <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl mb-4">
              Keine Antwort gefunden?
            </h2>
            <p className="max-w-md mx-auto text-lg text-blue-100 mb-8">
              Kontaktiere unser Support-Team für weitere Hilfe.
            </p>
            <motion.a
              href="/support"
              whileHover={{ y: -3 }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-700 focus:ring-white"
            >
              Zum Support
            </motion.a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default FAQ

