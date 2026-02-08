module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],

  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#0f3d2e",
          light: "#145c43",
        },
        gold: {
          DEFAULT: "#c7a14a",
          light: "#e7c873",
        }
      }
    }
  },

  plugins: []
};
