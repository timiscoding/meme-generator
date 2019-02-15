// https://usehooks.com/useWindowSize/

import React, { useState, useEffect } from "react";

export default () => {
  const isClient = typeof window === "object";
  const getSize = () => ({
    width: window.innerWidth,
    height: window.innerHeight
  });

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    if (!isClient) return false;
    const handleResize = () => {
      setWindowSize(getSize());
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return windowSize;
};
