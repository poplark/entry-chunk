const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const WebpackDevServer = require('webpack-dev-server');
const { replaceEntry } = require('./utils');

const [_n, _s, widget, port] = process.argv;

console.log(`widget ${widget} 将被编译`, );
startWidget(widget, port);

function startWidget(widget, port) {
  const baseConfig = require('../config/webpack.widget.base');
  const config = replaceEntry(
    merge(
      baseConfig,
      require(`../widgets/${widget}/webpack.dev`),
      {
        output: {
          path: path.resolve(__dirname, `../dist/widget/${widget}`),
          publicPath: `http://localhost:${port}/widget/${widget}/`,
          chunkLoadingGlobal: `webpack${widget}Jsonp`,
          hotUpdateGlobal: `webpackHotUpdate${widget}`, // 解决开启HMR，多个 widget 使用同一个 webpackHotUpdate 时异常的问题
        },
        stats: 'errors-only',
      }
    ),
    widget
  );

  console.log(`widget ${widget} 配置信息`, config);

  const compiler = webpack(config);
  const devServerOpts = {
    compress: true,
    open: false,
    hot: true,
    port,
    headers: {
      "Access-Control-Allow-Origin": "*",
    }
  };
  const server = new WebpackDevServer(devServerOpts, compiler);
  server.start()
    .then(() => {
      console.log(`${widget} - dev server listening at `, port);
    })
    .catch((err) => {
      console.log(`${widget} - dev server start failed `, err);
    }); 
}
