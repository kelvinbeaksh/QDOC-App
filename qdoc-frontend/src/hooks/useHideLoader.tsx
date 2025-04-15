import { useEffect } from "react";

export const useHideLoader = (): void => {
  useEffect(() => {
    const overlay = document.querySelector(".loader-overlay");
    const loader = document.querySelector(".main-loader");

    setTimeout(() => {
      loader.remove();
      overlay.remove();
    }, 300);
  }, []);
};
