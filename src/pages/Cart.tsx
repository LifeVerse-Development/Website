"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../stores/store";
import { updateQuantity, removeItem, clearCart } from "../stores/cartSlice";
import { motion } from "framer-motion";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const Cart: React.FC = () => {
  const cart = useSelector((state: RootState) => state.cart.items);
  const { currency } = useSelector((state: RootState) => state.preferences);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const updateQuantityHandler = (id: number, amount: number) => {
    dispatch(updateQuantity({ id, amount }));
  };

  const removeItemHandler = (id: number) => {
    dispatch(removeItem({ id }));
  };

  const clearCartHandler = () => {
    dispatch(clearCart());
  };

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const exchangeRates: { [key: string]: number } = {
    EUR: 1,
    USD: 1.1,
    GBP: 0.85,
  };

  const exchangeRate = exchangeRates[currency as keyof typeof exchangeRates] || exchangeRates.EUR;
  const totalPriceInSelectedCurrency = totalPrice * exchangeRate;

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">🛒 Dein Warenkorb</h1>

      {cart.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">Dein Warenkorb ist leer.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 flex items-center shadow-md"
              >
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                <div className="ml-4 flex-1">
                  <h2 className="text-lg font-semibold">{item.name}</h2>
                  <p className="text-gray-600 dark:text-gray-300">{item.price.toFixed(2)} {currency}</p>
                </div>
                <div className="flex items-center">
                  <button
                    className="px-3 py-1 bg-gray-800 text-white rounded-md mx-1"
                    onClick={() => updateQuantityHandler(item.id, -1)}
                  >
                    ➖
                  </button>
                  <span className="text-lg mx-2">{item.quantity}</span>
                  <button
                    className="px-3 py-1 bg-gray-800 text-white rounded-md mx-1"
                    onClick={() => updateQuantityHandler(item.id, 1)}
                  >
                    ➕
                  </button>
                  <button
                    className="ml-4 text-red-500"
                    onClick={() => removeItemHandler(item.id)}
                  >
                    ❌
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 text-right">
            <p className="text-lg font-semibold">
              Gesamt: {totalPriceInSelectedCurrency.toFixed(2)} {currency}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="m-4 px-6 py-3 bg-red-600 text-white font-bold rounded-lg shadow-md"
              onClick={clearCartHandler}
            >
              Warenkorb leeren
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md"
              onClick={() => navigate("/checkout")}
            >
              Zur Kasse
            </motion.button>
          </div>
        </>
      )}
      <Footer />
    </div>
  );
};

export default Cart;
