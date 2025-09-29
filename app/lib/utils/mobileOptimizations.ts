/**
 * Mobile optimization utilities for Control Panel
 * Provides enhanced touch interactions and mobile-specific functionality
 */

// Detect mobile devices
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
         window.innerWidth <= 768 ||
         ('ontouchstart' in window);
};

// Detect if device has a small screen
export const isSmallScreen = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 480;
};

// Detect if device is in landscape mode
export const isLandscape = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth > window.innerHeight;
};

// Get optimal touch target size based on device
export const getTouchTargetSize = (): number => {
  if (isSmallScreen()) return 52; // Larger for very small screens
  if (isMobile()) return 48; // Standard mobile size
  return 44; // Minimum recommended size
};

// Enhanced touch event handling
export const addTouchOptimizations = (element: HTMLElement): void => {
  if (!element) return;

  // Add touch-action manipulation to prevent zoom
  element.style.touchAction = 'manipulation';
  
  // Add passive event listeners for better performance
  const touchStartHandler = (e: TouchEvent) => {
    // Add visual feedback
    element.style.transform = 'scale(0.98)';
    element.style.opacity = '0.8';
  };

  const touchEndHandler = (e: TouchEvent) => {
    // Remove visual feedback
    element.style.transform = 'scale(1)';
    element.style.opacity = '1';
  };

  // Add event listeners with passive: true for better performance
  element.addEventListener('touchstart', touchStartHandler, { passive: true });
  element.addEventListener('touchend', touchEndHandler, { passive: true });
  element.addEventListener('touchcancel', touchEndHandler, { passive: true });
};

// Optimize scroll behavior for mobile
export const optimizeScroll = (element: HTMLElement): void => {
  if (!element) return;

  // Add smooth scrolling
  element.style.scrollBehavior = 'smooth';
  
  // Add momentum scrolling for iOS
  (element.style as any).webkitOverflowScrolling = 'touch';
  
  // Prevent overscroll bounce
  element.style.overscrollBehavior = 'contain';
};

// Handle viewport changes (keyboard appearance, orientation change)
export const handleViewportChanges = (callback: () => void): (() => void) => {
  if (typeof window === 'undefined') return () => {};

  let timeoutId: NodeJS.Timeout;
  
  const handleResize = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(callback, 100);
  };

  const handleOrientationChange = () => {
    // Delay to allow orientation change to complete
    setTimeout(callback, 500);
  };

  window.addEventListener('resize', handleResize, { passive: true });
  window.addEventListener('orientationchange', handleOrientationChange, { passive: true });

  // Return cleanup function
  return () => {
    clearTimeout(timeoutId);
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('orientationchange', handleOrientationChange);
  };
};

// Prevent zoom on input focus (iOS Safari)
export const preventZoomOnFocus = (): void => {
  if (typeof window === 'undefined') return;

  const inputs = document.querySelectorAll('input, textarea, select');
  
  inputs.forEach(input => {
    const element = input as HTMLElement;
    
    // Set font-size to 16px to prevent zoom on iOS
    if (isMobile()) {
      element.style.fontSize = '16px';
    }
  });
};

// Optimize modal positioning for mobile
export const optimizeModalPosition = (modal: HTMLElement): void => {
  if (!modal) return;

  if (isMobile()) {
    // Ensure modal is properly positioned on mobile
    modal.style.position = 'fixed';
    modal.style.top = '2.5vh';
    modal.style.left = '2.5vw';
    modal.style.right = '2.5vw';
    modal.style.bottom = '2.5vh';
    modal.style.width = 'auto';
    modal.style.height = 'auto';
    modal.style.margin = '0';
    modal.style.transform = 'none';
  }
};

// Add haptic feedback for supported devices
export const addHapticFeedback = (element: HTMLElement): void => {
  if (!element) return;

  const triggerHaptic = () => {
    // Check if haptic feedback is supported
    if ('vibrate' in navigator) {
      navigator.vibrate(10); // Short vibration
    }
  };

  element.addEventListener('touchstart', triggerHaptic, { passive: true });
};

// Optimize dropdown positioning for mobile
export const optimizeDropdownPosition = (dropdown: HTMLElement): void => {
  if (!dropdown) return;

  if (isMobile()) {
    // On mobile, position dropdown at bottom of screen
    dropdown.style.position = 'fixed';
    dropdown.style.bottom = '0';
    dropdown.style.left = '0';
    dropdown.style.right = '0';
    dropdown.style.top = 'auto';
    dropdown.style.width = '100%';
    dropdown.style.maxWidth = '100%';
    dropdown.style.borderRadius = '16px 16px 0 0';
    dropdown.style.margin = '0';
    dropdown.style.transform = 'none';
  }
};

// Initialize mobile optimizations for the entire Control Panel
export const initializeMobileOptimizations = (): (() => void) => {
  if (typeof window === 'undefined') return () => {};

  // Prevent zoom on input focus
  preventZoomOnFocus();

  // Handle viewport changes
  const cleanupViewport = handleViewportChanges(() => {
    // Re-optimize elements when viewport changes
    const modals = document.querySelectorAll('[role="dialog"]');
    const dropdowns = document.querySelectorAll('[role="menu"]');
    
    modals.forEach(modal => optimizeModalPosition(modal as HTMLElement));
    dropdowns.forEach(dropdown => optimizeDropdownPosition(dropdown as HTMLElement));
  });

  // Add touch optimizations to all interactive elements
  const interactiveElements = document.querySelectorAll(
    'button, [role="button"], [role="tab"], [role="menuitem"], .touch-optimized'
  );

  interactiveElements.forEach(element => {
    addTouchOptimizations(element as HTMLElement);
    addHapticFeedback(element as HTMLElement);
  });

  // Optimize scroll containers
  const scrollContainers = document.querySelectorAll('.overflow-y-auto, .mobile-scroll-optimized');
  scrollContainers.forEach(container => {
    optimizeScroll(container as HTMLElement);
  });

  // Return cleanup function
  return () => {
    cleanupViewport();
  };
};

// Utility to check if element is in viewport (for mobile optimization)
export const isInViewport = (element: HTMLElement): boolean => {
  if (!element) return false;

  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

// Debounce utility for mobile performance
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle utility for scroll events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};