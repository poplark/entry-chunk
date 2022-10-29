const path = require('path');

module.exports = {
  entry: {
    wa: path.resolve(__dirname, 'src/index.jsx')
  },
  output: {
    filename: 'wa.js'
  }
}
