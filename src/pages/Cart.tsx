"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const initialCart: CartItem[] = [
  { id: 1, name: "LifeVerse Premium Pass", price: 29.99, image: "/images/product1.jpg", quantity: 1 },
  { id: 2, name: "In-Game Währung (10.000 Coins)", price: 9.99, image: "/images/product2.jpg", quantity: 2 },
];

const Cart: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>(initialCart);
  const router = useRouter();

  const updateQuantity = (id: number, amount: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + amount } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

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
                  <p className="text-gray-600 dark:text-gray-300">{item.price.toFixed(2)}€</p>
                </div>
                <div className="flex items-center">
                  <button
                    className="px-3 py-1 bg-gray-800 text-white rounded-md mx-1"
                    onClick={() => updateQuantity(item.id, -1)}
                  >
                    ➖
                  </button>
                  <span className="text-lg mx-2">{item.quantity}</span>
                  <button
                    className="px-3 py-1 bg-gray-800 text-white rounded-md mx-1"
                    onClick={() => updateQuantity(item.id, 1)}
                  >
                    ➕
                  </button>
                  <button
                    className="ml-4 text-red-500"
                    onClick={() => removeItem(item.id)}
                  >
                    ❌
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 text-right">
            <p className="text-lg font-semibold">Gesamt: {totalPrice.toFixed(2)}€</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md"
              onClick={() => router.push("/checkout")}
            >
              Zur Kasse
            </motion.button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
