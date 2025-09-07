import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import tailwind from "eslint-plugin-tailwindcss";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

/** @type {import('eslint').Linter.Config[]} */
const config = [
  { ignores: [".next/**", "public/**", "next.config.js", "postcss.config.js"] },
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  eslintPluginUnicorn.configs["flat/recommended"],
  ...tailwind.configs["flat/recommended"],
  ...compat.config({
    extends: ["next"],
    settings: {
      next: {
        rootDir: ".",
      },
    },
  }),
  ...compat.config({
    extends: ["plugin:drizzle/all"],
  }),
  {
    plugins: {
      sonarjs,
      security,
      import: importPlugin,
    },
    rules: {
      ...sonarjs.configs.recommended.rules,
      "security/detect-object-injection": "warn",
      "security/detect-non-literal-require": "warn",
      "security/detect-non-literal-fs-filename": "warn",
      "import/order": ["error", {
        "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
        "newlines-between": "always",
        "alphabetize": { "order": "asc", "caseInsensitive": true }
      }],
      "no-undef": "error",
      "react/react-in-jsx-scope": "off",
      "tailwindcss/no-custom-classname": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "unicorn/prevent-abbreviations": "off",
      // Add these new rules
      "indent": ["error", 2],
      "semi": ["error", "always"],
      "quotes": ["error", "double"],
      "comma-dangle": ["error", "always-multiline"],
      "object-curly-spacing": ["error", "always"],
      "array-bracket-spacing": ["error", "never"],
      "react/jsx-curly-spacing": ["error", { "when": "never", "children": true }],
      "react/jsx-tag-spacing": ["error", {
        "closingSlash": "never",
        "beforeSelfClosing": "always",
        "afterOpening": "never",
        "beforeClosing": "never"
      }],
    },
  },
  {
    files: ["**/*.{jsx,tsx}"],
    rules: {
      "no-console": "warn",
    },
  },
];
export default config;