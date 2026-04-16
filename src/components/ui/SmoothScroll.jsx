import { useEffect } from 'react';
import Lenis from 'lenis';

let lenis;

const SmoothScroll = () => {
  useEffect(() => {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return null;
};

export const scrollTo = (target, options = {}) => lenis?.scrollTo(target, options);

export default SmoothScroll;