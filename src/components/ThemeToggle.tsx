import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme, setTheme } from '../stores/themeSlice';
import { RootState } from '../stores/store';

const ThemeToggle: React.FC = () => {
    const dispatch = useDispatch();
    const theme = useSelector((state: RootState) => state.theme.theme);

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;

        if (storedTheme && storedTheme !== theme) {
            dispatch(setTheme(storedTheme));
        }
    }, [dispatch, theme]);

    useEffect(() => {
        if (theme) {
            localStorage.setItem('theme', theme);

            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }, [theme]);

    const handleThemeToggle = () => {
        dispatch(toggleTheme());
    };

    return (
        <button
            onClick={handleThemeToggle}
            className="p-2 rounded-md focus:outline-none bg-primary text-lightText dark:bg-secondary dark:text-darkText"
        >
            {theme === 'light' ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6 text-gray-800 dark:text-gray-300"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 3v3m0 12v3m9-9h-3m-12 0H3m7.293-7.293a1 1 0 011.414 0l1.086 1.086m0 10.586a1 1 0 01-1.414 0l-1.086-1.086m6.364-6.364a1 1 0 000 1.414l1.086 1.086m-10.586 0a1 1 0 000-1.414L5.636 8.05"
                    />
                </svg>
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6 text-yellow-500"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 3v3m0 12v3m9-9h-3m-12 0H3m7.293-7.293a1 1 0 011.414 0l1.086 1.086m0 10.586a1 1 0 01-1.414 0l-1.086-1.086m6.364-6.364a1 1 0 000 1.414l1.086 1.086m-10.586 0a1 1 0 000-1.414L5.636 8.05"
                    />
                </svg>
            )}
        </button>
    );
};

export default ThemeToggle;
