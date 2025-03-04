"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "LifeVerse Premium Pass",
    description: "Freischaltung exklusiver Features und Belohnungen.",
    price: "29,99€",
    image: "/images/product1.jpg",
  },
  {
    id: 2,
    name: "In-Game Währung (10.000 Coins)",
    description: "Nutze Coins für besondere Items und Upgrades.",
    price: "9,99€",
    image: "/images/product2.jpg",
  },
  {
    id: 3,
    name: "Exklusive Fahrzeug-Skins",
    description: "Personalisiere dein Fahrzeug mit einzigartigen Designs.",
    price: "4,99€",
    image: "/images/product3.jpg",
  },
];

const Store: React.FC = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">LifeVerse Store</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer"
            onClick={() => router.push(`/store/${product.id}`)}
          >
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-gray-600 dark:text-gray-300">{product.price}</p>
              <p className="text-gray-700 dark:text-gray-400 mt-2">{product.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Store;
