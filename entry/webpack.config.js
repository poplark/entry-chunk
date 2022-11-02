const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const EntryChunkPlugin = require('../extension/EntryChunkPlugin');

const baseDir = process.cwd();

console.log('base dir', baseDir);

module.exports = {
  mode: 'development',
  devtool: 'cheap-source-map',
  entry: {
    main: path.resolve(baseDir, 'entry/src/index.js')
  },
  output: {
    path: path.resolve(baseDir, 'dist/entry'),
    chunkLoadingGlobal: 'webpackJsonp'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'react-router-dom': 'ReactRouterDOM',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        // use: ['babel-loader'],
        use: [
          'babel-loader',
          {
            loader: EntryChunkPlugin.loader,
            options: {
              replacePublicPath: function(id) {
                if (id.indexOf('/widget') === 0) {
                  return '';
                }
              },
              replaceGetFilename: function(chunkId) {
                if (chunkId.indexOf('/widget') === 0) {
                  return chunkId;
                }
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html'),
      // filename: 'xx.html',
      // chunks: ['vendor', 'common', 'main']
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      /*  initial - 入口 chunk，对于异步导入的文件不处理
          async - 异步 chunk，只对异步导入的文件处理
          all - 全部 chunk
      */
      // 缓存分组
      cacheGroups: {
        // 第三方模块
        vendor: {
            name: 'vendor', // chunk 名称
            priority: 1, // 权限更高，优先抽离，重要！！！！
            test: /node_modules/,
            minSize: 0, // 大小限制，太小的也没必要抽出来，可以设成 3KB, 5KB 之类的
            minChunks: 1, // 最少复用过几次
        },
        // 公共模块
        common: {
            name: 'common',
            priority: 0,
            minSize: 0,
            minChunks: 2,
        }
      }
    }
  }
}
