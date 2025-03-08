"use client"

import type React from "react"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { startLoading, stopLoading } from "../stores/loadingSlice"
import type { RootState } from "../stores/store"

const LazyLoading: React.FC = () => {
    const dispatch = useDispatch()
    const isLoading = useSelector((state: RootState) => state.loading.isLoading)
    const theme = useSelector((state: RootState) => state.theme.theme)

    useEffect(() => {
        dispatch(startLoading())

        const timer = setTimeout(() => {
            dispatch(stopLoading())
        }, 5000)

        return () => clearTimeout(timer)
    }, [dispatch])

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark")
    }, [theme])

    return (
        <div className={`flex items-center justify-center min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
            <div className="w-full max-w-md mx-auto">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-8">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-full blur-xl bg-gradient-to-r from-blue-400 to-purple-500 dark:from-blue-500 dark:to-purple-600 opacity-30 animate-pulse"></div>
                            <div className="relative">
                                <svg className="w-24 h-24" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="50" cy="50" r="45" fill="none" strokeWidth="8" stroke="currentColor" className="text-gray-200 dark:text-gray-800" />
                                    <path d="M50 5 A45 45 0 0 1 95 50" fill="none" strokeWidth="8" strokeLinecap="round" stroke="currentColor" className="text-blue-600 dark:text-blue-400 animate-spin origin-center" style={{ animationDuration: "1.5s" }} />
                                    <path d="M5 50 A45 45 0 0 1 50 95" fill="none" strokeWidth="8" strokeLinecap="round" stroke="currentColor" className="text-purple-600 dark:text-purple-400 animate-spin origin-center" style={{ animationDuration: "2s", animationDirection: "reverse" }} />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 text-center">
                            <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                                Loading
                            </h3>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">Please wait while we prepare your content</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transform transition-all duration-500 animate-in fade-in slide-in-from-bottom-8">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
                            Content Loaded Successfully
                        </h2>
                        <p className="text-center text-gray-600 dark:text-gray-400">Your content is now ready to view</p>
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-center text-gray-500 dark:text-gray-500">
                                Current theme: <span className="font-medium">{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default LazyLoading
