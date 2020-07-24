var path = require("path");
const webpack = require("webpack");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

module.exports = env => {
  console.log("NODE_ENV: ", env.NODE_ENV); // 'local'
  let plugins = [];
  let devtool = "cheap-module-source-map";
  if (env.NODE_ENV != "local") {
    devtool = "source-map";
    plugins = [
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": '"production"'
      }),
      new UglifyJSPlugin()
    ];
  }
  return {
    entry: {
      index: "./_javascript/index.js"
    },
    output: {
      path: path.join(__dirname, "javascript"),
      filename: "[name].bundle.js"
    },
    cache: false,
    devtool: devtool,
    module: {
      rules: [
        {
          test: /\.m?js$/,
          include: [path.join(__dirname, "_javascript")],
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react']
            }
          }
        },
        {
          test: /\.css$/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                importLoaders: 1,
                sourceMap: true
              }
            }
          ]
        },
        {
          test: /\.(png|woff|woff2|eot|ttf|svg)$/,
          use: [
            {
              loader: "url-loader?limit=100000"
            }
          ]
        }
      ]
    },
    plugins: plugins
  };
};
