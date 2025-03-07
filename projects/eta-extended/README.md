# Eta with Markdown support

An extended version of the [Eta template engine](https://eta.js.org/) that adds
support for loading and parsing Markdown files using
[markdown-it](https://github.com/markdown-it/markdown-it).

## Features

- Seamless integration with Eta template engine
- Markdown file support with automatic parsing
- Configurable markdown-it options
- Zero additional dependencies beyond Eta and markdown-it

## Usage

A custom Eta instance accepts all Eta configuration options. Markdown templates
must have `md` extension. The extension must be specified when importing the
template.

```html
<%~ include("./path-to-partial.md") %>
```

### Basic example

`views/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Example web page template</title>
        <meta name="description" content="Example web page template">
        <link rel="stylesheet" href="./styles.css">
    </head>
    <body>
        <div id="content">
            {{~ include("content/page.md") }}
        </div>
    </body>
</html>
```

`views/content/page.md`:

```md
# Webpage title

This is the content of the web page
```

Then in your js:

```js
import { resolve } from "node:path";
import EtaExtended from "@vralle/eta-extended";

const eta = new EtaExtended({
  defaultExtension: ".html",
  tags: ["{{", "}}"],
  views: resolve("./", "views"),
});

const res = eta.render("./index");
console.log(res)
```

Output:

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Example web page template</title>
        <meta name="description" content="Example web page template">
        <link rel="stylesheet" href="./styles.css">
    </head>
    <body>
        <div id="content">
            <h1>Webpage title</h1>
            <p>This is the content of the web page</p>
        </div>
    </body>
</html>
```

### Configuring markdown-it

1\. Using `markdownItConfig` option during initialization:

  ```js
  import { resolve } from "node:path";
  import EtaExtended from "@vralle/eta-extended";

  const eta = new EtaExtended({
    markdownItConfig: {
      html: true,
      xhtmlOut: false,
      breaks: false,
      linkify: false,
      typographer: true,
      quotes: "„“‚‘",
    },
  });
  ```

2\. Using `markdown-it` property after initialization:

```js
const eta = new EtaExtended();
eta.markdownIt.set({
  html: true,
  xhtmlOut: false,
  breaks: false,
  linkify: false,
  typographer: true,
  quotes: "„“‚‘",
});
```

## Limitations

1. **Template Tags in Markdown**: When using Eta data in Markdown templates,
   you must use `{{ }}` tags instead of the default `<% %>` tags. For example:

   ```md
   <!-- ❌ This won't work in .md files -->
   # Hello <%= name %>

   <!-- ✅ Use this instead -->
   # Hello {{ name }}
   ```

   This limitation exists because Markdown-it escapes angle brackets (`<`, `>`),
   which breaks the standard Eta tags. The double curly braces are preserved
   during Markdown processing.

2. **Layout Support**: Markdown templates cannot use layouts. For example:

   ```md
   <!-- ❌ This won't work -->
   {{ layout("./layouts/main") }}
   # Page Content

   <!-- ✅ Instead, include the Markdown in an HTML template -->
   <!-- In your HTML template: -->
   {{ layout("./layouts/main") }}
   <div>
     {{~ include("./content.md") }}
   </div>
   ```

   This limitation exists because Markdown-it processes the entire template
   content as Markdown first, converting layout tags into HTML elements before
   Eta can process them. To use layouts with Markdown content, include your
   Markdown files within HTML templates that handle the layout.

## API Reference

### `EtaExtended`

The main class that extends Eta's functionality.

#### Constructor Options

```typescript
interface EtaExtendedConfig extends Partial<EtaConfig> {
  markdownItConfig?: MarkdownItOptions;
}
```

- All Eta options are supported
- `markdownItConfig`: Optional configuration object for `markdown-it`

#### Properties

- `markdownIt`: The `markdown-it` instance used for parsing markdown files

## License

MIT License - See [LICENSE](../../LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

- [Eta](https://eta.js.org/) - The core template engine
- [markdown-it](https://github.com/markdown-it/markdown-it) - Markdown parser
