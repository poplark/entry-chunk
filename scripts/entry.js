const webpack = require('webpack');
const config = require('../entry/webpack.config.js');

const compiler = webpack(config);
compiler.run((err, stats) => {
  if (err) {
    console.warn('!!!!!! compile error !!!!!!');
    console.error(err);
    return;
  }
  console.info(stats);

  compiler.close((closeErr) => {
    // ...
  });
})
