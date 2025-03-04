"use client";

import React from "react";

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-gray-900 dark:text-white">About LifeVerse</h1>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
            LifeVerse is a 1:1 real-life simulation game that mirrors real-world experiences with realistic gameplay,
            offering an immersive and unique virtual experience. The game world evolves based on the players' actions,
            and every detail is designed to reflect real-life scenarios.
          </p>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Realistic World</h3>
            <p className="mt-4 text-gray-700 dark:text-gray-300">
              Explore a world where every decision you make impacts the virtual environment in a way that mimics real
              life. From careers to relationships, everything is interconnected.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Interactive Gameplay</h3>
            <p className="mt-4 text-gray-700 dark:text-gray-300">
              Engage with a dynamic economy, advanced AI, and a community of players that will keep the world of
              LifeVerse alive and evolving. Live your life as you choose.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Continuous Updates</h3>
            <p className="mt-4 text-gray-700 dark:text-gray-300">
              LifeVerse will constantly evolve. New features, locations, events, and updates will keep the world fresh
              and exciting for all players.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
