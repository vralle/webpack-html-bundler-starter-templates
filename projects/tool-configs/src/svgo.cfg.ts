import type { Config } from "svgo";

let prefixCounter = 0;

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
        leadingZero: true,
        defaultPx: true,
        convertToPx: true,
      },
    },
    {
      name: "prefixIds",
      params: {
        delim: "__",
        prefixIds: true,
        prefixClassNames: true,
        prefix: () => `${prefixCounter++}`,
      },
    },
    "removeDimensions",
    "removeOffCanvasPaths",
    "removeScriptElement",
    "reusePaths",
    {
      name: "preset-default",
      params: {
        overrides: {
          removeViewBox: false,
          inlineStyles: false, // @bug https://github.com/svg/svgo/issues/1834
          cleanupIds: {
            minify: false,
          },
        },
      },
    },
  ],
};

export default svgoConfig;
