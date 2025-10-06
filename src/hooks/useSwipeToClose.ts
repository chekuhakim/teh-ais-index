import { useRef, useEffect } from 'react';

interface SwipeToCloseOptions {
  onClose: () => void;
  threshold?: number; // Minimum distance to trigger close
  enabled?: boolean;
}

export const useSwipeToClose = ({ onClose, threshold = 100, enabled = true }: SwipeToCloseOptions) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);
  const isDragging = useRef<boolean>(false);

  useEffect(() => {
    if (!enabled || !elementRef.current) return;

    const element = elementRef.current;

    const handleTouchStart = (e: TouchEvent) => {
      startY.current = e.touches[0].clientY;
      currentY.current = e.touches[0].clientY;
      isDragging.current = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      
      currentY.current = e.touches[0].clientY;
      const deltaY = currentY.current - startY.current;
      
      // Only allow downward swipes
      if (deltaY > 0) {
        // Add visual feedback by moving the modal slightly
        const translateY = Math.min(deltaY * 0.5, 50);
        element.style.transform = `translateY(${translateY}px)`;
        element.style.transition = 'none';
      }
    };

    const handleTouchEnd = () => {
      if (!isDragging.current) return;
      
      isDragging.current = false;
      const deltaY = currentY.current - startY.current;
      
      // Reset transform
      element.style.transform = '';
      element.style.transition = '';
      
      // Trigger close if swipe distance exceeds threshold
      if (deltaY > threshold) {
        onClose();
      }
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onClose, threshold, enabled]);

  return elementRef;
};
