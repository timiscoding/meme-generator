module.exports = api => {
  api.cache.invalidate(() => process.env.NODE_ENV === "production");
  return {
    presets: [
      ["@babel/preset-env", { useBuiltIns: "usage", modules: false }],
      "@babel/preset-react"
    ],
    plugins: ["react-hot-loader/babel", "babel-plugin-styled-components"]
  };
};
