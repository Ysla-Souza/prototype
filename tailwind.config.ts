/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "dice": "url('/image.png')",
      },
      spacing: {
        '20vh': '20vh',
        '30vh': '30vh',
        '35vh': '35vh',
        '40vh': '40vh',
        '80vh': '80vh',
      },
      colors: {
        'gray-whats': '#202C33',
        'green-whats': '#005C4B',
        'prot-light': '#401399',
        'prot-dark': '#1B0349',
      },
    },
  },
  plugins: [],
}
    