# AskMaster Deployment Guide

## Overview

This guide covers various deployment options for the AskMaster application. The application is built with SvelteKit and uses `adapter-auto`, making it compatible with multiple hosting platforms.

## Prerequisites

- Node.js 18 or higher
- npm package manager
- Google Gemini API key
- (Optional) Custom OpenAI-compatible API credentials

## Local Development Deployment

### Development Environment Setup

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd askmaster
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` file:

   ```env
   # Required for Gemini provider
   GEMINI_API_KEY=your_gemini_api_key_here

   # Optional - for custom OpenAI-compatible endpoint
   CUSTOM_API_KEY=your_custom_api_key
   CUSTOM_MODEL=your_custom_model
   CUSTOM_BASE_URL=https://your-custom-api-endpoint.com
   ```

4. **Start Development Server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5174`

### Building for Production Locally

1. **Create Production Build**

   ```bash
   npm run build
   ```

2. **Preview Production Build**

   ```bash
   npm run preview
   ```

   The preview server will start on `http://localhost:4173`

## Platform-Specific Deployment

### Vercel Deployment

Vercel provides zero-config deployment for SvelteKit applications.

#### Automatic Deployment (Recommended)

1. **Connect Repository**
   - Push your code to GitHub, GitLab, or Bitbucket
   - Connect your repository to Vercel

2. **Configure Environment Variables**
   - Go to your project settings in Vercel
   - Add the following environment variables:
     ```
     GEMINI_API_KEY=your_gemini_api_key_here
     ```

3. **Deploy**
   - Vercel will automatically deploy on every push to the main branch

#### Manual Deployment

1. **Install Vercel CLI**

   ```bash
   npm i -g vercel
   ```

2. **Deploy**

   ```bash
   vercel
   ```

3. **Configure Environment Variables**
   ```bash
   vercel env add GEMINI_API_KEY
   ```

#### Vercel Configuration

Create `vercel.json` for custom configuration:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/"
    }
  ]
}
```

### Netlify Deployment

Netlify supports SvelteKit with adapter-auto.

#### Automatic Deployment

1. **Connect Repository**
   - Push your code to a Git repository
   - Connect to Netlify from the dashboard

2. **Build Settings**
   - **Build command**: `npm run build`
   - **Publish directory**: `build`

3. **Environment Variables**
   - Go to Site settings > Environment variables
   - Add:
     ```
     GEMINI_API_KEY=your_gemini_api_key_here
     ```

#### Manual Deployment

1. **Build Locally**

   ```bash
   npm run build
   ```

2. **Deploy to Netlify**

   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli

   # Deploy
   netlify deploy --dir=build --prod
   ```

#### Netlify Configuration

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Node.js Server Deployment

For traditional hosting platforms that support Node.js.

#### Build Process

1. **Create Production Build**

   ```bash
   npm run build
   ```

2. **Install Production Dependencies**
   ```bash
   npm ci --production
   ```

#### Environment Setup

1. **Set Environment Variables**

   ```bash
   export GEMINI_API_KEY=your_gemini_api_key_here
   # Or set in your hosting platform's environment settings
   ```

2. **Start Production Server**
   ```bash
   node build/index.js
   ```

#### PM2 Process Manager (Recommended)

1. **Install PM2**

   ```bash
   npm install -g pm2
   ```

2. **Create Ecosystem File** (`ecosystem.config.js`)

   ```javascript
   module.exports = {
     apps: [
       {
         name: "askmaster",
         script: "build/index.js",
         instances: "max",
         exec_mode: "cluster",
         env: {
           NODE_ENV: "production",
           PORT: 3000,
         },
       },
     ],
   };
   ```

3. **Start with PM2**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

### Docker Deployment

Create a Dockerfile for containerized deployment.

#### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["node", "build/index.js"]
```

#### Docker Commands

1. **Build Image**

   ```bash
   docker build -t askmaster .
   ```

2. **Run Container**
   ```bash
   docker run -d \
     -p 3000:3000 \
     -e GEMINI_API_KEY=your_gemini_api_key_here \
     --name askmaster \
     askmaster
   ```

#### Docker Compose

Create `docker-compose.yml`:

```yaml
version: "3.8"
services:
  askmaster:
    build: .
    ports:
      - "3000:3000"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - CUSTOM_API_KEY=${CUSTOM_API_KEY}
      - CUSTOM_MODEL=${CUSTOM_MODEL}
      - CUSTOM_BASE_URL=${CUSTOM_BASE_URL}
    restart: unless-stopped
```

## Environment Configuration

### Required Environment Variables

| Variable          | Description           | Required For    |
| ----------------- | --------------------- | --------------- |
| `GEMINI_API_KEY`  | Google Gemini API key | Google provider |
| `CUSTOM_API_KEY`  | Custom API key        | Custom provider |
| `CUSTOM_MODEL`    | Custom model name     | Custom provider |
| `CUSTOM_BASE_URL` | Custom API base URL   | Custom provider |

### Production Environment Variables

Set these in your hosting platform:

```env
# Required
GEMINI_API_KEY=your_production_api_key_here

# Optional - for custom provider
CUSTOM_API_KEY=your_custom_api_key
CUSTOM_MODEL=your_custom_model
CUSTOM_BASE_URL=https://your-custom-api-endpoint.com

# Node.js specific
NODE_ENV=production
PORT=3000
```

## Build Configuration

### SvelteKit Configuration ([`svelte.config.js`](svelte.config.js:1))

The project uses `@sveltejs/adapter-auto` which automatically chooses the appropriate adapter based on the deployment environment.

### Vite Configuration ([`vite.config.ts`](vite.config.ts:1))

Development server configuration:

```typescript
export default defineConfig({
  plugins: [sveltekit()],
  server: {
    host: "127.0.0.1",
    port: 5174,
  },
});
```

## Platform-Specific Considerations

### Vercel

- **Automatic HTTPS**: Enabled by default
- **Edge Functions**: Supported via adapter-auto
- **Environment Variables**: Set in project settings
- **Custom Domains**: Supported

### Netlify

- **Form Handling**: Not used in this application
- **Redirects**: Configured in `netlify.toml`
- **Environment Variables**: Set in site settings

### Traditional Hosting

- **Port Binding**: Application binds to `process.env.PORT` or `3000`
- **Process Management**: Use PM2 or similar
- **Reverse Proxy**: Configure nginx/Apache if needed

## Security Considerations

### API Key Security

- Never commit API keys to version control
- Use environment variables for all sensitive data
- Consider using secret management services for production

### HTTPS Enforcement

Ensure your hosting platform enforces HTTPS:

- Vercel: Automatic
- Netlify: Automatic
- Custom hosting: Configure SSL certificates

### CORS Configuration

The application doesn't require special CORS configuration as it's a self-contained web application.

## Performance Optimization

### Build Optimization

1. **Minimize Bundle Size**

   ```bash
   npm run build
   ```

2. **Enable Compression**
   - Most platforms handle compression automatically
   - For custom hosting, configure gzip/brotli

### Caching Strategy

Configure appropriate cache headers:

- Static assets: Long cache duration
- API responses: Short cache duration or no-cache

### CDN Integration

- Vercel: Built-in global CDN
- Netlify: Built-in global CDN
- Custom hosting: Configure CloudFront or similar

## Monitoring and Logging

### Application Logs

- **Vercel**: View logs in deployment dashboard
- **Netlify**: Access logs in site settings
- **Custom hosting**: Configure logging middleware

### Error Tracking

Consider integrating error tracking services:

- Sentry
- LogRocket
- Application-specific monitoring

## Database Considerations

AskMaster is a stateless application and doesn't require a database. All state is managed client-side.

## Scaling Considerations

### Horizontal Scaling

- Stateless architecture enables easy horizontal scaling
- Use load balancer for multiple instances
- Consider serverless deployment for automatic scaling

### Rate Limiting

Implement rate limiting if needed:

- API gateway level
- Application middleware
- Cloud provider services

## Troubleshooting Deployment Issues

### Common Issues

1. **Build Failures**

   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

2. **Environment Variables Not Loading**
   - Verify variable names match exactly
   - Check hosting platform's environment settings
   - Restart application after adding variables

3. **API Errors**
   - Verify API key is valid and has sufficient quota
   - Check network connectivity to AI providers
   - Review application logs for detailed errors

4. **Port Binding Issues**
   ```bash
   # Check if port is in use
   lsof -i :3000
   # Use different port
   PORT=8080 npm run preview
   ```

### Debug Mode

For debugging deployment issues:

1. **Enable Verbose Logging**

   ```bash
   NODE_ENV=development npm run build
   ```

2. **Check Build Output**

   ```bash
   npm run build -- --verbose
   ```

3. **Verify Environment Variables**
   ```bash
   # Print environment (be careful with sensitive data)
   echo $GEMINI_API_KEY
   ```

## Maintenance

### Regular Updates

- Keep dependencies updated
- Monitor for security vulnerabilities
- Update API keys as needed

### Backup Strategy

- Version control for code
- Environment variables in secure storage
- Regular backups of any configuration files

## Support

For deployment assistance:

1. Check platform-specific documentation
2. Review build logs for errors
3. Verify environment configuration
4. Test locally before deploying
