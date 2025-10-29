# Configuration Guide

Complete guide to configuring your LinkTree Modern template with detailed examples and best practices.

## 📋 Table of Contents

- [Overview](#overview)
- [Configuration Structure](#configuration-structure)
- [Profile Configuration](#profile-configuration)
- [Links Management](#links-management)
- [Social Media Integration](#social-media-integration)
- [Theme Customization](#theme-customization)
- [Layout Settings](#layout-settings)
- [SEO Configuration](#seo-configuration)
- [Analytics Setup](#analytics-setup)
- [Advanced Settings](#advanced-settings)
- [Configuration Examples](#configuration-examples)
- [Validation & Troubleshooting](#validation--troubleshooting)

## Overview

The LinkTree Modern template uses a JSON-based configuration system that allows complete customization of your link page. The configuration is validated against a JSON Schema to ensure type safety and prevent errors.

### Configuration Priority

1. **Platform Config** (`platform-config.json`) - Injected by cloud-landing platform
2. **User Config** (`config.json`) - User-provided configuration
3. **Default Config** (`config.defaults.json`) - Fallback defaults

### File Location

When developing locally, edit `src/config.json`. When deployed through the platform, configuration is automatically injected.

## Configuration Structure

```json
{
  "profile": { /* Profile information */ },
  "links": [ /* Array of link objects */ ],
  "socialMedia": { /* Social media usernames */ },
  "theme": { /* Visual appearance settings */ },
  "layout": { /* Layout and spacing options */ },
  "seo": { /* SEO and metadata */ },
  "analytics": { /* Analytics configuration */ },
  "advanced": { /* Advanced features */ }
}
```

## Profile Configuration

The profile section defines your personal or brand information displayed at the top of your page.

### Required Fields

```json
{
  "profile": {
    "name": "Your Display Name",
    "bio": "A short description about yourself",
    "avatar": "https://example.com/your-photo.jpg"
  }
}
```

### Complete Profile Example

```json
{
  "profile": {
    "name": "Jane Smith",
    "bio": "Digital creator, photographer, and coffee enthusiast. Welcome to my corner of the internet!",
    "avatar": "https://images.unsplash.com/photo-1494790108755-2616b169c2c1?w=400&h=400&fit=crop&crop=face",
    "location": "San Francisco, CA"
  }
}
```

### Profile Field Reference

| Field | Type | Required | Description | Limits |
|-------|------|----------|-------------|---------|
| `name` | string | ✅ | Display name or brand name | 1-50 characters |
| `bio` | string | ✅ | Short bio or tagline | Max 160 characters |
| `avatar` | string | ✅ | Profile picture URL | Valid HTTPS URL, image format |
| `location` | string | ❌ | Geographic location | Max 50 characters |

### Avatar Best Practices

- **Size**: 400x400 pixels minimum
- **Format**: JPG, PNG, or WebP
- **Aspect Ratio**: Square (1:1) for best results
- **File Size**: Under 500KB for optimal loading
- **Content**: Professional or on-brand image

## Links Management

Links are the core of your LinkTree page - buttons that direct visitors to your important content.

### Basic Link Structure

```json
{
  "links": [
    {
      "title": "My Website",
      "url": "https://example.com"
    }
  ]
}
```

### Complete Link Example

```json
{
  "links": [
    {
      "title": "Latest Blog Post",
      "url": "https://blog.example.com/latest-post",
      "description": "Read about my recent adventures in web development",
      "icon": "book-open",
      "enabled": true,
      "newTab": true,
      "featured": true
    }
  ]
}
```

### Link Field Reference

| Field | Type | Required | Description | Default |
|-------|------|----------|-------------|---------|
| `title` | string | ✅ | Link button text | - |
| `url` | string | ✅ | Destination URL | - |
| `description` | string | ❌ | Subtitle text | - |
| `icon` | string | ❌ | Lucide icon name | "link" |
| `enabled` | boolean | ❌ | Show/hide link | true |
| `newTab` | boolean | ❌ | Open in new tab | true |
| `featured` | boolean | ❌ | Special styling | false |

### URL Format Support

```json
{
  "links": [
    {"title": "Website", "url": "https://example.com"},
    {"title": "Email", "url": "mailto:hello@example.com"},
    {"title": "Phone", "url": "tel:+1-555-123-4567"},
    {"title": "Secure Site", "url": "https://secure.example.com"}
  ]
}
```

### Icon Options

Use any [Lucide React](https://lucide.dev/) icon name:

#### Popular Icons
- **Web**: `globe`, `external-link`, `link`
- **Communication**: `mail`, `phone`, `message-circle`
- **Social**: `twitter`, `instagram`, `facebook`, `linkedin`
- **Content**: `book-open`, `newspaper`, `video`, `music`
- **Business**: `briefcase`, `building`, `credit-card`, `shopping-bag`
- **Creative**: `camera`, `palette`, `film`, `mic`

#### Example with Icons

```json
{
  "links": [
    {"title": "Portfolio", "url": "https://portfolio.com", "icon": "briefcase"},
    {"title": "Blog", "url": "https://blog.com", "icon": "book-open"},
    {"title": "Shop", "url": "https://shop.com", "icon": "shopping-bag"},
    {"title": "Contact", "url": "mailto:hello@example.com", "icon": "mail"}
  ]
}
```

### Featured Links

Featured links receive special visual treatment:

```json
{
  "links": [
    {
      "title": "🚀 New Product Launch",
      "url": "https://product.example.com",
      "description": "Check out our latest release!",
      "icon": "star",
      "featured": true,
      "newTab": true
    }
  ]
}
```

## Social Media Integration

Connect your social media profiles with automatic icon generation and platform-specific validation.

### Complete Social Media Example

```json
{
  "socialMedia": {
    "twitter": "username",
    "instagram": "username",
    "github": "username",
    "linkedin": "username",
    "youtube": "channelname",
    "tiktok": "username",
    "discord": "invite-code",
    "twitch": "username"
  }
}
```

### Platform-Specific Guidelines

#### Twitter/X
```json
{"twitter": "username"}  // Without @, 1-15 characters
```

#### Instagram
```json
{"instagram": "username"}  // Without @, 1-30 characters, dots and underscores allowed
```

#### GitHub
```json
{"github": "username"}  // 1-39 characters, alphanumeric and hyphens
```

#### LinkedIn
```json
{"linkedin": "username"}  // Profile URL slug or custom URL
```

#### YouTube
```json
{"youtube": "channelname"}  // Channel handle or channel ID
```

#### TikTok
```json
{"tiktok": "username"}  // Without @, 1-24 characters
```

#### Discord
```json
{"discord": "invite-code"}  // Server invite code or full invite URL
```

#### Twitch
```json
{"twitch": "username"}  // Channel name, 4-25 characters
```

## Theme Customization

Control the visual appearance of your LinkTree with comprehensive theming options.

### Basic Theme Example

```json
{
  "theme": {
    "colorScheme": "auto",
    "primaryColor": "#6366f1",
    "backgroundStyle": "gradient",
    "fontFamily": "inter",
    "buttonStyle": "rounded"
  }
}
```

### Complete Theme Configuration

```json
{
  "theme": {
    "colorScheme": "auto",
    "primaryColor": "#6366f1",
    "backgroundStyle": "gradient",
    "backgroundImage": "",
    "fontFamily": "inter",
    "buttonStyle": "rounded",
    "buttonAnimation": "scale",
    "showBorder": true
  }
}
```

### Color Schemes

```json
{"colorScheme": "light"}   // Always light mode
{"colorScheme": "dark"}    // Always dark mode
{"colorScheme": "auto"}    // Follow system preference
```

### Primary Color Examples

```json
// Brand colors
{"primaryColor": "#6366f1"}  // Indigo (default)
{"primaryColor": "#3b82f6"}  // Blue
{"primaryColor": "#10b981"}  // Emerald
{"primaryColor": "#f59e0b"}  // Amber
{"primaryColor": "#ef4444"}  // Red
{"primaryColor": "#8b5cf6"}  // Violet
{"primaryColor": "#06b6d4"}  // Cyan
{"primaryColor": "#84cc16"}  // Lime
```

### Background Styles

#### Solid Color
```json
{
  "theme": {
    "backgroundStyle": "solid",
    "primaryColor": "#1f2937"
  }
}
```

#### Gradient (Default)
```json
{
  "theme": {
    "backgroundStyle": "gradient",
    "primaryColor": "#6366f1"
  }
}
```

#### Custom Background Image
```json
{
  "theme": {
    "backgroundStyle": "image",
    "backgroundImage": "https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&h=1080"
  }
}
```

### Font Families

#### Inter (Default)
```json
{"fontFamily": "inter"}  // Modern, clean sans-serif
```

#### Poppins
```json
{"fontFamily": "poppins"}  // Rounded, friendly sans-serif
```

#### Roboto
```json
{"fontFamily": "roboto"}  // Classic, readable sans-serif
```

#### Montserrat
```json
{"fontFamily": "montserrat"}  // Geometric, modern sans-serif
```

#### Playfair Display
```json
{"fontFamily": "playfair"}  // Elegant serif for creative brands
```

### Button Styles

#### Rounded (Default)
```json
{"buttonStyle": "rounded"}  // Standard rounded corners
```

#### Square
```json
{"buttonStyle": "square"}  // Sharp, modern edges
```

#### Pill
```json
{"buttonStyle": "pill"}  // Fully rounded, capsule shape
```

### Button Animations

```json
{"buttonAnimation": "none"}    // No hover effects
{"buttonAnimation": "scale"}   // Slight scale up (default)
{"buttonAnimation": "glow"}    // Glowing shadow effect
{"buttonAnimation": "lift"}    // Lift up with shadow
```

## Layout Settings

Control the overall layout, spacing, and positioning of elements on your page.

### Complete Layout Example

```json
{
  "layout": {
    "maxWidth": "md",
    "alignment": "center",
    "spacing": "normal",
    "showProfileFirst": true,
    "showSocialMedia": true,
    "socialMediaPosition": "bottom"
  }
}
```

### Layout Field Reference

| Field | Options | Description | Default |
|-------|---------|-------------|---------|
| `maxWidth` | sm, md, lg, xl, full | Content container width | md |
| `alignment` | left, center, right | Content alignment | center |
| `spacing` | compact, normal, relaxed | Element spacing | normal |
| `showProfileFirst` | true, false | Profile at top | true |
| `showSocialMedia` | true, false | Show social icons | true |
| `socialMediaPosition` | top, bottom, both | Social icon placement | bottom |

### Width Examples

```json
{"maxWidth": "sm"}    // ~384px max width
{"maxWidth": "md"}    // ~448px max width (default)
{"maxWidth": "lg"}    // ~512px max width
{"maxWidth": "xl"}    // ~576px max width
{"maxWidth": "full"}  // Full width of container
```

### Spacing Variations

```json
{"spacing": "compact"}   // Tighter spacing for more content
{"spacing": "normal"}    // Standard spacing (default)
{"spacing": "relaxed"}   // Looser spacing for breathing room
```

## SEO Configuration

Optimize your LinkTree for search engines and social media sharing.

### Complete SEO Example

```json
{
  "seo": {
    "title": "Jane Smith - Creative Professional",
    "description": "Photographer, designer, and content creator. Find all my work, social media, and contact information in one place.",
    "keywords": "photography, design, portfolio, creative, social media",
    "favicon": "https://example.com/favicon.ico"
  }
}
```

### SEO Field Reference

| Field | Type | Description | Limits |
|-------|------|-------------|---------|
| `title` | string | Browser tab title | Max 60 characters |
| `description` | string | Meta description for search results | Max 160 characters |
| `keywords` | string | Comma-separated SEO keywords | - |
| `favicon` | string | Custom favicon URL (optional) | ICO, PNG, or SVG |

### Title Best Practices

```json
// Good titles
{"title": "John Doe - Web Developer"}
{"title": "Creative Studio - Design & Branding"}
{"title": "Sarah's Links - Travel Blogger"}

// Avoid
{"title": "My LinkTree"}  // Too generic
{"title": "John Doe's Super Amazing Awesome Creative Professional Portfolio and Social Media Links"}  // Too long
```

### Description Best Practices

```json
{
  "description": "Web developer specializing in React and Node.js. Find my portfolio, blog posts, social media, and contact information. Let's build something amazing together!"
}
```

## Analytics Setup

Track visitor interactions and gather insights about your link performance.

### Google Analytics 4

```json
{
  "analytics": {
    "googleAnalyticsId": "G-XXXXXXXXXX",
    "trackClicks": true,
    "trackSocialClicks": true
  }
}
```

### Facebook Pixel

```json
{
  "analytics": {
    "facebookPixelId": "1234567890123456",
    "trackClicks": true,
    "trackSocialClicks": true
  }
}
```

### Complete Analytics Example

```json
{
  "analytics": {
    "googleAnalyticsId": "G-XXXXXXXXXX",
    "facebookPixelId": "1234567890123456",
    "trackClicks": true,
    "trackSocialClicks": true
  }
}
```

### Analytics Field Reference

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| `googleAnalyticsId` | string | GA4 tracking ID (G-XXXXXXXXXX) | - |
| `facebookPixelId` | string | Facebook Pixel ID | - |
| `trackClicks` | boolean | Track link clicks | true |
| `trackSocialClicks` | boolean | Track social media clicks | true |

### Getting Analytics IDs

#### Google Analytics 4
1. Visit [Google Analytics](https://analytics.google.com)
2. Create a new property
3. Copy the Measurement ID (starts with "G-")

#### Facebook Pixel
1. Visit [Facebook Events Manager](https://business.facebook.com/events_manager)
2. Create a new pixel
3. Copy the Pixel ID (16-digit number)

## Advanced Settings

Enable advanced features and customizations for power users.

### Complete Advanced Configuration

```json
{
  "advanced": {
    "enablePWA": false,
    "enableDarkMode": true,
    "enableAnimations": true,
    "preloadImages": true
  }
}
```

### Advanced Field Reference

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| `enablePWA` | boolean | Progressive Web App features | false |
| `enableDarkMode` | boolean | Dark mode toggle button | true |
| `enableAnimations` | boolean | Page animations and transitions | true |
| `preloadImages` | boolean | Preload images for faster loading | true |

### Progressive Web App (PWA)

When enabled, visitors can install your LinkTree as an app:

```json
{
  "advanced": {
    "enablePWA": true
  }
}
```

PWA features include:
- Add to home screen
- Offline functionality
- App-like experience
- Push notifications (future feature)

## Configuration Examples

### Personal Brand - Minimalist

```json
{
  "profile": {
    "name": "Alex Johnson",
    "bio": "Minimalist designer & photographer",
    "avatar": "https://example.com/alex.jpg",
    "location": "Portland, OR"
  },
  "links": [
    {
      "title": "Portfolio",
      "url": "https://alexjohnson.design",
      "icon": "briefcase",
      "featured": true
    },
    {
      "title": "Photography",
      "url": "https://photos.alexjohnson.design",
      "icon": "camera"
    },
    {
      "title": "Contact",
      "url": "mailto:hello@alexjohnson.design",
      "icon": "mail"
    }
  ],
  "socialMedia": {
    "instagram": "alexjohnsonphoto",
    "twitter": "alexjohnson"
  },
  "theme": {
    "colorScheme": "light",
    "primaryColor": "#000000",
    "backgroundStyle": "solid",
    "fontFamily": "inter",
    "buttonStyle": "square",
    "buttonAnimation": "none",
    "showBorder": true
  },
  "layout": {
    "maxWidth": "sm",
    "alignment": "left",
    "spacing": "compact"
  },
  "seo": {
    "title": "Alex Johnson - Designer & Photographer",
    "description": "Minimalist design and photography portfolio. View my work and get in touch."
  }
}
```

### Creative Brand - Vibrant

```json
{
  "profile": {
    "name": "Maya Creative Studio",
    "bio": "🎨 Bringing brands to life through bold design and storytelling",
    "avatar": "https://example.com/maya-studio.jpg"
  },
  "links": [
    {
      "title": "🚀 New Brand Packages",
      "url": "https://maya.studio/packages",
      "description": "Complete branding solutions starting at $2,000",
      "icon": "star",
      "featured": true
    },
    {
      "title": "Portfolio",
      "url": "https://maya.studio/work",
      "icon": "briefcase"
    },
    {
      "title": "Free Brand Guide",
      "url": "https://maya.studio/free-guide",
      "description": "Download our 50-page brand strategy guide",
      "icon": "gift"
    },
    {
      "title": "Book a Call",
      "url": "https://calendly.com/maya-studio",
      "icon": "calendar"
    }
  ],
  "socialMedia": {
    "instagram": "mayacreativestudio",
    "twitter": "mayastudio",
    "linkedin": "maya-creative-studio"
  },
  "theme": {
    "colorScheme": "auto",
    "primaryColor": "#ff6b6b",
    "backgroundStyle": "gradient",
    "fontFamily": "poppins",
    "buttonStyle": "pill",
    "buttonAnimation": "glow",
    "showBorder": false
  },
  "layout": {
    "maxWidth": "md",
    "alignment": "center",
    "spacing": "relaxed",
    "socialMediaPosition": "both"
  },
  "seo": {
    "title": "Maya Creative Studio - Brand Design & Strategy",
    "description": "Bold brand design and strategy for ambitious businesses. View our portfolio and start your brand transformation today."
  },
  "analytics": {
    "googleAnalyticsId": "G-XXXXXXXXXX",
    "facebookPixelId": "1234567890",
    "trackClicks": true,
    "trackSocialClicks": true
  }
}
```

### Professional - Corporate

```json
{
  "profile": {
    "name": "Dr. Sarah Chen",
    "bio": "Technology consultant and startup advisor specializing in AI and machine learning solutions",
    "avatar": "https://example.com/sarah-chen.jpg",
    "location": "San Francisco, CA"
  },
  "links": [
    {
      "title": "Consulting Services",
      "url": "https://sarahchen.consulting",
      "description": "AI strategy and implementation consulting",
      "icon": "briefcase",
      "featured": true
    },
    {
      "title": "Speaking & Events",
      "url": "https://sarahchen.consulting/speaking",
      "icon": "mic"
    },
    {
      "title": "Latest Research",
      "url": "https://scholar.google.com/citations?user=XXXXXXX",
      "icon": "book-open"
    },
    {
      "title": "Schedule Consultation",
      "url": "https://calendly.com/dr-sarah-chen",
      "icon": "calendar",
      "featured": true
    }
  ],
  "socialMedia": {
    "linkedin": "dr-sarah-chen",
    "twitter": "drsarahchen",
    "github": "sarahchen"
  },
  "theme": {
    "colorScheme": "auto",
    "primaryColor": "#2563eb",
    "backgroundStyle": "solid",
    "fontFamily": "roboto",
    "buttonStyle": "rounded",
    "buttonAnimation": "lift",
    "showBorder": true
  },
  "layout": {
    "maxWidth": "lg",
    "alignment": "center",
    "spacing": "normal"
  },
  "seo": {
    "title": "Dr. Sarah Chen - AI Consultant & Startup Advisor",
    "description": "Technology consultant specializing in AI and machine learning. Available for consulting, speaking, and advisory roles.",
    "keywords": "AI consultant, machine learning, startup advisor, technology consulting"
  },
  "analytics": {
    "googleAnalyticsId": "G-XXXXXXXXXX",
    "trackClicks": true,
    "trackSocialClicks": true
  }
}
```

### Content Creator - Entertainment

```json
{
  "profile": {
    "name": "Jake's Gaming World",
    "bio": "🎮 Gaming content creator | Twitch streamer | YouTube creator | Let's play together!",
    "avatar": "https://example.com/jake-gaming.jpg"
  },
  "links": [
    {
      "title": "🔴 Live on Twitch",
      "url": "https://twitch.tv/jakesgaming",
      "description": "Streaming now! Come hang out and game with us",
      "icon": "tv",
      "featured": true
    },
    {
      "title": "YouTube Channel",
      "url": "https://youtube.com/jakesgamingworld",
      "description": "Game reviews, tutorials, and Let's Play videos",
      "icon": "youtube"
    },
    {
      "title": "Discord Community",
      "url": "https://discord.gg/jakesgaming",
      "description": "Join 10k+ gamers in our community",
      "icon": "users"
    },
    {
      "title": "Gaming Setup Guide",
      "url": "https://jakesgaming.com/setup",
      "description": "Everything I use for streaming and gaming",
      "icon": "monitor"
    },
    {
      "title": "Support My Content",
      "url": "https://ko-fi.com/jakesgaming",
      "description": "Buy me a coffee to support the channel",
      "icon": "heart"
    }
  ],
  "socialMedia": {
    "twitch": "jakesgaming",
    "youtube": "jakesgamingworld",
    "twitter": "jakesgaming",
    "instagram": "jakesgamingworld",
    "discord": "jakesgaming",
    "tiktok": "jakesgaming"
  },
  "theme": {
    "colorScheme": "dark",
    "primaryColor": "#9146ff",
    "backgroundStyle": "gradient",
    "fontFamily": "poppins",
    "buttonStyle": "rounded",
    "buttonAnimation": "scale",
    "showBorder": true
  },
  "layout": {
    "maxWidth": "md",
    "alignment": "center",
    "spacing": "normal",
    "socialMediaPosition": "both"
  },
  "seo": {
    "title": "Jake's Gaming World - Twitch Streamer & Content Creator",
    "description": "Gaming content creator streaming on Twitch and YouTube. Join our community for gaming tips, reviews, and epic gameplay!",
    "keywords": "gaming, twitch, youtube, streaming, content creator"
  },
  "analytics": {
    "googleAnalyticsId": "G-XXXXXXXXXX",
    "trackClicks": true,
    "trackSocialClicks": true
  },
  "advanced": {
    "enableAnimations": true,
    "enableDarkMode": false
  }
}
```

## Validation & Troubleshooting

### JSON Validation

Ensure your configuration is valid JSON:

```bash
# Check JSON syntax
npm run validate-config

# Or use online tools
# https://jsonlint.com/
```

### Common Validation Errors

#### Invalid URL Format
```json
// ❌ Wrong
{"url": "example.com"}

// ✅ Correct
{"url": "https://example.com"}
```

#### Invalid Color Format
```json
// ❌ Wrong
{"primaryColor": "blue"}

// ✅ Correct
{"primaryColor": "#3b82f6"}
```

#### Missing Required Fields
```json
// ❌ Wrong - missing required fields
{
  "profile": {
    "name": "John Doe"
  }
}

// ✅ Correct - all required fields
{
  "profile": {
    "name": "John Doe",
    "bio": "Web developer",
    "avatar": "https://example.com/photo.jpg"
  }
}
```

### Testing Your Configuration

1. **Local Development**: Use `npm run dev` to test changes
2. **JSON Validation**: Verify syntax with online validators
3. **Schema Validation**: Run `npm run validate-config`
4. **Preview Build**: Use `npm run build && npm run preview`
5. **Accessibility**: Test with screen readers and keyboard navigation

### Performance Considerations

- **Image Optimization**: Compress images before uploading
- **Link Count**: Limit to 15-20 links for optimal performance
- **Description Length**: Keep descriptions concise
- **Font Loading**: Google Fonts are optimized and cached

### Accessibility Guidelines

- **Alt Text**: Profile images automatically use your name as alt text
- **Color Contrast**: Ensure sufficient contrast with your chosen colors
- **Keyboard Navigation**: All links are keyboard accessible
- **Screen Readers**: Use descriptive link titles and descriptions

For additional help, see:
- [Developer Documentation](./DEVELOPER.md)
- [Troubleshooting Guide](./docs/troubleshooting.md)
- [GitHub Issues](https://github.com/nailthelanding/template-linktree-modern/issues)