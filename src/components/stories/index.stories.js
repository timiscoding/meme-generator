import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import {
  withKnobs,
  text,
  select,
  boolean,
  object
} from "@storybook/addon-knobs";
import styled from "react-emotion";

const Button = styled.button(
  {
    fontSize: 20,
    padding: 5
  },
  ({ theme }) =>
    theme === "dark"
      ? {
          background: "chocolate",
          color: "honeydew"
        }
      : {
          background: "cornsilk",
          color: "crimson"
        }
);

storiesOf("Button", module)
  .addDecorator(withKnobs)

  .add("with text", () => (
    <Button onClick={action("clicked")}>Hello button</Button>
  ))
  .add("with some emoji", () => (
    <Button onClick={action("clicked")}>
      <span role="img" aria-label="so cool">
        😀 😇 😍 🙌
      </span>
    </Button>
  ))
  .add("playground", () => (
    <Button
      theme={select("theme", ["light", "dark"])}
      disabled={boolean("disabled", false)}
      style={object("style", {
        "font-size": 20,
        padding: 5
      })}
      onClick={action("clicked")}
    >
      {text("label", "default label")}
    </Button>
  ));
