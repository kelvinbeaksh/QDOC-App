import { useEffect, useState } from "react";

const useHeight = () => {
  const [ height, setHeight ] = useState(window.innerHeight * (window.visualViewport?.scale || 1));

  useEffect(() => {
    const onResize = () => {
      setHeight(window.innerHeight * (window.visualViewport?.scale || 1));
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  });

  return `${height}px`;
};
export default useHeight;
