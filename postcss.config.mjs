// Tailwind CSS v4 through PostCSS, so styles compile with both the
// Turbopack and the webpack builders (Liara builds with either).
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
