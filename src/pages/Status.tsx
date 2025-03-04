"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircleIcon, XCircleIcon, ExclamationCircleIcon } from "@heroicons/react/solid";

interface SystemStatus {
  id: number;
  name: string;
  status: "online" | "offline" | "maintenance";
}

const systems: SystemStatus[] = [
  { id: 1, name: "Game Server", status: "online" },
  { id: 2, name: "Authentication", status: "online" },
  { id: 3, name: "Database", status: "maintenance" },
  { id: 4, name: "API Gateway", status: "online" },
  { id: 5, name: "Matchmaking", status: "offline" },
];

const getStatusInfo = (status: SystemStatus["status"]) => {
  switch (status) {
    case "online":
      return { color: "text-green-500", icon: <CheckCircleIcon className="w-6 h-6 text-green-500" /> };
    case "offline":
      return { color: "text-red-500", icon: <XCircleIcon className="w-6 h-6 text-red-500" /> };
    case "maintenance":
      return { color: "text-yellow-500", icon: <ExclamationCircleIcon className="w-6 h-6 text-yellow-500" /> };
    default:
      return { color: "text-gray-500", icon: null };
  }
};

const Status: React.FC = () => {
  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">System Status</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {systems.map((system) => {
          const { color, icon } = getStatusInfo(system.status);
          return (
            <motion.div
              key={system.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 flex items-center justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold">{system.name}</h2>
                <p className={`text-sm ${color}`}>{system.status.toUpperCase()}</p>
              </div>
              {icon}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Status;
