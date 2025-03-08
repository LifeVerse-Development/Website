"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Download, Monitor, Gamepad, CheckCircle, Info, Server, Code, Globe } from 'lucide-react'

interface DownloadOption {
  title: string
  icon: React.ElementType
  description: string
  requirements: string
  version: string
  size: string
  releaseDate: string
  downloadUrl: string
  category: "game" | "software" | "api" | "discord" | "website"
}

const Downloads: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<"all" | "game" | "software" | "api" | "discord" | "website">("all")

  const downloadOptions: DownloadOption[] = [
    // Game Downloads
    {
      title: "Windows",
      icon: Monitor,
      description: "Die vollständige Version von LifeVerse für Windows-PCs.",
      requirements: "Windows 10/11, 16 GB RAM, 4 GB VRAM, 50 GB Speicherplatz",
      version: "1.2.5",
      size: "42.3 GB",
      releaseDate: "05.03.2025",
      downloadUrl: "#windows",
      category: "game"
    },
    {
      title: "macOS",
      icon: Monitor,
      description: "Die vollständige Version von LifeVerse für Mac-Computer.",
      requirements: "macOS 12 oder höher, 16 GB RAM, 4 GB VRAM, 50 GB Speicherplatz",
      version: "1.2.5",
      size: "45.1 GB",
      releaseDate: "05.03.2025",
      downloadUrl: "#macos",
      category: "game"
    },
    {
      title: "Linux",
      icon: Monitor,
      description: "Die vollständige Version von LifeVerse für Linux-Systeme.",
      requirements: "Ubuntu 20.04+, Debian 11+, 16 GB RAM, 4 GB VRAM, 50 GB Speicherplatz",
      version: "1.2.5",
      size: "43.7 GB",
      releaseDate: "05.03.2025",
      downloadUrl: "#linux",
      category: "game"
    },
    
    // Software Downloads
    {
      title: "LifeVerse Creator (Windows)",
      icon: Gamepad,
      description: "Modding-Tool für Windows zum Erstellen eigener Inhalte.",
      requirements: "Windows 10/11, 8 GB RAM, 2 GB VRAM, 10 GB Speicherplatz",
      version: "0.9.2",
      size: "3.2 GB",
      releaseDate: "01.03.2025",
      downloadUrl: "#creator-windows",
      category: "software"
    },
    {
      title: "LifeVerse Creator (macOS)",
      icon: Gamepad,
      description: "Modding-Tool für macOS zum Erstellen eigener Inhalte.",
      requirements: "macOS 12 oder höher, 8 GB RAM, 2 GB VRAM, 10 GB Speicherplatz",
      version: "0.9.2",
      size: "3.5 GB",
      releaseDate: "01.03.2025",
      downloadUrl: "#creator-macos",
      category: "software"
    },
    {
      title: "LifeVerse Creator (Linux)",
      icon: Gamepad,
      description: "Modding-Tool für Linux zum Erstellen eigener Inhalte.",
      requirements: "Ubuntu 20.04+, Debian 11+, 8 GB RAM, 2 GB VRAM, 10 GB Speicherplatz",
      version: "0.9.2",
      size: "3.3 GB",
      releaseDate: "01.03.2025",
      downloadUrl: "#creator-linux",
      category: "software"
    },
    
    // API
    {
      title: "LifeVerse API SDK",
      icon: Code,
      description: "TypeScript/JavaScript SDK für die LifeVerse API.",
      requirements: "Node.js 16+, TypeScript 4.5+",
      version: "2.1.0",
      size: "4.2 MB",
      releaseDate: "28.02.2025",
      downloadUrl: "#api-sdk",
      category: "api"
    },
    
    // Discord Bot
    {
      title: "LifeVerse Discord Bot",
      icon: Server,
      description: "Offizieller Discord Bot für LifeVerse Community-Server.",
      requirements: "Discord Server mit Administratorrechten",
      version: "1.4.2",
      size: "N/A",
      releaseDate: "25.02.2025",
      downloadUrl: "#discord-bot",
      category: "discord"
    },
    
    // Website
    {
      title: "LifeVerse Website Quellcode",
      icon: Globe,
      description: "Quellcode der LifeVerse Website für Entwickler.",
      requirements: "Node.js 16+, React 18+, TypeScript 4.5+",
      version: "3.2.1",
      size: "12.5 MB",
      releaseDate: "20.02.2025",
      downloadUrl: "#website-source",
      category: "website"
    }
  ]

  const filteredOptions = activeCategory === "all" 
    ? downloadOptions 
    : downloadOptions.filter(option => option.category === activeCategory)

  const getCategoryName = (category: string) => {
    switch(category) {
      case "game": return "Spiel";
      case "software": return "Software";
      case "api": return "API";
      case "discord": return "Discord Bot";
      case "website": return "Website";
      default: return "Alle";
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
              LifeVerse herunterladen
            </h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Lade die neueste Version von LifeVerse für deine bevorzugte Plattform herunter und tauche in eine neue Welt ein.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === "all"
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              Alle
            </button>
            <button
              onClick={() => setActiveCategory("game")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === "game"
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              Spiel
            </button>
            <button
              onClick={() => setActiveCategory("software")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === "software"
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              Software
            </button>
            <button
              onClick={() => setActiveCategory("api")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === "api"
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              API
            </button>
            <button
              onClick={() => setActiveCategory("discord")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === "discord"
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              Discord Bot
            </button>
            <button
              onClick={() => setActiveCategory("website")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === "website"
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              Website
            </button>
          </div>
        </div>

        {/* Latest Release Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-12"
        >
          <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Gamepad className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Version 1.2.5 jetzt verfügbar</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Veröffentlicht am 05.03.2025 | Enthält neue Features und Bugfixes
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-600 dark:text-gray-300">Neue Karrieremöglichkeiten im Kreativbereich</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-600 dark:text-gray-300">
                  Verbesserte Grafik und Performance auf allen Plattformen
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-600 dark:text-gray-300">Neue soziale Interaktionsmöglichkeiten</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-600 dark:text-gray-300">Über 100 Bugfixes und Stabilitätsverbesserungen</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Download Options */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
          {activeCategory === "all" ? "Alle Downloads" : `${getCategoryName(activeCategory)} Downloads`}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {filteredOptions.map((option, index) => (
            <motion.div
              key={option.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden"
            >
              <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <option.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{option.title}</h3>
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                        {getCategoryName(option.category)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{option.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Version</p>
                    <p className="font-medium text-gray-900 dark:text-white">{option.version}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Größe</p>
                    <p className="font-medium text-gray-900 dark:text-white">{option.size}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Veröffentlicht</p>
                    <p className="font-medium text-gray-900 dark:text-white">{option.releaseDate}</p>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-3 mb-6">
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Systemanforderungen:</span> {option.requirements}
                  </p>
                </div>
                <motion.a
                  href={option.downloadUrl}
                  whileHover={{ y: -3 }}
                  className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium transition-all hover:shadow-lg"
                >
                  <Download className="h-5 w-5" />
                  <span>Herunterladen</span>
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Technology Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden mb-12"
        >
          <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Info className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Technologie-Informationen</h2>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">LifeVerse Game</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Das LifeVerse Spiel wurde mit der Unreal Engine 5 entwickelt und in C++ programmiert. Es bietet hochmoderne Grafik, 
                  realistische Physik und eine immersive Spielwelt.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">LifeVerse API</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Die LifeVerse API ist in TypeScript mit Express.js geschrieben und ermöglicht Entwicklern den Zugriff auf 
                  Spielfunktionen und -daten über RESTful-Endpunkte.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">LifeVerse Website</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Die LifeVerse Website wurde mit React.js, TypeScript und Tailwind CSS entwickelt und bietet eine 
                  responsive und benutzerfreundliche Oberfläche.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Installation Guide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden"
        >
          <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Info className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Installationsanleitung</h2>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">1. Herunterladen</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Wähle die entsprechende Version für dein Betriebssystem und lade die Installationsdatei herunter.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">2. Installation</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Öffne die heruntergeladene Datei und folge den Anweisungen des Installationsassistenten.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">3. Anmeldung</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Starte LifeVerse und melde dich mit deinem Konto an. Falls du noch kein Konto hast, kannst du direkt in der App eines erstellen.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">4. Spielen</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Nach der Anmeldung kannst du direkt in die Welt von LifeVerse eintauchen und dein neues Leben beginnen!
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}

export default Downloads
