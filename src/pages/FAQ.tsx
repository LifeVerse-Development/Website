"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  { id: 1, question: "Was ist LifeVerse?", answer: "LifeVerse ist ein 1:1 Spiel zum echten Leben.", category: "Allgemein" },
  { id: 2, question: "Wie kann ich spielen?", answer: "Das Spiel ist aktuell in Entwicklung.", category: "Allgemein" },
  { id: 3, question: "Gibt es ein Wirtschaftssystem?", answer: "Ja, LifeVerse hat eine realistische Wirtschaft.", category: "Features" },
  { id: 4, question: "Ist LifeVerse kostenlos?", answer: "Es gibt eine kostenlose Version mit optionalen Inhalten.", category: "Zahlungen" },
  { id: 5, question: "Wie kann ich das Spiel unterstützen?", answer: "Du kannst das Projekt über Patreon unterstützen.", category: "Community" },
];

const categories = [...new Set(faqData.map((item) => item.category))];

const FAQ: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  return (
    <div className="min-h-screen flex">
      {/* Seitenleiste */}
      <aside className="w-64 p-4 bg-gray-100 dark:bg-gray-800 shadow-lg hidden md:block">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Kategorien</h2>
        <ul>
          <li
            onClick={() => setSelectedCategory(null)}
            className={`cursor-pointer p-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 ${
              selectedCategory === null ? "bg-gray-300 dark:bg-gray-700" : ""
            }`}
          >
            Alle anzeigen
          </li>
          {categories.map((category) => (
            <li
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`cursor-pointer p-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 ${
                selectedCategory === category ? "bg-gray-300 dark:bg-gray-700" : ""
              }`}
            >
              {category}
            </li>
          ))}
        </ul>
      </aside>

      {/* Hauptbereich */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Häufig gestellte Fragen</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {faqData
            .filter((faq) => (selectedCategory ? faq.category === selectedCategory : true))
            .map((faq) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md"
              >
                <button
                  onClick={() => setExpandedItem(expandedItem === faq.id ? null : faq.id)}
                  className="w-full text-left font-medium text-gray-900 dark:text-white flex justify-between"
                >
                  {faq.question}
                  {expandedItem === faq.id ? "▲" : "▼"}
                </button>
                {expandedItem === faq.id && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-gray-600 dark:text-gray-400">
                    {faq.answer}
                  </motion.div>
                )}
              </motion.div>
            ))}
        </div>
      </main>
    </div>
  );
};

export default FAQ;
