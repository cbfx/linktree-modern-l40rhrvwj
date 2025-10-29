# Developer Documentation

Technical guide for developers working with the LinkTree Modern template.

## 🏗️ Architecture Overview

### Component Structure

```
src/
├── App.tsx                 # Main app component with theme provider
├── components/
│   ├── Layout.tsx         # Main layout and accessibility provider
│   ├── Profile.tsx        # Profile display component
│   ├── LinkButton.tsx     # Link buttons and social media components
│   └── ThemeProvider.tsx  # Theme context and configuration
├── types/
│   └── config.ts         # TypeScript interfaces for configuration
├── utils/
│   ├── validation.ts     # Configuration validation utilities
│   └── analytics.ts      # Analytics tracking functions
└── styles/
    └── globals.css       # Global styles and CSS variables
```

### Configuration System

The template uses a JSON-based configuration system with:
- **Schema Validation**: JSON Schema validation for type safety
- **Default Values**: Comprehensive defaults in `config.defaults.json`
- **Platform Integration**: Support for platform-injected configurations
- **Type Safety**: Full TypeScript interfaces for all configuration options

### Theme Management

The theme system provides:
- **CSS Variables**: Dynamic color and spacing variables
- **Context Provider**: React context for theme state management
- **Font Loading**: Google Fonts integration with fallbacks
- **Dark Mode**: System preference detection with manual override

## 🔧 Configuration Schema

### Core Interfaces

```typescript
interface Config {
  profile: ProfileConfig;
  links: LinkConfig[];
  socialMedia: SocialMediaConfig;
  theme: ThemeConfig;
  layout: LayoutConfig;
  seo: SEOConfig;
  analytics: AnalyticsConfig;
  advanced: AdvancedConfig;
}

interface LinkConfig {
  title: string;
  url: string;
  description?: string;
  icon?: string;
  enabled?: boolean;
  newTab?: boolean;
  featured?: boolean;
}

interface ThemeConfig {
  colorScheme: 'light' | 'dark' | 'auto';
  primaryColor: string;
  backgroundStyle: 'solid' | 'gradient' | 'image';
  backgroundImage?: string;
  fontFamily: 'inter' | 'poppins' | 'roboto' | 'montserrat' | 'playfair';
  buttonStyle: 'rounded' | 'square' | 'pill';
  buttonAnimation: 'none' | 'scale' | 'glow' | 'lift';
  showBorder: boolean;
}
```

### Validation Rules

- **URL Validation**: HTTPS/HTTP, mailto, and tel protocols supported
- **Color Validation**: Hex color format required (#RRGGBB)
- **Image Validation**: Standard web image formats (jpg, png, webp, etc.)
- **String Limits**: Enforced maximum lengths for text fields
- **Social Media**: Platform-specific username validation patterns

## 🎨 Component API

### ThemeProvider

```typescript
interface ThemeProviderProps {
  children: React.ReactNode;
}

// Hook for accessing configuration
const config = useConfig();

// Hook for accessing theme utilities
const { isDark, toggleTheme, primaryColor } = useTheme();
```

### LinkButton

```typescript
interface LinkButtonProps {
  title: string;
  url: string;
  description?: string;
  icon?: string;
  featured?: boolean;
  onClick?: (event: LinkClickEvent) => void;
}

interface LinkClickEvent {
  linkTitle: string;
  linkUrl: string;
  featured: boolean;
  timestamp: number;
}
```

### Profile

```typescript
interface ProfileProps {
  name: string;
  bio: string;
  avatar: string;
  location?: string;
  showLocation?: boolean;
}
```

### Layout

```typescript
interface LayoutProps {
  maxWidth: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  alignment: 'left' | 'center' | 'right';
  spacing: 'compact' | 'normal' | 'relaxed';
  children: React.ReactNode;
}
```

## 🔄 Build Process

### Development

```bash
npm run dev    # Start Vite dev server with HMR
npm run lint   # ESLint with TypeScript support
npm run build  # Production build with optimization
```

### Build Pipeline

1. **TypeScript Compilation**: Full type checking
2. **ESLint**: Code quality and consistency
3. **Vite Build**: Module bundling and optimization
4. **Asset Processing**: Image optimization and compression
5. **Bundle Analysis**: Size analysis and tree shaking

### Output Structure

```
dist/
├── index.html           # Main HTML file
├── assets/
│   ├── index-[hash].js  # Main JavaScript bundle
│   ├── index-[hash].css # Compiled CSS with Tailwind
│   └── fonts/           # Optimized font files
└── images/              # Processed images and icons
```

## 🚀 Platform Integration

### Template Discovery

The template is discovered through `package.json` metadata:

```json
{
  "template": {
    "type": "website",
    "framework": "react",
    "category": "static",
    "displayName": "LinkTree Modern",
    "description": "A modern, customizable link aggregation page",
    "tags": ["linktree", "links", "profile", "social"],
    "features": ["responsive", "theme-switching", "customizable"],
    "minNodeVersion": "18.0.0"
  }
}
```

### Configuration Injection

The platform injects configuration through:

1. **Platform Config**: `platform-config.json` (highest priority)
2. **User Config**: `config.json` (user-provided)
3. **Default Config**: `config.defaults.json` (fallback)

### API Integration

#### Configuration Schema Endpoint

```typescript
GET /api/templates/linktree-modern/schema
Response: JSONSchema
```

#### Template Validation

```typescript
POST /api/templates/linktree-modern/validate
Body: { config: Config }
Response: { valid: boolean, errors?: ValidationError[] }
```

## 🔒 Security Implementation

### XSS Prevention

- **URL Validation**: Strict protocol validation
- **Content Sanitization**: All user input sanitized
- **CSP Headers**: Content Security Policy implementation
- **Safe Rendering**: React's built-in XSS protection

### Input Validation

```typescript
// URL validation with protocol check
const validateUrl = (url: string): boolean => {
  const urlPattern = /^(https?:\/\/)|(mailto:)|(tel:)[^\s<>"]+$/;
  return urlPattern.test(url);
};

// HTML sanitization for user content
const sanitizeHtml = (content: string): string => {
  return content
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};
```

### Configuration Security

- **Schema Validation**: All configuration validated against JSON Schema
- **Type Safety**: TypeScript ensures type correctness
- **Runtime Validation**: Additional runtime checks for security
- **Safe Defaults**: Secure default values for all options

## 📊 Analytics Integration

### Google Analytics 4

```typescript
// GA4 event tracking
const trackLinkClick = (event: LinkClickEvent) => {
  if (window.gtag) {
    window.gtag('event', 'click', {
      event_category: 'Link',
      event_label: event.linkTitle,
      custom_parameter_1: event.featured ? 'featured' : 'regular'
    });
  }
};
```

### Facebook Pixel

```typescript
// Facebook Pixel event tracking
const trackSocialClick = (platform: string) => {
  if (window.fbq) {
    window.fbq('track', 'Contact', {
      platform: platform,
      content_category: 'Social Media'
    });
  }
};
```

### Custom Event System

```typescript
interface AnalyticsEvent {
  type: 'link_click' | 'social_click' | 'theme_change';
  data: Record<string, any>;
  timestamp: number;
}

const trackEvent = (type: string, data: Record<string, any>) => {
  const event: AnalyticsEvent = {
    type: type as any,
    data,
    timestamp: Date.now()
  };
  
  // Send to configured analytics services
  sendToAnalytics(event);
};
```

## 🎯 Performance Optimization

### Bundle Size

- **Current Size**: < 100KB gzipped
- **Tree Shaking**: Unused code elimination
- **Code Splitting**: Dynamic imports for analytics
- **Asset Optimization**: Image compression and modern formats

### Loading Performance

```typescript
// Image preloading
const preloadImage = (src: string) => {
  const img = new Image();
  img.src = src;
  return img;
};

// Font loading optimization
const loadFont = (fontFamily: string) => {
  document.fonts.load(`16px ${fontFamily}`);
};
```

### Rendering Performance

- **React.memo**: Memoized components for expensive renders
- **useMemo**: Memoized computations
- **useCallback**: Memoized event handlers
- **Virtual Scrolling**: For large link lists (20+ items)

## 🧪 Testing Strategy

### Component Testing

```typescript
// Example test structure
describe('LinkButton', () => {
  it('renders with correct props', () => {
    render(<LinkButton title="Test" url="https://example.com" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const onClick = jest.fn();
    render(<LinkButton title="Test" url="https://example.com" onClick={onClick} />);
    fireEvent.click(screen.getByText('Test'));
    expect(onClick).toHaveBeenCalled();
  });
});
```

### Integration Testing

- **Configuration Loading**: Test configuration injection
- **Theme Switching**: Test theme state management
- **Analytics**: Test event tracking
- **Accessibility**: Test keyboard navigation and screen readers

### E2E Testing

- **Build Process**: Test complete build pipeline
- **Deployment**: Test GitHub Actions workflow
- **Performance**: Lighthouse CI integration
- **Accessibility**: axe-core automated testing

## 🔧 Development Tools

### ESLint Configuration

```json
{
  "extends": [
    "@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off"
  }
}
```

### TypeScript Configuration

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Vite Configuration

```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          icons: ['lucide-react']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react']
  }
});
```

## 🚀 Deployment Architecture

### GitHub Actions Workflow

The deployment process includes:

1. **Multi-Node Testing**: Node.js 18.x and 20.x
2. **Configuration Validation**: JSON Schema validation
3. **Code Quality**: ESLint and security audit
4. **Build Process**: Production build with optimization
5. **Testing**: Unit tests and accessibility tests
6. **Performance**: Lighthouse CI scoring
7. **Security**: CodeQL analysis and npm audit
8. **Deployment**: GitHub Pages, Netlify, and Vercel support

### Environment Variables

```bash
# GitHub Secrets for deployment
GITHUB_TOKEN          # Automatic GitHub token
NETLIFY_AUTH_TOKEN     # Netlify deployment token
NETLIFY_SITE_ID        # Netlify site identifier
VERCEL_TOKEN           # Vercel deployment token
VERCEL_ORG_ID          # Vercel organization ID
VERCEL_PROJECT_ID      # Vercel project ID
CUSTOM_DOMAIN          # Custom domain for GitHub Pages
```

### Performance Monitoring

- **Lighthouse CI**: Automated performance scoring
- **Bundle Analyzer**: Bundle size monitoring
- **Core Web Vitals**: Real user metrics
- **Error Tracking**: Runtime error monitoring

## 🤝 Contributing Guidelines

### Development Setup

1. **Fork Repository**: Create your own fork
2. **Clone Locally**: `git clone <your-fork-url>`
3. **Install Dependencies**: `npm install`
4. **Start Development**: `npm run dev`
5. **Run Tests**: `npm test` (when available)

### Code Standards

- **TypeScript**: All new code must be TypeScript
- **ESLint**: Follow configured linting rules
- **Prettier**: Code formatting consistency
- **Conventional Commits**: Structured commit messages
- **Testing**: Include tests for new features

### Pull Request Process

1. **Feature Branch**: Create from main branch
2. **Implementation**: Follow code standards
3. **Testing**: Ensure all tests pass
4. **Documentation**: Update relevant documentation
5. **Review**: Submit PR for review

## 📋 API Reference

### Configuration Loading

```typescript
// Load configuration with fallbacks
const loadConfig = async (): Promise<Config> => {
  // Try platform-injected config first
  try {
    const platformConfig = await import('./platform-config.json');
    return validateConfig(platformConfig.default);
  } catch {
    // Fall back to user config
    try {
      const userConfig = await import('./config.json');
      return validateConfig(userConfig.default);
    } catch {
      // Fall back to defaults
      const defaultConfig = await import('./config.defaults.json');
      return validateConfig(defaultConfig.default);
    }
  }
};
```

### Theme Utilities

```typescript
// Get CSS custom properties for theme
const getThemeVariables = (config: ThemeConfig) => ({
  '--primary-color': config.primaryColor,
  '--font-family': getFontFamily(config.fontFamily),
  '--button-style': getButtonStyle(config.buttonStyle),
  '--animation-type': getAnimationType(config.buttonAnimation)
});

// Convert theme config to CSS classes
const getThemeClasses = (config: ThemeConfig) => {
  return clsx(
    'theme-transition',
    config.colorScheme === 'dark' && 'dark',
    `font-${config.fontFamily}`,
    `buttons-${config.buttonStyle}`,
    config.showBorder && 'buttons-bordered'
  );
};
```

### Analytics Utilities

```typescript
// Initialize analytics services
const initializeAnalytics = (config: AnalyticsConfig) => {
  if (config.googleAnalyticsId) {
    initializeGA4(config.googleAnalyticsId);
  }
  
  if (config.facebookPixelId) {
    initializeFacebookPixel(config.facebookPixelId);
  }
};

// Track link clicks with privacy-aware implementation
const trackLinkClick = (event: LinkClickEvent, config: AnalyticsConfig) => {
  if (!config.trackClicks) return;
  
  const eventData = {
    title: event.linkTitle,
    featured: event.featured,
    timestamp: event.timestamp
    // URL omitted for privacy
  };
  
  sendAnalyticsEvent('link_click', eventData);
};
```

## 🔍 Troubleshooting

### Common Development Issues

**Build Failures**
- Check Node.js version (>=18.0.0 required)
- Clear `node_modules` and reinstall dependencies
- Verify TypeScript compilation with `npm run build`

**Configuration Errors**
- Validate JSON syntax in configuration files
- Check schema compliance with `npm run validate-config`
- Ensure required fields are provided

**Theme Issues**
- Verify CSS custom properties are applied
- Check font loading in Network tab
- Ensure color values are valid hex format

**Performance Issues**
- Analyze bundle size with `npm run analyze`
- Check image optimization and formats
- Monitor Core Web Vitals in DevTools

For additional troubleshooting, see [docs/troubleshooting.md](./docs/troubleshooting.md).