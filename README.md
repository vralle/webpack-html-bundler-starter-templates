# Webpack HTML Bundler Starter Templates

A comprehensive monorepo containing modern starter templates and utilities for
frontend development, focusing on static HTML page generation with Webpack
and advanced build tooling.

## Features

- Multiple optimized starter templates for different use cases
- Shared configuration packages and utilities
- Comprehensive HTML validation and testing tools
- Modern build tooling with SWC, Lightning CSS, and more
- Container-ready development environment

## Project Structure

```console
├── bootstrap/           # Classic Bootstrap 5 template
├── bootstrap-edge/      # Modern Bootstrap 5 template with cutting-edge tools
├── tailwindcss-postcss/ # TailwindCSS + Alpine.js template
├── eta-extended/        # Extended Eta template engine with Markdown support
├── nu-html-checker/     # HTML validation tool
└── tool-configs/        # Shared tool configurations
```

## Getting Started

### Installation

#### Using DevContainer (Recommended)

This repository is optimized for development in containers:

1. Install Docker and a compatible IDE
   - [VS Code](https://code.visualstudio.com/docs/devcontainers/containers)
   - [WebStorm](https://www.jetbrains.com/help/webstorm/dev-containers-starting-page.html)
2. Clone the repository
3. Open in your IDE - it will automatically detect and set up the devcontainer
4. Dependencies will be installed automatically

#### Local installation

**Prerequisites:**

- Node.js >= 18.18.0
- Java Runtime Environment (JRE) >= 8 (Optional, required for HTML validation)

**Steps:**

1. Clone the repository
2. Navigate to the repository directory
3. Run `npm install`

## Available Templates

### Bootstrap Classic Template

Traditional template using Bootstrap v5 with proven build tools:

- Bootstrap v5 integration
- Babel + Terser for JavaScript
- SCSS + PostCSS + Clean CSS for styles

### Bootstrap Edge Template

Modern template using cutting-edge build tools:

- Bootstrap v5 integration
- SWC for JavaScript compilation
- SCSS + Lightning CSS for style optimization

### TailwindCSS Template

Modern template using TailwindCSS and Alpine.js:

- TailwindCSS v4 for utility-first styling
- Alpine.js v3 for lightweight interactivity
- SWC for JavaScript compilation

## Common Scripts

```bash
npm run start         # Development server
npm run build         # Production build
npm run format        # Lint files with dprint formatter
npm run lint:js       # Lint JavaScript/TypeScript files
npm run lint:styles   # Lint SCSS/CSS files
npm run lint:md       # Lint Markdown files
npm run lint:html     # Validate HTML files using W3C standards
npm run lint:spelling # Check spelling in HTML and Markdown files
```

## Utility Packages

### `@vralle/eta-extended`

Extended Eta template engine with Markdown support:

- Seamless integration with Eta
- Markdown file parsing with markdown-it
- Configurable markdown options

### `@vralle/nu-html-checker`

HTML validation tool using W3C standards:

- HTML validation using official W3C validator
- Configurable error/warning filtering
- Customizable logging output

### `@vralle/tool-configs`

Shared configurations for build tools:

- Pre-configured optimization settings
- Easy to extend and customize

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add appropriate documentation
- Ensure all linting checks pass
- Add/update tests where necessary

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file
for details.

## Acknowledgments

- [Webpack](https://webpack.js.org/)
- [HTML Bundler Plugin](https://github.com/webdiscus/html-bundler-webpack-plugin)
- [Bootstrap](https://getbootstrap.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Alpine.js](https://alpinejs.dev/)
- [SWC](https://swc.rs/)
- [Lightning CSS](https://lightningcss.dev/)
