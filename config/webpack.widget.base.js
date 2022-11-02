const path = require('path');
const EntryChunkPlugin = require('../extension/EntryChunkPlugin');

const baseDir = process.cwd();

console.log('base dir', baseDir);

module.exports = {
  mode: 'development',
  devtool: 'cheap-source-map',
  output: {
    filename: '[name].[contenthash:8].js',
    path: path.resolve(baseDir, `dist/widget`),
    library: {
      name: 'someLibName',
      type: 'var', // var, umd, umd2
    },
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      'x-common': path.resolve(baseDir, 'common/src')
    }
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
        use: ['babel-loader']
      }
    ]
  },
  plugins: [
    new EntryChunkPlugin({
      publicPath: '/widget' // 注意这个是构建后，服务器保存的地址
    })
  ]
}
