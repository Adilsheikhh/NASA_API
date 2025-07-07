# 🚀 NASA Image Explorer - Deployment Guide

## Quick Deployment Options

| Platform | Difficulty | Deploy Time | Cost |
|----------|------------|-------------|------|
| [Vercel](#vercel-deployment) | ⭐ Easy | 2 minutes | Free tier available |
| [Netlify](#netlify-deployment) | ⭐⭐ Easy | 3 minutes | Free tier available |
| [Docker](#docker-deployment) | ⭐⭐⭐ Medium | 5 minutes | Varies |
| [AWS](#aws-deployment) | ⭐⭐⭐⭐ Advanced | 15 minutes | Pay-as-you-go |

## Vercel Deployment (Recommended)

### Why Vercel?
- Built for Next.js applications
- Automatic deployments from Git
- Global CDN
- Serverless functions
- Free tier with generous limits

### Step-by-Step Guide

#### 1. Prepare Your Repository
```bash
# Ensure your code is pushed to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### 2. Deploy to Vercel

**Option A: Vercel CLI (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (follow prompts)
vercel

# Set up environment variables
vercel env add NASA_API_KEY
vercel env add GEMINI_API_KEY

# Deploy to production
vercel --prod
```

**Option B: Vercel Dashboard**
1. Visit [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure build settings (auto-detected)
5. Add environment variables:
   - `NASA_API_KEY`: Your NASA API key
   - `GEMINI_API_KEY`: Your Google Gemini API key
6. Click "Deploy"

#### 3. Configure Custom Domain (Optional)
```bash
# Add custom domain
vercel domains add your-domain.com

# Configure DNS (follow Vercel instructions)
```

#### 4. Environment Variables
In Vercel dashboard:
1. Go to Project Settings
2. Environment Variables tab
3. Add:
   ```
   NASA_API_KEY = your_actual_nasa_key
   GEMINI_API_KEY = your_actual_gemini_key
   NEXT_PUBLIC_APP_NAME = NASA Image Explorer
   ```

### Vercel Configuration File
Create `vercel.json` for advanced configuration:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "src/app/api/**": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "s-maxage=3600, stale-while-revalidate"
        }
      ]
    }
  ]
}
```

## Netlify Deployment

### Step-by-Step Guide

#### 1. Build Configuration
Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

[functions]
  directory = ".netlify/functions"
```

#### 2. Deploy via Git
1. Push code to GitHub
2. Connect repository to Netlify
3. Configure build settings
4. Add environment variables
5. Deploy

#### 3. Environment Variables
In Netlify dashboard:
- Site Settings → Environment Variables
- Add the same variables as Vercel

## Docker Deployment

### Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose
Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NASA_API_KEY=${NASA_API_KEY}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - NEXT_PUBLIC_APP_NAME=NASA Image Explorer
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl
    depends_on:
      - app
    restart: unless-stopped
```

### Build and Deploy
```bash
# Build image
docker build -t nasa-explorer .

# Run container
docker run -d \
  --name nasa-explorer \
  -p 3000:3000 \
  --env-file .env.local \
  nasa-explorer

# Or use docker-compose
docker-compose up -d
```

## AWS Deployment

### AWS Amplify
1. Connect GitHub repository
2. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```
3. Add environment variables
4. Deploy

### AWS ECS (Container)
1. Build and push Docker image to ECR
2. Create ECS task definition
3. Create ECS service
4. Configure load balancer
5. Set up CloudFront distribution

### AWS Lambda (Serverless)
Use the Serverless Next.js component:

```bash
npm install -g serverless
serverless create --template aws-nodejs --path nasa-explorer-serverless
cd nasa-explorer-serverless
npm install serverless-nextjs-plugin
```

## Environment Variables Setup

### Required Variables
```env
# NASA API (Required)
NASA_API_KEY=your_nasa_api_key_here

# Google Gemini AI (Required)
GEMINI_API_KEY=your_gemini_api_key_here

# App Configuration (Optional)
NEXT_PUBLIC_APP_NAME=NASA Image Explorer
```

### Platform-Specific Setup

#### Vercel
```bash
vercel env add NASA_API_KEY production
vercel env add GEMINI_API_KEY production
```

#### Netlify
1. Site Settings → Environment Variables
2. Add each variable with appropriate scope

#### Docker
```bash
# Using .env file
docker run --env-file .env.local nasa-explorer

# Using individual variables
docker run -e NASA_API_KEY=value -e GEMINI_API_KEY=value nasa-explorer
```

## Custom Domain Setup

### DNS Configuration
1. **A Record**: Point to your hosting IP
2. **CNAME**: Point subdomain to hosting URL
3. **SSL**: Enable HTTPS (usually automatic)

### Vercel Custom Domain
```bash
# Add domain
vercel domains add your-domain.com

# Configure DNS (follow instructions)
```

### Cloudflare Setup (Recommended)
1. Add your domain to Cloudflare
2. Update nameservers
3. Enable proxy (orange cloud)
4. Configure SSL/TLS settings

## Performance Optimization

### Build Optimization
```json
// next.config.ts
{
  "compress": true,
  "poweredByHeader": false,
  "generateEtags": false,
  "httpAgentOptions": {
    "keepAlive": true
  }
}
```

### CDN Configuration
```javascript
// For static assets
module.exports = {
  assetPrefix: process.env.NODE_ENV === 'production' 
    ? 'https://cdn.yourdomain.com' 
    : '',
}
```

### Caching Headers
```javascript
// In API routes
export async function GET() {
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'CDN-Cache-Control': 'public, s-maxage=86400',
      'Vercel-CDN-Cache-Control': 'public, s-maxage=86400'
    }
  });
}
```

## Monitoring and Analytics

### Error Tracking
```bash
# Install Sentry
npm install @sentry/nextjs

# Configure in next.config.js
const { withSentryConfig } = require('@sentry/nextjs');
```

### Performance Monitoring
```javascript
// Google Analytics
export function gtag(...args) {
  window.gtag?.(...args);
}

// Vercel Analytics
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
```

## Security Best Practices

### Environment Variables
- Never commit API keys to version control
- Use platform-specific secret management
- Rotate keys regularly
- Use least-privilege access

### HTTPS Configuration
```javascript
// Enforce HTTPS
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          }
        ]
      }
    ];
  }
};
```

### Content Security Policy
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; img-src 'self' https://apod.nasa.gov; script-src 'self' 'unsafe-eval'"
          }
        ]
      }
    ];
  }
};
```

## Troubleshooting Deployment Issues

### Common Build Errors

#### TypeScript Errors
```bash
# Check types before deployment
npm run type-check

# Fix common issues
npm run lint:fix
```

#### Environment Variable Issues
```bash
# Verify variables are set
vercel env ls

# Test locally with production env
vercel dev
```

#### Memory/Timeout Issues
```json
// vercel.json
{
  "functions": {
    "src/app/api/**": {
      "maxDuration": 30,
      "memory": 1024
    }
  }
}
```

### Platform-Specific Issues

#### Vercel
- Check function logs in dashboard
- Verify environment variables
- Check build logs for errors

#### Netlify
- Review build logs
- Check function configuration
- Verify redirects

#### Docker
```bash
# Debug container
docker logs nasa-explorer
docker exec -it nasa-explorer sh

# Check health
docker inspect nasa-explorer
```

## Rollback Strategies

### Vercel
```bash
# List deployments
vercel ls

# Promote previous deployment
vercel promote [deployment-url]
```

### Git-based Rollback
```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard [commit-hash]
git push --force origin main
```

---

## Support and Resources

### Getting Help
- 📖 [Vercel Documentation](https://vercel.com/docs)
- 📖 [Netlify Documentation](https://docs.netlify.com)
- 📖 [Docker Documentation](https://docs.docker.com)
- 🆘 [GitHub Issues](https://github.com/your-repo/issues)

### Monitoring Resources
- [Vercel Analytics](https://vercel.com/analytics)
- [Google Analytics](https://analytics.google.com)
- [Sentry Error Tracking](https://sentry.io)
- [Uptime Robot](https://uptimerobot.com)

---

<div align="center">
  <strong>Happy Deploying! 🚀</strong>
</div>
