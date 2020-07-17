const greys = {
  "000": "#fafafa",
  "100": "#f5f5f5",
  "200": "#eeeeee",
  "300": "#e0e0e0",
  "400": "#bdbdbd",
  "500": "#9e9e9e",
  "600": "#757575",
  "700": "#616161",
  "800": "#424242",
  "900": "#212121",
};

module.exports = {
  purge: ["src/**/*.js", "src/**/*.jsx", "src/**/*.ts", "src/**/*.tsx", "public/**/*.html"],
  theme: {
    extend: {
      colors: {
        grey: greys,
        gray: greys,
      },
    },
  },
  variants: {},
  plugins: [],
};
