const nodeExternals = require("webpack-node-externals");

// webpack.functions.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
    ],
  },
  externals: nodeExternals(),
};
