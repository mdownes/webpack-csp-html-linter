### webpack-csp-html-linter
A Webpack plugin designed to analyze HTML and identify potential breaches of Content Security Policy (CSP) rules. The goal is to prevent CSP violations from infiltrating your codebase during the build process. This plugin is based on the [csp-html-linter](https://www.npmjs.com/package/csp-html-linter) package.
### Install

Using npm:

```npm install webpack-csp-html-linter --save-dev```

### Basic Usage

By default this plugin is strict, to reduce the most common XSS attack vectors. 

Create a webpack.config.js configuration file and import the plugin:

```javascript
import CspHtmlLinterWebpackPlugin from 'webpack-csp-html-linter';

export default {
  entry: './index.js',
  output: {
    path: path.resolve('./dist'),
    filename: 'bundle.js',
  },
  plugins: [
    new CspHtmlLinterWebpackPlugin({
      extensions: ['.html']
    })
  ]
};
```
### Advanced Usage 

Create a webpack.config.js configuration file and import the plugin:

```javascript
import CspHtmlLinterWebpackPlugin from 'webpack-csp-html-linter';

export default {
  entry: './index.js',
  output: {
    path: path.resolve('./dist'),
    filename: 'bundle.js',
  },
  plugins: [
    new CspHtmlLinterWebpackPlugin({
      extensions: ['.html'],
      exclusions:['node_modules', 'somefolder']
      allowInlineStyles: true,
      allowInlineJs: true,
      allowStyleTagWithoutNonce: true,
      allowScriptTagWithoutNonce: true
    })
  ]
};
```

The configuration above will allow all violations.

### Options

See [csp-html-linter](https://www.npmjs.com/package/csp-html-linter) package for more details.