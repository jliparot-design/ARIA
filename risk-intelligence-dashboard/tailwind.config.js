/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#006CD0',
        'primary-blue-dark': '#054886',
        'matrix-red':'#E10000',
        'matrix-yellow':'#F89500',
        'matrix-green':'#008F0E',
      },
      fontFamily:{
        'primary': ['"Jura"', 'sans-serif'],
        'secondary': ['"Jaldi"', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
};
