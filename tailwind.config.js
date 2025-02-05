const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"], // Adjust based on your project structure
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui"), // Add DaisyUI plugin
  ],
  // daisyui: {
  //   themes: ["light", "dark"], // Configure DaisyUI themes
  // },
});
