import React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Server, Database, Globe, Cpu, Users, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

interface SystemStatus {
  name: string
  status: "operational" | "degraded" | "outage"
  icon: React.ElementType
  lastUpdated: string
}

const Status: React.FC = () => {
  const [systems] = useState<SystemStatus[]>([
    {
      name: "Game Server",
      status: "operational",
      icon: Server,
      lastUpdated: "08.03.2025, 18:30 Uhr",
    },
    {
      name: "Datenbank",
      status: "operational",
      icon: Database,
      lastUpdated: "08.03.2025, 18:30 Uhr",
    },
    {
      name: "API",
      status: "operational",
      icon: Globe,
      lastUpdated: "08.03.2025, 18:30 Uhr",
    },
    {
      name: "Matchmaking",
      status: "degraded",
      icon: Cpu,
      lastUpdated: "08.03.2025, 17:45 Uhr",
    },
    {
      name: "Chat & Soziale Funktionen",
      status: "operational",
      icon: Users,
      lastUpdated: "08.03.2025, 18:30 Uhr",
    },
  ])

  const [overallStatus, setOverallStatus] = useState<"operational" | "degraded" | "outage">("operational")

  useEffect(() => {
    if (systems.some((system) => system.status === "outage")) {
      setOverallStatus("outage")
    } else if (systems.some((system) => system.status === "degraded")) {
      setOverallStatus("degraded")
    } else {
      setOverallStatus("operational")
    }
  }, [systems])

  const getStatusInfo = (status: "operational" | "degraded" | "outage") => {
    switch (status) {
      case "operational":
        return {
          icon: CheckCircle,
          color: "text-green-500",
          bgColor: "bg-green-100 dark:bg-green-900/30",
          label: "Betriebsbereit",
        }
      case "degraded":
        return {
          icon: AlertTriangle,
          color: "text-yellow-500",
          bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
          label: "Beeinträchtigt",
        }
      case "outage":
        return {
          icon: XCircle,
          color: "text-red-500",
          bgColor: "bg-red-100 dark:bg-red-900/30",
          label: "Ausfall",
        }
    }
  }

  // Berechne den Status außerhalb des JSX
  const overallStatusInfo = getStatusInfo(overallStatus)
  const overallStatusIcon = overallStatusInfo.icon
  const overallStatusColor = overallStatusInfo.color
  const overallStatusBgColor = overallStatusInfo.bgColor
  const overallStatusLabel = overallStatusInfo.label

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
              Systemstatus
            </h1>
            <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Überprüfe den aktuellen Status aller LifeVerse-Systeme und -Dienste.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Overall Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-8"
        >
          <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <div className="p-8">
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 ${overallStatusBgColor} rounded-full flex items-center justify-center`}
              >
                {React.createElement(overallStatusIcon, { className: `h-8 w-8 ${overallStatusColor}` })}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  LifeVerse ist {overallStatusLabel}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">Letzte Aktualisierung: 08.03.2025, 18:30 Uhr</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Individual Systems */}
        <div className="space-y-4">
          {systems.map((system, index) => {
            const systemStatusInfo = getStatusInfo(system.status)
            const systemStatusIcon = systemStatusInfo.icon
            const systemStatusColor = systemStatusInfo.color
            const systemStatusBgColor = systemStatusInfo.bgColor
            const systemStatusLabel = systemStatusInfo.label

            return (
              <motion.div
                key={system.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
              >
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 ${systemStatusBgColor} rounded-full flex items-center justify-center`}
                    >
                      {React.createElement(systemStatusIcon, { className: "h-6 w-6 text-gray-700 dark:text-gray-300" })}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{system.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Letzte Aktualisierung: {system.lastUpdated}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                  {React.createElement(systemStatusIcon, { className: "h-6 w-6 text-gray-700 dark:text-gray-300" })}
                    <span className={`text-sm font-medium ${systemStatusColor}`}>
                      {systemStatusLabel}
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Incident History */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Vorfallsverlauf</h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">07.03.2025</span>
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium rounded-full">
                      Gelöst
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Verzögerungen bei Transaktionen
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Einige Benutzer haben Verzögerungen bei In-Game-Transaktionen erlebt. Das Problem wurde
                    identifiziert und behoben.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">02.03.2025</span>
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium rounded-full">
                      Gelöst
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Serverausfall in der EU-Region
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Aufgrund eines Problems bei unserem Hosting-Anbieter kam es zu einem kurzzeitigen Ausfall in der
                    EU-Region. Alle Systeme wurden wiederhergestellt.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Status
