/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F42619",
        secondary: "#F13B2F",
      },
    },
  },
  plugins: [],
};
