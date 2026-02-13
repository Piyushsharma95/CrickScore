/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'p-blue': '#003399',
                'p-blue-light': '#1e56d9',
                'p-blue-bg': '#eef2ff',
                'saffron': '#FF6600',
                'saffron-light': '#ff8533',
                'india-saffron': '#FF9933',
                'india-green': '#138808',
                'india-blue': '#0055A6', // Standard lighter blue for jersey highlights
                'india-blue-dark': '#001D4A', // Deep jersey blue
            },
        },
    },
    plugins: [],
}
