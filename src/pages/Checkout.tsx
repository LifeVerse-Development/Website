"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../stores/store";
import { clearCart } from "../stores/cartSlice";
import Footer from "../components/Footer";

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  
  const csrfToken = useSelector((state: RootState) => state.auth.csrfToken);
  const { currency } = useSelector((state: RootState) => state.preferences);
  const cart = useSelector((state: RootState) => state.cart.items);

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const exchangeRates: { [key: string]: number } = {
    EUR: 1,
    USD: 1.1,
    GBP: 0.85,
  };
  const exchangeRate = exchangeRates[currency as keyof typeof exchangeRates] || exchangeRates.EUR;
  const totalPriceInSelectedCurrency = totalPrice * exchangeRate;

  const handlePayment = async () => {
    if (!csrfToken) {
      alert("❌ CSRF-Token fehlt. Bitte lade die Seite neu.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3001/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({
          amount: totalPriceInSelectedCurrency,
          currency,
          cardNumber,
          cardName,
          items: cart,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("✅ Zahlung erfolgreich!");
        dispatch(clearCart());
        navigate("/store");
      } else {
        alert(`❌ Zahlung fehlgeschlagen: ${result.message}`);
      }
    } catch (error) {
      alert("❌ Fehler bei der Zahlungsabwicklung");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">💳 Kasse</h1>

      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">🛍 Bestellübersicht</h2>
        <ul className="mb-4 text-gray-700 dark:text-gray-300">
          {cart.map((item) => (
            <li key={item.id}>
              ✅ {item.name} - {item.price.toFixed(2)} {currency} ({item.quantity}x)
            </li>
          ))}
        </ul>

        <p className="text-lg font-semibold">
          Gesamt: {totalPriceInSelectedCurrency.toFixed(2)} {currency}
        </p>

        <h2 className="text-lg font-semibold mt-4">🔒 Zahlungsinformationen</h2>
        <input
          type="text"
          placeholder="Kreditkartennummer"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          className="w-full mt-2 p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <input
          type="text"
          placeholder="Name auf Karte"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
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
      <Footer />
    </div>
  );
};

export default Checkout;
