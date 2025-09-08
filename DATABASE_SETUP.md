# Database Setup Guide

This guide will help you set up your Supabase PostgreSQL database for both local development and Vercel deployment.

## Prerequisites

- A Supabase account and project
- Node.js and npm installed
- Git configured

## Step 1: Set up Supabase Database

1. **Create a new Supabase project** (if you haven't already):
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note down your project URL and anon key

2. **Run the database schema**:
   - Open your Supabase project dashboard
   - Go to the SQL Editor
   - Copy and paste the contents of `supabase-schema.sql`
   - Execute the SQL to create the tables and sample data

## Step 2: Local Development Setup

1. **Create environment file**:
   ```bash
   cp .env.example .env.local
   ```

2. **Add your Supabase credentials to `.env.local`**:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

## Step 3: Vercel Deployment Setup

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "feat: integrate Supabase database"
   git push origin main
   ```

2. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - During deployment setup, add these environment variables:
     - `VITE_SUPABASE_URL`: Your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

3. **Alternative: Using Vercel CLI**:
   ```bash
   npm install -g vercel
   vercel
   # Follow the prompts and add environment variables when asked
   ```

## Step 4: Environment Variables

### Local Development (.env.local)
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Vercel Production
Add these in your Vercel project settings:
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

## Database Schema

The application uses two main tables:

### Brands Table
- `id`: UUID primary key
- `name`: Brand name
- `description`: Brand description
- `website`: Brand website URL
- `industry`: Industry category
- `logo`: Logo image URL
- `employee_count`: Number of employees
- `revenue`: Annual revenue
- `social_media`: JSON object with social media handles
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

### Signals Table
- `id`: UUID primary key
- `name`: Signal name
- `prompt`: AI prompt for the signal
- `type`: Signal type (Analytics, Social, Competitive, etc.)
- `status`: Signal status (active, inactive, pending)
- `tags`: Array of tags
- `brand_id`: Foreign key to brands table
- `triggered_at`: When the signal was triggered
- `ai_insights`: JSON object with AI insights
- `ai_recommendations`: Array of AI recommendations
- `csv_data`: CSV formatted data
- `metadata`: Additional metadata as JSON
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

## Security

The database uses Row Level Security (RLS) with policies that allow authenticated users to perform all operations. You may want to customize these policies based on your specific security requirements.

## Troubleshooting

### Common Issues

1. **Environment variables not loading**:
   - Make sure your `.env.local` file is in the project root
   - Restart your development server after adding environment variables
   - Check that variable names start with `VITE_`

2. **Database connection errors**:
   - Verify your Supabase URL and anon key are correct
   - Check that your Supabase project is active
   - Ensure the database schema has been applied

3. **CORS issues**:
   - Supabase handles CORS automatically for web applications
   - If you encounter CORS issues, check your Supabase project settings

4. **Build errors on Vercel**:
   - Ensure all environment variables are set in Vercel
   - Check that your build command is correct
   - Verify that all dependencies are in `package.json`

### Getting Help

- Check the [Supabase documentation](https://supabase.com/docs)
- Review the [Vercel documentation](https://vercel.com/docs)
- Check the application logs in your browser's developer console

## Next Steps

After setting up the database:

1. Test the application locally to ensure everything works
2. Deploy to Vercel and verify the production environment
3. Consider setting up database backups and monitoring
4. Review and customize the security policies as needed
