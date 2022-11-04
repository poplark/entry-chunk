const path = require('path');

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
  },
}
