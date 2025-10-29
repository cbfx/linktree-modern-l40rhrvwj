/**
 * TypeScript types for LinkTree Modern configuration
 */

import React from 'react';

export interface ProfileConfig {
  name: string;
  bio: string;
  avatar: string;
  location?: string;
}

export interface LinkConfig {
  title: string;
  url: string;
  description?: string;
  icon: string;
  enabled: boolean;
  newTab: boolean;
  featured: boolean;
}

export interface SocialMediaConfig {
  twitter?: string;
  instagram?: string;
  github?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
  discord?: string;
  twitch?: string;
}

export type ColorScheme = 'light' | 'dark' | 'auto';
export type BackgroundStyle = 'solid' | 'gradient' | 'image';
export type FontFamily = 'inter' | 'poppins' | 'roboto' | 'montserrat' | 'playfair';
export type ButtonStyle = 'rounded' | 'square' | 'pill';
export type ButtonAnimation = 'none' | 'scale' | 'glow' | 'lift';

export interface ThemeConfig {
  colorScheme: ColorScheme;
  primaryColor: string;
  backgroundStyle: BackgroundStyle;
  backgroundImage?: string;
  fontFamily: FontFamily;
  buttonStyle: ButtonStyle;
  buttonAnimation: ButtonAnimation;
  showBorder: boolean;
}

export type MaxWidth = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type Alignment = 'left' | 'center' | 'right';
export type Spacing = 'compact' | 'normal' | 'relaxed';
export type SocialMediaPosition = 'top' | 'bottom' | 'both';

export interface LayoutConfig {
  maxWidth: MaxWidth;
  alignment: Alignment;
  spacing: Spacing;
  showProfileFirst: boolean;
  showSocialMedia: boolean;
  socialMediaPosition: SocialMediaPosition;
}

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  favicon?: string;
}

export interface AnalyticsConfig {
  googleAnalyticsId?: string;
  facebookPixelId?: string;
  trackClicks: boolean;
  trackSocialClicks: boolean;
}

export interface AdvancedConfig {
  enablePWA: boolean;
  enableDarkMode: boolean;
  enableAnimations: boolean;
  preloadImages: boolean;
}

export interface LinkTreeConfig {
  profile: ProfileConfig;
  links: LinkConfig[];
  socialMedia: SocialMediaConfig;
  theme: ThemeConfig;
  layout: LayoutConfig;
  seo: SEOConfig;
  analytics: AnalyticsConfig;
  advanced: AdvancedConfig;
}

// Utility types for components
export interface ThemeContextValue {
  config: LinkTreeConfig;
  updateConfig: (updates: Partial<LinkTreeConfig>) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export interface LinkClickEvent {
  linkTitle: string;
  linkUrl: string;
  timestamp: number;
  featured: boolean;
}

export interface SocialClickEvent {
  platform: string;
  username: string;
  timestamp: number;
}

// Component prop types
export interface ProfileProps {
  profile: ProfileConfig;
  className?: string;
}

export interface LinkButtonProps {
  link: LinkConfig;
  theme: ThemeConfig;
  onLinkClick?: (event: LinkClickEvent) => void;
  className?: string;
}

export interface SocialMediaProps {
  socialMedia: SocialMediaConfig;
  position: SocialMediaPosition;
  onSocialClick?: (event: SocialClickEvent) => void;
  className?: string;
}

export interface LayoutProps {
  config: LinkTreeConfig;
  children: React.ReactNode;
}

// Error types
export interface ConfigError {
  field: string;
  message: string;
  value?: any;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

// Analytics types
export interface AnalyticsEvent {
  type: 'link_click' | 'social_click' | 'page_view' | 'theme_change';
  data: Record<string, any>;
  timestamp: number;
}

// Configuration validation types
export interface ValidationResult {
  isValid: boolean;
  errors: ConfigError[];
  warnings: ConfigError[];
}

// Theme CSS variables interface
export interface ThemeCSSVariables {
  '--primary-color': string;
  '--primary-color-rgb': string;
  '--background-image'?: string;
  '--font-family': string;
  '--max-width': string;
  '--spacing': string;
}

// Font loading state
export interface FontLoadingState {
  inter: boolean;
  poppins: boolean;
  roboto: boolean;
  montserrat: boolean;
  playfair: boolean;
}

// SEO metadata interface
export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  favicon?: string;
  structuredData: Record<string, any>;
}

// Performance metrics
export interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  interactionToNextPaint: number;
}

// Accessibility features
export interface AccessibilityConfig {
  highContrast: boolean;
  reducedMotion: boolean;
  screenReaderOptimized: boolean;
  keyboardNavigation: boolean;
}

// Export utility type for deep partial updates
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Configuration update type
export type ConfigUpdate = DeepPartial<LinkTreeConfig>;

// Icon names type (for better type safety with Lucide icons)
export type IconName = 
  | 'globe' 
  | 'mail' 
  | 'book-open' 
  | 'briefcase' 
  | 'link'
  | 'phone'
  | 'map-pin'
  | 'calendar'
  | 'camera'
  | 'music'
  | 'video'
  | 'shopping-cart'
  | 'heart'
  | 'star'
  | 'user'
  | 'users'
  | 'message-circle'
  | 'send'
  | 'download'
  | 'upload'
  | 'play'
  | 'pause'
  | 'stop'
  | 'home'
  | 'settings'
  | 'search'
  | 'filter'
  | 'edit'
  | 'trash'
  | 'plus'
  | 'minus'
  | 'check'
  | 'x'
  | 'arrow-right'
  | 'arrow-left'
  | 'arrow-up'
  | 'arrow-down'
  | 'external-link'
  | 'copy'
  | 'share'
  | 'bookmark'
  | 'flag'
  | 'gift'
  | 'coffee'
  | 'pizza'
  | 'gamepad'
  | 'headphones'
  | 'laptop'
  | 'smartphone'
  | 'tablet'
  | 'tv'
  | 'wifi'
  | 'bluetooth'
  | 'battery'
  | 'zap'
  | 'sun'
  | 'moon'
  | 'cloud'
  | 'umbrella'
  | 'tree'
  | 'flower'
  | 'car'
  | 'plane'
  | 'ship'
  | 'train'
  | 'bike'
  | 'walking';

// Social media platform types
export type SocialPlatform = 
  | 'twitter'
  | 'instagram' 
  | 'github'
  | 'linkedin'
  | 'youtube'
  | 'tiktok'
  | 'discord'
  | 'twitch'
  | 'facebook'
  | 'snapchat'
  | 'pinterest'
  | 'reddit'
  | 'telegram'
  | 'whatsapp'
  | 'signal'
  | 'mastodon'
  | 'threads';

// Theme preset interface
export interface ThemePreset {
  name: string;
  description: string;
  config: Partial<ThemeConfig>;
  preview: string;
}

// Animation preferences
export interface AnimationPreferences {
  enablePageTransitions: boolean;
  enableHoverEffects: boolean;
  enableLoadingAnimations: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
}

// PWA configuration
export interface PWAConfig {
  enabled: boolean;
  name: string;
  shortName: string;
  description: string;
  themeColor: string;
  backgroundColor: string;
  display: 'fullscreen' | 'standalone' | 'minimal-ui' | 'browser';
  orientation: 'any' | 'portrait' | 'landscape';
}

// Export all types as a module
export type {
  LinkTreeConfig as Config,
  ThemeContextValue as ThemeContext,
  ConfigUpdate as Update,
  ValidationResult as Validation,
  SEOMetadata as SEO,
  PerformanceMetrics as Performance,
};