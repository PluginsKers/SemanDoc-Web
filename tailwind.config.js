/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontSize: {
                'sm': '0.875rem', // 14px
                'base': '1rem', // 16px
                'lg': '1.125rem', // 18px
                'xl': '1.25rem', // 20px
                '2xl': '1.5rem', // 24px
            },
            spacing: {
                '1': '0.25rem', // 4px
                '2': '0.5rem', // 8px
                '3': '0.75rem', // 12px
                '4': '1rem', // 16px
                '5': '1.25rem', // 20px
                '6': '1.5rem', // 24px
                '8': '2rem', // 32px
                '10': '2.5rem', // 40px
            },
            boxShadow: {
                'vercel': '0 4px 14px 0 rgba(0,0,0,0.1)',
            },
            fontFamily: {
                'sans': ['Inter', 'sans-serif'], // Assuming Vercel uses Inter, replace with the actual font stack
            },
        },
    },
    plugins: [],
}
