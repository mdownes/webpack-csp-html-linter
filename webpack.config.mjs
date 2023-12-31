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
      exclude: ['**/nestedfolder/**'],
      include: ['demo/**/*.js', 'demo/**/*.ts']

      //  allowInlineStyles: true,
      //  allowInlineJs: true,
      //  allowStyleTagWithoutNonce: true,
      //  allowScriptTagWithoutNonce: true
    })
  ]
};
