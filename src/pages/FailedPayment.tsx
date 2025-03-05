"use client";

import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const FailedPayment: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-red-50 dark:bg-red-900 text-red-900 dark:text-red-100 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md text-center shadow-lg"
      >
        <h1 className="text-4xl font-bold mb-4">❌ Zahlung Fehlgeschlagen</h1>
        <p className="text-lg mb-4">Etwas ist schiefgelaufen bei der Zahlung. Bitte versuche es erneut oder kontaktiere den Support.</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow-md"
          onClick={() => navigate("/cart")}
        >
          Zurück zum Warenkorb
        </motion.button>
      </motion.div>
      <Footer />
    </div>
  );
};

export default FailedPayment;
