'use client';

import React, { useEffect, useRef, useState } from 'react';

export type ScrollAnimationType =
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'zoom-in'
  | 'fade';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  animation?: ScrollAnimationType;
  delay?: number; // Delay in milliseconds
  duration?: number; // Duration in milliseconds
  threshold?: number; // Visibility percentage before triggering (0.1 = 10%)
  once?: boolean; // Trigger once or re-trigger
  as?: React.ElementType;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  animation = 'fade-up',
  delay = 0,
  duration = 700,
  threshold = 0.12,
  once = true,
  as: Component = 'div',
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px', // Trigger slightly before it hits bottom of viewport
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, once]);

  // Initial transforms and styling based on animation choice
  const getAnimationStyles = (): React.CSSProperties => {
    const baseTransition = `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, filter ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`;

    if (isVisible) {
      return {
        opacity: 1,
        transform: 'translate3d(0, 0, 0) scale(1)',
        filter: 'blur(0px)',
        transition: baseTransition,
        willChange: 'opacity, transform, filter',
      };
    }

    let initialTransform = 'translate3d(0, 36px, 0)';
    switch (animation) {
      case 'fade-up':
        initialTransform = 'translate3d(0, 38px, 0)';
        break;
      case 'fade-down':
        initialTransform = 'translate3d(0, -38px, 0)';
        break;
      case 'fade-left':
        initialTransform = 'translate3d(-40px, 0, 0)';
        break;
      case 'fade-right':
        initialTransform = 'translate3d(40px, 0, 0)';
        break;
      case 'zoom-in':
        initialTransform = 'translate3d(0, 20px, 0) scale(0.92)';
        break;
      case 'fade':
        initialTransform = 'translate3d(0, 0, 0)';
        break;
    }

    return {
      opacity: 0,
      transform: initialTransform,
      filter: 'blur(4px)',
      transition: baseTransition,
      willChange: 'opacity, transform, filter',
    };
  };

  return (
    <Component
      ref={ref}
      style={getAnimationStyles()}
      className={`scroll-reveal-item ${className}`}
    >
      {children}
    </Component>
  );
};

export default ScrollReveal;
