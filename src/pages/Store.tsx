"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { addItem } from "../stores/cartSlice";
import { setQuery } from "../stores/searchSlice";
import { RootState } from "../stores/store";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

const products: Product[] = [
  {
    id: 1,
    name: "LifeVerse Premium Pass",
    description: "Freischaltung exklusiver Features und Belohnungen.",
    price: 29.99,
    image: "/images/product1.jpg",
  },
  {
    id: 2,
    name: "In-Game Währung (10.000 Coins)",
    description: "Nutze Coins für besondere Items und Upgrades.",
    price: 9.99,
    image: "/images/product2.jpg",
  },
  {
    id: 3,
    name: "Exklusive Fahrzeug-Skins",
    description: "Personalisiere dein Fahrzeug mit einzigartigen Designs.",
    price: 4.99,
    image: "/images/product3.jpg",
  },
];

const Store: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchQuery = useSelector((state: RootState) => state.search.query);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const { currency } = useSelector((state: RootState) => state.preferences);

  const exchangeRates: { [key: string]: number } = {
    EUR: 1,
    USD: 1.1,
    GBP: 0.85,
  };

  const exchangeRate = exchangeRates[currency as keyof typeof exchangeRates] || exchangeRates.EUR;

  const filteredProducts = products.map((product) => ({
    ...product,
    priceInSelectedCurrency: product.price * exchangeRate,
  }));

  const addToCart = (product: Product) => {
    dispatch(
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      })
    );
  };

  const goToCart = () => {
    navigate("/cart");
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setQuery(e.target.value));
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <h1 className="text-3xl font-bold mb-6 text-center">LifeVerse Store</h1>

        <div className="mb-6 text-center">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Suche nach Produkten..."
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div className="text-center mb-6">
          <button
            onClick={goToCart}
            className="bg-primary hover:bg-green-600 px-6 py-3 rounded-lg text-lg"
          >
            Zum Warenkorb ({cartItems.length})
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer"
              onClick={() => navigate(`/store/${product.id}`)}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{product.name}</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  {product.priceInSelectedCurrency.toFixed(2)} {currency}
                </p>
                <p className="text-gray-700 dark:text-gray-400 mt-2">{product.description}</p>
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 px-4 py-2 mt-4 rounded-lg text-white"
                >
                  Zum Warenkorb hinzufügen
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Store;
