import { configure } from "@storybook/react";

/* require.context is a webpack module that lets us dynamically import story files found in
src/components, searching all subdir and ends in storiesOf.js */
const req = require.context("../src/components", true, /\.stories\.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
