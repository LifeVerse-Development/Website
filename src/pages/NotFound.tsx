import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const NotFound: React.FC = () => {
    const balls = Array.from({ length: 10 }, (_, index) => index);

    return (
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Navbar />
            <motion.div
                className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center relative"
                style={{
                    backgroundImage: 'url("/path/to/your/background-image.jpg")',
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                {balls.map((_, index) => (
                    <motion.div
                        key={index}
                        className={`absolute bg-${index % 2 === 0 ? 'blue' : 'green'}-500 rounded-full`}
                        style={{
                            width: `${Math.random() * 30 + 20}px`,
                            height: `${Math.random() * 30 + 20}px`,
                            top: `${Math.random() * 100 + 10}%`,
                            left: `${Math.random() * 100 + 10}%`,
                        }}
                        animate={{
                            x: [0, 50, 0],
                            y: [0, -50, 0],
                            rotate: [0, 360, 0],
                        }}
                        transition={{
                            duration: Math.random() * 4 + 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: Math.random() * 2,
                        }}
                    />
                ))}

                <motion.h1
                    className="text-6xl font-extrabold text-red-600 dark:text-red-400"
                    initial={{ y: -50 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    404 - Page Not Found
                </motion.h1>
                <motion.p
                    className="text-gray-600 dark:text-gray-400 mt-4 text-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                >
                    Oops! The page you are looking for does not exist.
                </motion.p>
                <motion.div
                    className="mt-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.4, ease: "easeInOut" }}
                >
                    <Link to="/" className="text-blue-500 hover:underline text-lg font-semibold dark:text-blue-300">
                        Go back to Home
                    </Link>
                </motion.div>
            </motion.div>
            <Footer />
        </div>
    );
};

export default NotFound;
