/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#fdf3fd', 100: '#f9e5f9', 200: '#f2ccf3', 300: '#e8a4e8',
                    400: '#d96ed9', 500: '#c045bf', 600: '#8D1589', 700: '#741270',
                    800: '#5c0e58', 900: '#450a42',
                },
                gray: {
                    50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db',
                    400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151',
                    800: '#1f2937', 900: '#111827',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Inter', 'system-ui', 'sans-serif'],
            },
            boxShadow: {
                'card': '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
                'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.07)',
                'modal': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
            },
        },
    },
    plugins: [],
};
