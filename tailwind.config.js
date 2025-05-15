/* https://tailwindcss.com/docs/installation/using-vite */
/* USE THIS LINK TO SET UP TAILWIND CSS STYLE TO THE PROJECT */


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
   theme: {
      extend: {
         fontFamily: {
            'noto-sans-malayalam': ['Noto Sans Malayalam', 'Kartika', 'sans-serif'],
            merriweather: ['Merriweather', 'Times New Roman', 'serif'],
         },
      },
   },
   plugins: [],
   darkMode: 'class', // Enables dark mode with 'dark' class
}
