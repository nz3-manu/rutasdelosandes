var path = require("path");

module.exports = {
  entry: {
    index: "./_javascript/index.js"
  },
  output: {
    path: path.join(__dirname, "javascript"),
    filename: "[name].bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["babel-loader"],
        include: [path.join(__dirname, "_javascript")]
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true,
              importLoaders: 1,
              sourceMap: false
            }
          }
        ]
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, "_site"),
    inline: true
  }
};
