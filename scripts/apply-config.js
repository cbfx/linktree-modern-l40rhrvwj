const fs = require('fs');
const path = require('path');

// Read site.config.json (will be written by API during fork)
const configPath = path.join(__dirname, '../site.config.json');
const publicConfigPath = path.join(__dirname, '../public/config.json');

if (fs.existsSync(configPath)) {
  const siteConfig = fs.readFileSync(configPath, 'utf8');

  // Write to public/config.json for the app to consume
  fs.writeFileSync(publicConfigPath, siteConfig);

  console.log('✓ Applied site configuration');
} else {
  console.log('⚠ No site.config.json found, using defaults');
}
