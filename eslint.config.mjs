import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettierConfig,
  {
    plugins: {
      prettier: prettierPlugin,
      import: importPlugin,
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
        },
      },
    },
    rules: {
      "prettier/prettier": "error",
      "@typescript-eslint/member-delimiter-style": "off",
      "no-console": "warn",
      "import/order": [
        "error",
        {
          groups: [
            ["builtin", "external"],
            ["internal"],
            ["sibling", "index"],
            ["parent"],
            ["object", "type"],
          ],
          pathGroups: [
            { pattern: "@/**", group: "internal", position: "before" },
            { pattern: "./**", group: "sibling", position: "before" },
            { pattern: "../**", group: "parent", position: "before" },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
