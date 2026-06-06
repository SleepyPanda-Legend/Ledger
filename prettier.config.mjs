/**
 * Prettier config — keeps code style consistent across the team.
 * tailwindcss plugin auto-sorts Tailwind class names on save.
 */
/** @type {import("prettier").Config} */
const config = {
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  printWidth: 100,
  plugins: ["prettier-plugin-tailwindcss"],
};

export default config;
