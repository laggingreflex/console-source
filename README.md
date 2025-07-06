# console-source

Patch's global `console` to output source file, line, column information

## Install

```
npm i console-source
```

## Usage

1. Require the module in your code

   ```js
   require("console-source");
   ```

2. Set either of these environment variable:

   - `ENV=CONSOLE_SOURCE`
   - `CONSOLE_SOURCE`

### Example

```js
// test.js
console.log("test");
```

```
ENV=CONSOLE_SOURCE node --require console-source test.js
```

```
test ………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………………… test.js:1:1
```

### API

```js
const { disable, line } = require("console-source");
```

- **`disable`** `{function}` Disable
- **`line`** `{(number) => {}}` Adjust this number if it's not logging the correct source

#### Environment Variables

```
CONSOLE_SOURCE
ENV=CONSOLE_SOURCE
    - enable
CONSOLE_SOURCE_SILENT
ENV=CONSOLE_SOURCE_SILENT
    - enable, silent
CONSOLE_SOURCE_LINE=<number>
    - Adjust source line
```

## Related

- [console-interceptor](//github.com/laggingreflex/console-interceptor)
- [console-tee](//github.com/laggingreflex/console-tee)
