# Architecture Documentation

Technical architecture and design decisions for the LinkTree Modern template.

## 🏗️ System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Interface Layer                     │
├─────────────────────────────────────────────────────────────────┤
│  React Components  │  Theme System  │  Configuration System    │
├─────────────────────────────────────────────────────────────────┤
│             Build & Deployment Infrastructure                   │
├─────────────────────────────────────────────────────────────────┤
│  Vite Build Tool   │  GitHub Actions │  Platform Integration   │
├─────────────────────────────────────────────────────────────────┤
│                    Static Hosting Platforms                     │
└─────────────────────────────────────────────────────────────────┘
```

### Component Architecture

```
App.tsx (Root)
├── ThemeProvider (Context)
│   ├── Configuration Loading
│   ├── Theme State Management
│   └── CSS Custom Properties
├── AccessibilityProvider (Context)
│   ├── Focus Management
│   ├── Keyboard Navigation
│   └── Screen Reader Support
└── Layout (Main Container)
    ├── Profile Component
    │   ├── Avatar Display
    │   ├── Name & Bio
    │   └── Location (optional)
    ├── LinksList Component
    │   └── LinkButton[] (Dynamic)
    │       ├── Icon Rendering
    │       ├── Click Tracking
    │       └── Accessibility Attrs
    └── SocialMedia Component
        └── SocialButton[] (Dynamic)
            ├── Platform Validation
            ├── URL Generation
            └── Click Tracking
```

## 🎨 Design Patterns

### Configuration-Driven Architecture

The template uses a configuration-driven approach where the UI is entirely generated from JSON configuration:

```typescript
interface Config {
  profile: ProfileConfig;      // User information
  links: LinkConfig[];         // Dynamic link list
  theme: ThemeConfig;          // Visual appearance
  layout: LayoutConfig;        // Spacing and positioning
  seo: SEOConfig;             // Meta information
  analytics: AnalyticsConfig;  // Tracking configuration
  advanced: AdvancedConfig;    // Feature flags
}
```

**Benefits**:
- **Flexibility**: Easy customization without code changes
- **Validation**: JSON Schema ensures type safety
- **Platform Integration**: Seamless configuration injection
- **Maintainability**: Clear separation of data and presentation

### React Context Pattern

```typescript
// ThemeProvider manages global state
const ThemeContext = React.createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<Config | null>(null);
  const [isDark, setIsDark] = useState(false);
  
  // Configuration loading and theme management
  
  return (
    <ThemeContext.Provider value={{ config, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook for consuming context
export const useConfig = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useConfig must be used within ThemeProvider');
  return context.config;
};
```

### Component Composition

```typescript
// Flexible component composition
const App = () => (
  <ThemeProvider>
    <AccessibilityProvider>
      <Layout>
        <Profile />
        <LinksList />
        <SocialMediaSection />
      </Layout>
    </AccessibilityProvider>
  </ThemeProvider>
);

// Each component is self-contained and reusable
const LinkButton: React.FC<LinkButtonProps> = ({ title, url, icon, featured }) => {
  const { theme } = useTheme();
  const handleClick = useAnalytics();
  
  return (
    <a 
      href={url}
      className={getButtonClasses(theme, featured)}
      onClick={handleClick}
      aria-label={`Visit ${title}`}
    >
      {icon && <Icon name={icon} />}
      <span>{title}</span>
    </a>
  );
};
```

## 🔧 Configuration System

### Schema-Driven Validation

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "profile": {
      "type": "object",
      "properties": {
        "name": {"type": "string", "minLength": 1, "maxLength": 50},
        "bio": {"type": "string", "maxLength": 160},
        "avatar": {"type": "string", "format": "uri"}
      },
      "required": ["name", "bio", "avatar"]
    }
  }
}
```

**Architecture Benefits**:
- **Type Safety**: Compile-time and runtime validation
- **Documentation**: Schema serves as API documentation
- **Tool Integration**: IDE autocompletion and validation
- **Platform Integration**: Automatic form generation

### Configuration Loading Pipeline

```typescript
const loadConfiguration = async (): Promise<Config> => {
  // 1. Try platform-injected configuration
  try {
    const platformConfig = await import('./platform-config.json');
    return validateAndNormalize(platformConfig.default);
  } catch {}
  
  // 2. Try user-provided configuration
  try {
    const userConfig = await import('./config.json');
    return validateAndNormalize(userConfig.default);
  } catch {}
  
  // 3. Fall back to defaults
  const defaultConfig = await import('./config.defaults.json');
  return validateAndNormalize(defaultConfig.default);
};

const validateAndNormalize = (config: any): Config => {
  // JSON Schema validation
  const valid = validateSchema(config);
  if (!valid) throw new Error('Invalid configuration');
  
  // Runtime type checking
  return config as Config;
};
```

## 🎨 Theme System Architecture

### CSS Custom Properties Strategy

```css
:root {
  /* Color System */
  --primary-color: #6366f1;
  --primary-dark: #4338ca;
  --primary-light: #8b5cf6;
  
  /* Typography */
  --font-family: 'Inter', sans-serif;
  --font-size-base: 16px;
  --line-height: 1.5;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Theme-specific values */
  --background-color: #ffffff;
  --text-color: #1f2937;
  --border-color: #e5e7eb;
}

[data-theme="dark"] {
  --background-color: #1f2937;
  --text-color: #f9fafb;
  --border-color: #374151;
}
```

### Dynamic Theme Generation

```typescript
const generateThemeVariables = (theme: ThemeConfig): CSSProperties => {
  const baseVars = {
    '--primary-color': theme.primaryColor,
    '--font-family': getFontFamily(theme.fontFamily),
  };
  
  // Generate derived colors
  const primaryRGB = hexToRgb(theme.primaryColor);
  const derivedVars = {
    '--primary-dark': darken(theme.primaryColor, 0.1),
    '--primary-light': lighten(theme.primaryColor, 0.1),
    '--primary-alpha-10': `rgba(${primaryRGB.r}, ${primaryRGB.g}, ${primaryRGB.b}, 0.1)`,
    '--primary-alpha-20': `rgba(${primaryRGB.r}, ${primaryRGB.g}, ${primaryRGB.b}, 0.2)`,
  };
  
  return { ...baseVars, ...derivedVars };
};
```

### Responsive Design System

```css
/* Mobile-first breakpoint system */
.container {
  width: 100%;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: var(--spacing-md);
}

/* Tablet */
@media (min-width: 640px) {
  .container {
    padding: var(--spacing-lg);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    padding: var(--spacing-xl);
  }
}
```

## 🔗 Data Flow Architecture

### Unidirectional Data Flow

```
Configuration JSON
        ↓
   Schema Validation
        ↓
  React Context Store
        ↓
   Component Props
        ↓
    UI Rendering
        ↓
   User Interactions
        ↓
   Analytics Events
```

### Event System

```typescript
interface AnalyticsEvent {
  type: 'link_click' | 'social_click' | 'theme_toggle';
  data: Record<string, any>;
  timestamp: number;
}

const useAnalytics = () => {
  const { analytics } = useConfig();
  
  return useCallback((event: AnalyticsEvent) => {
    // Multiple analytics providers
    if (analytics.googleAnalyticsId) {
      sendToGA4(event);
    }
    
    if (analytics.facebookPixelId) {
      sendToFacebookPixel(event);
    }
    
    // Custom analytics
    sendToCustomAnalytics(event);
  }, [analytics]);
};
```

## 🏗️ Build Architecture

### Vite Build Pipeline

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    react(),
    // Custom plugin for configuration injection
    configInjectionPlugin(),
  ],
  build: {
    target: 'es2020',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          icons: ['lucide-react'],
          utils: ['clsx', 'tailwind-merge']
        }
      }
    }
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer(),
      ]
    }
  }
});
```

### Asset Processing

```
Source Assets
     ↓
  TypeScript Compilation
     ↓
  React JSX Transform
     ↓
  CSS Processing (Tailwind)
     ↓
  Bundle Optimization
     ↓
  Minification & Compression
     ↓
  Static Assets (dist/)
```

### Code Splitting Strategy

```typescript
// Lazy loading for analytics
const GoogleAnalytics = lazy(() => import('./analytics/GoogleAnalytics'));
const FacebookPixel = lazy(() => import('./analytics/FacebookPixel'));

// Component-based splitting
const AdvancedFeatures = lazy(() => import('./components/AdvancedFeatures'));

// Route-based splitting (if routing added)
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
```

## 🔒 Security Architecture

### Input Validation Layers

```
User Input (JSON)
       ↓
JSON Schema Validation
       ↓
Runtime Type Checking
       ↓
URL Protocol Validation
       ↓
Content Sanitization
       ↓
Safe Rendering (React)
```

### Content Security Policy

```typescript
const generateCSP = (config: Config): string => {
  const directives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
    "font-src 'self' fonts.gstatic.com",
    "img-src 'self' data: https:",
  ];
  
  // Add analytics domains if configured
  if (config.analytics.googleAnalyticsId) {
    directives.push("connect-src 'self' *.google-analytics.com");
    directives.push("script-src 'self' 'unsafe-inline' *.googletagmanager.com");
  }
  
  if (config.analytics.facebookPixelId) {
    directives.push("connect-src 'self' *.facebook.com");
    directives.push("script-src 'self' 'unsafe-inline' *.facebook.net");
  }
  
  return directives.join('; ');
};
```

## 📊 Performance Architecture

### Bundle Optimization

```typescript
// Tree shaking configuration
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['react', 'react-dom'], // Externalize if using CDN
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
});
```

### Lazy Loading Strategy

```typescript
// Image lazy loading
const LazyImage: React.FC<ImageProps> = ({ src, alt, ...props }) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoaded(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <img
      ref={imgRef}
      src={loaded ? src : undefined}
      alt={alt}
      loading="lazy"
      {...props}
    />
  );
};
```

### Caching Strategy

```typescript
// Service Worker for PWA
const CACHE_NAME = 'linktree-modern-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/assets/index.js',
  '/assets/index.css',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

## 🔌 Platform Integration Architecture

### Template Discovery

```typescript
interface TemplateMetadata {
  type: 'website' | 'application';
  framework: 'react' | 'vue' | 'vanilla';
  category: 'static' | 'dynamic';
  displayName: string;
  description: string;
  tags: string[];
  features: string[];
  minNodeVersion: string;
  compatibility: {
    node: string;
    npm: string;
    browsers: string[];
  };
}
```

### API Integration Points

```typescript
// Template service endpoints
interface TemplateAPI {
  // Get template metadata
  GET('/api/templates/{templateId}'): TemplateMetadata;
  
  // Get configuration schema
  GET('/api/templates/{templateId}/schema'): JSONSchema;
  
  // Validate configuration
  POST('/api/templates/{templateId}/validate', { config: Config }): ValidationResult;
  
  // Deploy template
  POST('/api/templates/{templateId}/deploy', { 
    config: Config, 
    repository: string 
  }): DeploymentResult;
}
```

### Repository Management

```typescript
interface RepositoryManager {
  // Fork template repository
  forkRepository(templateId: string, userId: string): Promise<Repository>;
  
  // Inject configuration
  injectConfiguration(repoId: string, config: Config): Promise<void>;
  
  // Trigger deployment
  triggerDeployment(repoId: string): Promise<Deployment>;
  
  // Monitor deployment status
  getDeploymentStatus(deploymentId: string): Promise<DeploymentStatus>;
}
```

## 🧪 Testing Architecture

### Testing Pyramid

```
    E2E Tests (Cypress/Playwright)
           ↗
  Integration Tests (Testing Library)
             ↗
     Unit Tests (Jest + Testing Library)
```

### Component Testing Strategy

```typescript
// Test utilities
const renderWithProviders = (
  component: ReactElement,
  config: Partial<Config> = {}
) => {
  const mockConfig = { ...defaultConfig, ...config };
  
  return render(
    <ThemeProvider initialConfig={mockConfig}>
      <AccessibilityProvider>
        {component}
      </AccessibilityProvider>
    </ThemeProvider>
  );
};

// Example component test
describe('LinkButton', () => {
  it('renders with analytics tracking', async () => {
    const mockTrack = jest.fn();
    const config = {
      analytics: { trackClicks: true, googleAnalyticsId: 'GA-TEST' }
    };
    
    renderWithProviders(
      <LinkButton title="Test" url="https://example.com" />,
      config
    );
    
    const button = screen.getByRole('link', { name: /test/i });
    fireEvent.click(button);
    
    await waitFor(() => {
      expect(mockTrack).toHaveBeenCalledWith({
        type: 'link_click',
        data: expect.objectContaining({
          title: 'Test',
          url: 'https://example.com'
        })
      });
    });
  });
});
```

### Performance Testing

```typescript
// Bundle size testing
describe('Bundle Size', () => {
  it('should be under 100KB gzipped', async () => {
    const stats = await getBuildStats();
    expect(stats.gzippedSize).toBeLessThan(100 * 1024);
  });
  
  it('should have optimal chunk sizes', async () => {
    const chunks = await getChunkSizes();
    expect(chunks.vendor).toBeLessThan(50 * 1024);
    expect(chunks.main).toBeLessThan(30 * 1024);
  });
});
```

## 🔮 Future Architecture Considerations

### Scalability

- **Multi-template Support**: Shared component library
- **Plugin System**: Extensible functionality
- **Micro-frontends**: Independent deployable components
- **Edge Computing**: CDN-based rendering

### Advanced Features

- **Real-time Updates**: WebSocket configuration updates
- **A/B Testing**: Configuration variants
- **Analytics Dashboard**: Advanced insights
- **Custom Domains**: DNS management integration

### Technical Debt Management

- **Dependency Updates**: Automated dependency management
- **Legacy Browser Support**: Polyfill strategy
- **Performance Monitoring**: Real-time metrics
- **Security Scanning**: Automated vulnerability detection

This architecture provides a solid foundation for the current implementation while allowing for future growth and enhancement. The modular design ensures maintainability and extensibility as the template ecosystem evolves.