/**
 * Configuration loader utility for LinkTree Modern
 * Handles loading, validation, and merging of configuration files
 */

import type { 
  LinkTreeConfig, 
  ConfigError, 
  ValidationResult,
  DeepPartial 
} from '@/types/config';
import { 
  validateConfig as validateConfigSecurity,
  sanitizeConfig as sanitizeConfigSecurity,
  validateUrl,
  validateHexColor
} from './validation';

// Default configuration fallback
const DEFAULT_CONFIG: LinkTreeConfig = {
  profile: {
    name: "Your Name",
    bio: "Welcome to my links! Find all my important stuff here.",
    avatar: "https://via.placeholder.com/400x400/6366f1/ffffff?text=You",
    location: ""
  },
  links: [
    {
      title: "My Website",
      url: "https://example.com",
      description: "Check out my main website",
      icon: "globe",
      enabled: true,
      newTab: true,
      featured: false
    },
    {
      title: "Contact Me",
      url: "mailto:hello@example.com",
      description: "Get in touch via email",
      icon: "mail",
      enabled: true,
      newTab: false,
      featured: true
    }
  ],
  socialMedia: {
    twitter: "",
    instagram: "",
    github: "",
    linkedin: "",
    youtube: "",
    tiktok: "",
    discord: "",
    twitch: ""
  },
  theme: {
    colorScheme: "auto",
    primaryColor: "#6366f1",
    backgroundStyle: "gradient",
    backgroundImage: "",
    fontFamily: "inter",
    buttonStyle: "rounded",
    buttonAnimation: "scale",
    showBorder: true
  },
  layout: {
    maxWidth: "md",
    alignment: "center",
    spacing: "normal",
    showProfileFirst: true,
    showSocialMedia: true,
    socialMediaPosition: "bottom"
  },
  seo: {
    title: "My Links",
    description: "Find all my important links in one place",
    keywords: "links, profile, bio, social media",
    favicon: ""
  },
  analytics: {
    googleAnalyticsId: "",
    facebookPixelId: "",
    trackClicks: true,
    trackSocialClicks: true
  },
  advanced: {
    enablePWA: false,
    enableDarkMode: true,
    enableAnimations: true,
    preloadImages: true
  }
};

/**
 * Validates a configuration object against the expected schema
 */
export function validateConfig(config: any): ValidationResult {
  const errors: ConfigError[] = [];
  const warnings: ConfigError[] = [];

  // Validate profile section
  if (!config.profile) {
    errors.push({ field: 'profile', message: 'Profile section is required' });
  } else {
    if (!config.profile.name || typeof config.profile.name !== 'string') {
      errors.push({ field: 'profile.name', message: 'Profile name is required and must be a string' });
    }
    if (!config.profile.bio || typeof config.profile.bio !== 'string') {
      errors.push({ field: 'profile.bio', message: 'Profile bio is required and must be a string' });
    }
    if (!config.profile.avatar || typeof config.profile.avatar !== 'string') {
      errors.push({ field: 'profile.avatar', message: 'Profile avatar URL is required and must be a string' });
    } else if (!isValidUrl(config.profile.avatar)) {
      warnings.push({ field: 'profile.avatar', message: 'Profile avatar should be a valid URL' });
    }
  }

  // Validate links array
  if (!Array.isArray(config.links)) {
    errors.push({ field: 'links', message: 'Links must be an array' });
  } else {
    config.links.forEach((link: any, index: number) => {
      const prefix = `links[${index}]`;
      if (!link.title || typeof link.title !== 'string') {
        errors.push({ field: `${prefix}.title`, message: 'Link title is required and must be a string' });
      }
      if (!link.url || typeof link.url !== 'string') {
        errors.push({ field: `${prefix}.url`, message: 'Link URL is required and must be a string' });
      } else if (!isValidUrl(link.url)) {
        errors.push({ field: `${prefix}.url`, message: 'Link URL must be a valid URL' });
      }
      if (typeof link.enabled !== 'boolean') {
        warnings.push({ field: `${prefix}.enabled`, message: 'Link enabled should be a boolean' });
      }
    });
  }

  // Validate theme section
  if (!config.theme) {
    errors.push({ field: 'theme', message: 'Theme section is required' });
  } else {
    const validColorSchemes = ['light', 'dark', 'auto'];
    if (!validColorSchemes.includes(config.theme.colorScheme)) {
      errors.push({ 
        field: 'theme.colorScheme', 
        message: `Color scheme must be one of: ${validColorSchemes.join(', ')}` 
      });
    }
    
    if (!isValidHexColor(config.theme.primaryColor)) {
      errors.push({ field: 'theme.primaryColor', message: 'Primary color must be a valid hex color' });
    }
  }

  // Validate layout section
  if (!config.layout) {
    errors.push({ field: 'layout', message: 'Layout section is required' });
  }

  // Validate SEO section
  if (!config.seo) {
    errors.push({ field: 'seo', message: 'SEO section is required' });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Loads configuration from multiple sources and merges them
 */
export async function loadConfig(): Promise<LinkTreeConfig> {
  try {
    // Try to load user configuration
    const userConfig = await loadUserConfig();

    // Merge with defaults
    const mergedConfig = mergeConfig(DEFAULT_CONFIG, userConfig);

    // Validate the final configuration using security validation
    const validation = validateConfigSecurity(mergedConfig);

    if (!validation.isValid) {
      console.warn('Configuration validation errors:', validation.errors);
      // Return default config with any valid user overrides
      return mergeConfig(DEFAULT_CONFIG, sanitizeConfigSecurity(mergedConfig));
    }

    if (validation.warnings.length > 0) {
      console.warn('Configuration validation warnings:', validation.warnings);
    }

    // Apply additional sanitization to prevent XSS
    return sanitizeConfigSecurity(mergedConfig);
  } catch (error) {
    console.error('Failed to load configuration:', error);
    return DEFAULT_CONFIG;
  }
}

/**
 * Loads user configuration from config.json
 */
async function loadUserConfig(): Promise<DeepPartial<LinkTreeConfig>> {
  try {
    const response = await fetch('/src/config.json');
    if (!response.ok) {
      throw new Error(`Failed to load config: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn('Could not load user config, using defaults:', error);
    return {};
  }
}

/**
 * Deep merges configuration objects
 */
export function mergeConfig<T>(base: T, override: DeepPartial<T>): T {
  const result = { ...base };
  
  for (const key in override) {
    const overrideValue = override[key];
    const baseValue = base[key];
    
    if (overrideValue === undefined) {
      continue;
    }
    
    if (isObject(overrideValue) && isObject(baseValue) && !Array.isArray(overrideValue)) {
      (result as any)[key] = mergeConfig(baseValue, overrideValue);
    } else {
      (result as any)[key] = overrideValue;
    }
  }
  
  return result;
}

/**
 * Sanitizes configuration by removing invalid fields
 */
function sanitizeConfig(config: any): DeepPartial<LinkTreeConfig> {
  if (!config || typeof config !== 'object') {
    return {};
  }
  
  const sanitized: any = {};
  
  // Sanitize profile
  if (config.profile && typeof config.profile === 'object') {
    sanitized.profile = {};
    if (typeof config.profile.name === 'string') {
      sanitized.profile.name = config.profile.name;
    }
    if (typeof config.profile.bio === 'string') {
      sanitized.profile.bio = config.profile.bio;
    }
    if (typeof config.profile.avatar === 'string') {
      sanitized.profile.avatar = config.profile.avatar;
    }
    if (typeof config.profile.location === 'string') {
      sanitized.profile.location = config.profile.location;
    }
  }
  
  // Sanitize links
  if (Array.isArray(config.links)) {
    sanitized.links = config.links
      .filter((link: any) => 
        link && 
        typeof link === 'object' && 
        typeof link.title === 'string' && 
        typeof link.url === 'string'
      )
      .map((link: any) => ({
        title: link.title,
        url: link.url,
        description: typeof link.description === 'string' ? link.description : '',
        icon: typeof link.icon === 'string' ? link.icon : 'link',
        enabled: typeof link.enabled === 'boolean' ? link.enabled : true,
        newTab: typeof link.newTab === 'boolean' ? link.newTab : true,
        featured: typeof link.featured === 'boolean' ? link.featured : false
      }));
  }
  
  // Sanitize other sections similarly...
  if (config.theme && typeof config.theme === 'object') {
    sanitized.theme = {};
    const validColorSchemes = ['light', 'dark', 'auto'];
    if (validColorSchemes.includes(config.theme.colorScheme)) {
      sanitized.theme.colorScheme = config.theme.colorScheme;
    }
    if (isValidHexColor(config.theme.primaryColor)) {
      sanitized.theme.primaryColor = config.theme.primaryColor;
    }
    // Add other theme fields...
  }
  
  return sanitized;
}

/**
 * Utility functions
 */
function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}

function isValidUrl(url: string): boolean {
  return validateUrl(url);
}

function isValidHexColor(color: string): boolean {
  return validateHexColor(color);
}

/**
 * Updates the document title and meta tags based on SEO config
 */
export function updateSEOMetadata(seo: LinkTreeConfig['seo']): void {
  // Update document title
  document.title = seo.title;
  
  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', seo.description);
  }
  
  // Update meta keywords
  const metaKeywords = document.querySelector('meta[name="keywords"]');
  if (metaKeywords) {
    metaKeywords.setAttribute('content', seo.keywords);
  }
  
  // Update Open Graph title
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute('content', seo.title);
  }
  
  // Update Open Graph description
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) {
    ogDescription.setAttribute('content', seo.description);
  }
  
  // Update Twitter title
  const twitterTitle = document.querySelector('meta[name="twitter:title"]');
  if (twitterTitle) {
    twitterTitle.setAttribute('content', seo.title);
  }
  
  // Update Twitter description
  const twitterDescription = document.querySelector('meta[name="twitter:description"]');
  if (twitterDescription) {
    twitterDescription.setAttribute('content', seo.description);
  }
  
  // Update favicon if provided
  if (seo.favicon) {
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      favicon.setAttribute('href', seo.favicon);
    }
  }
}

/**
 * Applies theme CSS variables to the document
 */
export function applyThemeVariables(theme: LinkTreeConfig['theme']): void {
  const root = document.documentElement;
  
  // Convert hex to RGB for transparency usage
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };
  
  const primaryRgb = hexToRgb(theme.primaryColor);
  
  // Set CSS variables
  root.style.setProperty('--primary-color', theme.primaryColor);
  if (primaryRgb) {
    root.style.setProperty('--primary-color-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);
  }
  
  // Set font family
  const fontFamilyMap = {
    inter: 'Inter, system-ui, sans-serif',
    poppins: 'Poppins, system-ui, sans-serif',
    roboto: 'Roboto, system-ui, sans-serif',
    montserrat: 'Montserrat, system-ui, sans-serif',
    playfair: 'Playfair Display, serif'
  };
  root.style.setProperty('--font-family', fontFamilyMap[theme.fontFamily]);
  
  // Set background image if provided
  if (theme.backgroundStyle === 'image' && theme.backgroundImage) {
    root.style.setProperty('--background-image', `url(${theme.backgroundImage})`);
  } else {
    root.style.removeProperty('--background-image');
  }
}

/**
 * Gets the effective color scheme based on user preference and system preference
 */
export function getEffectiveColorScheme(colorScheme: LinkTreeConfig['theme']['colorScheme']): 'light' | 'dark' {
  if (colorScheme === 'auto') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return colorScheme;
}

/**
 * Applies dark mode class to document
 */
export function applyColorScheme(colorScheme: LinkTreeConfig['theme']['colorScheme']): void {
  const isDark = getEffectiveColorScheme(colorScheme) === 'dark';
  
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

export { DEFAULT_CONFIG };