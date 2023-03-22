const path = require('path');
const fs = require('fs');

const baseDir = process.cwd();

console.log('base dir', baseDir);

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  output: {
    publicPath: '', // todo - 开发模式下，HMR 会覆盖掉 entry-chunk-loader 注入的方法，目前只能写死 publicPath 为 ''
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    open: false,
    hot: true,
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }
      devServer.app.get('/routes.json', (_, response) => {
        const routesFile = path.resolve(baseDir, 'widgets.json');
        if (routesFile) {
          response.send(fs.readFileSync(routesFile));
        } else {
          const routesExample = JSON.stringify([{name: 'wa', path: 'wa', file: '/widget/wa/wa.js'}]);
          response.send(routesExample);
          fs.writeFileSync(JSON.stringify(routesExample));
        }
      });
      return middlewares;
    }
  },
}
