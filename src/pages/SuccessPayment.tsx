"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CheckCircle, Home } from 'lucide-react';

const SuccessPayment: React.FC = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

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
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Zahlung erfolgreich!</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Vielen Dank für deinen Kauf. Deine Transaktion wurde erfolgreich abgeschlossen und dein Konto wurde
              aktualisiert.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <motion.button
                whileHover={{ y: -3 }}
                onClick={() => navigate("/")}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium transition-all hover:shadow-lg"
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
  );
};

export default SuccessPayment;
