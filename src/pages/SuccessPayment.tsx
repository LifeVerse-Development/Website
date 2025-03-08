"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { CheckCircle, Download, Home } from 'lucide-react'

const SuccessPayment: React.FC = () => {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          navigate("/")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [navigate])

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a]">
      <Navbar />

      {/* Main Content */}
      <div className="relative overflow-hidden pt-24 pb-12">
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
            <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500 absolute top-0 left-0 right-0"></div>
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Zahlung erfolgreich!</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Vielen Dank für deinen Kauf. Deine Transaktion wurde erfolgreich abgeschlossen und dein Konto wurde
              aktualisiert.
            </p>

            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Bestellübersicht</h2>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400">Produkt:</span>
                <span className="font-medium text-gray-900 dark:text-white">LifeVerse Premium (1 Jahr)</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400">Betrag:</span>
                <span className="font-medium text-gray-900 dark:text-white">59,99 €</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400">Bestellnummer:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  LV-{Math.floor(Math.random() * 1000000)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Datum:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {new Date().toLocaleDateString("de-DE")}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <motion.button
                whileHover={{ y: -3 }}
                onClick={() => navigate("/downloads")}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium transition-all hover:shadow-lg"
              >
                <Download className="h-5 w-5" />
                <span>Jetzt herunterladen</span>
              </motion.button>
              <motion.button
                whileHover={{ y: -3 }}
                onClick={() => navigate("/")}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-medium transition-colors hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                <Home className="h-5 w-5" />
                <span>Zur Startseite</span>
              </motion.button>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Du wirst in {countdown} Sekunden automatisch zur Startseite weitergeleitet.
            </p>

            <div className="mt-8 text-sm text-gray-600 dark:text-gray-400">
              <p>
                Eine Bestätigung wurde an deine E-Mail-Adresse gesendet. Bei Fragen kontaktiere bitte unseren{" "}
                <a href="/support" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Kundensupport
                </a>
                .
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default SuccessPayment
