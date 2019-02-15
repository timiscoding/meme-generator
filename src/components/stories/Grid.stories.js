import React from "react";
import { storiesOf } from "@storybook/react";
import { withKnobs, number } from "@storybook/addon-knobs";
import faker from "faker";
import Grid from "../Grid/Grid";

const figures = Array.from({ length: 30 }, (_, i) => ({
  src: `${faker.image.animals()}#${i}`,
  alt: faker.random.word(),
  title: faker.random.words(),
  subtitle: faker.lorem.sentence()
}));

storiesOf("Grid", module)
  .addDecorator(withKnobs)

  .add("playground", () => {
    const cols = number("columns", 3);

    return (
      <Grid cols={cols}>
        {figures.slice(0, 2 * cols).map(f => (
          <Grid.FigCaption {...f} key={Math.random()} />
        ))}
      </Grid>
    );
  });
