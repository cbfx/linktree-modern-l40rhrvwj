# Deployment and Operations Guide

Complete guide for deploying and managing your LinkTree Modern template across different platforms and environments.

## 📋 Table of Contents

- [Overview](#overview)
- [Current Deployment Status](#current-deployment-status)
- [Platform Integration](#platform-integration)
- [GitHub Actions Deployment](#github-actions-deployment)
- [Manual Deployment Options](#manual-deployment-options)
- [Environment Configuration](#environment-configuration)
- [Performance Monitoring](#performance-monitoring)
- [Security Considerations](#security-considerations)
- [Troubleshooting](#troubleshooting)
- [Maintenance](#maintenance)

## Overview

The LinkTree Modern template is designed for easy deployment across multiple platforms with automated CI/CD pipelines. The template supports both platform-managed deployments through cloud-landing and standalone deployments.

### Deployment Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Configuration  │───▶│  Build Process   │───▶│   Deployment    │
│  Injection      │    │  & Validation    │    │   Platform      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Supported Platforms

- **GitHub Pages** (Free, automatic)
- **Netlify** (Free tier available)
- **Vercel** (Free tier available)
- **Custom hosting** (Any static hosting provider)
- **Cloud-Landing Platform** (Managed deployment)

## Current Deployment Status

### Readiness Level: 45/100 (Developer Preview)

#### ✅ Fully Functional
- Template build process
- GitHub Actions CI/CD
- Configuration system
- Security implementation
- Performance optimization

#### 🟡 Partially Functional (85%)
- Platform integration
- API endpoint integration
- Template discovery service

#### ❌ Blocked
- Full backend integration (ioredis dependency issue)
- Complete platform automation

### Known Limitations

1. **Backend Dependency**: ioredis module prevents full backend startup
2. **Platform Integration**: Some API endpoints not fully operational
3. **Auto-deployment**: Platform-triggered deployments need manual intervention

## Platform Integration

### Cloud-Landing Platform Deployment

The template integrates with the cloud-landing platform through:

#### 1. Template Discovery

The platform discovers templates through package.json metadata:

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

#### 2. Configuration Schema Endpoint

```
GET /api/templates/linktree-modern/schema
```

Returns the JSON Schema for configuration validation.

#### 3. Template Deployment Flow

```
User Selects Template
      ↓
Configuration Form Generation
      ↓
User Fills Configuration
      ↓
Repository Fork & Configuration Injection
      ↓
GitHub Actions Triggered
      ↓
Build & Deploy
```

#### 4. Current Platform Status

- **Template Discovery**: ✅ Working
- **Schema Endpoint**: 🟡 Mock data available
- **Configuration Form**: ✅ Working
- **Repository Management**: 🟡 Limited functionality
- **Deployment Automation**: ❌ Manual intervention required

## GitHub Actions Deployment

The template includes a comprehensive GitHub Actions workflow for automated deployment.

### Workflow Overview

```yaml
name: Deploy LinkTree Modern

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:
```

### Build Process

#### 1. Multi-Environment Testing
- Node.js 18.x and 20.x
- Cross-platform compatibility (Ubuntu)
- Dependency caching for faster builds

#### 2. Configuration Loading
```bash
# Priority order:
1. platform-config.json (Platform injected)
2. config.json (User provided)
3. config.defaults.json (Fallback)
```

#### 3. Validation & Quality Checks
- JSON Schema validation
- ESLint code quality
- TypeScript compilation
- Security audit (npm audit)

#### 4. Build & Optimization
```bash
npm run build
# Outputs to dist/ directory
# - Vite optimization
# - Terser minification
# - Asset compression
```

#### 5. Testing Pipeline
- Unit tests (when available)
- Lighthouse CI performance testing
- Accessibility testing (axe-core)
- Security scanning (CodeQL)

### Deployment Targets

#### GitHub Pages (Automatic)
```yaml
- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./dist
    cname: ${{ secrets.CUSTOM_DOMAIN }}
```

#### Netlify (Optional)
```yaml
- name: Deploy to Netlify
  uses: nwtgck/actions-netlify@v3.0
  with:
    publish-dir: './dist'
    production-branch: main
  env:
    NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
    NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

#### Vercel (Optional)
```yaml
- name: Deploy to Vercel
  uses: amondnet/vercel-action@v25
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
    vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### Required GitHub Secrets

| Secret | Required | Description |
|--------|----------|-------------|
| `GITHUB_TOKEN` | ✅ | Automatic GitHub token |
| `NETLIFY_AUTH_TOKEN` | ❌ | Netlify deployment token |
| `NETLIFY_SITE_ID` | ❌ | Netlify site identifier |
| `VERCEL_TOKEN` | ❌ | Vercel deployment token |
| `VERCEL_ORG_ID` | ❌ | Vercel organization ID |
| `VERCEL_PROJECT_ID` | ❌ | Vercel project ID |
| `CUSTOM_DOMAIN` | ❌ | Custom domain for GitHub Pages |

## Manual Deployment Options

### Local Build & Deploy

#### Prerequisites
```bash
# Required versions
Node.js >= 18.0.0
npm >= 9.0.0
```

#### Build Process
```bash
# 1. Install dependencies
npm install

# 2. Configure your template
cp config.defaults.json src/config.json
# Edit src/config.json with your settings

# 3. Validate configuration (optional)
npm run lint

# 4. Build for production
npm run build

# 5. Preview locally (optional)
npm run preview
```

#### Deploy to Static Hosting
```bash
# Upload the dist/ folder to your web server
# Example with rsync:
rsync -av dist/ user@server:/path/to/web/root/

# Example with scp:
scp -r dist/* user@server:/path/to/web/root/
```

### Platform-Specific Deployment

#### Netlify Manual Deploy

1. **Build locally**:
   ```bash
   npm run build
   ```

2. **Deploy via Netlify CLI**:
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli

   # Login to Netlify
   netlify login

   # Deploy
   netlify deploy --prod --dir dist
   ```

3. **Deploy via Netlify UI**:
   - Visit [Netlify](https://app.netlify.com)
   - Drag and drop the `dist` folder

#### Vercel Manual Deploy

1. **Build locally**:
   ```bash
   npm run build
   ```

2. **Deploy via Vercel CLI**:
   ```bash
   # Install Vercel CLI
   npm install -g vercel

   # Deploy
   vercel --prod
   ```

#### Other Static Hosts

The template works with any static hosting provider:

- **AWS S3 + CloudFront**
- **Google Cloud Storage**
- **Azure Static Web Apps**
- **DigitalOcean App Platform**
- **Cloudflare Pages**
- **Firebase Hosting**

## Environment Configuration

### Environment Variables

#### Build-time Variables
```bash
NODE_ENV=production          # Production optimization
VITE_GA_ID=G-XXXXXXXXXX     # Google Analytics ID
VITE_FB_PIXEL_ID=1234567890  # Facebook Pixel ID
```

#### Runtime Configuration
Configuration is injected at build time through JSON files:

```bash
# Configuration priority:
1. platform-config.json (Platform)
2. config.json (User)
3. config.defaults.json (Default)
```

### Custom Domain Setup

#### GitHub Pages
1. Add `CUSTOM_DOMAIN` secret to repository
2. Configure DNS CNAME record
3. Enable HTTPS in repository settings

#### Netlify
1. Go to Domain settings in Netlify dashboard
2. Add custom domain
3. Configure DNS records as instructed

#### Vercel
1. Go to Project settings in Vercel dashboard
2. Add custom domain
3. Configure DNS records as instructed

### HTTPS Configuration

All deployment targets support HTTPS:
- **GitHub Pages**: Automatic with Let's Encrypt
- **Netlify**: Automatic with Let's Encrypt
- **Vercel**: Automatic with Let's Encrypt

## Performance Monitoring

### Lighthouse CI Integration

Automated performance testing on every deployment:

```yaml
- name: Run Lighthouse CI
  run: lhci autorun
  env:
    LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

#### Performance Targets
- **Performance**: > 95
- **Accessibility**: > 95
- **Best Practices**: > 95
- **SEO**: > 95

### Core Web Vitals

Target metrics:
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1

### Bundle Analysis

Monitor bundle size:
```bash
npm run build
# Check dist/ folder size
du -sh dist/
```

Expected sizes:
- **Total Bundle**: < 100KB gzipped
- **JavaScript**: < 50KB gzipped
- **CSS**: < 30KB gzipped

## Security Considerations

### Content Security Policy

Recommended CSP headers:
```
Content-Security-Policy: default-src 'self'; 
  script-src 'self' 'unsafe-inline' *.googletagmanager.com *.facebook.net; 
  style-src 'self' 'unsafe-inline' fonts.googleapis.com; 
  font-src 'self' fonts.gstatic.com; 
  img-src 'self' data: https:; 
  connect-src 'self' *.google-analytics.com *.facebook.com;
```

### Security Headers

Recommended security headers:
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

### HTTPS Enforcement

Always use HTTPS in production:
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

### Input Sanitization

All user input is sanitized:
- URL validation with protocol checking
- HTML entity encoding
- XSS prevention through React's built-in protection

## Troubleshooting

### Common Deployment Issues

#### Build Failures

**Node.js Version Mismatch**
```bash
# Check version
node --version

# Use correct version
nvm use 18
# or
nvm use 20
```

**Dependency Issues**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**TypeScript Errors**
```bash
# Check types
npm run lint

# Build with type checking
npx tsc --noEmit
```

#### Configuration Issues

**Invalid JSON Syntax**
```bash
# Validate JSON
npx ajv validate -s config.schema.json -d src/config.json
```

**Missing Required Fields**
```bash
# Check against schema
npm run validate-config
```

**Invalid URLs**
```bash
# URLs must include protocol
# ❌ example.com
# ✅ https://example.com
```

#### Performance Issues

**Large Bundle Size**
```bash
# Analyze bundle
npm run build
npx vite-bundle-analyzer dist
```

**Slow Loading**
- Optimize images (WebP format, compression)
- Minimize configuration size
- Use appropriate CDN

#### Accessibility Issues

**Failed axe-core Tests**
```bash
# Run accessibility tests locally
npx axe-core http://localhost:4173
```

Common fixes:
- Ensure sufficient color contrast
- Add proper alt text to images
- Maintain semantic HTML structure

### Debugging GitHub Actions

#### View Workflow Logs
1. Go to repository Actions tab
2. Click on failed workflow
3. Expand failed step logs

#### Common Workflow Failures

**Configuration Validation Failed**
- Check JSON syntax in config files
- Ensure all required fields are present
- Validate against schema

**Build Process Failed**
- Check Node.js version compatibility
- Verify all dependencies are available
- Check for TypeScript errors

**Deployment Failed**
- Verify deployment secrets are set
- Check deployment platform status
- Ensure repository permissions are correct

### Getting Help

1. **Check workflow logs** in GitHub Actions
2. **Validate configuration** with schema
3. **Test locally** with `npm run dev`
4. **Check dependencies** with `npm audit`
5. **Review documentation** for platform-specific issues

## Maintenance

### Regular Maintenance Tasks

#### Weekly
- [ ] Monitor deployment status
- [ ] Check performance metrics
- [ ] Review security alerts

#### Monthly
- [ ] Update dependencies (`npm update`)
- [ ] Review and rotate secrets
- [ ] Check for template updates
- [ ] Monitor analytics and traffic

#### Quarterly
- [ ] Security audit (`npm audit`)
- [ ] Performance optimization review
- [ ] Accessibility compliance check
- [ ] Backup configuration and content

### Dependency Updates

```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Update major versions (carefully)
npx npm-check-updates -u
npm install
```

### Security Updates

```bash
# Security audit
npm audit

# Fix automatically fixable issues
npm audit fix

# Manual review for breaking changes
npm audit fix --force
```

### Backup Strategy

#### Configuration Backup
- Store configuration in version control
- Export configuration from platform
- Document custom modifications

#### Content Backup
- Backup profile images
- Save configuration history
- Document deployment procedures

### Monitoring & Alerts

#### Performance Monitoring
- Set up Lighthouse CI alerts
- Monitor Core Web Vitals
- Track bundle size changes

#### Uptime Monitoring
- Use external monitoring service
- Set up alerting for downtime
- Monitor DNS and SSL certificate expiration

#### Analytics Monitoring
- Track visitor metrics
- Monitor link click rates
- Review conversion funnel

### Support & Updates

#### Template Updates
- Watch repository for updates
- Review changelog before updating
- Test updates in staging environment

#### Community Support
- [GitHub Issues](https://github.com/nailthelanding/template-linktree-modern/issues)
- [Developer Documentation](./DEVELOPER.md)
- [Configuration Guide](./CONFIGURATION.md)

#### Professional Support
For enterprise deployments or custom requirements:
- Platform support through cloud-landing
- Custom deployment consulting
- Priority bug fixes and features

---

For additional help with deployment issues, please check:
- [Troubleshooting Guide](./docs/troubleshooting.md)
- [Developer Documentation](./DEVELOPER.md)
- [GitHub Issues](https://github.com/nailthelanding/template-linktree-modern/issues)