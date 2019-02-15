import React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, number } from "@storybook/addon-knobs";
import { withViewport } from "@storybook/addon-viewport";
import Pager from "../Pager/Pager";

storiesOf("Pager", module)
  .addDecorator(withKnobs)
  .addDecorator(withViewport())
  .add("Playground", () => {
    const pages = number("Pages", 4);
    return <Pager pages={pages} />;
  })
  .add(
    "Mobile",
    () => {
      const pages = number("Pages", 4);
      return <Pager pages={pages} />;
    },
    { viewport: "iphone6" }
  );
