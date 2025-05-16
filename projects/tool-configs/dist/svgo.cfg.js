import ShortUniqueId from "short-unique-id";
const { randomUUID } = new ShortUniqueId({ length: 3 });
/**
 * SVGO options
 * @see https://github.com/svg/svgo
 */
const svgoConfig = {
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
                prefix: () => randomUUID(),
            },
        },
        "removeDimensions",
        "removeOffCanvasPaths",
        "removeScriptElement",
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
