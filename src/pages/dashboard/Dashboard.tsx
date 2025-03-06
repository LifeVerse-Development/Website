"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import ThemeToggle from "../../components/ThemeToggle";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Example data for the chart
  const data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Sales",
        data: [65, 59, 80, 81, 56, 55, 40],
        borderColor: "#4CAF50",
        backgroundColor: "rgba(76, 175, 80, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <motion.aside
        initial={{ opacity: 0, x: -200 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className={`w-64 bg-white dark:bg-gray-800 shadow-md p-4 ${isSidebarOpen ? "block" : "hidden"} md:block`}
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Dashboard</h2>
        <nav>
          <ul>
            <li>
              <a href="/" className="block py-2 px-4 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">
                Overview
              </a>
            </li>
            <li>
              <a href="/" className="block py-2 px-4 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">
                Sales
              </a>
            </li>
            <li>
              <a href="/" className="block py-2 px-4 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">
                Reports
              </a>
            </li>
            <li>
              <a href="/" className="block py-2 px-4 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">
                Settings
              </a>
            </li>
          </ul>
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <motion.header
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 p-4 shadow-md flex justify-between items-center"
        >
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden text-gray-800 dark:text-gray-200 p-2 rounded-full"
          >
            {isSidebarOpen ? <ChevronLeftIcon className="w-6 h-6" /> : <ChevronRightIcon className="w-6 h-6" />}
          </button>

          <div className="flex items-center space-x-4">
            <span className="font-semibold text-lg text-gray-900 dark:text-white">Dashboard</span>
            <button className="bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700">
              <ChevronDownIcon className="w-5 h-5" />
            </button>
          </div>
          <ThemeToggle />
        </motion.header>

        {/* Main Content Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: Sales Overview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Sales Overview</h3>
              <Line data={data} options={options} />
            </motion.div>

            {/* Card 2: Active Users */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Active Users</h3>
              <div className="text-4xl text-center font-bold text-green-500">1,234</div>
            </motion.div>

            {/* Card 3: Revenue */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Revenue</h3>
              <div className="text-4xl text-center font-bold text-blue-500">$45,678</div>
            </motion.div>
          </div>

          {/* Reports Section */}
          <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Latest Reports</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg text-gray-900 dark:text-white">Monthly Report</span>
                <button className="bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700">
                  <ChevronDownIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-lg text-gray-900 dark:text-white">Annual Report</span>
                <button className="bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700">
                  <ChevronDownIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-lg text-gray-900 dark:text-white">User Growth Report</span>
                <button className="bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700">
                  <ChevronDownIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
