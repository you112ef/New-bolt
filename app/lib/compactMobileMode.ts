/**
 * Compact Mobile Mode - Touch Optimization and Responsive Scaling
 * Provides automatic and manual compact mode functionality for bolt.diy
 */

interface CompactModeConfig {
  autoEnable: boolean;
  breakpoint: number;
  scaleFactor: number;
  touchMinSize: number;
  enablePassiveListeners: boolean;
}

class CompactMobileMode {
  private config: CompactModeConfig = {
    autoEnable: true,
    breakpoint: 480,
    scaleFactor: 0.857,
    touchMinSize: 40,
    enablePassiveListeners: true
  };

  private isCompactMode = false;
  private isManualMode = false;
  private resizeObserver: ResizeObserver | null = null;
  private mediaQuery: MediaQueryList | null = null;

  constructor(config?: Partial<CompactModeConfig>) {
    this.config = { ...this.config, ...config };
    this.init();
  }

  private init(): void {
    this.setupMediaQuery();
    this.setupResizeObserver();
    this.setupPassiveListeners();
    this.autoDetectAndApply();
  }

  private setupMediaQuery(): void {
    if (typeof window !== 'undefined') {
      this.mediaQuery = window.matchMedia(`(max-width: ${this.config.breakpoint}px)`);
      this.mediaQuery.addEventListener('change', this.handleMediaQueryChange.bind(this));
    }
  }

  private setupResizeObserver(): void {
    if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.target === document.documentElement) {
            this.autoDetectAndApply();
          }
        }
      });
      this.resizeObserver.observe(document.documentElement);
    }
  }

  private setupPassiveListeners(): void {
    if (!this.config.enablePassiveListeners || typeof window === 'undefined') return;

    // Add passive event listeners for better touch performance
    const touchEvents = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
    const passiveOptions = { passive: true, capture: false };

    touchEvents.forEach(eventType => {
      document.addEventListener(eventType, this.handleTouchEvent.bind(this), passiveOptions);
    });

    // Add touch-action manipulation to all interactive elements
    this.addTouchActionToElements();
  }

  private handleTouchEvent(event: TouchEvent): void {
    // Ensure touch events are handled efficiently
    if (event.type === 'touchstart') {
      // Add visual feedback for touch interactions
      const target = event.target as HTMLElement;
      if (target && this.isInteractiveElement(target)) {
        this.addTouchFeedback(target);
      }
    }
  }

  private isInteractiveElement(element: HTMLElement): boolean {
    const interactiveTags = ['button', 'a', 'input', 'select', 'textarea'];
    const interactiveRoles = ['button', 'link', 'tab', 'menuitem', 'option'];
    
    return (
      interactiveTags.includes(element.tagName.toLowerCase()) ||
      interactiveRoles.includes(element.getAttribute('role') || '') ||
      element.classList.contains('touch-target') ||
      element.classList.contains('touch-optimized')
    );
  }

  private addTouchFeedback(element: HTMLElement): void {
    element.style.transition = 'opacity 0.1s ease';
    element.style.opacity = '0.8';
    
    setTimeout(() => {
      element.style.opacity = '';
    }, 100);
  }

  private addTouchActionToElements(): void {
    const interactiveSelectors = [
      'button',
      'a',
      'input',
      'select',
      'textarea',
      '[role="button"]',
      '[role="tab"]',
      '[role="menuitem"]',
      '.touch-target',
      '.touch-optimized'
    ];

    interactiveSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element: HTMLElement) => {
        element.style.touchAction = 'manipulation';
      });
    });
  }

  private handleMediaQueryChange(event: MediaQueryListEvent): void {
    if (!this.isManualMode) {
      this.autoDetectAndApply();
    }
  }

  private autoDetectAndApply(): void {
    if (!this.config.autoEnable || this.isManualMode) return;

    const shouldEnable = window.innerWidth <= this.config.breakpoint;
    
    if (shouldEnable && !this.isCompactMode) {
      this.enableCompactMode();
    } else if (!shouldEnable && this.isCompactMode) {
      this.disableCompactMode();
    }
  }

  public enableCompactMode(): void {
    if (this.isCompactMode) return;

    this.isCompactMode = true;
    document.documentElement.classList.add('compact-mode');
    
    // Update CSS custom properties
    this.updateCSSProperties();
    
    // Re-apply touch optimizations
    this.addTouchActionToElements();
    
    // Dispatch custom event
    this.dispatchCompactModeEvent('enabled');
  }

  public disableCompactMode(): void {
    if (!this.isCompactMode) return;

    this.isCompactMode = false;
    document.documentElement.classList.remove('compact-mode', 'compact-mode-smaller');
    
    // Reset CSS custom properties
    this.resetCSSProperties();
    
    // Dispatch custom event
    this.dispatchCompactModeEvent('disabled');
  }

  public toggleCompactMode(): void {
    this.isManualMode = true;
    
    if (this.isCompactMode) {
      this.disableCompactMode();
    } else {
      this.enableCompactMode();
    }
  }

  public setCompactModeLevel(level: 'normal' | 'smaller'): void {
    this.isManualMode = true;
    
    if (level === 'smaller') {
      document.documentElement.classList.add('compact-mode-smaller');
      this.updateCSSProperties(0.8, 11);
    } else {
      document.documentElement.classList.remove('compact-mode-smaller');
      this.updateCSSProperties();
    }
  }

  private updateCSSProperties(scaleFactor?: number, fontSize?: number): void {
    const root = document.documentElement;
    const scale = scaleFactor || this.config.scaleFactor;
    const font = fontSize || 12;

    root.style.setProperty('--compact-scale-factor', scale.toString());
    root.style.setProperty('--compact-font-base', `${font}px`);
    root.style.setProperty('--compact-touch-min-size', `${this.config.touchMinSize}px`);
  }

  private resetCSSProperties(): void {
    const root = document.documentElement;
    root.style.removeProperty('--compact-scale-factor');
    root.style.removeProperty('--compact-font-base');
    root.style.removeProperty('--compact-touch-min-size');
  }

  private dispatchCompactModeEvent(action: 'enabled' | 'disabled'): void {
    const event = new CustomEvent('compactModeChange', {
      detail: {
        action,
        isCompact: this.isCompactMode,
        scaleFactor: this.config.scaleFactor
      }
    });
    document.dispatchEvent(event);
  }

  public getStatus(): { isCompact: boolean; isManual: boolean; scaleFactor: number } {
    return {
      isCompact: this.isCompactMode,
      isManual: this.isManualMode,
      scaleFactor: this.config.scaleFactor
    };
  }

  public updateConfig(newConfig: Partial<CompactModeConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (this.mediaQuery) {
      this.mediaQuery.removeEventListener('change', this.handleMediaQueryChange.bind(this));
    }
    
    this.setupMediaQuery();
    
    if (this.isCompactMode) {
      this.updateCSSProperties();
    }
  }

  public destroy(): void {
    if (this.mediaQuery) {
      this.mediaQuery.removeEventListener('change', this.handleMediaQueryChange.bind(this));
    }
    
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    
    this.disableCompactMode();
  }
}

// Create global instance
let compactMobileMode: CompactMobileMode | null = null;

export const initCompactMobileMode = (config?: Partial<CompactModeConfig>): CompactMobileMode => {
  if (typeof window === 'undefined') {
    throw new Error('CompactMobileMode can only be initialized in browser environment');
  }
  
  if (!compactMobileMode) {
    compactMobileMode = new CompactMobileMode(config);
  }
  
  return compactMobileMode;
};

export const getCompactMobileMode = (): CompactMobileMode | null => {
  return compactMobileMode;
};

export const destroyCompactMobileMode = (): void => {
  if (compactMobileMode) {
    compactMobileMode.destroy();
    compactMobileMode = null;
  }
};

// Auto-initialize when DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initCompactMobileMode();
    });
  } else {
    initCompactMobileMode();
  }
}

export default CompactMobileMode;