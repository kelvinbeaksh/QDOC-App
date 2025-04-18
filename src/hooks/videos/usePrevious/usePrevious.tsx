import { useEffect, useRef } from "react";

const usePrevious = <T extends unknown>(value: T): T| undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export default usePrevious;
