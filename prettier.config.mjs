/** @type {import("prettier").Config} */
const config = {
  arrowParens: "avoid",
  singleQuote: false,
  trailingComma: "all",
  semi: true,
  tabWidth: 2,
  useTabs: false,
  printWidth: 100,
  quoteProps: "as-needed",
  jsxSingleQuote: false,
  endOfLine: "auto",
  embeddedLanguageFormatting: "auto",

  plugins: ["prettier-plugin-tailwindcss"],

  overrides: [
    {
      files: "*.ts",
      options: {
        parser: "typescript",
      },
    },
  ],
};

export default config;
