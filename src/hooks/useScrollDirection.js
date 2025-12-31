import { useState, useEffect } from "react";

export function useScrollDirection() {
  const [scrollDir, setScrollDir] = useState("up");

  useEffect(() => {
    let lastScrollY = window.pageYOffset;

    const updateScrollDir = () => {
      const scrollY = window.pageYOffset;
      const direction = scrollY > lastScrollY ? "down" : "up";
      if (direction !== scrollDir && (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)) {
        setScrollDir(direction);
      }
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };

    const onScroll = () => window.requestAnimationFrame(updateScrollDir);

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollDir]);

  return scrollDir;
}