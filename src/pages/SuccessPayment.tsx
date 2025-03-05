"use client";

import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import Footer from "../components/Footer";

const SuccessPayment: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-green-50 dark:bg-green-900 text-green-900 dark:text-green-100 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md text-center shadow-lg"
      >
        <h1 className="text-4xl font-bold mb-4">✅ Zahlung Erfolgreich</h1>
        <p className="text-lg mb-4">Deine Bestellung wurde erfolgreich verarbeitet! Vielen Dank für deinen Kauf.</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition"
          onClick={() => navigate("/store")}
        >
          Zurück zum Store
        </motion.button>
      </motion.div>
      <Footer />
    </div>
  );
};

export default SuccessPayment;
