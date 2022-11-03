const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: path.resolve(__dirname, 'src/index.jsx'),
  output: {
    filename: '[name].js'
  }
}
