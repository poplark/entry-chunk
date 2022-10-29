const webpack = require('webpack');
const { merge } = require('webpack-merge');
const baseConfig = require('../config/webpack.widget.base.js');

const widget = process.argv[2];

console.log(`widget ${widget} 将被编译`);

const config = merge(baseConfig, require(`../widgets/${widget}/webpack.config.js`));

console.log(`widget ${widget} 配置信息`, config);

const compiler = webpack(config);
compiler.run((err, stats) => {
  if (err) {
    console.warn('!!!!!! compile error !!!!!!');
    // console.error(err);
    return;
  }
  const { errors } = stats;
  if (errors) {
    console.info(`widget ${widget} 构建失败`);
    // console.errors(errors);
    return;
  }
  console.info(`widget ${widget} 构建完成`);
  // console.info(stats.chunks);

  compiler.close((closeErr) => {
    // ...
  });
})
