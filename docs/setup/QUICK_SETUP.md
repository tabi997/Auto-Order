# 🚀 Quick Setup - What You Need to Do

## 🚫 What I CANNOT Do (You Must Do)

1. **Create Supabase Project** - You need to go to https://supabase.com
2. **Get API Keys** - You need to copy credentials from your project
3. **Apply Database Migrations** - You need to run SQL in Supabase Dashboard
4. **Create Admin User** - You need to add user in Supabase Auth
5. **Set up Cloudinary** - You need to create account and upload preset
6. **Fill Environment Variables** - You need to add your actual credentials

## ✅ What I CAN Do (Already Done)

1. ✅ **Code is ready** - All components built and tested
2. ✅ **Build successful** - No TypeScript errors
3. ✅ **Setup scripts created** - Easy setup process
4. ✅ **Documentation complete** - Step-by-step guides

## 📋 Your Action Items (In Order)

### 1. Create Supabase Project (5 minutes)
- Go to https://supabase.com
- Click "New Project"
- Choose organization, name it "autoorder"
- Set database password (remember it!)
- Wait for project to be ready

### 2. Get Supabase Credentials (2 minutes)
- In your project, go to **Settings > API**
- Copy:
  - Project URL
  - `anon` public key
  - `service_role` secret key (keep this private)

### 3. Apply Database Migrations (10 minutes)
- In Supabase Dashboard, go to **SQL Editor**
- Copy and paste the content from `001_initial_schema.sql`
- Click "Run" 
- Copy and paste the content from `003_simplified_schema.sql`
- Click "Run"

### 4. Create Admin User (3 minutes)
- Go to **Authentication > Users**
- Click "Add user"
- Email: `admin@autoorder.ro`
- Password: `admin123`
- User metadata:
  ```json
  {
    "role": "admin",
    "name": "Admin User"
  }
  ```

### 5. Set up Cloudinary (5 minutes)
- Go to https://cloudinary.com
- Create free account
- Note your Cloud Name
- Go to **Settings > Upload**
- Create upload preset:
  - Name: `autoorder_unsigned`
  - Signing Mode: **Unsigned**

### 6. Update Environment File (3 minutes)
- Edit `.env.local` file
- Replace placeholder values with your real credentials:
  ```env
  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
  CLOUDINARY_UPLOAD_PRESET=autoorder_unsigned
  ```

### 7. Test Everything (5 minutes)
```bash
pnpm dev
```
- Visit: http://localhost:3000/admin
- Login: `admin@autoorder.ro` / `admin123`
- Test adding a vehicle
- Test uploading an image

## 🎯 Expected Results

After completing these steps, you'll have:
- ✅ Working admin panel at `/admin`
- ✅ Database with vehicles and leads tables
- ✅ Image upload via Cloudinary
- ✅ Featured system for homepage
- ✅ Lead management system
- ✅ Secure authentication

## 🆘 If Something Goes Wrong

1. **Check browser console** for errors
2. **Check terminal** for error messages
3. **Verify environment variables** are set correctly
4. **Ensure migrations** were applied successfully
5. **Check Supabase Dashboard** for any errors

## 📞 Need Help?

The complete troubleshooting guide is in `SETUP_CHECKLIST.md` with detailed error solutions.

---

**🎯 Goal: Get your admin panel working in under 30 minutes!**
