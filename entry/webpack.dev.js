const path = require('path');
const webpack = require('webpack');

const baseDir = process.cwd();

console.log('base dir', baseDir);

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    open: false,
    hot: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
}
