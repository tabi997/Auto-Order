# Environment Setup Guide

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# UploadThing Configuration (optional)
UPLOADTHING_SECRET=your_uploadthing_secret_here
NEXT_PUBLIC_UPLOADTHING_URL=your_uploadthing_url_here
NEXT_PUBLIC_UPLOADTHING_API_KEY=your_uploadthing_api_key_here

# Cloudinary Configuration (optional)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_UPLOAD_PRESET=autoorder_unsigned

# Email Configuration (optional)
RESEND_API_KEY=your_resend_api_key_here

# Telegram Configuration (optional)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_CHAT_ID=your_telegram_chat_id_here
```

## Supabase Setup

1. Create a new Supabase project at https://supabase.com
2. Get your project URL and anon key from the project settings
3. Run the migrations in the `supabase/migrations/` folder:
   - `001_initial_schema.sql` - Creates vehicles and leads tables
   - `002_admin_schema.sql` - Creates admin tables (users, sessions, listings, images, audit_log)

## Default Admin User

The migration creates a default admin user:
- Email: `admin@autoorder.ro`
- Password: `admin123`

## Database Schema

The application now uses the following Supabase tables:
- `vehicles` - Public vehicle listings
- `leads` - Customer leads
- `users` - Admin users
- `sessions` - Admin authentication sessions
- `listings` - Admin-managed listings
- `images` - Images for listings
- `audit_log` - Admin action logs

## Running the Application

1. Set up your environment variables
2. Run the Supabase migrations
3. Start the development server:
   ```bash
   pnpm dev
   ```

The application will now use Supabase for all database operations instead of Prisma.
