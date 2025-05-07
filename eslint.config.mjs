/**
 * Eslint options
 * @see https://eslint.org/docs/latest/use/configure/configuration-files
 */

import eslintJs from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import vitestEslint from "@vitest/eslint-plugin";
import jsdocPlugin from "eslint-plugin-jsdoc";
import globals from "globals";
import tsEslint from "typescript-eslint";

/**
 * @type {import("typescript-eslint").ConfigArray}
 */
export default tsEslint.config(
  eslintJs.configs.recommended,
  tsEslint.configs.strict,
  tsEslint.configs.stylistic,
  stylistic.configs.customize({
    indent: 2,
    quotes: "double",
    semi: true,
    jsx: false,
  }),
  jsdocPlugin.configs["flat/recommended-typescript-flavor"],
  jsdocPlugin.configs["flat/logical-typescript-flavor"],
  jsdocPlugin.configs["flat/stylistic-typescript-flavor"],
  { ignores: ["**/dist", "**/node_modules", "**/.git"] },
  {
    rules: {
      "@typescript-eslint/no-namespace": ["error", { allowDeclarations: true, allowDefinitionFiles: true }],
    },
  },
  {
    rules: {
      "@stylistic/brace-style": ["error", "1tbs"],
      "@stylistic/quote-props": ["error", "as-needed"],
      "@stylistic/quotes": ["error", "double", { avoidEscape: true, allowTemplateLiterals: "avoidEscape" }],
      "@stylistic/comma-dangle": ["error", "only-multiline"],
    },
  },
  {
    rules: {
      "jsdoc/check-types": "error",
      "jsdoc/lines-before-block": ["warn", { excludedTags: ["type", "see"], ignoreSameLine: false }],
      "jsdoc/no-undefined-types": "off",
    },
  },
  {
    files: ["**/*.{jc,mjs,cjs}"],
    rules: {
      "jsdoc/no-types": "off",
    },
  },
  {
    files: ["*.{js,mjs,ts}"],
    ignores: ["**/src/js/**"],
    languageOptions: { globals: globals.node },
  },
  {
    files: ["**/src/js/**/*.{js,mjs,ts}"],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ["tests/**"],
    plugins: {
      vitestEslint,
    },
    rules: {
      ...vitestEslint.configs.recommended.rules,
    },
    settings: {
      vitest: {
        typecheck: true,
      },
    },
    languageOptions: {
      globals: {
        ...vitestEslint.environments.env.globals,
      },
    },
  },
);
