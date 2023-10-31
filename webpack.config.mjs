import path from 'path';
import CspHtmlLinterWebpackPlugin from './index.js';

export default {
  entry: './demo/src/index.js',
  output: {
    path: path.resolve('./dist'),
    filename: 'demo.js',
  },
  plugins: [
    new CspHtmlLinterWebpackPlugin({
      extensions: ['.js'],
      //  allowInlineStyles: true,
      //  allowInlineJs: true,
      //  allowStyleTagWithoutNonce: true,
      //  allowScriptTagWithoutNonce: true
    })
  ]
};
