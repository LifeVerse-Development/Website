"use client";

import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const blogPosts = [
  {
    id: 1,
    title: "Willkommen in LifeVerse!",
    content: "LifeVerse ist das erste 1:1-Spiel, das das echte Leben vollständig simuliert. In diesem Artikel erfährst du alles über unser revolutionäres Konzept.",
    image: "/images/blog1.jpg",
    date: "05. März 2025",
  },
  {
    id: 2,
    title: "Gameplay-Mechaniken enthüllt",
    content: "In LifeVerse kannst du arbeiten, studieren, Freunde treffen und sogar eine Familie gründen. Hier erfährst du, wie unser Real-Life-Gameplay funktioniert.",
    image: "/images/blog2.jpg",
    date: "20. Februar 2025",
  },
  {
    id: 3,
    title: "Roadmap 2025",
    content: "Unsere Roadmap für 2025 zeigt dir alle geplanten Features, darunter Immobilien, Unternehmen und sogar eine Wirtschaftssimulation!",
    image: "/images/blog3.jpg",
    date: "10. Januar 2025",
  },
];

const BlogView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const post = blogPosts.find((p) => p.id === Number(id));

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-900 dark:text-white">
        <p>Artikel nicht gefunden.</p>
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
          <img src={post.image} alt={post.title} className="w-full h-64 object-cover rounded-lg shadow-md" />
          <h1 className="text-3xl font-bold mt-4">{post.title}</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{post.date}</p>
          <p className="mt-4 text-gray-700 dark:text-gray-300">{post.content}</p>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogView;
