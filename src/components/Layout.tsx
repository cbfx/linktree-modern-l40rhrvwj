/**
 * Layout component for responsive design and structure
 */

import React from 'react';
import { clsx } from 'clsx';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import type { LayoutProps } from '@/types/config';

/**
 * Main layout component that handles responsive design and theme application
 */
export function Layout({ config, children }: LayoutProps) {
  const { isDarkMode, toggleDarkMode } = useTheme();

  // Get layout classes based on configuration
  const layoutClasses = getLayoutClasses(config);
  const containerClasses = getContainerClasses(config);
  const backgroundClasses = getBackgroundClasses(config);

  return (
    <div className={clsx('main-container', backgroundClasses, layoutClasses)}>
      {/* Skip to main content link for accessibility */}
      <a 
        href="#main-content" 
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById('main-content')?.focus();
        }}
      >
        Skip to main content
      </a>

      {/* Dark mode toggle (if enabled) */}
      {config.advanced.enableDarkMode && (
        <button
          onClick={toggleDarkMode}
          className="theme-toggle no-print"
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
      )}

      {/* Main content wrapper */}
      <div className={clsx('content-wrapper', containerClasses)}>
        <main 
          id="main-content"
          className="w-full focus:outline-none"
          tabIndex={-1}
          role="main"
          aria-label="LinkTree content"
        >
          {children}
        </main>
      </div>


      {/* Analytics scripts */}
      <AnalyticsScripts config={config} />
    </div>
  );
}

/**
 * Analytics scripts component with proper validation and security
 */
function AnalyticsScripts({ config }: { config: LayoutProps['config'] }) {
  const { analytics } = config;

  // Validate Google Analytics ID format
  const isValidGoogleAnalyticsId = (id: string): boolean => {
    return /^G-[A-Z0-9]{10}$/.test(id);
  };

  // Validate Facebook Pixel ID format
  const isValidFacebookPixelId = (id: string): boolean => {
    return /^[0-9]{15,16}$/.test(id);
  };

  React.useEffect(() => {
    // Google Analytics setup using modern gtag API
    if (analytics.googleAnalyticsId && isValidGoogleAnalyticsId(analytics.googleAnalyticsId)) {
      // Load gtag script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${analytics.googleAnalyticsId}`;
      document.head.appendChild(script);

      // Initialize gtag
      script.onload = () => {
        (window as any).dataLayer = (window as any).dataLayer || [];
        function gtag(...args: any[]) {
          (window as any).dataLayer.push(args);
        }
        (window as any).gtag = gtag;
        
        gtag('js', new Date());
        gtag('config', analytics.googleAnalyticsId, {
          page_title: document.title,
          page_location: window.location.href,
          send_page_view: true
        });
      };
    }

    // Facebook Pixel setup
    if (analytics.facebookPixelId && isValidFacebookPixelId(analytics.facebookPixelId)) {
      (window as any).fbq = (window as any).fbq || function() {
        ((window as any).fbq.q = (window as any).fbq.q || []).push(arguments);
      };
      (window as any).fbq.q = (window as any).fbq.q || [];
      (window as any).fbq.loaded = true;
      (window as any).fbq.version = '2.0';
      
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://connect.facebook.net/en_US/fbevents.js';
      document.head.appendChild(script);
      
      script.onload = () => {
        (window as any).fbq('init', analytics.facebookPixelId);
        (window as any).fbq('track', 'PageView');
      };
    }
  }, [analytics.googleAnalyticsId, analytics.facebookPixelId]);

  return null; // No need to render anything, scripts are loaded via useEffect
}

/**
 * Get layout classes based on configuration
 */
function getLayoutClasses(config: LayoutProps['config']): string {
  const classes = [];

  // Spacing classes
  classes.push(`spacing-${config.layout.spacing}`);

  // Alignment classes
  classes.push(`align-${config.layout.alignment}`);

  // Animation classes
  if (config.advanced.enableAnimations) {
    classes.push('page-enter');
  }

  return clsx(classes);
}

/**
 * Get container classes based on configuration
 */
function getContainerClasses(config: LayoutProps['config']): string {
  const classes = ['content-container'];

  // Max width classes
  classes.push(`max-w-${config.layout.maxWidth}`);

  return clsx(classes);
}

/**
 * Get background classes based on configuration
 */
function getBackgroundClasses(config: LayoutProps['config']): string {
  const { theme } = config;

  switch (theme.backgroundStyle) {
    case 'solid':
      return 'bg-solid';
    case 'gradient':
      return 'bg-gradient';
    case 'image':
      return theme.backgroundImage ? 'bg-image' : 'bg-gradient';
    default:
      return 'bg-gradient';
  }
}

/**
 * ResponsiveContainer component for adaptive layouts
 */
export function ResponsiveContainer({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <div className={clsx(
      'w-full max-w-md mx-auto px-4 sm:max-w-lg md:max-w-xl lg:max-w-2xl',
      className
    )}>
      {children}
    </div>
  );
}

/**
 * Section component for organizing content
 */
export function Section({ 
  children, 
  className, 
  spacing = 'normal',
  ...props 
}: { 
  children: React.ReactNode; 
  className?: string;
  spacing?: 'compact' | 'normal' | 'relaxed';
} & React.HTMLAttributes<HTMLElement>) {
  const spacingClasses = {
    compact: 'space-y-3',
    normal: 'space-y-6',
    relaxed: 'space-y-8'
  };

  return (
    <section 
      className={clsx(spacingClasses[spacing], className)} 
      {...props}
    >
      {children}
    </section>
  );
}

/**
 * AnimatedContainer component for staggered animations
 */
export function AnimatedContainer({ 
  children, 
  className,
  enableAnimations = true,
  stagger = false 
}: { 
  children: React.ReactNode; 
  className?: string;
  enableAnimations?: boolean;
  stagger?: boolean;
}) {
  if (!enableAnimations) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={clsx(
      className,
      stagger && 'space-y-4'
    )}>
      {children}
    </div>
  );
}

/**
 * AccessibilityProvider component for enhanced accessibility
 */
export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    // Add focus management for keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip to main content on Ctrl+/
      if (e.ctrlKey && e.key === '/') {
        e.preventDefault();
        document.getElementById('main-content')?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Announce page changes to screen readers
  React.useEffect(() => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = 'Page content loaded';
    
    document.body.appendChild(announcement);
    
    const timer = setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);

    return () => {
      clearTimeout(timer);
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    };
  }, []);

  return <>{children}</>;
}

export default Layout;