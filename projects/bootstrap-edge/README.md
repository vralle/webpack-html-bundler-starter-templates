# Bootstrap Edge Template

A modern webpack-based template for building static HTML pages using
Bootstrap v5 with cutting-edge build tools and optimizations.

## Features

- Bootstrap v5 integration with customizable options
- Modern build tooling with SWC and Lightning CSS
- SCSS support with modern compiler API
- Automatic HTML/CSS/JS minification
- Configurable browser targeting
- Configurable public URL for production builds
- Built-in linting and validation

## Usage

```bash
npm run start        # Development server
npm run build        # Production build (relative URLs)
npm run build:public # Production build with a public URL
```

### Linting and Validation

```bash
npm run format        # Lint files with dprint formatter
npm run lint          # Run all linting checks
npm run lint:js       # Lint JavaScript/TypeScript files
npm run lint:styles   # Lint styles in SCSS/CSS/HTML files
npm run lint:html     # Validate HTML files using W3C standards
npm run lint:md       # Lint Markdown files
npm run lint:spelling # Check spelling in HTML and Markdown files
```

## Configuration

### Bootstrap Options

Bootstrap features can be customized in `src/scss/_options.scss`:

### Webpack Configuration

The build process is configured in `webpack.config.mjs` with the following key features:

- JS/CSS/HTML minification in production
- Source maps in development
- Integrity hash generation
- Preload tags generation

### JavaScript Processing

- Compilation using SWC
- Minification with SWC

### Style Processing

- SCSS compilation using `sass-embedded`
- CSS minification with Lightning CSS

### Asset Handling

- SVG optimization with SVGO
- SVG files under 3KB are automatically converted to data URIs
- Processing binary images with `sharp`
- Font files are not embedded by default
- Asset paths maintain their directory structure in the output

### Build Output

Production builds are generated in `dist` directory by default.

## Browser Support

Browser targeting is configured in `.browserslistrc` file (workspace-wide
by default). The template uses this configuration for:

- JavaScript transpilation (SWC)
- CSS optimization (Lightning CSS)
- Vendor prefixing (Lightning CSS)

## License

MIT License - See [LICENSE](../../LICENSE) file for details.

## Acknowledgments

- [Bootstrap](https://getbootstrap.com/)
- [Webpack](https://webpack.js.org/)
- [HTML Bundler Plugin](https://github.com/webdiscus/html-bundler-webpack-plugin)
- [SWC](https://swc.rs/)
- [Lightning CSS](https://lightningcss.dev/)
