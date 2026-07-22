import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * PageTransition
 * Wraps page content and replays a CSS fade+slide-up animation on every route change.
 * The animation class is toggled via the route location.key so it re-fires on every nav.
 */
export default function PageTransition({ children }) {
  const location = useLocation();
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Remove the class first so re-adding it re-triggers the animation
    el.classList.remove('page-enter');
    // Force a reflow to restart the animation
    void el.offsetWidth;
    el.classList.add('page-enter');
  }, [location.key]);

  return (
    <div ref={ref} className="page-enter w-full">
      {children}
    </div>
  );
}
