/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#0f172a', // Slate 900 - Deep Navy
                    light: '#1e293b',   // Slate 800 - Lighter Navy
                    dark: '#020617',    // Slate 950 - Darkest Navy
                },
                accent: {
                    DEFAULT: '#dc2626', // Red 600 - Professional Red
                    hover: '#b91c1c',   // Red 700
                },
                background: '#f8fafc', // Slate 50 - Off-white background
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
