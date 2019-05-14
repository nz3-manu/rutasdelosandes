const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = {
  entry: './server.js',
  output: {
    path: path.resolve(__dirname, ''),
    filename: 'builtserver.js',
    publicPath: '/'
  },
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  externals: nodeExternals(),
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
  }
};