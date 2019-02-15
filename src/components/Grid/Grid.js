import React, { Component } from "react";
import styled from "react-emotion";

const GridContainer = styled.div`
  background: cornsilk;
  display: grid;
  grid-template-columns: repeat(${({ cols = 3 }) => cols}, minmax(100px, 1fr));
  grid-gap: 20px;
`;

const Img = styled.img`
  width: 100%;
`;

const Figure = styled.figure`
  margin: 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
`;

const Figcaption = styled.figcaption`
  padding: 10px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  h2 {
    font-size: 12px;
    margin-top: 0;
    hyphens: auto;
  }
  p {
    font-size: 10px;
    line-height: 1.2em;
    position: relative;
    height: 3.6em;
    overflow: hidden;
    margin: 0;
    padding: 1px 0;
    flex-grow: 1;
  }
  .fade::after {
    content: "";
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    height: 2.4em;
    background: linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
  }
`;

class FigCaption extends Component {
  constructor(...args) {
    super(...args);
    this.state = { fade: false };
  }

  componentDidMount() {
    const { clientHeight, scrollHeight } = this.pNode;
    console.log(this.pNode, clientHeight, scrollHeight);
    const styles = window.getComputedStyle(this.pNode);
    const height =
      Math.floor(clientHeight / parseInt(styles.lineHeight)) *
      parseInt(styles.lineHeight);
    if (clientHeight < scrollHeight) {
      this.setState({ fade: true, height });
    }
    if (clientHeight >= scrollHeight) {
      this.setState({ fade: false, height });
    }
  }

  render() {
    const { src, alt, title, subtitle } = this.props;
    return (
      <Figure>
        <Img src={src} alt={alt} />
        <Figcaption>
          {title ? <h2>{title}</h2> : null}
          {subtitle ? (
            <p
              ref={node => (this.pNode = node)}
              className={this.state.fade ? "fade" : ""}
              style={{ maxHeight: this.state.height }}
            >
              {subtitle}
            </p>
          ) : null}
        </Figcaption>
      </Figure>
    );
  }
}

class Grid extends Component {
  static FigCaption = FigCaption;
  render() {
    return (
      <GridContainer cols={this.props.cols}>
        {this.props.children}
      </GridContainer>
    );
  }
}

export default Grid;
