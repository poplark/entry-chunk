/**
 * entry + widget 的开发脚本
 * 使用 multiple dev server 方式
 */
const { fork } = require('child_process');
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const WebpackDevServer = require('webpack-dev-server');

const PORT = 9000;

startWidgetsAndEntry(PORT);

function startWidgetsAndEntry(mainPort) {
  const children = [];
  const startArgs = generateStartWidgetArgs(mainPort);
  // config.devServer.proxy = config.devServer.proxy || {};
  for (let arg of startArgs) {
    const [name, port] = arg;
    children.push(startWidget(name, port));
    // 不需要代理了，widget 的 server 开启 CORS 后，可直接访问
    // config.devServer.proxy[`/widget/${name}`] = `http://localhost:${port}`;
  }

  let server;
  try {
    server = startEntry(mainPort);
  } catch (err) {
    console.log('start entry failed ', err);
    for (const child of children) {
      const [_, ac] = child;
      ac.abort();
    }
  }

  ['SIGINT', 'SIGTERM'].forEach(function(sig) {
    process.on(sig, function() {
      for (const child of children) {
        const [_, ac] = child;
        ac.abort();
      }
      server.close();
      process.exit();
    });
  });
}

function generateStartWidgetArgs(port) {
  let args = [];
  let widgets;
  const devJsonPath = path.resolve(__dirname, '../widgets.json');
  if (fs.existsSync(devJsonPath)) {
    widgets = require(devJsonPath);
  } else {
    widgets = [];
    fs.writeFileSync(devJsonPath, JSON.stringify(widgets, ' ', 2), 'utf-8');
  }
  for (const widget of widgets) {
    args.push([ widget.name, ++port ]);
  }
  return args;
}

function startEntry(port) {
  const baseConfig = require('../config/webpack.entry.base');
  const config = merge(baseConfig, require('../entry/webpack.dev'), {
    plugins: [
      new webpack.DefinePlugin({
        DEV_MODE: JSON.stringify('m-server')
      })
    ]
  });

  const compiler = webpack(config);

  const devServerOpts = merge(config.devServer, {port});

  const server = new WebpackDevServer(devServerOpts, compiler);

  server.start()
    .then(() => {
      console.log('dev server listening at ', PORT);
    })
    .catch((err) => {
      console.log('dev server start failed ', err);
    });
  return server;
}

function startWidget(name, port) {
  const ac = new AbortController();
  const cp = fork(path.resolve(__dirname, './dev-widget.js'), [name, port], { signal: ac.signal });
  cp.on('error', (err) => {
    // This will be called with err being an AbortError if the controller aborts
  });
  ac.signal.addEventListener('abort', () => {
    console.log(`${name} Aborted!`);
  }, { once: true });
  return [cp, ac];
}
