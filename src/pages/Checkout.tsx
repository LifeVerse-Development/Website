"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const Checkout: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("✅ Bestellung erfolgreich! (Simuliert)");
      router.push("/store");
    }, 2000);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">💳 Kasse</h1>

      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">🛍 Bestellübersicht</h2>
        <ul className="mb-4 text-gray-700 dark:text-gray-300">
          <li>✅ LifeVerse Premium Pass - 29,99€</li>
          <li>✅ In-Game Währung (10.000 Coins) - 9,99€</li>
        </ul>

        <p className="text-lg font-semibold">Gesamt: 39,98€</p>

        <h2 className="text-lg font-semibold mt-4">🔒 Zahlungsinformationen</h2>
        <input
          type="text"
          placeholder="Kreditkartennummer"
          className="w-full mt-2 p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <input
          type="text"
          placeholder="Name auf Karte"
          className="w-full mt-2 p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md w-full"
          onClick={handlePayment}
          disabled={isLoading}
        >
          {isLoading ? "Verarbeite Zahlung..." : "Jetzt bezahlen"}
        </motion.button>
      </div>
    </div>
  );
};

export default Checkout;
