// icon source https://www.materialui.co/icon/search

import React from "react";
import Search from "./Search";
import Clear from "./Clear";
import { css } from "emotion";

const tags = {
  Search, Clear
};

export default ({ name, customCss, ...props }) => {
  const Tag = tags[name[0].toUpperCase() + name.slice(1).toLowerCase()];
  return (
    <Tag
      {...props}
      className={css`
        ${customCss};
        vertical-align: bottom;
      `}
    />
  );
};
