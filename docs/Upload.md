# Cloudinary Upload Configuration

## Setup Cloudinary (Free Tier)

### 1. Create Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Verify your email address

### 2. Get API Credentials
1. Login to your Cloudinary Dashboard
2. Navigate to **Settings** → **Access Keys**
3. Copy the following values:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### 3. Configure Environment Variables
Add the following variables to your `.env` file:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Test Upload Functionality
1. Start the development server: `pnpm dev`
2. Navigate to `/admin/upload`
3. Upload one or more images
4. Check the console for upload results
5. Verify images are displayed correctly

## Features

### UploadButton Component
- **Multiple file upload**: Select multiple images at once
- **File validation**: Only accepts image files (JPG, PNG, WebP, etc.)
- **Size limit**: Maximum 10MB per file
- **Progress tracking**: Visual feedback during upload
- **Error handling**: Toast notifications for errors
- **Secure upload**: Server-side signed uploads

### API Endpoints
- `POST /api/uploads/sign` - Generate signed upload parameters
- Returns: `{ timestamp, folder, signature, cloudName, apiKey }`

### Security
- **Signed uploads**: All uploads are signed server-side
- **No client secrets**: API secret never exposed to client
- **Folder organization**: Images stored in `auto-order/dev` folder
- **Secure URLs**: Uses HTTPS URLs from Cloudinary

## Usage

### Basic Upload
```tsx
import { UploadButton } from '@/components/UploadButton';

<UploadButton
  onUploaded={(results) => {
    console.log('Uploaded:', results);
    // results: [{ url: string, public_id: string }]
  }}
/>
```

### Custom Configuration
```tsx
<UploadButton
  multiple={false}
  accept="image/jpeg,image/png"
  maxSize={5 * 1024 * 1024} // 5MB
  onUploaded={handleUploaded}
/>
```

## Free Tier Limits
- **Storage**: 25GB
- **Bandwidth**: 25GB/month
- **Transformations**: 25,000/month
- **Uploads**: 25,000/month

## Troubleshooting

### Common Issues
1. **"Failed to get upload signature"**
   - Check if environment variables are set correctly
   - Verify Cloudinary credentials

2. **"Upload failed"**
   - Check file size (max 10MB)
   - Verify file type is image
   - Check Cloudinary account limits

3. **Images not displaying**
   - Verify `next.config.js` has Cloudinary domain configured
   - Check if image URLs are accessible

### Troubleshooting Rapid
- **Signature mismatch**: Verify eager parameter is included in signature generation
- **401 Unauthorized**: Check API key and secret are correctly set in environment

### Debug Mode
Enable debug logging by adding to your `.env`:
```env
DEBUG=cloudinary:*
```

## Migration from UploadThing
If migrating from UploadThing to Cloudinary:
1. Update image URLs in database
2. Update `next.config.js` image domains
3. Test all image displays
4. Remove UploadThing dependencies if no longer needed
