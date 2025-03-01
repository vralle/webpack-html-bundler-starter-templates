# @vralle/tool-configs

A collection of shareable configurations for common frontend build tools and optimizers.

## Features

- Pre-configured optimization settings for popular tools
- TypeScript support with type definitions
- Easy to extend and customize
- Consistent settings across projects

## Supported Tools

- [CleanCSS](https://github.com/clean-css/clean-css) - Fast and efficient CSS
   optimizer for node.js and the Web;
- [HTMLMinifier](https://github.com/terser/html-minifier-terser) - HTMLMinifier
  is a highly configurable, well-tested, JavaScript-based HTML minifier;
- [PostCSS](https://postcss.org/) - A tool for transforming CSS with JavaScript;
- [Sharp.js](https://github.com/lovell/sharp) - High performance Node.js image processing;
- [SVGO](https://svgo.dev/) - SVG Optimizer for Node.js and CLI;
- [@swc/html](https://swc.rs/docs/usage/html) Fast HTML Minifier;
- [terser](https://terser.org/) - JavaScript mangler and compressor toolkit;

## Usage

Import the configurations you need:

```js
import {
    cleanCssConfig,
    htmlTerserConfig,
    postcssConfig,
    sharpEncodeOptions,
    svgoConfig,
    swcHtmlConfig,
    terserConfig
} from "@vralle/tool-configs";
```

### Extending Configurations

You can extend or override any configuration:

```js
import { minify } from '@swc/html';
import { swcHtmlConfig } from "@vralle/tool-configs";

const html = await minify(
  '<div>Hello, world!</div>',
  {
    ...swcHtmlConfig,
    minifyJson: false,
    minifyJs: false,
    minifyCss: false,
  }
);
```

## License

MIT License - See [LICENSE](../../LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Author

Vitaliy Ralle - [GitHub](https://github.com/vralle)
