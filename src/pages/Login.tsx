import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../stores/authSlice";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const LOGIN_API_URL = "http://localhost:3001/api/auth/discord";

const Login: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const storedAuth = localStorage.getItem("authState");
        if (storedAuth) {
            const authState = JSON.parse(storedAuth);
            if (authState.isAuthenticated && authState.user) {
                dispatch(login(authState.user));
                navigate(`/profile/${authState?.username}`);
            }
        }
    }, [dispatch, navigate]);

    const handleDiscordLogin = () => {
        setIsLoading(true);
        window.location.href = LOGIN_API_URL;
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const user = urlParams.get("user");
        if (user) {
            const userData = JSON.parse(user);
            localStorage.setItem("authState", JSON.stringify({ isAuthenticated: true, user: userData }));
            dispatch(login(userData));
            navigate(`/profile/${userData?.username}`);
        }
    }, [navigate, dispatch]);

    const balls = Array.from({ length: 10 }, (_, index) => index);

    return (
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Navbar />
            <motion.div
                className="flex flex-col items-center justify-center min-h-screen bg-cover bg-center relative z-0"
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
                        className={`absolute bg-${index % 2 === 0 ? "blue" : "green"}-500 rounded-full z-1`}
                        style={{
                            width: `${Math.random() * 40 + 30}px`,
                            height: `${Math.random() * 40 + 30}px`,
                            top: `${Math.random() * 100 + 10}%`,
                            left: `${Math.random() * 100 + 10}%`,
                        }}
                        animate={{
                            x: [0, 50, -50, 0],
                            y: [0, -50, 50, 0],
                            rotate: [0, 360, 0],
                        }}
                        transition={{
                            duration: Math.random() * 4 + 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: Math.random() * 2,
                        }}
                    />
                ))}

                <motion.div
                    className="absolute bg-yellow-500 w-20 h-20 rounded-lg z-1"
                    style={{
                        top: "20%",
                        left: "40%",
                    }}
                    animate={{
                        x: [0, 30, -30, 0],
                        y: [0, 20, -20, 0],
                        rotate: [0, 360, 0],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5,
                    }}
                />

                <motion.h1
                    className="text-4xl font-extrabold text-red-600 dark:text-red-400 mb-6"
                    initial={{ y: -50 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    Login with Discord
                </motion.h1>

                <form className="flex flex-col items-center space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <motion.button
                        type="button"
                        onClick={handleDiscordLogin}
                        className="bg-primary hover:bg-green-600 px-6 py-3 rounded-lg text-lg"
                        disabled={isLoading}
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        {isLoading ? "Loading..." : "Login via Discord"}
                    </motion.button>
                </form>
            </motion.div>
            <Footer />
        </div>
    );
};

export default Login;
