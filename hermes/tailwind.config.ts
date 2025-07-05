/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            fontFamily: {
                // Add Satoshi as a custom font family
                satoshi: ['Satoshi', 'system-ui', 'sans-serif'],
            },
            fontWeight: {
                light: '300',
                normal: '400',
                medium: '500',
                bold: '700',
                black: '900',
            }
        },
    },
    plugins: [],
}