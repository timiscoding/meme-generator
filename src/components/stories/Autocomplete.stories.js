import React from "react";
import { storiesOf } from "@storybook/react";
import Autocomplete from "../Autocomplete/Autocomplete";

storiesOf("Autocomplete", module).add("Playground", () => {
  return (
    <Autocomplete
      options={[
        "Papaya",
        "Persimmon",
        "Paw Paw",
        "Prickly Pear",
        "Peach",
        "Pomegranate",
        "Pineapple"
      ]}
    />
  );
});
