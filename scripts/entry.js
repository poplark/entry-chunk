const webpack = require('webpack');
const { merge } = require('webpack-merge');
const baseConfig = require('../config/webpack.entry.base');

const config = merge(baseConfig, require('../entry/webpack.prod'));

console.log(`entry 配置信息`, config);

const compiler = webpack(config);
compiler.run((err, stats) => {
  if (err) {
    console.warn('!!!!!! compile error !!!!!!');
    console.error(err);
    return;
  }
  const { errors } = stats;
  if (errors) {
    console.info(`entry 构建失败`);
    console.errors(errors);
    return;
  }
  console.info(`entry 构建完成`);
  // console.info(stats.chunks);

  compiler.close((closeErr) => {
    // ...
  });
})
