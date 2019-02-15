import React, { useState } from "react";
import styled from "react-emotion";
import { mq } from "../../common";

import useResponsive from "../../customHooks/useResponsive";

const border = "1px solid lightgrey";

const centerStyle = ({ active }) => ({
  pointerEvents: "none",
  border: "none",
  [`@media ${mq[0]}`]: {
    pointerEvents: "auto",
    backgroundColor: active ? "lightgray" : "",
    border
  }
});

const prevNextStyle = ({ disabled }) => ({
  opacity: disabled ? 0.5 : 1,
  pointerEvents: disabled ? "none" : "auto",
  flexGrow: 1,
  [`@media ${mq[0]}`]: {
    flexGrow: 0,
    textAlign: "left"
  }
});

const A = styled.a({
  flexBasis: "2em",
  color: "black",
  textAlign: "center",
  textDecoration: "none",
  marginLeft: 10,
  padding: 5,
  border,
  userSelect: "none",
  ["&:active"]: {
    color: "white",
    backgroundColor: "darkgrey"
  }
});

const Container = styled.div`
  display: flex;
`;

const EllipsisLink = props => {
  return <Link {...props}>…</Link>;
};

const Link = ({ page, onClick, disabled, active, children, className }) => (
  <A
    className={className}
    href="#"
    onClick={event => {
      event.preventDefault();
      onClick(page);
    }}
    disabled={disabled}
    active={active}
  >
    {children}
  </A>
);

const PLink = styled(Link)(prevNextStyle, { marginLeft: 0 });
const PrevLink = props => {
  const isMobile = useResponsive();
  return (
    <PLink {...props} isMobile={isMobile}>
      {isMobile ? "<" : "Previous"}
    </PLink>
  );
};

const CLink = styled(Link)(centerStyle);
const CenterLink = props => {
  return <CLink {...props}>{props.page + 1}</CLink>;
};

const NLink = styled(Link)(prevNextStyle);
const NextLink = props => {
  const isMobile = useResponsive();
  return <NLink {...props}>{isMobile ? ">" : "Next"}</NLink>;
};

const Pager = ({ pages, initCurPage = 0, perPage = 10 }) => {
  const isMobile = useResponsive();
  const [curPage, setCurPage] = useState(initCurPage);
  const handleClick = page => {
    setCurPage(page);
  };
  let segment = [];
  if (isMobile) {
    segment.push(curPage);
  } else if (pages < 8 || curPage < 5) {
    segment.push(...Array.from({ length: Math.min(pages, 7) }, (_, i) => i));
  } else {
    /* do math to ensure curPage is 3rd last if more than 2 pages left, 2nd last if 1 page left or
       last in pager if no more pages left */
    const pagesLeft = Math.min(pages - curPage - 1, 2); // - 1 because curPage is 0-indexed
    const offset = curPage - 4 + pagesLeft;
    segment.push(
      0,
      offset - 2,
      ...Array.from({ length: 5 }, (_, i) => offset + i)
    );
  }
  return (
    <Container>
      <PrevLink
        page={curPage - 1}
        disabled={curPage === 0}
        onClick={handleClick}
      />
      {segment.map((page, i) => {
        const Tag = i === 1 && segment[2] !== 2 ? EllipsisLink : CenterLink;
        return (
          <Tag page={page} active={curPage === page} onClick={handleClick} />
        );
      })}
      <NextLink
        page={curPage + 1}
        disabled={curPage === pages - 1}
        onClick={handleClick}
      />
    </Container>
  );
};

export default Pager;
