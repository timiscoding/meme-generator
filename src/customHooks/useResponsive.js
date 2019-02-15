import { useState, useEffect } from "react";
import { mq } from "../common";

export default () => {
  const mql = window.matchMedia(mq[0]);
  const [isMobile, setMobile] = useState(!mql.matches);
  useEffect(() => {
    const handleQuery = mql => {
      setMobile(!mql.matches);
    };
    mql.addListener(handleQuery);
    return () => mql.removeListener(handleQuery);
  }, []);
  return isMobile;
};
