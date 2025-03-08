"use client"

import type React from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { XCircle, RefreshCw, HelpCircle } from 'lucide-react'

const FailedPayment: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a]">
      <Navbar />

      {/* Main Content */}
      <div className="relative overflow-hidden pt-24 pb-8">
        {/* Background Blobs */}
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900/30 rounded-full filter blur-3xl opacity-30"></div>
          <div className="absolute top-60 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-900/30 rounded-full filter blur-3xl opacity-30"></div>
        </div>

        <div className="relative z-10 min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden text-center p-8"
          >
            <div className="h-2 bg-gradient-to-r from-red-500 to-pink-500 absolute top-0 left-0 right-0"></div>
            <div className="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Zahlung fehlgeschlagen</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Leider konnte deine Zahlung nicht abgeschlossen werden. Bitte überprüfe deine Zahlungsinformationen und
              versuche es erneut.
            </p>

            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Mögliche Gründe</h2>
              <ul className="text-left text-gray-600 dark:text-gray-400 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>Unzureichende Deckung auf dem Konto oder der Kreditkarte</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>Falsche Karteninformationen (Nummer, Ablaufdatum, Prüfziffer)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>Die Transaktion wurde von deiner Bank abgelehnt</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>Temporäre Probleme mit unserem Zahlungsdienstleister</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <motion.button
                whileHover={{ y: -3 }}
                onClick={() => navigate("/checkout")}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium transition-all hover:shadow-lg"
              >
                <RefreshCw className="h-5 w-5" />
                <span>Erneut versuchen</span>
              </motion.button>
              <motion.button
                whileHover={{ y: -3 }}
                onClick={() => navigate("/support")}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-medium transition-colors hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                <HelpCircle className="h-5 w-5" />
                <span>Hilfe erhalten</span>
              </motion.button>
            </div>

            <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
              <p>
                Du kannst auch eine andere Zahlungsmethode ausprobieren oder unseren{" "}
                <a href="/support" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Kundensupport
                </a>{" "}
                kontaktieren, wenn du weiterhin Probleme hast.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default FailedPayment
