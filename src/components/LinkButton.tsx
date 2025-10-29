/**
 * LinkButton component for displaying individual links
 */

import React from 'react';
import { ExternalLink, Mail, Phone } from 'lucide-react';
import { clsx } from 'clsx';
import type { LinkButtonProps, LinkClickEvent } from '@/types/config';

// Dynamic icon import utility
const getIcon = async (iconName: string) => {
  try {
    const icons = await import('lucide-react');
    const IconComponent = (icons as any)[toPascalCase(iconName)];
    return IconComponent || icons.Link;
  } catch {
    const { Link } = await import('lucide-react');
    return Link;
  }
};

// Convert kebab-case to PascalCase for icon names
function toPascalCase(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * LinkButton component for individual link display
 */
export function LinkButton({ link, theme, onLinkClick, className }: LinkButtonProps) {
  const [IconComponent, setIconComponent] = React.useState<React.ComponentType<any> | null>(null);

  // Load icon dynamically
  React.useEffect(() => {
    let mounted = true;

    const loadIcon = async () => {
      try {
        const Icon = await getIcon(link.icon);
        if (mounted) {
          setIconComponent(() => Icon);
        }
      } catch (error) {
        console.warn(`Failed to load icon "${link.icon}":`, error);
        if (mounted) {
          const { Link } = await import('lucide-react');
          setIconComponent(() => Link);
        }
      }
    };

    loadIcon();

    return () => {
      mounted = false;
    };
  }, [link.icon]);

  // Handle link click
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Track click if analytics enabled
    if (onLinkClick) {
      const clickEvent: LinkClickEvent = {
        linkTitle: link.title,
        linkUrl: link.url,
        timestamp: Date.now(),
        featured: link.featured
      };
      onLinkClick(clickEvent);
    }

    // Handle special URL schemes
    if (link.url.startsWith('mailto:') || link.url.startsWith('tel:')) {
      // Let browser handle these naturally
      return;
    }

    // For external links, ensure they open in new tab if configured
    if (link.newTab && !link.url.startsWith('#') && !link.url.startsWith('/')) {
      e.currentTarget.target = '_blank';
      e.currentTarget.rel = 'noopener noreferrer';
    }
  };

  // Get button classes based on theme configuration
  const buttonClasses = getButtonClasses(theme, link.featured);

  // Determine if link is external
  const isExternal = !link.url.startsWith('/') && 
                   !link.url.startsWith('#') && 
                   !link.url.startsWith('mailto:') && 
                   !link.url.startsWith('tel:');

  const showExternalIcon = isExternal && link.newTab;

  return (
    <a
      href={link.url}
      onClick={handleClick}
      className={clsx('btn-link link-enter', buttonClasses, className)}
      target={link.newTab && isExternal ? '_blank' : undefined}
      rel={link.newTab && isExternal ? 'noopener noreferrer' : undefined}
      aria-label={link.description ? `${link.title}: ${link.description}` : link.title}
    >
      <div className="link-content">
        {/* Icon */}
        <div className="link-icon" aria-hidden="true">
          {IconComponent ? (
            <IconComponent className="w-5 h-5" />
          ) : (
            <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
          )}
        </div>

        {/* Text content */}
        <div className="link-text">
          <div className="link-title">{link.title}</div>
          {link.description && (
            <div className="link-description">{link.description}</div>
          )}
        </div>

        {/* External link indicator */}
        {showExternalIcon && (
          <ExternalLink className="link-external" aria-hidden="true" />
        )}
      </div>

      {/* Featured badge */}
      {link.featured && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full" 
             aria-label="Featured link" />
      )}
    </a>
  );
}

/**
 * LinkButtonSkeleton for loading state
 */
export function LinkButtonSkeleton({ className }: { className?: string }) {
  return (
    <div className={clsx('btn-link', className)}>
      <div className="link-content">
        <div className="w-5 h-5 skeleton rounded" />
        <div className="flex-1 space-y-1">
          <div className="h-4 skeleton rounded w-3/4" />
          <div className="h-3 skeleton rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}

/**
 * SocialMediaButton component for social media links
 */
export function SocialMediaButton({ 
  platform, 
  username, 
  url,
  onSocialClick,
  className 
}: {
  platform: string;
  username: string;
  url: string;
  onSocialClick?: (event: any) => void;
  className?: string;
}) {
  const [IconComponent, setIconComponent] = React.useState<React.ComponentType<any> | null>(null);

  // Load social media icon
  React.useEffect(() => {
    const loadSocialIcon = async () => {
      try {
        const icons = await import('lucide-react');
        const iconMap: Record<string, string> = {
          twitter: 'Twitter',
          instagram: 'Instagram',
          github: 'Github',
          linkedin: 'Linkedin',
          youtube: 'Youtube',
          facebook: 'Facebook',
          tiktok: 'Music', // TikTok uses music icon
          discord: 'MessageCircle',
          twitch: 'Twitch',
          snapchat: 'Camera',
          pinterest: 'Pin',
          reddit: 'MessageSquare',
          telegram: 'Send',
          whatsapp: 'Phone',
        };

        const iconName = iconMap[platform.toLowerCase()] || 'Link';
        const Icon = (icons as any)[iconName] || icons.Link;
        setIconComponent(() => Icon);
      } catch {
        const { Link } = await import('lucide-react');
        setIconComponent(() => Link);
      }
    };

    loadSocialIcon();
  }, [platform]);

  const handleClick = () => {
    if (onSocialClick) {
      onSocialClick({
        platform,
        username,
        timestamp: Date.now()
      });
    }
  };

  const getSocialUrl = (platform: string, username: string): string => {
    const baseUrls: Record<string, string> = {
      twitter: 'https://twitter.com/',
      instagram: 'https://instagram.com/',
      github: 'https://github.com/',
      linkedin: 'https://linkedin.com/in/',
      youtube: 'https://youtube.com/@',
      facebook: 'https://facebook.com/',
      tiktok: 'https://tiktok.com/@',
      discord: username.startsWith('http') ? '' : 'https://discord.gg/',
      twitch: 'https://twitch.tv/',
      snapchat: 'https://snapchat.com/add/',
      pinterest: 'https://pinterest.com/',
      reddit: 'https://reddit.com/u/',
      telegram: 'https://t.me/',
      whatsapp: 'https://wa.me/',
    };

    const baseUrl = baseUrls[platform.toLowerCase()];
    return baseUrl ? `${baseUrl}${username}` : url;
  };

  const socialUrl = getSocialUrl(platform, username);
  const displayName = getPlatformDisplayName(platform);

  return (
    <a
      href={socialUrl}
      onClick={handleClick}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx('social-icon', className)}
      aria-label={`Visit ${displayName} profile`}
      title={`${displayName}: ${username}`}
    >
      {IconComponent ? (
        <IconComponent className="w-full h-full" />
      ) : (
        <div className="w-full h-full bg-gray-300 dark:bg-gray-600 rounded animate-pulse" />
      )}
    </a>
  );
}

/**
 * LinksList component for rendering multiple links
 */
export function LinksList({ 
  links, 
  theme, 
  onLinkClick,
  className 
}: {
  links: LinkButtonProps['link'][];
  theme: LinkButtonProps['theme'];
  onLinkClick?: LinkButtonProps['onLinkClick'];
  className?: string;
}) {
  const enabledLinks = links.filter(link => link.enabled);

  if (enabledLinks.length === 0) {
    return (
      <div className={clsx('text-center py-8', className)}>
        <p className="text-gray-500 dark:text-gray-400">No links available</p>
      </div>
    );
  }

  return (
    <div className={clsx('links-section', className)}>
      {enabledLinks.map((link, index) => (
        <LinkButton
          key={`${link.title}-${index}`}
          link={link}
          theme={theme}
          onLinkClick={onLinkClick}
        />
      ))}
    </div>
  );
}

/**
 * SpecialLinkButton for special link types (email, phone, etc.)
 */
export function SpecialLinkButton({ 
  type, 
  value, 
  label,
  className 
}: {
  type: 'email' | 'phone' | 'sms';
  value: string;
  label: string;
  className?: string;
}) {
  const getHref = () => {
    switch (type) {
      case 'email':
        return `mailto:${value}`;
      case 'phone':
        return `tel:${value}`;
      case 'sms':
        return `sms:${value}`;
      default:
        return value;
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'email':
        return Mail;
      case 'phone':
      case 'sms':
        return Phone;
      default:
        return ExternalLink;
    }
  };

  const Icon = getIcon();

  return (
    <a
      href={getHref()}
      className={clsx('btn-link', className)}
      aria-label={`${label}: ${value}`}
    >
      <div className="link-content">
        <Icon className="link-icon" />
        <div className="link-text">
          <div className="link-title">{label}</div>
          <div className="link-description">{value}</div>
        </div>
      </div>
    </a>
  );
}

// Utility functions
function getButtonClasses(theme: LinkButtonProps['theme'], featured: boolean): string {
  const classes = [];

  // Button style
  classes.push(`btn-${theme.buttonStyle}`);

  // Border style
  if (theme.showBorder) {
    classes.push('btn-bordered');
  }

  // Animation
  if (theme.buttonAnimation !== 'none') {
    classes.push(`btn-${theme.buttonAnimation}`);
  }

  // Featured style
  if (featured) {
    classes.push('btn-featured');
  }

  return clsx(classes);
}

function getPlatformDisplayName(platform: string): string {
  const displayNames: Record<string, string> = {
    twitter: 'Twitter/X',
    instagram: 'Instagram',
    github: 'GitHub',
    linkedin: 'LinkedIn',
    youtube: 'YouTube',
    facebook: 'Facebook',
    tiktok: 'TikTok',
    discord: 'Discord',
    twitch: 'Twitch',
    snapchat: 'Snapchat',
    pinterest: 'Pinterest',
    reddit: 'Reddit',
    telegram: 'Telegram',
    whatsapp: 'WhatsApp',
  };

  return displayNames[platform.toLowerCase()] || platform;
}

export default LinkButton;