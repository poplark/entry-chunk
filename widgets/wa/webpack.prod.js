const path = require('path');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: path.resolve(__dirname, 'src/index.jsx'),
}
