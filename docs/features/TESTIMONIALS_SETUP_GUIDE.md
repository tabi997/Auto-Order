# Testimonials Table Setup Guide

## Overview
This guide will help you set up the testimonials table in your Supabase database. The testimonials system allows you to manage customer reviews and testimonials through the admin panel.

## Prerequisites
- Access to your Supabase Dashboard
- Service role key configured in your environment
- Basic understanding of SQL

## Setup Options

### Option 1: Manual Setup via Supabase Dashboard (Recommended)

#### Step 1: Access Supabase Dashboard
1. Go to [supabase.com](https://supabase.com) and sign in
2. Select your AutoOrder project
3. Navigate to **SQL Editor** in the left sidebar

#### Step 2: Run the Migration SQL
1. Copy the entire content from `supabase/migrations/007_create_testimonials_complete.sql`
2. Paste it into the SQL Editor
3. Click **Run** to execute the migration

#### Step 3: Verify Setup
After running the SQL, you should see:
- ✅ Table created successfully
- ✅ Indexes created
- ✅ RLS enabled
- ✅ Policies created
- ✅ Sample testimonials inserted
- ✅ Permissions granted

### Option 2: Automated Setup (If RPC is available)

If your Supabase instance supports the `exec_sql` RPC function:

```bash
node scripts/create-testimonials-table-sql.js
```

### Option 3: Population Only (After table creation)

If the table already exists and you just want to add data:

```bash
node scripts/populate-testimonials.js
```

## Table Structure

The testimonials table includes the following fields:

| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| `id` | `uuid` | Unique identifier | Primary key, auto-generated |
| `name` | `text` | Customer name | Required |
| `role` | `text` | Customer role/position | Required |
| `company` | `text` | Company name | Optional |
| `rating` | `int` | Rating (1-5 stars) | Required, 1-5 range |
| `content` | `text` | Testimonial text | Required |
| `avatar` | `text` | Profile image URL | Optional |
| `badge` | `text` | Display badge | Required |
| `active` | `boolean` | Whether to show publicly | Default: true |
| `created_at` | `timestamptz` | Creation timestamp | Auto-generated |
| `updated_at` | `timestamptz` | Last update timestamp | Auto-updated |

## Features

### 🔒 Row Level Security (RLS)
- **Public Read Policy**: Only active testimonials are visible to public users
- **Admin Management Policy**: Full CRUD access for authenticated admin users

### 📊 Performance Indexes
- `idx_testimonials_active`: Optimizes queries filtering by active status
- `idx_testimonials_created_at`: Optimizes sorting by creation date
- `idx_testimonials_badge`: Optimizes filtering by badge type

### ⏰ Automatic Timestamps
- `created_at`: Set automatically when record is created
- `updated_at`: Updated automatically on every record modification

### 🎯 Sample Data
The migration includes 4 sample testimonials:
1. **Ion Popescu** - Dealer Auto (AutoMax București)
2. **Maria Ionescu** - Manager Flotă (Transport Express)
3. **Alexandru Dumitrescu** - Proprietar (Firma Individuală)
4. **Elena Vasilescu** - Director Comercial (Auto Solutions)

## Badge Options

The system supports various badge types:
- `Dealer verificat` - Verified dealer
- `Client fidel` - Loyal customer
- `Prima achiziție` - First-time buyer
- `Partener de afaceri` - Business partner
- `Client VIP` - VIP customer
- `Dealer premium` - Premium dealer

## Usage

### Frontend Display
Testimonials are automatically displayed on your website using the `getTestimonials()` action:

```typescript
import { getTestimonials } from '@/app/actions/testimonials'

// Get all active testimonials
const testimonials = await getTestimonials({ active: true })

// Get limited testimonials
const testimonials = await getTestimonials({ 
  active: true, 
  limit: 6 
})
```

### Admin Management
Use the admin panel at `/admin/settings/testimonials` to:
- View all testimonials
- Create new testimonials
- Edit existing testimonials
- Toggle testimonial visibility
- Delete testimonials

### API Actions
The following actions are available:

```typescript
// Get testimonials with optional filtering
getTestimonials(filters?: TestimonialFilters)

// Create new testimonial (admin only)
createTestimonial(data: TestimonialData)

// Update existing testimonial (admin only)
updateTestimonial(id: string, updates: Partial<Testimonial>)

// Delete testimonial (admin only)
deleteTestimonial(id: string)
```

## Troubleshooting

### Common Issues

#### 1. Table Already Exists
If you get an error about the table already existing:
```sql
-- Check if table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'testimonials'
);
```

#### 2. Permission Denied
If you get permission errors:
```sql
-- Grant permissions manually
GRANT ALL ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
GRANT SELECT ON public.testimonials TO anon;
```

#### 3. RLS Policy Issues
If RLS policies aren't working:
```sql
-- Check RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'testimonials';

-- Recreate policies
DROP POLICY IF EXISTS "public can read active testimonials" ON public.testimonials;
CREATE POLICY "public can read active testimonials" ON public.testimonials
  FOR SELECT USING (active = true);
```

### Verification Queries

#### Check Table Structure
```sql
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'testimonials'
ORDER BY ordinal_position;
```

#### Check RLS Policies
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'testimonials';
```

#### Check Sample Data
```sql
SELECT name, role, company, rating, badge, active
FROM public.testimonials
ORDER BY created_at DESC;
```

## Next Steps

After setting up the testimonials table:

1. **Test the Admin Panel**
   - Navigate to `/admin/settings/testimonials`
   - Verify you can view, create, edit, and delete testimonials

2. **Test Frontend Display**
   - Check if testimonials appear on your website
   - Verify the styling and layout

3. **Customize Badges**
   - Add new badge types as needed
   - Update existing testimonials with appropriate badges

4. **Add More Testimonials**
   - Use the admin panel to add real customer testimonials
   - Ensure proper formatting and content quality

5. **Monitor Performance**
   - Check query performance for large testimonial collections
   - Add additional indexes if needed

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify your Supabase permissions and settings
3. Check the browser console for JavaScript errors
4. Review the Supabase logs for database errors

## Files Created

- `supabase/migrations/007_create_testimonials_complete.sql` - Complete migration SQL
- `scripts/create-testimonials-table-sql.js` - Automated table creation script
- `scripts/populate-testimonials.js` - Data population script
- `src/app/actions/testimonials.ts` - Testimonials actions
- `src/components/admin/TestimonialsManager.tsx` - Admin management component

The testimonials system is now fully integrated with your application and ready to use!
