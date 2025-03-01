# Bootstrap Starter Template

A modern webpack-based template for building static HTML pages using
Bootstrap v5 with optimized build tools and comprehensive validation.

## Features

- Bootstrap v5 integration
- Time-tested build tooling with Webpack 5
- SCSS support with modern compiler API
- Automatic HTML/CSS/JS minification
- Configurable public URL for production builds
- Built-in linting and validation

## Usage

```bash
npm run start        # Development server
npm run build        # Production build (relative URLs)
npm run build:public # Production build with public URL
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

- CSS/JS/HTML minification in production
- Source maps in development
- Integrity hash generation
- SVG optimization with SVGO

### JavaScript Processing

- JavaScript compilation using Babel
- Code minification with Terser

### Style Processing

- SCSS compilation using sass-embedded
- PostCSS/autoprefixer processing in production
- CSS minification with clean-css

### Asset Handling

- SVG files under 3KB are automatically converted to data URIs
- Font files are not embedded by default
- Asset paths maintain their directory structure in the output

### Build Output

Production builds are generated in the `dist` directory by default.

## License

MIT License - See [LICENSE](../../LICENSE) file for details.

## Acknowledgments

- [Bootstrap](https://getbootstrap.com/)
- [Webpack](https://webpack.js.org/)
- [HTML Bundler Plugin](https://github.com/webdiscus/html-bundler-webpack-plugin)
