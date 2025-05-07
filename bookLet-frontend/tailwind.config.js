/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        web: {
          primary: "#DCF763",
          secondary: "#435058",
          third: "#F1F2EE",
          background: "#fefdf9",
          alert: "#F97300",
          offer: "#F97300",
          discount: "#848C8E",
          normal: "black",
        },
      },
    },
  },
  plugins: [],
};
