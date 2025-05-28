/**
 * sharp.js options
 * @see https://sharp.pixelplumbing.com/api-output
 */
const sharpEncodeOptions = {
    avif: {
        effort: 9,
    },
    jpeg: {
        // @ts-expect-error: effort is a valid parameter for JPEG encoding in Sharp.js/libvips but not reflected in TypeScript types.
        effort: 10,
        mozjpeg: true,
    },
    heif: {
        effort: 9,
    },
    png: {
        compressionLevel: 9,
        effort: 10,
        palette: true,
        quality: 92,
    },
    webp: {
        effort: 6,
        preset: "default", // one of: default, photo, picture, drawing, icon, text
    },
};
export default sharpEncodeOptions;
