/**
 * Input validation and sanitization utilities for security
 */

import type { LinkTreeConfig, ConfigError, ValidationResult } from '@/types/config';

/**
 * Validate URL format and security
 */
export function validateUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    
    // Only allow http, https, mailto, and tel protocols
    const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
    if (!allowedProtocols.includes(urlObj.protocol)) {
      return false;
    }
    
    // Block dangerous URLs
    const dangerousPatterns = [
      /javascript:/i,
      /data:/i,
      /vbscript:/i,
      /file:/i,
      /ftp:/i,
    ];
    
    return !dangerousPatterns.some(pattern => pattern.test(url));
  } catch {
    return false;
  }
}

/**
 * Validate image URL format and security
 */
export function validateImageUrl(url: string): boolean {
  if (!validateUrl(url)) {
    return false;
  }
  
  // Must be http/https for images
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return false;
  }
  
  // Check for valid image extensions
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i;
  return imageExtensions.test(url);
}

/**
 * Sanitize text input to prevent XSS
 */
export function sanitizeText(text: string): string {
  if (!text) return '';
  
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

/**
 * Validate Google Analytics ID format
 */
export function validateGoogleAnalyticsId(id: string): boolean {
  return /^G-[A-Z0-9]{10}$/.test(id);
}

/**
 * Validate Facebook Pixel ID format
 */
export function validateFacebookPixelId(id: string): boolean {
  return /^[0-9]{15,16}$/.test(id);
}

/**
 * Validate social media username patterns
 */
export function validateSocialMediaUsername(platform: string, username: string): boolean {
  if (!username) return true; // Optional field
  
  const patterns: Record<string, RegExp> = {
    twitter: /^[A-Za-z0-9_]{1,15}$/,
    instagram: /^[A-Za-z0-9_.]{1,30}$/,
    github: /^[A-Za-z0-9-]{1,39}$/,
    linkedin: /^[A-Za-z0-9-]{3,100}$/,
    tiktok: /^[A-Za-z0-9_.]{1,24}$/,
    twitch: /^[A-Za-z0-9_]{4,25}$/,
  };
  
  const pattern = patterns[platform];
  return pattern ? pattern.test(username) : true;
}

/**
 * Validate hex color format
 */
export function validateHexColor(color: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
}

/**
 * Validate complete configuration object
 */
export function validateConfig(config: LinkTreeConfig): ValidationResult {
  const errors: ConfigError[] = [];
  const warnings: ConfigError[] = [];
  
  // Validate profile
  if (!config.profile.name || config.profile.name.length === 0) {
    errors.push({ field: 'profile.name', message: 'Name is required' });
  }
  
  if (config.profile.name && config.profile.name.length > 50) {
    errors.push({ field: 'profile.name', message: 'Name must be 50 characters or less' });
  }
  
  if (config.profile.bio && config.profile.bio.length > 160) {
    errors.push({ field: 'profile.bio', message: 'Bio must be 160 characters or less' });
  }
  
  if (config.profile.avatar && !validateImageUrl(config.profile.avatar)) {
    errors.push({ field: 'profile.avatar', message: 'Invalid avatar URL format' });
  }
  
  if (config.profile.location && config.profile.location.length > 50) {
    errors.push({ field: 'profile.location', message: 'Location must be 50 characters or less' });
  }
  
  // Validate links
  if (config.links.length > 20) {
    errors.push({ field: 'links', message: 'Maximum 20 links allowed' });
  }
  
  config.links.forEach((link, index) => {
    if (!link.title || link.title.length === 0) {
      errors.push({ field: `links[${index}].title`, message: 'Link title is required' });
    }
    
    if (link.title && link.title.length > 50) {
      errors.push({ field: `links[${index}].title`, message: 'Link title must be 50 characters or less' });
    }
    
    if (!link.url || !validateUrl(link.url)) {
      errors.push({ field: `links[${index}].url`, message: 'Invalid URL format' });
    }
    
    if (link.url && link.url.length > 2048) {
      errors.push({ field: `links[${index}].url`, message: 'URL too long (max 2048 characters)' });
    }
    
    if (link.description && link.description.length > 100) {
      errors.push({ field: `links[${index}].description`, message: 'Description must be 100 characters or less' });
    }
  });
  
  // Validate social media
  Object.entries(config.socialMedia).forEach(([platform, username]) => {
    if (username && !validateSocialMediaUsername(platform, username)) {
      errors.push({ field: `socialMedia.${platform}`, message: `Invalid ${platform} username format` });
    }
  });
  
  // Validate theme
  if (!validateHexColor(config.theme.primaryColor)) {
    errors.push({ field: 'theme.primaryColor', message: 'Invalid hex color format' });
  }
  
  if (config.theme.backgroundImage && !validateImageUrl(config.theme.backgroundImage)) {
    errors.push({ field: 'theme.backgroundImage', message: 'Invalid background image URL' });
  }
  
  // Validate SEO
  if (config.seo.title && config.seo.title.length > 60) {
    warnings.push({ field: 'seo.title', message: 'Title longer than 60 characters may be truncated in search results' });
  }
  
  if (config.seo.description && config.seo.description.length > 160) {
    warnings.push({ field: 'seo.description', message: 'Description longer than 160 characters may be truncated' });
  }
  
  if (config.seo.favicon && !validateImageUrl(config.seo.favicon)) {
    errors.push({ field: 'seo.favicon', message: 'Invalid favicon URL format' });
  }
  
  // Validate analytics
  if (config.analytics.googleAnalyticsId && !validateGoogleAnalyticsId(config.analytics.googleAnalyticsId)) {
    errors.push({ field: 'analytics.googleAnalyticsId', message: 'Invalid Google Analytics ID format (should be G-XXXXXXXXXX)' });
  }
  
  if (config.analytics.facebookPixelId && !validateFacebookPixelId(config.analytics.facebookPixelId)) {
    errors.push({ field: 'analytics.facebookPixelId', message: 'Invalid Facebook Pixel ID format' });
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Sanitize configuration object to prevent XSS
 */
export function sanitizeConfig(config: LinkTreeConfig): LinkTreeConfig {
  return {
    profile: {
      name: sanitizeText(config.profile.name),
      bio: sanitizeText(config.profile.bio),
      avatar: config.profile.avatar, // URLs don't need HTML sanitization
      location: config.profile.location ? sanitizeText(config.profile.location) : undefined,
    },
    links: config.links.map(link => ({
      ...link,
      title: sanitizeText(link.title),
      description: link.description ? sanitizeText(link.description) : undefined,
    })),
    socialMedia: config.socialMedia, // Usernames are validated separately
    theme: config.theme, // Colors and enums don't need sanitization
    layout: config.layout, // Enums don't need sanitization
    seo: {
      title: sanitizeText(config.seo.title),
      description: sanitizeText(config.seo.description),
      keywords: sanitizeText(config.seo.keywords),
      favicon: config.seo.favicon,
    },
    analytics: config.analytics, // IDs are validated separately
    advanced: config.advanced, // Boolean values don't need sanitization
  };
}

/**
 * Check if URL is safe for external linking
 */
export function isSafeExternalUrl(url: string): boolean {
  if (!validateUrl(url)) {
    return false;
  }
  
  try {
    const urlObj = new URL(url);
    
    // Block localhost and private IPs to prevent SSRF
    const hostname = urlObj.hostname.toLowerCase();
    const privateIpPatterns = [
      /^localhost$/,
      /^127\./,
      /^192\.168\./,
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^::1$/,
      /^fc00:/,
      /^fe80:/,
    ];
    
    return !privateIpPatterns.some(pattern => pattern.test(hostname));
  } catch {
    return false;
  }
}

/**
 * Rate limiting for configuration updates (simple in-memory implementation)
 */
class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  
  isAllowed(key: string, maxAttempts: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const record = this.attempts.get(key);
    
    if (!record || now > record.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }
    
    if (record.count >= maxAttempts) {
      return false;
    }
    
    record.count++;
    return true;
  }
  
  reset(key: string): void {
    this.attempts.delete(key);
  }
}

export const configUpdateRateLimit = new RateLimiter();