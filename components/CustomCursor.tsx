'use client';

import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorType, setCursorType] = useState<'default' | 'pointer' | 'text' | 'grab'>('default');

  useEffect(() => {
    // Track mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    // Track mouse down/up for click animation
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    // Detect interactive elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.onclick !== null ||
        target.getAttribute('role') === 'button' ||
        target.closest('a, button, [role="button"], input, textarea, select') !== null;

      setIsHovering(isInteractive);

      // Determine cursor type
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        setCursorType('text');
      } else if (target.closest('[data-grab]')) {
        setCursorType('grab');
      } else if (isInteractive) {
        setCursorType('pointer');
      } else {
        setCursorType('default');
      }
    };

    const handleMouseOut = () => {
      setIsHovering(false);
      setCursorType('default');
    };

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    // Hide default cursor on desktop
    if (window.matchMedia('(pointer: fine)').matches) {
      document.body.style.cursor = 'none';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.body.style.cursor = '';
    };
  }, []);

  // Don't show custom cursor on mobile/touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  const cursorSize = isHovering ? 48 : 32; // Fitts's Law: larger targets for interactive elements
  const clickScale = isClicking ? 0.8 : 1;

  return (
    <>
      {/* Main cursor */}
      <div
        className="custom-cursor"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) scale(${clickScale})`,
          width: `${cursorSize}px`,
          height: `${cursorSize}px`,
          opacity: isHovering ? 1 : 0.7,
        }}
        data-cursor-type={cursorType}
      />

      {/* Outer ring for better visibility */}
      <div
        className="custom-cursor-ring"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) scale(${isHovering ? 1.5 : 1})`,
          width: `${cursorSize * 1.5}px`,
          height: `${cursorSize * 1.5}px`,
        }}
      />
    </>
  );
}

