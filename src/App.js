import React, { Component } from "react";
import { hot } from "react-hot-loader";
import styled from "react-emotion";

const Header = styled("h1")`
  font-size: 20px;
  color: blue;
`;

class App extends Component {
  render() {
    return (
      <div>
        <Header>Header</Header>
        <p>hello it works</p>
        <input type="text" />
      </div>
    );
  }
}

export default hot(module)(App);
