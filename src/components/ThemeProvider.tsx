/**
 * ThemeProvider component for managing theme state and configuration
 */

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { 
  loadConfig, 
  applyThemeVariables, 
  applyColorScheme, 
  updateSEOMetadata,
  getEffectiveColorScheme 
} from '@/utils/config-loader';
import type { LinkTreeConfig, ThemeContextValue, DeepPartial } from '@/types/config';

// Create the theme context
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * ThemeProvider component that manages global theme state and configuration
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [config, setConfig] = useState<LinkTreeConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load configuration on mount
  useEffect(() => {
    let mounted = true;

    const initializeConfig = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const loadedConfig = await loadConfig();
        
        if (mounted) {
          setConfig(loadedConfig);
          
          // Apply theme immediately
          applyThemeVariables(loadedConfig.theme);
          applyColorScheme(loadedConfig.theme.colorScheme);
          updateSEOMetadata(loadedConfig.seo);
        }
      } catch (err) {
        console.error('Failed to load configuration:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load configuration');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeConfig();

    return () => {
      mounted = false;
    };
  }, []);

  // Listen for system color scheme changes
  useEffect(() => {
    if (!config) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (config.theme.colorScheme === 'auto') {
        applyColorScheme('auto');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [config?.theme.colorScheme]);

  // Update configuration function
  const updateConfig = (updates: DeepPartial<LinkTreeConfig>) => {
    if (!config) return;

    const newConfig = mergeDeep(config, updates);
    setConfig(newConfig);

    // Apply theme changes immediately
    if (updates.theme) {
      applyThemeVariables(newConfig.theme);
      applyColorScheme(newConfig.theme.colorScheme);
    }

    // Apply SEO changes
    if (updates.seo) {
      updateSEOMetadata(newConfig.seo);
    }
  };

  // Get current dark mode state
  const isDarkMode = useMemo(() => {
    if (!config) return false;
    return getEffectiveColorScheme(config.theme.colorScheme) === 'dark';
  }, [config?.theme.colorScheme]);

  // Toggle dark mode function
  const toggleDarkMode = () => {
    if (!config) return;

    const newColorScheme = isDarkMode ? 'light' : 'dark';
    updateConfig({
      theme: {
        colorScheme: newColorScheme
      }
    });
  };

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo<ThemeContextValue | undefined>(() => {
    if (!config) return undefined;

    return {
      config,
      updateConfig,
      isDarkMode,
      toggleDarkMode,
    };
  }, [config, isDarkMode]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center space-y-4">
          <div className="loading-spinner mx-auto" />
          <p className="text-gray-600 dark:text-gray-400">Loading your LinkTree...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="error-message max-w-md">
          <h2 className="text-lg font-semibold mb-2">Configuration Error</h2>
          <p className="mb-4">{error || 'Failed to load configuration'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!contextValue) {
    return null;
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to use the theme context
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}

/**
 * Hook to use only the configuration (lighter alternative to useTheme)
 */
export function useConfig(): LinkTreeConfig {
  const { config } = useTheme();
  return config;
}

/**
 * Hook to check if dark mode is active
 */
export function useDarkMode(): boolean {
  const { isDarkMode } = useTheme();
  return isDarkMode;
}

/**
 * Deep merge utility function
 */
function mergeDeep<T>(target: T, source: DeepPartial<T>): T {
  const result = { ...target };
  
  for (const key in source) {
    const sourceValue = source[key];
    const targetValue = target[key];
    
    if (sourceValue === undefined) {
      continue;
    }
    
    if (
      isObject(sourceValue) && 
      isObject(targetValue) && 
      !Array.isArray(sourceValue)
    ) {
      (result as any)[key] = mergeDeep(targetValue, sourceValue);
    } else {
      (result as any)[key] = sourceValue;
    }
  }
  
  return result;
}

function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}