/**
 * React hook for Compact Mobile Mode functionality
 * Provides easy access to compact mode state and controls
 */

import { useState, useEffect, useCallback } from 'react';
import { getCompactMobileMode, type CompactMobileMode } from '../compactMobileMode';

interface UseCompactMobileModeReturn {
  isCompactMode: boolean;
  isManualMode: boolean;
  scaleFactor: number;
  enableCompactMode: () => void;
  disableCompactMode: () => void;
  toggleCompactMode: () => void;
  setCompactModeLevel: (level: 'normal' | 'smaller') => void;
  status: {
    isCompact: boolean;
    isManual: boolean;
    scaleFactor: number;
  };
}

export const useCompactMobileMode = (): UseCompactMobileModeReturn => {
  const [compactMode, setCompactMode] = useState<CompactMobileMode | null>(null);
  const [isCompactMode, setIsCompactMode] = useState(false);
  const [isManualMode, setIsManualMode] = useState(false);
  const [scaleFactor, setScaleFactor] = useState(1);

  useEffect(() => {
    const mode = getCompactMobileMode();
    if (mode) {
      setCompactMode(mode);
      const status = mode.getStatus();
      setIsCompactMode(status.isCompact);
      setIsManualMode(status.isManual);
      setScaleFactor(status.scaleFactor);
    }

    // Listen for compact mode changes
    const handleCompactModeChange = (event: CustomEvent) => {
      const { action, isCompact, scaleFactor: newScaleFactor } = event.detail;
      setIsCompactMode(isCompact);
      setScaleFactor(newScaleFactor);
    };

    document.addEventListener('compactModeChange', handleCompactModeChange as EventListener);

    return () => {
      document.removeEventListener('compactModeChange', handleCompactModeChange as EventListener);
    };
  }, []);

  const enableCompactMode = useCallback(() => {
    if (compactMode) {
      compactMode.enableCompactMode();
    }
  }, [compactMode]);

  const disableCompactMode = useCallback(() => {
    if (compactMode) {
      compactMode.disableCompactMode();
    }
  }, [compactMode]);

  const toggleCompactMode = useCallback(() => {
    if (compactMode) {
      compactMode.toggleCompactMode();
    }
  }, [compactMode]);

  const setCompactModeLevel = useCallback((level: 'normal' | 'smaller') => {
    if (compactMode) {
      compactMode.setCompactModeLevel(level);
    }
  }, [compactMode]);

  const status = {
    isCompact: isCompactMode,
    isManual: isManualMode,
    scaleFactor
  };

  return {
    isCompactMode,
    isManualMode,
    scaleFactor,
    enableCompactMode,
    disableCompactMode,
    toggleCompactMode,
    setCompactModeLevel,
    status
  };
};

export default useCompactMobileMode;