"use client"

import type React from "react"
import { motion } from "framer-motion"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Shield, Users, MessageSquare, AlertTriangle } from "lucide-react"

const Guidelines: React.FC = () => {
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
              Community-Richtlinien
            </h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Unsere Regeln für ein respektvolles und sicheres Miteinander in LifeVerse.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Introduction */}
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
                <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Unsere Grundwerte</h2>
                <p className="text-gray-600 dark:text-gray-400">Die Basis für eine positive Community-Erfahrung</p>
              </div>
            </div>
            <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-300">
              <p>
                LifeVerse ist ein Ort, an dem Menschen aus aller Welt zusammenkommen, um gemeinsam eine virtuelle
                Gesellschaft zu gestalten. Um sicherzustellen, dass alle Spieler eine positive und bereichernde
                Erfahrung machen können, haben wir diese Richtlinien entwickelt.
              </p>
              <p>
                Wir glauben an Respekt, Inklusion, Kreativität und Fairness. Diese Werte bilden das Fundament unserer
                Community und leiten alle Interaktionen innerhalb von LifeVerse.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Guidelines Sections */}
        <div className="space-y-8">
          {/* Section 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Respektvoller Umgang</h3>
              </div>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  Behandle alle Mitglieder der LifeVerse-Community mit Respekt und Würde, unabhängig von ihrer Herkunft,
                  Identität oder ihrem Spielstil.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Keine Beleidigungen, Hassrede oder Diskriminierung jeglicher Art</li>
                  <li>Respektiere die Privatsphäre anderer Spieler</li>
                  <li>Keine Belästigung oder Stalking anderer Spieler</li>
                  <li>Respektiere unterschiedliche Meinungen und Spielweisen</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Section 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Kommunikation</h3>
              </div>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  Kommunikation ist ein wesentlicher Bestandteil von LifeVerse. Wir erwarten, dass alle Spieler
                  angemessen kommunizieren.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Keine unangemessenen, beleidigenden oder expliziten Inhalte in öffentlichen Chats</li>
                  <li>Keine Spam-Nachrichten oder übermäßige Werbung</li>
                  <li>Keine Verbreitung von Falschinformationen oder Betrug</li>
                  <li>Respektiere die Chatsprache und -regeln in verschiedenen Bereichen des Spiels</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Section 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Fairplay & Wirtschaft</h3>
              </div>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>Die Wirtschaft in LifeVerse basiert auf dem Prinzip des fairen Handels und der ehrlichen Arbeit.</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Keine Ausnutzung von Spielfehlern (Exploits) oder Cheats</li>
                  <li>Keine betrügerischen Handelsaktivitäten oder Täuschung anderer Spieler</li>
                  <li>Keine Manipulation des Marktes durch unfaire Praktiken</li>
                  <li>Keine Verwendung von Drittanbieter-Software, die einen unfairen Vorteil verschafft</li>
                  <li>Keine Echtgeld-Transaktionen außerhalb der offiziellen Kanäle</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Section 4 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Konsequenzen bei Verstößen</h3>
              </div>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>Verstöße gegen diese Richtlinien können je nach Schwere verschiedene Konsequenzen haben:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Warnungen und Ermahnungen</li>
                  <li>Temporäre Einschränkungen bestimmter Spielfunktionen</li>
                  <li>Temporäre Sperrung des Kontos</li>
                  <li>Permanente Sperrung des Kontos bei schwerwiegenden oder wiederholten Verstößen</li>
                </ul>
                <p className="mt-4">
                  Wir behalten uns das Recht vor, diese Maßnahmen nach eigenem Ermessen anzuwenden, um die Integrität
                  und Sicherheit der LifeVerse-Community zu gewährleisten.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reporting Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="px-8 py-10 text-white">
            <h2 className="text-2xl font-bold mb-4">Meldung von Verstößen</h2>
            <p className="mb-6">
              Wenn du einen Verstoß gegen diese Richtlinien beobachtest, bitten wir dich, dies zu melden. Gemeinsam
              können wir LifeVerse zu einem sicheren und angenehmen Ort für alle machen.
            </p>
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <h3 className="font-semibold mb-2">Im Spiel melden</h3>
                <p className="text-blue-100">
                  Nutze die Meldefunktion im Spiel, indem du auf das Profilbild des betreffenden Spielers klickst und
                  "Melden" auswählst.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <h3 className="font-semibold mb-2">Support kontaktieren</h3>
                <p className="text-blue-100">
                  Bei schwerwiegenden Verstößen kannst du auch direkt unseren Support unter support@lifeverse-game.com
                  kontaktieren.
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

export default Guidelines

