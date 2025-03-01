/**
 * Stylelint options
 * Stylelint parses Tailwind classes with errors. If you
 * want to try linting, remove `ignoreFiles` option.
 * @see https://stylelint.io/user-guide/configure/
 * @type {import('stylelint').Config}
 */
const stylelintConfig = {
  extends: [
    "stylelint-config-standard",
  ],
  rules: {
    "import-notation": null,
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: [
          /** tailwindcss v4 */
          "theme",
          "source",
          "utility",
          "variant",
          "custom-variant",
          "plugin",
          /** tailwindcss v3 */
          "tailwind",
          "apply",
          "layer",
          "config",
          /** tailwindcss v1, v2 */
          "variants",
          "responsive",
          "screen",
        ],
      },
    ],
    "at-rule-no-deprecated": [
      true,
      {
        ignoreAtRules: ["apply"],
      },
    ],
  },
  // Ignore all as Stylelint parses tailwind classes with errors
  ignoreFiles: [
    "**/*.*",
  ],
};

export default stylelintConfig;
