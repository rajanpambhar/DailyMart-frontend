/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // DailyMart brand colors
                primary: {
                    50: '#e6f9ff',
                    100: '#ccf3ff',
                    200: '#99e8ff',
                    300: '#66dcff',
                    400: '#33d1ff',
                    500: '#33ccff', // Main brand color
                    600: '#29a3cc',
                    700: '#1f7a99',
                    800: '#145266',
                    900: '#0a2933',
                },
                secondary: {
                    50: '#e8fbf5',
                    100: '#d1f7eb',
                    200: '#a3efd7',
                    300: '#75e7c3',
                    400: '#5de4c7', // Accent color
                    500: '#47dfaf',
                    600: '#39b38c',
                    700: '#2b8669',
                    800: '#1d5a46',
                    900: '#0e2d23',
                },
                dark: {
                    50: '#f5f5f5',
                    100: '#e0e0e0',
                    200: '#b3b3b3',
                    300: '#888888',
                    400: '#666666',
                    500: '#444444',
                    600: '#333333',
                    700: '#1e1e1e', // Main background
                    800: '#141414',
                    900: '#0a0a0a',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
                'spin-slow': 'spin 3s linear infinite',
                'typewriter': 'typewriter 2s steps(40) 1s 1 normal both',
            },
            keyframes: {
                typewriter: {
                    '0%': { width: '0%' },
                    '100%': { width: '100%' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
};
