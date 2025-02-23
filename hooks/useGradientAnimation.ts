"use client";

import { useEffect, useRef } from "react";

export function useGradientAnimation() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const colors = ["#00caeb", "#df3f8b", "#060885"];
    let currentIndex = 0;

    const updateColors = () => {
      if (!ref.current) return;
      
      const nextIndex = (currentIndex + 1) % colors.length;
      const prevIndex = (currentIndex - 1 + colors.length) % colors.length;

      ref.current.style.setProperty("--color1", colors[prevIndex]);
      ref.current.style.setProperty("--color2", colors[currentIndex]);
      ref.current.style.setProperty("--color3", colors[nextIndex]);

      currentIndex = nextIndex;
    };

    updateColors();
    const interval = setInterval(updateColors, 5000);

    return () => clearInterval(interval);
  }, []);

  return ref;
} 