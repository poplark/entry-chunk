const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const baseDir = process.cwd();

console.log('base dir', baseDir);

module.exports = {
  mode: 'development',
  entry: {
    main: path.resolve(baseDir, 'entry/src/index.js')
  },
  output: {
    path: path.resolve(baseDir, 'dist/entry')
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.js(x)?/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
      // filename: 'xx.html',
      // chunks: ['vendor', 'common', 'main']
    })
  ]
}
