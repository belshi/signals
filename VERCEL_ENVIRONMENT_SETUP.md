# Vercel Environment Variables Setup

This document explains how to configure the required environment variables for your Vercel deployment.

## Required Environment Variables

### Supabase Configuration
```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Talkwalker Configuration
```bash
VITE_TALKWALKER_BASE_URL=https://api.talkwalker.com
VITE_TALKWALKER_ACCESS_TOKEN=your_talkwalker_access_token
VITE_TALKWALKER_ORIGIN=your_talkwalker_origin
VITE_TALKWALKER_WORKSPACE_ID=your_workspace_id
VITE_TALKWALKER_ACCOUNT_ID=your_account_id
VITE_TALKWALKER_USER_EMAIL=your_user_email
```

## How to Set Environment Variables in Vercel

### Method 1: Vercel Dashboard
1. Go to your project in the [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Go to **Settings** → **Environment Variables**
4. Add each environment variable:
   - **Name**: The variable name (e.g., `VITE_SUPABASE_URL`)
   - **Value**: The variable value
   - **Environment**: Select `Production`, `Preview`, and `Development` as needed
5. Click **Save**

### Method 2: Vercel CLI
```bash
# Install Vercel CLI if you haven't already
npm i -g vercel

# Login to Vercel
vercel login

# Set environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add VITE_TALKWALKER_BASE_URL
vercel env add VITE_TALKWALKER_ACCESS_TOKEN
vercel env add VITE_TALKWALKER_ORIGIN
vercel env add VITE_TALKWALKER_WORKSPACE_ID
vercel env add VITE_TALKWALKER_ACCOUNT_ID
vercel env add VITE_TALKWALKER_USER_EMAIL

# Deploy with new environment variables
vercel --prod
```

## Getting Talkwalker Credentials

If you don't have Talkwalker credentials yet:

1. **Contact Talkwalker Support** to get API access
2. **Request the following information**:
   - Access token
   - Origin identifier
   - Workspace ID
   - Account ID
   - User email associated with the account

## Troubleshooting

### CORS Issues
- The application now uses a server-side proxy (`/api/talkwalker-proxy`) to avoid CORS issues
- This proxy runs on Vercel's serverless functions

### 403 Forbidden Errors
- Check that your Talkwalker access token is valid and not expired
- Verify that your account has the necessary permissions
- Ensure all required environment variables are set correctly

### Missing Environment Variables
- The application will show warnings in the console for missing variables
- Check the browser console for specific missing variable names
- Ensure variables are set for the correct environment (Production/Preview/Development)

## Testing

After setting up environment variables:

1. **Redeploy your application**:
   ```bash
   vercel --prod
   ```

2. **Check the browser console** for any remaining warnings

3. **Test the Add Signal modal** to see if copilots load correctly

## Security Notes

- Never commit environment variables to your repository
- Use Vercel's environment variable system for secure storage
- Consider using different credentials for development vs production
- Regularly rotate access tokens for security
