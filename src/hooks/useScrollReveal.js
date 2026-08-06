import { useEffect, useRef, useState } from "react";

export function useScrollReveal({ index = 0, step = 80 } = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setVisible(true);
      return undefined;
    }

    let timerId;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          timerId = setTimeout(() => setVisible(true), index * step);
          observer.unobserve(node);
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (timerId) clearTimeout(timerId);
    };
  }, [index, step]);

  return { ref, className: visible ? "is-visible" : "" };
}
