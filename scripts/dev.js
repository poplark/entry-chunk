/**
 * entry + widget 的开发脚本
 * 使用 multiple compiler，只开启一个 dev server 的方式
 */
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const WebpackDevServer = require('webpack-dev-server');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const { replaceEntry } = require('./utils');

const PORT = 9000;

startEntry(getWidgetConfigs(), PORT);

// 使用 multiple compiler 的方式调试 widget
function startEntry(widgetConfigs, port) {
  const baseConfig = require('../config/webpack.entry.base');
  const config = merge(baseConfig, require('../entry/webpack.dev'), {
    plugins: [
      new webpack.DefinePlugin({
        DEV_MODE: JSON.stringify('m-compiler')
      }),
      new FriendlyErrorsWebpackPlugin(),
    ],
    stats: 'errors-only',
  });
  // todo - 使用 multiple compiler ，widget 更新时，存在 HMR 无法支持的问题
  const multipleCompiler = webpack([config].concat(widgetConfigs));

  const devServerOpts = merge(config.devServer, {port});

  const server = new WebpackDevServer(devServerOpts, multipleCompiler);

  server.start()
    .then(() => {
      console.log('dev server listening at ', port);
    })
    .catch((err) => {
      console.log('dev server start failed ', err);
    });
}

function getWidgetConfigs() {
  const baseConfig = require('../config/webpack.widget.base');
  let configs = [];
  let widgets;
  const devJsonPath = path.resolve(__dirname, '../widgets.json');
  if (fs.existsSync(devJsonPath)) {
    widgets = require(devJsonPath);
  } else {
    widgets = [];
    fs.writeFileSync(devJsonPath, JSON.stringify(widgets, ' ', 2), 'utf-8');
  }
  for (const widget of widgets) {
    configs.push(
      replaceEntry(
        merge(
          baseConfig,
          require(`../widgets/${widget.name}/webpack.dev`),
          {
            output: {
              publicPath: `/widget/${widget.name}/`,
              chunkLoadingGlobal: `webpack${widget.name}Jsonp`,
              hotUpdateGlobal: `webpackHotUpdate${widget.name}`, // 解决开启HMR，多个 widget 使用同一个 webpackHotUpdate 时异常的问题
            },
            plugins: [new FriendlyErrorsWebpackPlugin()],
            // stats: 'errors-only',
          },
        ),
        widget.name
      )
    );
  }
  return configs;
}
