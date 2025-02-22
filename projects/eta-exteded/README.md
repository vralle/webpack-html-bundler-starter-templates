# Eta with Markdown support

This is an extended [Eta template engine](https://eta.js.org/) allows you to load
and parse Markdown files using Eta template loader and [markdown-it](https://github.com/markdown-it/markdown-it).

```html
<%~ include("./path-to-partial.md") %>
```

## Usage

A custom Eta instance accepts all Eta configuration options. Markdown templates
must have `md` extension. The extension must be specified when importing the
template.

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

Then, in your JS file:

```js
import { resolve } from "node:path";
import EtaExtended from "@vralle/eta-extended";

const eta = new EtaExtended({
  defaultExtension: ".html",
  tags: ["{{", "}}"],
  views: resolve("./", "views"),
});

eta.markdownIt.set({
  html: true,
  xhtmlOut: false,
  breaks: false,
  linkify: false,
  typographer: true,
  quotes: "„“‚‘",
});

const res = eta.render("./index");
console.log(res)
```

Another way to configure `markdown-it` is to specify options in the `markdownItConfig` parameter:

```js
import { resolve } from "node:path";
import EtaExtended from "@vralle/eta-extended";

const eta = new EtaExtended({
  defaultExtension: ".html",
  tags: ["{{", "}}"],
  views: resolve("./", "views"),
  markdownItConfig: {
    html: true,
    xhtmlOut: false,
    breaks: false,
    linkify: false,
    typographer: true,
    quotes: "„“‚‘",
  },
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
