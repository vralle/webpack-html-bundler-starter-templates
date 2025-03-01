# @vralle/nu-html-checker

A Node.js wrapper for [The Nu Html Checker](https://github.com/validator/validator)
that validates HTML files against W3C standards.

## Features

- HTML validation using the official W3C validator
- Configurable error/warning filtering
- Customizable logging output
- Support for both 32-bit and 64-bit Java environments

## Prerequisites

- Node.js >= 18.18.0
- Java Runtime Environment (JRE) >= 8

## Usage

Basic usage with glob pattern:

```javascript
import validate from "@vralle/nu-html-checker";
import { globSync } from "glob";

const files = globSync("dist/**/*.html", { nodir: true });

validate(files);
```

### Options

The validate function accepts an optional options object:

```typescript
interface Options {
  ignores?: string[]; // Array of error patterns to ignore
  logger?: Logger; // Custom logging function
}
```

#### `ignores`

You can ignore specific validation errors by providing regular expression patterns.

The option is an alias for `vnu.jar --filterpattern PATTERN`:
> Specifies a regular expression. Any error message or warning message that
matches the regular expression is filtered out (dropped/suppressed).

**Default value**:

<!-- markdownlint-disable MD013 -->
```javascript
const IGNORES = [
  "Attribute “autocomplete” is only allowed when the input type is.*",
  "Attribute “autocomplete” not allowed on element “button” at this point.",
  "An “aria-disabled” attribute whose value is “true” should not be specified on an “a” element that has an “href” attribute.",
];
```
<!-- markdownlint-enable MD013 -->

#### `logger`

You can provide your own logging function to customize the output.

```typescript
type Logger = (vnuReport: VnuReport, files: string[]) => void;
```

## Error Handling

The validator will exit with a non-zero code in the following cases:

- No files to check
- Java is not installed
- Unsupported Java version (< 8)
- Validation errors found in HTML files

## License

MIT License - See [LICENSE](../../LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgments

- [The Nu Html Checker](https://github.com/validator/validator) - The core
  validation engine
- [vnu-jar](https://www.npmjs.com/package/vnu-jar) - NPM package for the
  validator JAR file
