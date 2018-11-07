const webpack = require("webpack");

const plugins = [new webpack.HotModuleReplacementPlugin()];

module.exports = require("./webpack.base")({
  mode: "development",
  devServer: {
    port: 3000,
    hot: true
  },
  plugins
});
