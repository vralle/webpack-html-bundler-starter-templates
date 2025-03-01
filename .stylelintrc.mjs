/**
 * Stylelint options
 * @see https://stylelint.io/user-guide/configure/
 * @type {import('stylelint').Config}
 */
const stylelintConfig = {
  extends: "stylelint-config-standard",
  cache: true,
  ignoreFiles: [
    "**/dist/**",
    "**/node_modules/**",
  ],
  overrides: [
    {
      files: [
        "**/*.scss",
      ],
      extends: "stylelint-config-standard-scss",
    },
    {
      files: [
        "**/*.html",
      ],
      extends: "stylelint-config-html/html",
    },
  ],
};

export default stylelintConfig;
