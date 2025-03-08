import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../stores/authSlice";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const LOGIN_API_URL = "http://localhost:3001/api/auth/discord";

const Login: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const storedAuth = localStorage.getItem("authState");
        if (storedAuth) {
            const authState = JSON.parse(storedAuth);
            if (authState.isAuthenticated && authState.user) {
                dispatch(login(authState));
                navigate(`/profile/${authState.user.username}`);
            }
        }
    }, [dispatch, navigate]);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const userParam = urlParams.get("user");

        if (userParam) {
            try {
                const userData = JSON.parse(decodeURIComponent(userParam));

                const authState = {
                    isAuthenticated: true,
                    user: userData,
                    csrfToken: "",
                };

                localStorage.setItem("authState", JSON.stringify(authState));
                dispatch(login(authState));

                navigate(`/profile/${userData.username}`);
            } catch (error) {
                console.error("Fehler beim Parsen der Benutzerdaten:", error);
            }
        }
    }, [location.search, dispatch, navigate]);

    const handleDiscordLogin = () => {
        setIsLoading(true);
        window.location.href = LOGIN_API_URL;
    };

    return (
        <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-4xl font-bold mb-6">Login with Discord</h1>

                <button
                    type="button"
                    onClick={handleDiscordLogin}
                    className="bg-primary hover:bg-green-600 px-6 py-3 rounded-lg text-lg"
                    disabled={isLoading}
                >
                    {isLoading ? "Loading..." : "Login via Discord"}
                </button>
            </div>
            <Footer />
        </div>
    );
};

export default Login;
