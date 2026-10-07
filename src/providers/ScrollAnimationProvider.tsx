'use client';

import React, { useEffect } from 'react';
import Lenis from 'lenis';

interface ScrollAnimationProviderProps {
  children: React.ReactNode;
}

export const ScrollAnimationProvider: React.FC<ScrollAnimationProviderProps> = ({ children }) => {
  useEffect(() => {
    // 1. Initialize Lenis Smooth Momentum Scrolling with instant zero-lag response
    const lenis = new Lenis({
      duration: 0.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.15,
      touchMultiplier: 1.5,
      infinite: false,
    });
    (window as any).__lenis = lenis;

    let animationFrameId: number;
    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }
    animationFrameId = requestAnimationFrame(raf);

    // 2. Automated IntersectionObserver for elements with [data-reveal] or .scroll-reveal-auto
    const revealCallback: IntersectionObserverCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          // Optionally unobserve if only once
          const once = entry.target.getAttribute('data-reveal-once') !== 'false';
          if (once) {
            observer.unobserve(entry.target);
          }
        } else {
          const once = entry.target.getAttribute('data-reveal-once') !== 'false';
          if (!once) {
            entry.target.classList.remove('is-revealed');
          }
        }
      });
    };

    const observer = new IntersectionObserver(revealCallback, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    });

    const observeElements = () => {
      const elements = document.querySelectorAll('.scroll-reveal-auto, [data-reveal]');
      elements.forEach((el) => {
        if (!el.classList.contains('is-revealed')) {
          observer.observe(el);
        }
      });
    };

    observeElements();

    // Re-observe when DOM dynamically updates
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return <>{children}</>;
};

export default ScrollAnimationProvider;
