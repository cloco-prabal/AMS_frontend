/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xsm: "10px",
      },
      backgroundImage: {
        "login-bg-img": "url('/src/assets/login.jpg')",
      },
    },
  },
  plugins: [],
};
