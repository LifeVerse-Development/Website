"use client";

import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Guidelines: React.FC = () => {
  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-4xl w-full shadow-lg"
        >
          <h1 className="text-4xl font-bold mb-4">LifeVerse Guidelines</h1>
          <p className="text-lg mb-6">
            Willkommen bei den LifeVerse-Richtlinien. Hier findest du alle wichtigen Informationen zu den Verhaltensregeln und Standards, die im Spiel zu beachten sind.
          </p>

          <div>
            <h2 className="text-2xl font-semibold mb-2">Allgemeine Verhaltensregeln</h2>
            <ul className="list-disc pl-5 mb-4">
              <li>Respektiere alle anderen Spieler.</li>
              <li>Keine Belästigung oder Diskriminierung jeglicher Art.</li>
              <li>Verhalte dich immer fair und bleibe freundlich.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">Verbote</h2>
            <ul className="list-disc pl-5 mb-4">
              <li>Cheating oder Verwendung von Exploits.</li>
              <li>Verwendung von unangemessener Sprache oder Inhalten.</li>
              <li>Illegale Aktivitäten oder das Hacken von Spielservern.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-2">Konsequenzen bei Verstößen</h2>
            <p className="mb-4">
              Verstöße gegen die Richtlinien können zu Sanktionen führen, darunter:
            </p>
            <ul className="list-disc pl-5">
              <li>Warnungen oder temporäre Sperrungen.</li>
              <li>Permanent bannen im Falle schwerwiegender Verstöße.</li>
            </ul>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Guidelines;
