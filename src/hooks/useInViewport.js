import { useEffect, useState } from "react";

/**
 * Observa se o elemento ainda toca a viewport. Começa em `true` para o
 * primeiro quadro não sair em branco enquanto o observer não disparou.
 */
export function useInViewport(ref, rootMargin = "0px") {
  const [inViewport, setInViewport] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setInViewport(entry.isIntersecting),
      { rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return inViewport;
}
