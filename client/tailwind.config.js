/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        dmSans: ["Space Mono", "sans-serif"],
      },
    },
    colors: {
      "itheum": {
        "black": "#110528",
        "dark": "#333333",
        "blue": "#51cbd7",
        "orchid": "#dd67dc",
      },
    },
  },
  plugins: [],
};
