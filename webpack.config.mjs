import path from 'path';
import CspHtmlLinterWebpackPlugin from 'webpack-csp-html-linter';

export default {
  entry: './demo/src/index.js',
  output: {
    path: path.resolve('./dist'),
    filename: 'demo.js',
  },
  plugins: [
    new CspHtmlLinterWebpackPlugin({
      extensions: ['.js'],
      exclusions:['nestedfolder']
      //  allowInlineStyles: true,
      //  allowInlineJs: true,
      //  allowStyleTagWithoutNonce: true,
      //  allowScriptTagWithoutNonce: true
    })
  ]
};
