import type { Options } from "@swc/html";

/**
 * @swc/html minimizer options
 * @see https://github.com/swc-project/swc/blob/main/packages/html/index.ts
 */
const swcHtmlConfig: Options = {
  collapseBooleanAttributes: true,
  collapseWhitespaces: "smart",
  minifyCss: true,
  minifyJs: false,
  minifyJson: true,
  normalizeAttributes: true,
  quotes: true,
  removeComments: true,
  removeEmptyAttributes: true,
  removeEmptyMetadataElements: true,
  removeRedundantAttributes: "smart",
  selfClosingVoidElements: true,
  sortAttributes: true,
  sortSpaceSeparatedAttributeValues: false,
  // tagOmission can cause unexpected results.
  tagOmission: false,
};

export default swcHtmlConfig;
