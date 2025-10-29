# API Integration Guide

Complete guide for integrating the LinkTree Modern template with the cloud-landing platform and external APIs.

## 🔌 Platform API Integration

### Template Discovery Service

The cloud-landing platform discovers and manages templates through a standardized API interface.

#### Template Metadata Endpoint

```typescript
GET /api/templates/linktree-modern

Response:
{
  "id": "linktree-modern",
  "displayName": "LinkTree Modern",
  "description": "A modern, customizable link aggregation page",
  "version": "1.0.0",
  "type": "website",
  "framework": "react",
  "category": "static",
  "tags": ["linktree", "links", "profile", "social"],
  "features": ["responsive", "theme-switching", "customizable"],
  "compatibility": {
    "node": ">=18.0.0",
    "npm": ">=9.0.0",
    "browsers": ["Chrome >=90", "Firefox >=88", "Safari >=14", "Edge >=90"]
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/nailthelanding/template-linktree-modern.git"
  },
  "preview": {
    "screenshot": "https://example.com/preview.png",
    "demo": "https://demo.example.com"
  },
  "status": "active",
  "readiness": 45,
  "lastUpdated": "2024-09-10T22:19:00Z"
}
```

#### Configuration Schema Endpoint

```typescript
GET /api/templates/linktree-modern/schema

Response: JSONSchema
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "LinkTree Modern Configuration",
  "type": "object",
  "properties": {
    "profile": { /* Profile schema */ },
    "links": { /* Links schema */ },
    "theme": { /* Theme schema */ },
    // ... complete schema
  },
  "required": ["profile", "links", "theme", "layout", "seo"]
}
```

### Configuration Validation

#### Validate Configuration Endpoint

```typescript
POST /api/templates/linktree-modern/validate
Content-Type: application/json

Request Body:
{
  "config": {
    "profile": {
      "name": "John Doe",
      "bio": "Web developer",
      "avatar": "https://example.com/avatar.jpg"
    },
    "links": [
      {
        "title": "My Website",
        "url": "https://johndoe.com",
        "icon": "globe"
      }
    ],
    // ... rest of configuration
  }
}

Response:
{
  "valid": true,
  "errors": [],
  "warnings": [
    {
      "field": "theme.primaryColor",
      "message": "Consider using a higher contrast color for better accessibility",
      "severity": "warning"
    }
  ],
  "suggestions": [
    {
      "field": "seo.description",
      "message": "Add a meta description for better SEO",
      "suggestion": "Find all my important links in one place"
    }
  ]
}
```

#### Error Response Format

```typescript
Response (400 Bad Request):
{
  "valid": false,
  "errors": [
    {
      "field": "profile.avatar",
      "message": "Invalid URL format",
      "code": "INVALID_URL",
      "expected": "https://example.com/image.jpg",
      "received": "example.com/image.jpg"
    },
    {
      "field": "links[0].url",
      "message": "URL must include protocol (https:// or http://)",
      "code": "MISSING_PROTOCOL"
    }
  ],
  "warnings": [],
  "suggestions": []
}
```

### Template Deployment

#### Create Deployment Endpoint

```typescript
POST /api/templates/linktree-modern/deploy
Content-Type: application/json
Authorization: Bearer <user-token>

Request Body:
{
  "config": { /* Complete configuration object */ },
  "deployment": {
    "name": "my-linktree",
    "subdomain": "my-linktree", // Optional: custom subdomain
    "customDomain": "", // Optional: custom domain
    "platform": "github-pages", // github-pages | netlify | vercel
    "repository": {
      "name": "my-linktree-site",
      "private": false
    }
  },
  "user": {
    "id": "user-123",
    "githubUsername": "johndoe"
  }
}

Response:
{
  "deploymentId": "deploy-abc123",
  "status": "initiated",
  "repository": {
    "url": "https://github.com/johndoe/my-linktree-site",
    "branch": "main"
  },
  "urls": {
    "preview": "https://my-linktree.nailthelanding.io",
    "production": "https://johndoe.github.io/my-linktree-site"
  },
  "estimatedCompletionTime": "2-3 minutes",
  "steps": [
    {
      "id": "fork-repository",
      "name": "Fork Template Repository",
      "status": "completed",
      "duration": 2000
    },
    {
      "id": "inject-configuration",
      "name": "Inject Configuration",
      "status": "in-progress",
      "progress": 60
    },
    {
      "id": "setup-github-actions",
      "name": "Setup GitHub Actions",
      "status": "pending"
    },
    {
      "id": "initial-deployment",
      "name": "Initial Deployment",
      "status": "pending"
    }
  ]
}
```

#### Deployment Status Endpoint

```typescript
GET /api/deployments/{deploymentId}

Response:
{
  "deploymentId": "deploy-abc123",
  "status": "completed", // initiated | in-progress | completed | failed
  "progress": 100,
  "templateId": "linktree-modern",
  "userId": "user-123",
  "createdAt": "2024-09-10T22:19:00Z",
  "completedAt": "2024-09-10T22:22:30Z",
  "repository": {
    "url": "https://github.com/johndoe/my-linktree-site",
    "branch": "main",
    "lastCommit": "abc123def456"
  },
  "urls": {
    "preview": "https://my-linktree.nailthelanding.io",
    "production": "https://johndoe.github.io/my-linktree-site"
  },
  "buildInfo": {
    "nodeVersion": "18.17.0",
    "buildTime": 45000, // milliseconds
    "bundleSize": 95000, // bytes
    "lighthouseScore": {
      "performance": 96,
      "accessibility": 100,
      "bestPractices": 95,
      "seo": 98
    }
  },
  "steps": [
    {
      "id": "fork-repository",
      "name": "Fork Template Repository",
      "status": "completed",
      "startedAt": "2024-09-10T22:19:01Z",
      "completedAt": "2024-09-10T22:19:03Z",
      "duration": 2000
    },
    {
      "id": "inject-configuration",
      "name": "Inject Configuration",
      "status": "completed",
      "startedAt": "2024-09-10T22:19:03Z",
      "completedAt": "2024-09-10T22:19:15Z",
      "duration": 12000
    },
    {
      "id": "setup-github-actions",
      "name": "Setup GitHub Actions",
      "status": "completed",
      "startedAt": "2024-09-10T22:19:15Z",
      "completedAt": "2024-09-10T22:19:20Z",
      "duration": 5000
    },
    {
      "id": "initial-deployment",
      "name": "Initial Deployment",
      "status": "completed",
      "startedAt": "2024-09-10T22:19:20Z",
      "completedAt": "2024-09-10T22:22:30Z",
      "duration": 190000,
      "logs": [
        "Installing dependencies...",
        "Building application...",
        "Deploying to GitHub Pages...",
        "Deployment completed successfully"
      ]
    }
  ]
}
```

### Configuration Management

#### Update Configuration Endpoint

```typescript
PUT /api/deployments/{deploymentId}/config
Content-Type: application/json
Authorization: Bearer <user-token>

Request Body:
{
  "config": { /* Updated configuration */ },
  "message": "Update profile information and theme colors"
}

Response:
{
  "success": true,
  "deploymentId": "deploy-abc123",
  "configVersion": 2,
  "triggerDeployment": true,
  "estimatedUpdateTime": "1-2 minutes"
}
```

#### Configuration History Endpoint

```typescript
GET /api/deployments/{deploymentId}/config/history

Response:
{
  "deploymentId": "deploy-abc123",
  "versions": [
    {
      "version": 2,
      "createdAt": "2024-09-10T23:15:00Z",
      "message": "Update profile information and theme colors",
      "changes": [
        {
          "field": "profile.bio",
          "oldValue": "Web developer",
          "newValue": "Full-stack developer and UI/UX designer"
        },
        {
          "field": "theme.primaryColor",
          "oldValue": "#6366f1",
          "newValue": "#3b82f6"
        }
      ],
      "deploymentStatus": "completed"
    },
    {
      "version": 1,
      "createdAt": "2024-09-10T22:19:00Z",
      "message": "Initial configuration",
      "changes": [],
      "deploymentStatus": "completed"
    }
  ]
}
```

## 🔗 External API Integrations

### Analytics Services

#### Google Analytics 4 Integration

```typescript
// GA4 Configuration
interface GA4Config {
  measurementId: string;
  trackingEvents: {
    linkClicks: boolean;
    socialClicks: boolean;
    themeChanges: boolean;
    pageViews: boolean;
  };
}

// Implementation
class GoogleAnalytics {
  private config: GA4Config;
  
  constructor(config: GA4Config) {
    this.config = config;
    this.initialize();
  }
  
  private initialize() {
    // Load GA4 script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.measurementId}`;
    document.head.appendChild(script);
    
    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() { dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', this.config.measurementId);
  }
  
  trackLinkClick(data: LinkClickData) {
    if (!this.config.trackingEvents.linkClicks) return;
    
    window.gtag('event', 'click', {
      event_category: 'Link',
      event_label: data.title,
      custom_parameter_url: data.url,
      custom_parameter_featured: data.featured
    });
  }
  
  trackSocialClick(platform: string) {
    if (!this.config.trackingEvents.socialClicks) return;
    
    window.gtag('event', 'social_click', {
      event_category: 'Social Media',
      event_label: platform
    });
  }
}
```

#### Facebook Pixel Integration

```typescript
// Facebook Pixel Configuration
interface FacebookPixelConfig {
  pixelId: string;
  trackingEvents: {
    linkClicks: boolean;
    socialClicks: boolean;
    pageViews: boolean;
  };
}

// Implementation
class FacebookPixel {
  private config: FacebookPixelConfig;
  
  constructor(config: FacebookPixelConfig) {
    this.config = config;
    this.initialize();
  }
  
  private initialize() {
    // Facebook Pixel base code
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    
    fbq('init', this.config.pixelId);
    fbq('track', 'PageView');
  }
  
  trackLinkClick(data: LinkClickData) {
    if (!this.config.trackingEvents.linkClicks) return;
    
    window.fbq('track', 'Contact', {
      content_name: data.title,
      content_category: 'Link Click'
    });
  }
  
  trackSocialClick(platform: string) {
    if (!this.config.trackingEvents.socialClicks) return;
    
    window.fbq('track', 'Contact', {
      content_name: platform,
      content_category: 'Social Media'
    });
  }
}
```

### Image and Asset APIs

#### Image Optimization Service

```typescript
// Image optimization for avatars and backgrounds
interface ImageOptimizationAPI {
  optimize(imageUrl: string, options: OptimizationOptions): Promise<OptimizedImage>;
}

interface OptimizationOptions {
  width?: number;
  height?: number;
  format?: 'webp' | 'jpeg' | 'png';
  quality?: number; // 1-100
  crop?: 'center' | 'top' | 'bottom';
}

interface OptimizedImage {
  url: string;
  originalSize: number;
  optimizedSize: number;
  format: string;
  dimensions: {
    width: number;
    height: number;
  };
}

// Usage example
const optimizeAvatar = async (avatarUrl: string): Promise<string> => {
  try {
    const optimized = await imageOptimization.optimize(avatarUrl, {
      width: 400,
      height: 400,
      format: 'webp',
      quality: 85,
      crop: 'center'
    });
    
    return optimized.url;
  } catch (error) {
    console.warn('Image optimization failed, using original URL:', error);
    return avatarUrl;
  }
};
```

### Social Media APIs

#### Social Media URL Validation

```typescript
// Validate social media usernames against platform APIs
interface SocialMediaValidator {
  validateUsername(platform: string, username: string): Promise<ValidationResult>;
}

interface ValidationResult {
  valid: boolean;
  exists?: boolean;
  profileUrl?: string;
  displayName?: string;
  profilePicture?: string;
  followerCount?: number;
  verified?: boolean;
  error?: string;
}

// Implementation
class SocialMediaValidator {
  async validateTwitter(username: string): Promise<ValidationResult> {
    try {
      // Note: Twitter API v2 requires authentication
      // This would typically be done server-side
      const response = await fetch(`/api/social/twitter/validate/${username}`);
      const data = await response.json();
      
      return {
        valid: data.exists,
        exists: data.exists,
        profileUrl: `https://twitter.com/${username}`,
        displayName: data.name,
        verified: data.verified
      };
    } catch (error) {
      return {
        valid: false,
        error: 'Unable to validate Twitter username'
      };
    }
  }
  
  async validateInstagram(username: string): Promise<ValidationResult> {
    // Instagram Basic Display API integration
    // This would be implemented server-side due to CORS restrictions
    return {
      valid: true, // Basic format validation
      profileUrl: `https://instagram.com/${username}`
    };
  }
  
  async validateGitHub(username: string): Promise<ValidationResult> {
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      
      if (response.status === 404) {
        return {
          valid: false,
          exists: false,
          error: 'GitHub user not found'
        };
      }
      
      const data = await response.json();
      
      return {
        valid: true,
        exists: true,
        profileUrl: data.html_url,
        displayName: data.name || data.login,
        profilePicture: data.avatar_url,
        followerCount: data.followers
      };
    } catch (error) {
      return {
        valid: false,
        error: 'Unable to validate GitHub username'
      };
    }
  }
}
```

## 🛠️ Development API Tools

### Local Development Server

```typescript
// Mock API server for local development
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Mock template metadata
app.get('/api/templates/linktree-modern', (req, res) => {
  res.json({
    id: 'linktree-modern',
    displayName: 'LinkTree Modern',
    version: '1.0.0',
    status: 'active',
    readiness: 45
  });
});

// Mock configuration validation
app.post('/api/templates/linktree-modern/validate', (req, res) => {
  const { config } = req.body;
  
  // Basic validation logic
  const errors = [];
  const warnings = [];
  
  if (!config.profile?.name) {
    errors.push({
      field: 'profile.name',
      message: 'Name is required',
      code: 'REQUIRED_FIELD'
    });
  }
  
  if (config.theme?.primaryColor && !/^#[0-9A-Fa-f]{6}$/.test(config.theme.primaryColor)) {
    errors.push({
      field: 'theme.primaryColor',
      message: 'Invalid hex color format',
      code: 'INVALID_COLOR'
    });
  }
  
  res.json({
    valid: errors.length === 0,
    errors,
    warnings
  });
});

// Mock deployment creation
app.post('/api/templates/linktree-modern/deploy', (req, res) => {
  const deploymentId = `deploy-${Date.now()}`;
  
  res.json({
    deploymentId,
    status: 'initiated',
    repository: {
      url: `https://github.com/mock-user/mock-repo`,
      branch: 'main'
    },
    estimatedCompletionTime: '2-3 minutes'
  });
});

app.listen(3001, () => {
  console.log('Mock API server running on http://localhost:3001');
});
```

### API Testing Utilities

```typescript
// Test utilities for API integration
export class APITestClient {
  private baseUrl: string;
  private authToken?: string;
  
  constructor(baseUrl: string, authToken?: string) {
    this.baseUrl = baseUrl;
    this.authToken = authToken;
  }
  
  async validateConfiguration(config: Config): Promise<ValidationResult> {
    const response = await fetch(`${this.baseUrl}/api/templates/linktree-modern/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.authToken && { Authorization: `Bearer ${this.authToken}` })
      },
      body: JSON.stringify({ config })
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    return response.json();
  }
  
  async createDeployment(deploymentData: DeploymentRequest): Promise<DeploymentResponse> {
    const response = await fetch(`${this.baseUrl}/api/templates/linktree-modern/deploy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.authToken}`
      },
      body: JSON.stringify(deploymentData)
    });
    
    if (!response.ok) {
      throw new Error(`Deployment failed: ${response.status}`);
    }
    
    return response.json();
  }
  
  async getDeploymentStatus(deploymentId: string): Promise<DeploymentStatus> {
    const response = await fetch(`${this.baseUrl}/api/deployments/${deploymentId}`, {
      headers: {
        ...(this.authToken && { Authorization: `Bearer ${this.authToken}` })
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get deployment status: ${response.status}`);
    }
    
    return response.json();
  }
}

// Usage in tests
describe('API Integration', () => {
  const apiClient = new APITestClient('http://localhost:3001');
  
  it('should validate configuration successfully', async () => {
    const config = {
      profile: {
        name: 'Test User',
        bio: 'Test bio',
        avatar: 'https://example.com/avatar.jpg'
      },
      links: [],
      theme: {
        primaryColor: '#6366f1',
        colorScheme: 'auto'
      }
    };
    
    const result = await apiClient.validateConfiguration(config);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
  
  it('should handle validation errors', async () => {
    const invalidConfig = {
      profile: {
        name: '', // Invalid: empty name
        bio: 'Test bio',
        avatar: 'invalid-url' // Invalid: not a URL
      }
    };
    
    const result = await apiClient.validateConfiguration(invalidConfig);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
```

## 🔐 Authentication & Authorization

### API Authentication

```typescript
// JWT token management for API requests
interface AuthToken {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  refresh_token: string;
  scope: string[];
}

class AuthManager {
  private token: AuthToken | null = null;
  private baseUrl: string;
  
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  
  async authenticate(username: string, password: string): Promise<AuthToken> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    if (!response.ok) {
      throw new Error('Authentication failed');
    }
    
    this.token = await response.json();
    return this.token;
  }
  
  async refreshToken(): Promise<AuthToken> {
    if (!this.token?.refresh_token) {
      throw new Error('No refresh token available');
    }
    
    const response = await fetch(`${this.baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: this.token.refresh_token })
    });
    
    if (!response.ok) {
      throw new Error('Token refresh failed');
    }
    
    this.token = await response.json();
    return this.token;
  }
  
  getAuthHeaders(): Record<string, string> {
    if (!this.token) {
      throw new Error('Not authenticated');
    }
    
    return {
      Authorization: `${this.token.token_type} ${this.token.access_token}`
    };
  }
}
```

### OAuth Integration

```typescript
// GitHub OAuth for repository access
interface GitHubOAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

class GitHubOAuth {
  private config: GitHubOAuthConfig;
  
  constructor(config: GitHubOAuthConfig) {
    this.config = config;
  }
  
  getAuthorizationUrl(): string {
    const params = new URLSearchParams({
      client_id: this.config.clientId,
      redirect_uri: this.config.redirectUri,
      scope: this.config.scopes.join(' '),
      state: this.generateState()
    });
    
    return `https://github.com/login/oauth/authorize?${params}`;
  }
  
  async exchangeCodeForToken(code: string, state: string): Promise<string> {
    // Verify state parameter
    if (!this.verifyState(state)) {
      throw new Error('Invalid state parameter');
    }
    
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: this.config.clientId,
        client_secret: this.config.clientSecret,
        code: code
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(`OAuth error: ${data.error_description}`);
    }
    
    return data.access_token;
  }
  
  private generateState(): string {
    return Math.random().toString(36).substring(2, 15);
  }
  
  private verifyState(state: string): boolean {
    // Implement state verification logic
    return true; // Simplified for example
  }
}
```

## 📊 Monitoring & Analytics

### API Performance Monitoring

```typescript
// API performance tracking
class APIMonitor {
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  
  async makeRequest<T>(
    url: string,
    options: RequestInit,
    operationName: string
  ): Promise<T> {
    const startTime = performance.now();
    
    try {
      const response = await fetch(url, options);
      const endTime = performance.now();
      
      this.recordMetric(operationName, {
        duration: endTime - startTime,
        status: response.status,
        success: response.ok,
        timestamp: Date.now()
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      const endTime = performance.now();
      
      this.recordMetric(operationName, {
        duration: endTime - startTime,
        status: 0,
        success: false,
        error: error.message,
        timestamp: Date.now()
      });
      
      throw error;
    }
  }
  
  private recordMetric(operation: string, metric: PerformanceMetric) {
    if (!this.metrics.has(operation)) {
      this.metrics.set(operation, []);
    }
    
    const metrics = this.metrics.get(operation)!;
    metrics.push(metric);
    
    // Keep only last 100 metrics per operation
    if (metrics.length > 100) {
      metrics.shift();
    }
  }
  
  getMetrics(operation: string): PerformanceStats {
    const metrics = this.metrics.get(operation) || [];
    
    if (metrics.length === 0) {
      return {
        count: 0,
        averageDuration: 0,
        successRate: 0,
        errorRate: 0
      };
    }
    
    const successCount = metrics.filter(m => m.success).length;
    const totalDuration = metrics.reduce((sum, m) => sum + m.duration, 0);
    
    return {
      count: metrics.length,
      averageDuration: totalDuration / metrics.length,
      successRate: (successCount / metrics.length) * 100,
      errorRate: ((metrics.length - successCount) / metrics.length) * 100
    };
  }
}

interface PerformanceMetric {
  duration: number;
  status: number;
  success: boolean;
  error?: string;
  timestamp: number;
}

interface PerformanceStats {
  count: number;
  averageDuration: number;
  successRate: number;
  errorRate: number;
}
```

This comprehensive API integration guide provides all the necessary information for integrating the LinkTree Modern template with the cloud-landing platform and external services. The examples show both the current implementation and the target architecture for full platform integration.