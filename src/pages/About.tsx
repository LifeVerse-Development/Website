"use client"

import type React from "react"
import { motion } from "framer-motion"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Users, Code, Rocket, Heart } from "lucide-react"

const About: React.FC = () => {
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
              Über LifeVerse
            </h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Entdecke die Geschichte und Vision hinter dem revolutionären 1:1-Spiel zum echten Leben.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-12"
        >
          <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Unsere Geschichte</h2>
            <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-300">
              <p>
                LifeVerse entstand aus einer einfachen Idee: Was wäre, wenn wir ein Spiel erschaffen könnten, das das
                echte Leben in all seinen Facetten nachbildet, aber gleichzeitig die Grenzen der Realität überwindet?
              </p>
              <p>
                Im Jahr 2023 begann ein kleines Team von Entwicklern und Visionären mit der Arbeit an diesem
                ambitionierten Projekt. Unser Ziel war es, eine virtuelle Welt zu schaffen, die so detailliert und
                immersiv ist, dass sie sich wie eine Erweiterung des echten Lebens anfühlt - mit all seinen
                Herausforderungen, Möglichkeiten und Überraschungen.
              </p>
              <p>
                Nach zwei Jahren intensiver Entwicklung und zahlreichen Iterationen sind wir stolz darauf, LifeVerse der
                Welt vorzustellen - ein Spiel, das die Grenzen zwischen virtueller und realer Welt verschwimmen lässt.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Vision Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-12"
        >
          <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Unsere Vision</h2>
            <div className="prose prose-lg max-w-none text-gray-600 dark:text-gray-300">
              <p>
                Wir glauben, dass Spiele mehr sein können als nur Unterhaltung. Sie können Plattformen für
                Selbstentfaltung, soziale Verbindungen und sogar wirtschaftliche Möglichkeiten sein.
              </p>
              <p>Mit LifeVerse wollen wir eine Welt schaffen, in der Spieler:</p>
              <ul>
                <li>Verschiedene Lebenswege erkunden können, ohne reale Konsequenzen</li>
                <li>Neue Fähigkeiten erlernen, die auch im echten Leben nützlich sind</li>
                <li>Bedeutungsvolle Beziehungen zu anderen Spielern aufbauen können</li>
                <li>Eine virtuelle Wirtschaft erleben, die auf realen wirtschaftlichen Prinzipien basiert</li>
                <li>Kreativität und Innovation in einer grenzenlosen Umgebung ausleben können</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Team Section */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Unser Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[
            { name: "Anna Schmidt", role: "Gründerin & CEO", icon: Users },
            { name: "Markus Weber", role: "Technischer Direktor", icon: Code },
            { name: "Laura Müller", role: "Kreativdirektorin", icon: Rocket },
            { name: "Thomas Becker", role: "Community Manager", icon: Heart },
          ].map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden text-center"
            >
              <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              <div className="p-6">
                <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <member.icon className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{member.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="px-8 py-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Unsere Werte</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">Innovation</h3>
                <p className="text-blue-100">
                  Wir streben danach, die Grenzen dessen zu erweitern, was in virtuellen Welten möglich ist, indem wir
                  neue Technologien und kreative Ideen einsetzen.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">Gemeinschaft</h3>
                <p className="text-blue-100">
                  Wir glauben an die Kraft der Gemeinschaft und schaffen Räume, in denen Menschen zusammenkommen, teilen
                  und gemeinsam wachsen können.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">Authentizität</h3>
                <p className="text-blue-100">
                  Wir streben danach, echte und bedeutungsvolle Erfahrungen zu schaffen, die die Komplexität und
                  Schönheit des Lebens widerspiegeln.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-3">Zugänglichkeit</h3>
                <p className="text-blue-100">
                  Wir setzen uns dafür ein, dass LifeVerse für Menschen aller Hintergründe und Fähigkeiten zugänglich
                  ist.
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

export default About

