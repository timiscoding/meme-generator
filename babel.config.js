module.exports = api => {
  api.cache.invalidate(() => process.env.NODE_ENV === "production");
  return {
    presets: [
      [
        "@babel/preset-env",
        {
          // imports polyfills if environment doesn't support it. else use native impl.
          useBuiltIns: "usage", // use webpack modules so that HMR can swap updated modules when using `import`
          modules: false
        }
      ],
      "@babel/preset-react"
    ],
    plugins: [
      // preserves react state when code changes
      "react-hot-loader/babel",
      "babel-plugin-styled-components",
      "@babel/plugin-proposal-class-properties"
    ],
    env: {
      test: {
        presets: [
          // jest needs 'modules' option set to true in order to work
          "@babel/preset-env",
          "@babel/preset-react"
        ]
      }
    }
  };
};
