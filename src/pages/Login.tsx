import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../stores/authSlice";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const LOGIN_API_URL = "http://localhost:3001/api/auth/discord";

const Login: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const storedAuth = localStorage.getItem('authState');
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
            localStorage.setItem('authState', JSON.stringify({ isAuthenticated: true, user: userData }));
            dispatch(login(userData));
            navigate(`/profile/${userData?.username}`);
        }
    }, [navigate, dispatch]);

    return (
        <div>
            <Navbar />
            <div className="flex flex-col items-center justify-center min-h-screen bg-lightBackground text-lightText dark:bg-darkBackground dark:text-darkText">
                <h1 className="text-4xl font-bold mb-6">Login with Discord</h1>

                <form className="flex flex-col items-center space-y-4" onSubmit={(e) => e.preventDefault()}>
                    <button
                        type="button"
                        onClick={handleDiscordLogin}
                        className="bg-primary hover:bg-green-600 px-6 py-3 rounded-lg text-lg"
                        disabled={isLoading}
                    >
                        {isLoading ? "Loading..." : "Login via Discord"}
                    </button>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default Login;
