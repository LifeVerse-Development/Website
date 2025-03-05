"use client";

import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

interface BlogPost {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
}

const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Willkommen in LifeVerse!",
    description: "Erfahre alles über das kommende 1:1-Spiel zum echten Leben.",
    image: "/images/blog1.jpg",
    date: "05. März 2025",
  },
  {
    id: 2,
    title: "Gameplay-Mechaniken enthüllt",
    description: "Ein detaillierter Blick auf die Spielmechaniken und Features.",
    image: "/images/blog2.jpg",
    date: "20. Februar 2025",
  },
  {
    id: 3,
    title: "Roadmap 2025",
    description: "Was euch in LifeVerse erwartet: Alle geplanten Updates.",
    image: "/images/blog3.jpg",
    date: "10. Januar 2025",
  },
];

const Blog: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />
      <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
        <h1 className="text-3xl font-bold mb-6 text-center">LifeVerse Blog</h1>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer"
              onClick={() => navigate(`/news/${post.id}`)}
            >
              <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{post.date}</p>
                <p className="text-gray-700 dark:text-gray-400 mt-2">{post.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
