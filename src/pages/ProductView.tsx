import React from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const products = [
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

const ProductView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === Number(id));

  if (!product) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-gray-900 dark:text-white">
          <p>Produkt nicht gefunden.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <motion.button
          onClick={() => navigate(-1)}
          whileHover={{ scale: 1.05 }}
          className="mb-4 px-4 py-2 bg-gray-800 text-white rounded-lg shadow-md"
        >
          Zurück
        </motion.button>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
          <img src={product.image} alt={product.name} className="w-full h-64 object-cover rounded-lg shadow-md" />
          <h1 className="text-3xl font-bold mt-4">{product.name}</h1>
          <p className="text-gray-600 dark:text-gray-400">{product.price}</p>
          <p className="mt-4 text-gray-700 dark:text-gray-300">{product.description}</p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg shadow-md"
            onClick={() => alert("Kaufprozess gestartet (Dummy)")}
          >
            Kaufen
          </motion.button>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductView;
