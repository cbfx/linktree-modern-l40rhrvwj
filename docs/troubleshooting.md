# Troubleshooting Guide

Common issues and solutions for the LinkTree Modern template.

## 🚨 Common Issues

### Build and Development Issues

#### Node.js Version Compatibility

**Problem**: Build fails with Node.js version errors
```bash
Error: The engine "node" is incompatible with this module
```

**Solution**:
```bash
# Check current version
node --version

# Install correct version (18.0.0 or higher)
nvm install 18
nvm use 18

# Or install latest LTS
nvm install --lts
nvm use --lts
```

#### Dependency Installation Failures

**Problem**: npm install fails with permission or corruption errors

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install

# For permission issues on macOS/Linux
sudo npm install -g npm@latest
```

#### TypeScript Compilation Errors

**Problem**: Build fails with TypeScript errors

**Solution**:
```bash
# Check for TypeScript errors
npx tsc --noEmit

# Common fixes:
# 1. Update @types packages
npm update @types/react @types/react-dom

# 2. Check tsconfig.json compatibility
# 3. Verify import statements are correct
```

### Configuration Issues

#### Invalid JSON Syntax

**Problem**: Configuration file has syntax errors
```
SyntaxError: Unexpected token in JSON
```

**Solution**:
```bash
# Validate JSON syntax
node -e "console.log(JSON.parse(require('fs').readFileSync('src/config.json', 'utf8')))"

# Or use online validator
# https://jsonlint.com/

# Common issues:
# - Trailing commas
# - Unescaped quotes
# - Missing closing brackets
```

#### Schema Validation Failures

**Problem**: Configuration doesn't match required schema

**Solutions**:

1. **Missing Required Fields**:
```json
// ❌ Missing required profile fields
{
  "profile": {
    "name": "John"
  }
}

// ✅ Include all required fields
{
  "profile": {
    "name": "John Doe",
    "bio": "Web developer",
    "avatar": "https://example.com/photo.jpg"
  }
}
```

2. **Invalid URL Format**:
```json
// ❌ Missing protocol
{"url": "example.com"}

// ✅ Include protocol
{"url": "https://example.com"}
```

3. **Invalid Color Format**:
```json
// ❌ Color name or invalid hex
{"primaryColor": "blue"}

// ✅ Valid hex color
{"primaryColor": "#3b82f6"}
```

#### Image Loading Issues

**Problem**: Profile images or backgrounds not loading

**Checklist**:
- ✅ URLs use HTTPS protocol
- ✅ Images are publicly accessible
- ✅ File formats are supported (jpg, png, webp, gif, svg)
- ✅ CORS headers allow cross-origin requests
- ✅ Image URLs are not behind authentication

**Solution**:
```bash
# Test image URL directly in browser
curl -I https://your-image-url.com/image.jpg

# Check for proper response headers
HTTP/1.1 200 OK
Content-Type: image/jpeg
Access-Control-Allow-Origin: *
```

### Deployment Issues

#### GitHub Actions Workflow Failures

**Problem**: Deployment workflow fails in GitHub Actions

**Common Causes & Solutions**:

1. **Node.js Version Mismatch**:
```yaml
# Ensure workflow uses correct Node version
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '18.x'  # Match your local version
```

2. **Missing Secrets**:
```bash
# For Netlify deployment, add secrets:
NETLIFY_AUTH_TOKEN
NETLIFY_SITE_ID

# For Vercel deployment, add secrets:
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

3. **Configuration Validation Failure**:
```bash
# Check that your configuration is valid
npm run lint
npx ajv validate -s config.schema.json -d src/config.json
```

#### Build Artifacts Missing

**Problem**: Deployment succeeds but site shows 404 or blank page

**Solutions**:
1. **Check Build Output**:
```bash
npm run build
ls -la dist/
# Should contain index.html and assets folder
```

2. **Verify Base Path**:
```javascript
// vite.config.ts
export default defineConfig({
  base: './', // For relative paths
  // or
  base: '/repository-name/', // For GitHub Pages
});
```

3. **Check Deployment Directory**:
- GitHub Pages: Ensure `publish_dir: ./dist`
- Netlify: Ensure `publish-dir: './dist'`
- Vercel: Should auto-detect Vite output

### Performance Issues

#### Slow Loading Times

**Problem**: Template loads slowly on mobile or slow connections

**Solutions**:

1. **Optimize Images**:
```bash
# Compress images before uploading
# Recommended: 400x400px for avatars, <500KB file size
# Use WebP format when possible
```

2. **Minimize Configuration**:
```json
// Keep descriptions concise
{
  "links": [
    {
      "title": "My Website",
      "description": "Check it out", // Keep short
      "url": "https://example.com"
    }
  ]
}
```

3. **Limit Link Count**:
```json
// Optimal: 10-15 links
// Maximum: 20 links
{
  "links": [
    // Focus on most important links
  ]
}
```

#### Large Bundle Size

**Problem**: Built bundle is larger than expected

**Solutions**:
```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist

# Check for:
# - Unused dependencies
# - Large icon imports
# - Duplicate code
```

### Accessibility Issues

#### Keyboard Navigation Problems

**Problem**: Can't navigate with keyboard only

**Solutions**:
1. **Check Tab Order**:
```html
<!-- Ensure logical tab sequence -->
<div role="main">
  <section aria-label="Profile">
    <!-- Profile content -->
  </section>
  <nav aria-label="Links">
    <!-- Links content -->
  </nav>
</div>
```

2. **Verify Focus Indicators**:
```css
/* Ensure visible focus styles */
.link-button:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}
```

#### Color Contrast Failures

**Problem**: Text doesn't meet WCAG contrast requirements

**Solutions**:
```json
// Use high-contrast color combinations
{
  "theme": {
    "primaryColor": "#1f2937", // Dark color for text
    "colorScheme": "light"     // Light background
  }
}
```

**Tools for Testing**:
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Colour Contrast Analyser](https://www.tpgi.com/color-contrast-checker/)

### Browser Compatibility Issues

#### Modern Browser Features

**Problem**: Template doesn't work in older browsers

**Browser Support**:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Solutions**:
1. **Check Browser Version**:
```javascript
// Add browser detection if needed
const isSupported = 'CSS' in window && 'supports' in window.CSS;
```

2. **Fallback Fonts**:
```css
/* Ensure font fallbacks */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
```

### Social Media Integration Issues

#### Social Links Not Working

**Problem**: Social media buttons don't navigate correctly

**Common Issues**:

1. **Invalid Usernames**:
```json
// ❌ Including @ symbol
{"twitter": "@username"}

// ✅ Username only
{"twitter": "username"}
```

2. **Invalid Characters**:
```json
// ❌ Special characters not allowed
{"instagram": "user@name"}

// ✅ Valid characters only
{"instagram": "username"}
```

3. **Platform-Specific Validation**:
```json
{
  "socialMedia": {
    "twitter": "user123",          // 1-15 alphanumeric + underscore
    "instagram": "user.name_123",  // 1-30 alphanumeric + dots + underscores
    "github": "user-name",         // 1-39 alphanumeric + hyphens
    "linkedin": "username",        // 3-100 alphanumeric + hyphens
    "tiktok": "username123",       // 1-24 alphanumeric + dots + underscores
    "twitch": "username",          // 4-25 alphanumeric + underscores
    "youtube": "channelname",      // Channel name or ID
    "discord": "invite-code"       // Server invite code
  }
}
```

### Analytics Issues

#### Google Analytics Not Tracking

**Problem**: GA4 events not appearing in analytics

**Solutions**:

1. **Verify GA4 ID Format**:
```json
// ✅ Correct GA4 format
{"googleAnalyticsId": "G-XXXXXXXXXX"}

// ❌ Old Universal Analytics format
{"googleAnalyticsId": "UA-XXXXXXXXX-X"}
```

2. **Check Implementation**:
```javascript
// Verify gtag is loaded
console.log(typeof window.gtag); // Should be 'function'

// Test tracking manually
window.gtag('event', 'test_click', {
  event_category: 'Test',
  event_label: 'Manual Test'
});
```

3. **Verify Configuration**:
```json
{
  "analytics": {
    "googleAnalyticsId": "G-XXXXXXXXXX",
    "trackClicks": true,        // Enable click tracking
    "trackSocialClicks": true   // Enable social tracking
  }
}
```

#### Facebook Pixel Not Tracking

**Problem**: Facebook Pixel events not recording

**Solutions**:

1. **Verify Pixel ID**:
```json
// 15-16 digit numeric ID
{"facebookPixelId": "1234567890123456"}
```

2. **Check Implementation**:
```javascript
// Verify fbq is loaded
console.log(typeof window.fbq); // Should be 'function'

// Test tracking manually
window.fbq('track', 'PageView');
```

## 🔧 Debugging Tools

### Browser Developer Tools

#### Console Debugging
```javascript
// Check for errors
console.clear();
// Reload page and check for errors

// Verify configuration loading
console.log('Config loaded:', window.__LINKTREE_CONFIG__);

// Test analytics
console.log('GA loaded:', typeof window.gtag);
console.log('FB Pixel loaded:', typeof window.fbq);
```

#### Network Tab
- Check for failed resource loads (images, fonts, scripts)
- Verify analytics scripts are loading
- Check for CORS errors

#### Application Tab
- Verify localStorage/sessionStorage if used
- Check for service worker registration (PWA)

### Command Line Tools

#### Configuration Validation
```bash
# Validate JSON syntax
node -p "JSON.parse(require('fs').readFileSync('src/config.json'))"

# Validate against schema (if ajv-cli installed)
npx ajv validate -s config.schema.json -d src/config.json
```

#### Build Analysis
```bash
# Check build output
npm run build
du -sh dist/*

# Analyze dependencies
npm list --depth=0
npm audit
```

#### Performance Testing
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Test performance
lighthouse http://localhost:4173 --output html
```

### Online Tools

- **JSON Validation**: [JSONLint](https://jsonlint.com/)
- **Color Contrast**: [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- **Image Compression**: [TinyPNG](https://tinypng.com/)
- **Performance Testing**: [PageSpeed Insights](https://pagespeed.web.dev/)
- **Accessibility Testing**: [WAVE](https://wave.webaim.org/)

## 📞 Getting Additional Help

### Self-Service Resources

1. **Documentation**:
   - [Configuration Guide](../CONFIGURATION.md)
   - [Developer Documentation](../DEVELOPER.md)
   - [Deployment Guide](../DEPLOYMENT.md)

2. **Example Configurations**:
   - [Basic Configuration](./examples/basic-configuration.json)
   - [Advanced Configuration](./examples/advanced-configuration.json)
   - [Theme Examples](./examples/theme-examples.json)

3. **Community Resources**:
   - [GitHub Issues](https://github.com/nailthelanding/template-linktree-modern/issues)
   - [GitHub Discussions](https://github.com/nailthelanding/template-linktree-modern/discussions)

### Creating Support Requests

When creating an issue, include:

1. **Environment Information**:
   - Node.js version (`node --version`)
   - npm version (`npm --version`)
   - Operating system
   - Browser and version

2. **Configuration**:
   ```json
   // Relevant parts of your configuration
   // Remove sensitive information (URLs, personal data)
   ```

3. **Error Messages**:
   - Console errors (with full stack traces)
   - Build output errors
   - Network errors from browser dev tools

4. **Steps to Reproduce**:
   - Exact steps that trigger the issue
   - Expected vs actual behavior

5. **Attempts to Fix**:
   - What you've already tried
   - Results of debugging steps

### Escalation Path

1. **Search Documentation** - Check guides and examples
2. **Search Issues** - Look for existing solutions
3. **Create Issue** - Detailed bug report or question
4. **Community Help** - Engage in discussions
5. **Maintainer Review** - Wait for maintainer response

### Emergency Issues

For urgent production issues:
1. **Revert to Working State** - Use last known good configuration
2. **Check Status Pages** - Verify hosting platform status
3. **Create High-Priority Issue** - Mark as urgent with clear impact
4. **Document Workaround** - Share temporary solutions with community

Remember: Most issues have been encountered before. Check existing documentation and issues first for faster resolution! 🚀