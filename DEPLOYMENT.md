# Deployment Guide

This guide covers various deployment options for the Czech National Bank Currency Converter application.

## Table of Contents

1. [Static Hosting](#static-hosting)
2. [Docker Deployment](#docker-deployment)
3. [Vercel Deployment](#vercel-deployment)
4. [Netlify Deployment](#netlify-deployment)
5. [GitHub Pages Deployment](#github-pages-deployment)
6. [Traditional Server Deployment](#traditional-server-deployment)
7. [Environment Configuration](#environment-configuration)
8. [Monitoring and Maintenance](#monitoring-and-maintenance)

## Static Hosting

The application builds to static files that can be deployed to any static hosting service.

### Build the Application

```bash
npm run build
```

This creates a `dist/` directory with all static files.

### Upload to Static Host

Upload the contents of the `dist/` directory to your static hosting service.

## Docker Deployment

### Development

```bash
# Start development environment
docker-compose up dev

# Run tests
docker-compose up test
```

### Production

```bash
# Build and run production container
docker-compose up --build prod
```

### Manual Docker Build

```bash
# Build production image
docker build -t czech-currency-converter .

# Run production container
docker run -p 80:80 czech-currency-converter
```

## Vercel Deployment

### Automatic Deployment

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect it's a React app and deploy
3. Configure environment variables in Vercel dashboard

### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Environment Variables in Vercel

Add these environment variables in your Vercel project settings:
- `VITE_CNB_API_URL`: CNB API endpoint
- `VITE_CACHE_DURATION`: Cache duration in milliseconds
- `VITE_ENABLE_ANALYTICS`: Enable/disable analytics
- `VITE_ENABLE_ERROR_TRACKING`: Enable/disable error tracking

## Netlify Deployment

### Automatic Deployment

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables

### Manual Deployment

```bash
# Install Netlify CLI
npm install netlify-cli -g

# Deploy
netlify deploy --prod --dir=dist
```

### Netlify Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.css"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

## GitHub Pages Deployment

### Using GitHub Actions

1. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        if: github.ref == 'refs/heads/main'
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

2. Configure GitHub Pages in repository settings

## Traditional Server Deployment

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/currency-converter;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Cache HTML files
    location ~* \.html$ {
        expires 1h;
        add_header Cache-Control "public";
    }

    # Handle SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Remove server info
    server_tokens off;
}
```

### Apache Configuration

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/currency-converter

    # Enable compression
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/plain
        AddOutputFilterByType DEFLATE text/html
        AddOutputFilterByType DEFLATE text/xml
        AddOutputFilterByType DEFLATE text/css
        AddOutputFilterByType DEFLATE application/xml
        AddOutputFilterByType DEFLATE application/xhtml+xml
        AddOutputFilterByType DEFLATE application/rss+xml
        AddOutputFilterByType DEFLATE application/javascript
        AddOutputFilterByType DEFLATE application/x-javascript
    </IfModule>

    # Cache static assets
    <FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
        Header set Cache-Control "public, max-age=31536000, immutable"
    </FilesMatch>

    # Cache HTML files
    <FilesMatch "\.html$">
        Header set Cache-Control "public, max-age=3600"
    </FilesMatch>

    # Handle SPA routing
    <IfModule mod_rewrite.c>
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </IfModule>

    # Security headers
    <IfModule mod_headers.c>
        Header always set X-Frame-Options "SAMEORIGIN"
        Header always set X-Content-Type-Options "nosniff"
        Header always set X-XSS-Protection "1; mode=block"
        Header always set Referrer-Policy "strict-origin-when-cross-origin"
    </IfModule>
</VirtualHost>
```

## Environment Configuration

### Production Environment Variables

```bash
# API Configuration
VITE_CNB_API_URL=https://api.cnb.cz/cnbapi/exrates/daily
VITE_CACHE_DURATION=600000

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_TRACKING=true

# Logging
VITE_LOG_LEVEL=warn
```

### Security Considerations

1. **API Rate Limiting**: The CNB API has rate limits. Monitor usage and implement client-side caching.
2. **CORS**: The application makes cross-origin requests to the CNB API.
3. **Environment Variables**: Never expose sensitive data in client-side environment variables.
4. **HTTPS**: Always use HTTPS in production.

## Monitoring and Maintenance

### Performance Monitoring

Consider adding:
- Google Analytics or similar for user analytics
- Error tracking (Sentry, Bugsnag)
- Performance monitoring (Web Vitals)

### Cache Management

- Monitor cache hit rates
- Adjust cache duration based on API usage patterns
- Implement cache invalidation strategies

### API Monitoring

- Monitor CNB API availability
- Implement fallback mechanisms for API failures
- Log API errors and response times

### SSL/TLS Configuration

For production deployments, ensure:
- Valid SSL certificate
- HTTPS redirection
- Security headers properly configured
- Regular certificate renewal

## Health Checks

Implement health checks to monitor application availability:

```javascript
// Add to your application
export const healthCheck = async () => {
  try {
    const response = await fetch('/index.html');
    return response.ok;
  } catch (error) {
    return false;
  }
};
```

## Backup and Recovery

- Regular backups of configuration files
- Version control for all source code
- Disaster recovery plan for hosting provider outages

## Support

For deployment issues:
- Check hosting provider documentation
- Review build logs for errors
- Test in local environment first
- Check environment variable configuration