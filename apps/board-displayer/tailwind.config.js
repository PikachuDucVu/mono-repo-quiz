/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      boxShadow: {
        "custom-inset": "inset 4px 4px 8px 0px rgba(35, 30, 99, 0.59)", // #231E6396 in RGBA format
      },
    },
  },
  plugins: [],
};
