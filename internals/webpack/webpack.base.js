const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const plugins = [
  new HtmlWebpackPlugin({
    inject: true,
    template: path.join(process.cwd(), "src/index.html")
  })
];

module.exports = options => ({
  mode: options.mode,
  entry: [path.join(process.cwd(), "./src/index.js")],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader"
          }
        ]
      }
    ]
  },
  devServer: options.devServer,
  plugins: options.plugins.concat(plugins)
});