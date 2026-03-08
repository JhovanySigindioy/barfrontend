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
                primary: {
                    DEFAULT: '#ffbf00',
                    50: '#fff9e6',
                    100: '#fff0b3',
                    200: '#ffe680',
                    300: '#ffdb4d',
                    400: '#ffd11a',
                    500: '#ffbf00',
                    600: '#cca300',
                    700: '#997a00',
                    800: '#665200',
                    900: '#332900',
                },
                background: {
                    light: '#f8f8f5',
                    dark: '#1a1608',
                },
                success: '#10b981',
                card: {
                    dark: 'rgba(35, 30, 15, 0.7)',
                }
            },
            borderRadius: {
                'lg': '1rem',
                'xl': '1.5rem',
                '2xl': '2rem',
            }
        },
    },
    plugins: [],
}
