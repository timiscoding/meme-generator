const path = require("path");

module.exports = require("./webpack.base")({
  mode: "production",
  devServer: {
    port: 3000,
    contentBase: path.join(process.cwd(), "dist/")
  }
});
