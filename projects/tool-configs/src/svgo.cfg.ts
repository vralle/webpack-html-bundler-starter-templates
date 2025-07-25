import ShortUniqueId from "short-unique-id";
import type { Config } from "svgo";

const { randomUUID } = new ShortUniqueId({ length: 3 });

/**
 * SVGO options
 * @see https://github.com/svg/svgo
 */
const svgoConfig: Config = {
  multipass: true,
  plugins: [
    {
      name: "preset-default",
      params: {
        overrides: {
          inlineStyles: false, // @bug https://github.com/svg/svgo/issues/1834,
        },
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
  ],
};

export default svgoConfig;
