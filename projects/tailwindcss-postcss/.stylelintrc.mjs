/**
 * Stylelint options
 * @see https://stylelint.io/user-guide/configure/
 * @type {import('stylelint').Config}
 */
const stylelintConfig = {
  extends: [
    "stylelint-config-standard",
    "stylelint-config-tailwindcss",
  ],
  cache: true,
  ignoreFiles: [
    "dist/**",
    "node_modules/**",
  ],
  overrides: [
    {
      files: [
        "**/*.scss",
      ],
      extends: [
        "stylelint-config-standard-scss",
        "stylelint-config-tailwindcss/scss",
      ],
    },
  ],
};

export default stylelintConfig;
