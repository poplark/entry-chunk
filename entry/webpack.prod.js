const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const baseDir = process.cwd();

console.log('base dir', baseDir);

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
      // filename: 'xx.html',
      // chunks: ['vendor', 'common', 'main']
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public/*.js'),
          to: path.resolve(baseDir, 'dist'),
        },
      ],
    })
  ],
}
