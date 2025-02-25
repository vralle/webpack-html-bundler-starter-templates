/**
 * Stylelint options
 * @see https://stylelint.io/user-guide/configure/
 * @type {import('stylelint').Config}
 */
export default {
  extends: "stylelint-config-twbs-bootstrap",
  cache: true,
  ignoreFiles: [
    "dist/**",
    "node_modules/**",
  ],
  overrides: [
    {
      files: [
        "*.html",
      ],
      extends: [
        "stylelint-config-html",
      ],
    },
  ],
};
