/**
 * 单个 widget 的构建脚本
 */
const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const { replaceEntry } = require('./utils');

const [_n, _s, widget] = process.argv;

console.log(`widget ${widget} 将被编译`);
startWidget(widget);

function startWidget(widget) {
  const baseConfig = require('../config/webpack.widget.base');
  const config = replaceEntry(
    merge(
      baseConfig,
      require(`../widgets/${widget}/webpack.prod`),
      {
        output: {
          path: path.resolve(__dirname, `../dist/widget/${widget}`),
          publicPath: `/widget/${widget}/`, // 可配置 CDN 地址
          chunkLoadingGlobal: `webpack${widget}Jsonp`, // 需要为每个 widget 指定不同的 webpackJsonp 名称，不然可能会导致 widget chunk 加载时的冲突
        }
      }
    ),
    widget,
  );

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

    // todo - 将生成的 assets 数据入库保存

    compiler.close((closeErr) => {
      // ...
    });
  })
}
