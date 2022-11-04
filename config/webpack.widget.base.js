const path = require('path');
const externals = require('./externals');
const EntryChunkPlugin = require('../extension/entry-chunk-plugin');

const baseDir = process.cwd();

console.log('base dir', baseDir);

module.exports = {
  output: {
    filename: '[name].[contenthash:8].js',
    library: {
      name: 'someLibName', // todo - 暂不支持 [name] 变量方式(多个 entry 可能会有问题)，也不支持 string[] 和 {amd: ...} 形式
      type: 'var', // 仅支持 var, umd, umd2
    },
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      'x-common': path.resolve(baseDir, 'common/src')
    }
  },
  externals: externals,
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  plugins: [
    new EntryChunkPlugin()
  ]
}
