const isTest = String(process.env.NODE_ENV) === "test";
const notProd = String(process.env.NODE_ENV) !== "production";

module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        // imports polyfills if environment doesn't support it. else use native impl.
        useBuiltIns: "usage",
        // jest doesn't understand es modules. Else use webpack modules as it can do treeshaking and HMR can swap updated modules when using `import`
        modules: isTest ? "commonjs" : false
      }
    ],
    "@babel/preset-react"
  ],
  plugins: [
    notProd ? ["emotion", { sourceMap: true, autoLabel: true }] : "emotion",
    "react-hot-loader/babel", // preserves react state when code changes
    "@babel/plugin-proposal-class-properties"
  ]
};
