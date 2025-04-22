import type { Config } from "svgo";

/**
 * SVGO options
 * @see https://github.com/svg/svgo
 */
const svgoConfig: Config = {
  multipass: true,
  plugins: [
    {
      name: "cleanupListOfValues",
      params: {
        floatPrecision: 0,
        leadingZero: true,
        defaultPx: true,
        convertToPx: true,
      },
    },
    "removeDimensions",
    "removeHiddenElems",
    "removeOffCanvasPaths",
    "removeScriptElement",
    "reusePaths",
    {
      name: "preset-default",
      params: {
        overrides: {
          removeViewBox: false,
          inlineStyles: false, // @bug https://github.com/svg/svgo/issues/1834
        },
      },
    },
  ],
};

export default svgoConfig;
