"use client";

import React from "react";
import { motion } from "framer-motion";

interface DownloadItem {
  id: number;
  name: string;
  version: string;
  description: string;
  url: string;
}

const downloads: DownloadItem[] = [
  {
    id: 1,
    name: "LifeVerse für Windows",
    version: "v1.0.0",
    description: "Die neueste Version von LifeVerse für Windows.",
    url: "/downloads/lifeverse-windows.zip",
  },
  {
    id: 2,
    name: "LifeVerse für macOS",
    version: "v1.0.0",
    description: "Die neueste Version von LifeVerse für macOS.",
    url: "/downloads/lifeverse-macos.dmg",
  },
  {
    id: 3,
    name: "LifeVerse für Linux",
    version: "v1.0.0",
    description: "Die neueste Version von LifeVerse für Linux.",
    url: "/downloads/lifeverse-linux.tar.gz",
  },
];

const Downloads: React.FC = () => {
  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Downloads</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {downloads.map((download) => (
          <motion.div
            key={download.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold">{download.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Version: {download.version}</p>
            <p className="mt-2 text-gray-700 dark:text-gray-300">{download.description}</p>
            <a
              href={download.url}
              download
              className="mt-4 inline-block bg-blue-600 dark:bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-400 transition"
            >
              Download
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Downloads;
