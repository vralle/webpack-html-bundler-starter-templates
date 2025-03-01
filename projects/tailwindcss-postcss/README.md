# Tailwind CSS + Alpine.js Starter Template

A modern webpack-based template for building static HTML pages using
Tailwind CSS v4 and Alpine.js v3. This template provides a robust
development environment with optimized production builds.

## Features

- [Tailwind CSS v4](https://tailwindcss.com/) for utility-first styling
- [Alpine.js v3](https://alpinejs.dev/) for lightweight interactivity
- [Webpack 5](https://webpack.js.org/) with modern configuration
- [SWC](https://swc.rs/) for fast JavaScript compilation

## Prerequisites

- Node.js >= 18.18.0
- npm or compatible package manager

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
npm run lint:html     # Validate HTML files using W3C standards
npm run lint:spelling # Check spelling in HTML and Markdown files
```

## Configuration

### Webpack

The webpack configuration (`webpack.config.mjs`) includes:

- SWC for JavaScript transpilation
- PostCSS with Tailwind CSS processing
- Image optimization with SVG special handling
- HTML bundling with minification

### Tailwind CSS

Tailwind is configured in `tailwind.config.mjs`.

### Asset Handling

- SVG files under 3KB are automatically converted to data URIs
- Font files are not embedded by default
- Asset paths maintain their directory structure in the output

## Browser Support

Browser compatibility is managed through Browserslist configuration.
The template uses this for:

- JavaScript transpilation (SWC)
- CSS optimization

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - See [LICENSE](../../LICENSE) file for details.

## Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/)
- [Alpine.js](https://alpinejs.dev/)
- [HTML Bundler Plugin](https://github.com/webdiscus/html-bundler-webpack-plugin)
- [SWC](https://swc.rs/)
