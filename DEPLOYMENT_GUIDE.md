# Guardian Guide Deployment Guide

This guide provides step-by-step instructions for deploying Guardian Guide to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [Third-Party Services](#third-party-services)
5. [Build and Deploy](#build-and-deploy)
6. [Post-Deployment](#post-deployment)
7. [Monitoring](#monitoring)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

- [ ] Node.js 18+ installed
- [ ] Git repository access
- [ ] Supabase account
- [ ] Stripe account
- [ ] OpenAI API key
- [ ] Domain name (optional)
- [ ] SSL certificate (for custom domain)

## Environment Setup

### 1. Clone Repository

```bash
git clone https://github.com/vistara-apps/this-is-a-9054.git
cd this-is-a-9054
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Fill in all required environment variables:

```env
# OpenAI Configuration
VITE_OPENAI_API_KEY=sk-your-openai-key

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-key

# Production Settings
VITE_APP_ENVIRONMENT=production
VITE_DEBUG_MODE=false
```

## Database Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### 2. Run Database Schema

1. Open Supabase SQL Editor
2. Copy and paste the contents of `database-schema.sql`
3. Execute the SQL to create all tables and policies

### 3. Create Storage Bucket

1. Go to Storage in Supabase dashboard
2. Create a new bucket named "recordings"
3. Set bucket to private (not public)
4. Configure storage policies (included in schema)

### 4. Configure Authentication

1. Go to Authentication > Settings
2. Enable email/password authentication
3. Configure email templates (optional)
4. Set up redirect URLs for your domain

## Third-Party Services

### 1. OpenAI Setup

1. Create account at [platform.openai.com](https://platform.openai.com)
2. Generate API key
3. Set usage limits to control costs
4. Add key to environment variables

**Cost Management:**
- Set monthly usage limits
- Monitor usage in OpenAI dashboard
- Consider caching responses for common queries

### 2. Stripe Setup

1. Create Stripe account
2. Create products and prices:
   - Free plan (no price needed)
   - Premium plan ($3/month recurring)
3. Get publishable key for your environment
4. Set up webhooks (optional, for subscription management)

**Webhook Endpoints (if using backend):**
- `POST /api/webhooks/stripe` - Handle subscription events

### 3. SMS/Email Services (Optional)

For emergency notifications:

**Twilio (SMS):**
1. Create Twilio account
2. Get Account SID and Auth Token
3. Purchase phone number

**SendGrid (Email):**
1. Create SendGrid account
2. Get API key
3. Verify sender identity

## Build and Deploy

### Option 1: Vercel (Recommended)

1. **Connect Repository:**
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

2. **Configure Environment Variables:**
   - Go to Vercel dashboard
   - Add all environment variables from `.env`
   - Ensure `VITE_APP_ENVIRONMENT=production`

3. **Deploy:**
   ```bash
   vercel --prod
   ```

### Option 2: Netlify

1. **Build Project:**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify:**
   - Connect GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`
   - Add environment variables

### Option 3: Docker

1. **Build Docker Image:**
   ```bash
   docker build -t guardian-guide .
   ```

2. **Run Container:**
   ```bash
   docker run -p 3000:3000 \
     -e VITE_OPENAI_API_KEY=your-key \
     -e VITE_SUPABASE_URL=your-url \
     -e VITE_SUPABASE_ANON_KEY=your-key \
     -e VITE_STRIPE_PUBLISHABLE_KEY=your-key \
     guardian-guide
   ```

### Option 4: Traditional Hosting

1. **Build for Production:**
   ```bash
   npm run build
   ```

2. **Upload `dist` folder to your web server**

3. **Configure Web Server:**
   - Ensure all routes redirect to `index.html` (SPA routing)
   - Enable HTTPS
   - Set proper cache headers

## Post-Deployment

### 1. Verify Deployment

Test all core features:

- [ ] App loads correctly
- [ ] Location detection works
- [ ] Rights guides display
- [ ] Recording functionality
- [ ] Emergency contacts
- [ ] Premium upgrade flow

### 2. Configure Domain (Optional)

If using custom domain:

1. **DNS Configuration:**
   ```
   CNAME www.yourapp.com -> your-deployment-url
   A     yourapp.com     -> deployment-ip
   ```

2. **SSL Certificate:**
   - Most platforms (Vercel, Netlify) provide automatic SSL
   - For custom hosting, use Let's Encrypt or purchase certificate

### 3. Set up Monitoring

**Error Tracking:**
- Integrate Sentry or similar service
- Monitor JavaScript errors
- Track API failures

**Analytics:**
- Google Analytics (optional)
- Supabase Analytics
- Custom usage tracking

### 4. Performance Optimization

**CDN Configuration:**
- Enable CDN for static assets
- Configure cache headers
- Optimize images

**Bundle Optimization:**
```bash
# Analyze bundle size
npm run build -- --analyze
```

## Monitoring

### 1. Application Monitoring

**Key Metrics to Monitor:**
- Page load times
- API response times
- Error rates
- User engagement

**Tools:**
- Vercel Analytics
- Google PageSpeed Insights
- Lighthouse CI

### 2. Database Monitoring

**Supabase Dashboard:**
- Monitor database performance
- Track API usage
- Check storage usage
- Review authentication metrics

### 3. Third-Party Service Monitoring

**OpenAI:**
- Monitor API usage and costs
- Track rate limits
- Review response times

**Stripe:**
- Monitor payment success rates
- Track subscription metrics
- Review webhook delivery

## Troubleshooting

### Common Issues

#### 1. Environment Variables Not Loading

**Symptoms:** Features not working, API calls failing

**Solutions:**
- Verify all environment variables are set
- Check variable names have `VITE_` prefix
- Restart development server after changes
- Verify variables in deployment platform

#### 2. Supabase Connection Issues

**Symptoms:** Database operations failing

**Solutions:**
- Verify Supabase URL and key
- Check Row Level Security policies
- Ensure user is authenticated
- Review Supabase logs

#### 3. OpenAI API Errors

**Symptoms:** Content generation failing

**Solutions:**
- Verify API key is valid
- Check usage limits
- Review rate limiting
- Implement fallback content

#### 4. Stripe Integration Issues

**Symptoms:** Payment flow not working

**Solutions:**
- Verify publishable key
- Check product/price IDs
- Test in Stripe test mode first
- Review webhook configuration

#### 5. Recording Not Working

**Symptoms:** Camera/microphone access denied

**Solutions:**
- Ensure HTTPS is enabled
- Check browser permissions
- Verify MediaRecorder API support
- Test on different devices/browsers

### Debug Mode

Enable debug mode for troubleshooting:

```env
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug
```

This will:
- Enable console logging
- Show detailed error messages
- Display API request/response data

### Performance Issues

**Slow Loading:**
- Check bundle size
- Optimize images
- Enable compression
- Use CDN

**High API Costs:**
- Implement caching
- Reduce API calls
- Optimize prompts
- Set usage limits

## Security Checklist

Before going live:

- [ ] All API keys are secure and not exposed
- [ ] HTTPS is enabled
- [ ] Row Level Security is configured
- [ ] Input validation is implemented
- [ ] Rate limiting is in place
- [ ] Error messages don't expose sensitive data
- [ ] User data is encrypted at rest
- [ ] Regular security updates are planned

## Backup and Recovery

### Database Backups

**Supabase:**
- Automatic daily backups (Pro plan)
- Manual backup via dashboard
- Export data via API

### Code Backups

**Git Repository:**
- Ensure code is pushed to remote
- Tag releases for easy rollback
- Maintain deployment documentation

### Recovery Plan

1. **Database Recovery:**
   - Restore from Supabase backup
   - Re-run migrations if needed
   - Verify data integrity

2. **Application Recovery:**
   - Rollback to previous deployment
   - Check environment variables
   - Verify third-party integrations

## Maintenance

### Regular Tasks

**Weekly:**
- Review error logs
- Check performance metrics
- Monitor API usage and costs

**Monthly:**
- Update dependencies
- Review security patches
- Analyze user feedback

**Quarterly:**
- Security audit
- Performance optimization
- Feature usage analysis

### Updates

**Dependency Updates:**
```bash
npm audit
npm update
```

**Security Updates:**
- Monitor security advisories
- Update vulnerable packages immediately
- Test thoroughly before deploying

## Support

For deployment support:

- **Documentation:** This guide and README.md
- **Issues:** GitHub Issues for bugs
- **Community:** GitHub Discussions for questions

---

**Last Updated:** 2024-01-XX
**Version:** 1.0.0
