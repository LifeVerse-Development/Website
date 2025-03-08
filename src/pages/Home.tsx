"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useNavigate, Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Play, Download, Users, Globe, HomeIcon, Briefcase, Car, ShoppingBag, MessageCircle, ChevronRight, Star, ArrowRight } from 'lucide-react'

const Home: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<string>("leben")
  const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 30,
    hours: 12,
    minutes: 45,
    seconds: 0,
  })

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
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
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-teal-300 dark:bg-teal-900/30 rounded-full filter blur-3xl opacity-20"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-32 md:pb-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="text-center lg:text-left">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                    Life
                  </span>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400">
                    Verse
                  </span>
                </h1>
                <p className="mt-6 text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0">
                  Dein Leben, neu definiert. Eine 1:1 Spiegelung der Realität in einer virtuellen Welt.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/login")}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <Play className="h-5 w-5" />
                    <span>Jetzt Spielen</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/downloads")}
                    className="px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-2"
                  >
                    <Download className="h-5 w-5" />
                    <span>Download</span>
                  </motion.button>
                </div>

                <div className="mt-8 flex items-center justify-center lg:justify-start">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <img
                        key={i}
                        src={`https://avatar.iran.liara.run/public?text=${i}`}
                        alt={`User ${i}`}
                        className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800"
                      />
                    ))}
                  </div>
                  <p className="ml-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold text-gray-900 dark:text-white">2.5M+</span> Spieler weltweit
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="/logo.png"
                    alt="LifeVerse Game"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating badges */}
                <div className="absolute -top-6 -right-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">4.9/5</span>
                </div>

                <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">250K+ aktive Spieler</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white dark:bg-gray-800 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Eine Welt voller Möglichkeiten
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              LifeVerse bietet dir eine komplette virtuelle Welt, in der du leben, arbeiten, spielen und dich entfalten
              kannst.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <HomeIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
                title: "Eigenes Zuhause",
                description: "Kaufe, baue und gestalte dein Traumhaus nach deinen Vorstellungen.",
              },
              {
                icon: <Briefcase className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
                title: "Karriere",
                description: "Wähle aus hunderten von Berufen und steige die Karriereleiter hinauf.",
              },
              {
                icon: <Car className="h-6 w-6 text-green-600 dark:text-green-400" />,
                title: "Fahrzeuge",
                description: "Sammle und fahre eine Vielzahl von Fahrzeugen durch die offene Welt.",
              },
              {
                icon: <ShoppingBag className="h-6 w-6 text-amber-600 dark:text-amber-400" />,
                title: "Shopping",
                description: "Kaufe Kleidung, Möbel und Accessoires in virtuellen Geschäften.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Game Modes Section */}
      <div className="py-24 bg-gradient-to-b from-[#f8fafc] to-white dark:from-[#0f172a] dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Entdecke deine Spielweise</h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              LifeVerse bietet verschiedene Modi, die auf deine Spielweise zugeschnitten sind.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex overflow-x-auto">
                {[
                  { id: "leben", label: "Leben" },
                  { id: "karriere", label: "Karriere" },
                  { id: "kreativ", label: "Kreativ" },
                  { id: "abenteuer", label: "Abenteuer" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-4 text-sm font-medium whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {activeTab === "leben" && "Lebe dein virtuelles Leben"}
                    {activeTab === "karriere" && "Baue deine Karriere auf"}
                    {activeTab === "kreativ" && "Entfalte deine Kreativität"}
                    {activeTab === "abenteuer" && "Erlebe spannende Abenteuer"}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {activeTab === "leben" &&
                      "Im Lebensmodus kannst du ein komplettes virtuelles Leben führen. Baue Beziehungen auf, gründe eine Familie, kaufe ein Haus und gestalte deinen Alltag nach deinen Wünschen."}
                    {activeTab === "karriere" &&
                      "Der Karrieremodus konzentriert sich auf deinen beruflichen Werdegang. Starte als Einsteiger und arbeite dich bis an die Spitze. Gründe Unternehmen, investiere in Aktien und werde zum Tycoon."}
                    {activeTab === "kreativ" &&
                      "Im Kreativmodus stehen dir unbegrenzte Ressourcen zur Verfügung. Baue beeindruckende Strukturen, gestalte Landschaften und erschaffe deine eigene Welt ohne Einschränkungen."}
                    {activeTab === "abenteuer" &&
                      "Der Abenteuermodus bietet spannende Quests und Herausforderungen. Erkunde gefährliche Gebiete, löse Rätsel und sammle seltene Gegenstände auf deinen Reisen."}
                  </p>

                  <ul className="space-y-3 mb-8">
                    {activeTab === "leben" &&
                      [
                        "Realistische Lebenssimulation",
                        "Tiefgründige soziale Interaktionen",
                        "Dynamisches Beziehungssystem",
                        "Persönlichkeitsentwicklung",
                      ].map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <ChevronRight className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                          <span className="ml-2 text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}

                    {activeTab === "karriere" &&
                      [
                        "Über 200 verschiedene Berufe",
                        "Wirtschaftssystem mit Aktienmarkt",
                        "Unternehmensgründung und -management",
                        "Skill-basiertes Fortschrittssystem",
                      ].map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <ChevronRight className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                          <span className="ml-2 text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}

                    {activeTab === "kreativ" &&
                      [
                        "Unbegrenzte Ressourcen",
                        "Erweiterte Bau- und Designwerkzeuge",
                        "Teile deine Kreationen mit der Community",
                        "Importiere eigene Designs und Texturen",
                      ].map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <ChevronRight className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                          <span className="ml-2 text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}

                    {activeTab === "abenteuer" &&
                      [
                        "Spannende Hauptstory mit Verzweigungen",
                        "Hunderte von Nebenquests",
                        "Erkundung von Geheimnissen und versteckten Orten",
                        "Sammle einzigartige Gegenstände und Trophäen",
                      ].map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <ChevronRight className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                          <span className="ml-2 text-gray-700 dark:text-gray-300">{feature}</span>
                        </li>
                      ))}
                  </ul>

                  <button
                    onClick={() => navigate(`/modes/${activeTab}`)}
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                  >
                    <span>Mehr erfahren</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="relative">
                  <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={`https://fakeimg.pl/600x400?text=${activeTab}`}
                      alt={`${activeTab} mode`}
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <button className="w-16 h-16 bg-blue-600/90 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors">
                        <Play className="h-6 w-6 text-white ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Community Section */}
      <div className="bg-gradient-to-b from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Werde Teil unserer Community
            </h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Verbinde dich mit Millionen von Spielern weltweit und teile deine LifeVerse-Erfahrungen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden"
            >
              <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Soziale Verbindungen</h3>
                </div>

                <motion.ul variants={containerVariants} className="space-y-4">
                  {[
                    "Finde neue Freunde mit ähnlichen Interessen",
                    "Gründe oder tritt Gilden und Clubs bei",
                    "Organisiere und nimm an Events teil",
                    "Teile deine Erfolge und Kreationen",
                  ].map((item, index) => (
                    <motion.li key={index} variants={itemVariants} className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="ml-2 text-gray-700 dark:text-gray-300">{item}</span>
                    </motion.li>
                  ))}
                </motion.ul>

                <div className="mt-8 grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="aspect-square rounded-lg overflow-hidden">
                      <img
                        src={`https://avatar.iran.liara.run/public?text=${i}`}
                        alt={`Community ${i}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden"
            >
              <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <MessageCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Kommunikation</h3>
                </div>

                <motion.ul variants={containerVariants} className="space-y-4">
                  {[
                    "In-Game Chat mit Spracherkennung",
                    "Privat- und Gruppennachrichten",
                    "Integrierte Videokonferenzen",
                    "Übersetzungsfunktion für globale Kommunikation",
                  ].map((item, index) => (
                    <motion.li key={index} variants={itemVariants} className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                      <span className="ml-2 text-gray-700 dark:text-gray-300">{item}</span>
                    </motion.li>
                  ))}
                </motion.ul>

                <div className="mt-8 bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <div className="flex items-start gap-3 mb-4">
                    <img
                      src="https://avatar.iran.liara.run/public?text=U1"
                      alt="User 1"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="bg-blue-100 dark:bg-blue-900/30 rounded-xl p-3">
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        Hat jemand Lust, heute Abend eine virtuelle Party zu organisieren? 🎉
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Vor 2 Stunden</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <img
                      src="https://avatar.iran.liara.run/public?text=U2"
                      alt="User 2"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="bg-purple-100 dark:bg-purple-900/30 rounded-xl p-3">
                      <p className="text-sm text-gray-800 dark:text-gray-200">
                        Ich bin dabei! Mein virtuelles Haus hat einen neuen Pool! 🏊‍♂️
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Vor 1 Stunde</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden"
            >
              <div className="h-2 bg-gradient-to-r from-green-500 to-teal-500"></div>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <Globe className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Globale Events</h3>
                </div>

                <motion.ul variants={containerVariants} className="space-y-4">
                  {[
                    "Saisonale Festivals und Feiern",
                    "Wöchentliche Community-Challenges",
                    "E-Sport-Turniere mit Preisen",
                    "Virtuelle Konzerte und Kunstausstellungen",
                  ].map((item, index) => (
                    <motion.li key={index} variants={itemVariants} className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="ml-2 text-gray-700 dark:text-gray-300">{item}</span>
                    </motion.li>
                  ))}
                </motion.ul>

                <div className="mt-8">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Nächstes Event: Sommerfestival</h4>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700 dark:text-gray-300">Live in:</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="grid grid-flow-col gap-1 text-center auto-cols-max">
                          <div className="flex flex-col p-1 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                            <span className="font-mono text-sm text-gray-900 dark:text-white">{countdown.days}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Tage</span>
                          </div>
                          <div className="flex flex-col p-1 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                            <span className="font-mono text-sm text-gray-900 dark:text-white">{countdown.hours}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Std</span>
                          </div>
                          <div className="flex flex-col p-1 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                            <span className="font-mono text-sm text-gray-900 dark:text-white">{countdown.minutes}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Min</span>
                          </div>
                          <div className="flex flex-col p-1 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                            <span className="font-mono text-sm text-gray-900 dark:text-white">{countdown.seconds}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">Sek</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button className="w-full py-2 text-sm text-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                      Alle Events anzeigen
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gray-100 dark:bg-gray-900 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Was unsere Spieler sagen</h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Entdecke, warum Millionen von Spielern LifeVerse lieben.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Max Mustermann",
                avatar: "https://avatar.iran.liara.run/public?text=MM",
                role: "Spieler seit 2 Jahren",
                quote:
                  "LifeVerse hat meine Vorstellung von Spielen komplett verändert. Die Detailtiefe und Freiheit sind unglaublich. Ich habe virtuelle Freunde gefunden, die zu echten Freunden wurden.",
              },
              {
                name: "Laura Schmidt",
                avatar: "https://avatar.iran.liara.run/public?text=LS",
                role: "Spieler seit 1 Jahr",
                quote:
                  "Die Möglichkeit, ein zweites Leben zu führen und Dinge auszuprobieren, die im echten Leben nicht möglich sind, ist faszinierend. Ich habe in LifeVerse mein eigenes Restaurant eröffnet!",
              },
              {
                name: "Thomas Weber",
                avatar: "https://avatar.iran.liara.run/public?text=TW",
                role: "Spieler seit 3 Jahren",
                quote:
                  "Die Community ist das Herzstück von LifeVerse. Ich habe an Events teilgenommen, die besser organisiert waren als manche realen Veranstaltungen. Ein absolutes Muss für jeden Gamer.",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden"
              >
                <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 italic">"{testimonial.quote}"</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Download Section */}
      <div className="relative overflow-hidden py-24">
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 dark:bg-purple-900/30 rounded-full filter blur-3xl opacity-30"></div>
          <div className="absolute bottom-20 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-900/30 rounded-full filter blur-3xl opacity-30"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 md:p-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Bereit für dein neues Leben?</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                  Lade LifeVerse jetzt herunter und beginne deine Reise in einer Welt voller Möglichkeiten. Verfügbar
                  für PC, Mac, Konsolen und Mobile.
                </p>

                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate("/downloads")}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    <Download className="h-5 w-5" />
                    <span>Windows PC herunterladen</span>
                  </motion.button>

                  <div className="grid grid-cols-2 gap-4">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate("/downloads")}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-xl transition-all duration-300"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-1-13v8l6-4-6-4z" />
                      </svg>
                      <span>Mac</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => navigate("/downloads")}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-xl transition-all duration-300"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.5 2h-11C5.121 2 4 3.121 4 4.5v15C4 20.879 5.121 22 6.5 22h11c1.379 0 2.5-1.121 2.5-2.5v-15C20 3.121 18.879 2 17.5 2zM12 19c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm6-9H6V5h12v5z" />
                      </svg>
                      <span>Mobile</span>
                    </motion.button>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: "url('https://fakeimg.pl/600x400?text=LifeVerse')",
                    backgroundSize: "cover",
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-8">
                    <h3 className="text-3xl font-bold text-white mb-4">Jetzt spielen</h3>
                    <p className="text-blue-100 mb-8 max-w-md">
                      Über 2,5 Millionen Spieler haben bereits ihr zweites Leben in LifeVerse begonnen. Werde Teil
                      dieser wachsenden Community!
                    </p>
                    <div className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 transition-colors">
                      <a href="/login">
                        Kostenlos starten
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* News Section */}
      <div className="bg-white dark:bg-gray-800 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Neueste Updates</h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Bleibe auf dem Laufenden mit den neuesten Entwicklungen und Updates für LifeVerse.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                id: 1,
                title: "Neues Sommerupdate: Strandleben",
                date: "15. Juli 2023",
                image: "https://fakeimg.pl/600x400?text=Summer",
                excerpt: "Entdecke neue Strandaktivitäten, Wassersport und Sommerfestivals in unserem neuesten Update.",
              },
              {
                id: 2,
                title: "Karriere-Erweiterung: Kreative Berufe",
                date: "2. Juni 2023",
                image: "https://fakeimg.pl/600x400?text=Careers",
                excerpt:
                  "Werde Künstler, Designer, Musiker oder Schriftsteller mit unserer neuen Erweiterung für kreative Karrieren.",
              },
              {
                id: 3,
                title: "Community-Event: Virtuelles Konzert",
                date: "28. Mai 2023",
                image: "https://fakeimg.pl/600x400?text=Concert",
                excerpt:
                  "Nimm am größten virtuellen Konzert des Jahres teil, mit Live-Auftritten echter Künstler in LifeVerse.",
              },
            ].map((news, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-700 rounded-2xl shadow-md overflow-hidden"
              >
                <div className="h-48 overflow-hidden">
                  <img src={news.image || "/placeholder.svg"} alt={news.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">{news.date}</p>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{news.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{news.excerpt}</p>
                  <button className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                    <a href={`/news/${news.id}`}>
                      Weiterlesen →
                    </a>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button className="px-6 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-xl shadow-md hover:shadow-lg border border-gray-200 dark:border-gray-600 transition-all">
              <a href="/news">
                Alle News anzeigen
              </a>
            </button>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 dark:bg-gray-900 py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Häufig gestellte Fragen</h2>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Finde Antworten auf die häufigsten Fragen zu LifeVerse.
            </p>
          </div>

          <div className="space-y-6">
            <Link
              to="/faq"
              className="block bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Häufig gestellte Fragen ansehen
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Klicke hier, um die FAQ-Seite zu sehen.</p>
              </div>
            </Link>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">Noch Fragen? Kontaktiere unser Support-Team.</p>
            <Link
              to="/contact"
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Kontakt aufnehmen
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Bereit, dein zweites Leben zu beginnen?</h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10">
            Tritt der LifeVerse-Community bei und erlebe eine Welt voller Möglichkeiten.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/register")}
              className="px-8 py-4 bg-white text-blue-600 font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Play className="h-5 w-5" />
              <span><a href="/login">Jetzt Spielen</a></span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/download")}
              className="px-8 py-4 bg-blue-700 bg-opacity-30 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border border-white border-opacity-30 hover:bg-opacity-40 flex items-center justify-center gap-2"
            >
              <Download className="h-5 w-5" />
              <span><a href="/downloads">Download</a></span>
            </motion.button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Home
