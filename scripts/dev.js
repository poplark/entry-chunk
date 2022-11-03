const webpack = require('webpack');
const { merge } = require('webpack-merge');
const WebpackDevServer = require('webpack-dev-server');
const baseConfig = require('../config/webpack.entry.base');

const PORT = 9000;
const config = merge(baseConfig, require('../entry/webpack.dev'));

const compiler = webpack(config);

const devServerOpts = merge(config.devServer, {port: PORT});

const server = new WebpackDevServer(devServerOpts, compiler);

server.start()
  .then(() => {
    console.log('dev server listening at ', PORT);
  })
  .catch((err) => {
    console.log('dev server start failed ', err);
  });
