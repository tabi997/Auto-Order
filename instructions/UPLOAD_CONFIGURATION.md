# File Upload Configuration

This project supports two file upload modes:

## Development Mode (Local Storage)
- **Default**: Automatically enabled when `NODE_ENV=development`
- **Storage**: Files are saved to `public/uploads/` directory
- **API**: Uses `/api/upload/local` endpoint
- **Benefits**: No external dependencies, instant file access, easy debugging

## Production Mode (Cloud Storage)
- **Default**: Automatically enabled when `NODE_ENV=production`
- **Storage**: Files are uploaded to UploadThing cloud service
- **API**: Uses `/api/uploadthing` endpoint
- **Benefits**: Scalable, CDN delivery, automatic optimization

## Configuration

### Environment Variables

Create a `.env.local` file in your project root:

```bash
# Database
DATABASE_URL="file:./dev.db"

# UploadThing (for production only)
UPLOADTHING_SECRET=your_uploadthing_secret_here
UPLOADTHING_APP_ID=your_uploadthing_app_id_here

# Next.js
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# Environment
NODE_ENV=development
```

### Switching Modes

The upload mode is automatically determined by `NODE_ENV`:

- **Development**: `NODE_ENV=development` → Local storage
- **Production**: `NODE_ENV=production` → Cloud storage

### Manual Override

To manually override the mode, you can modify `src/lib/upload-config.ts`:

```typescript
export const UPLOAD_CONFIG = {
  // Force local mode
  mode: 'local' as const,
  
  // Or force cloud mode
  // mode: 'cloud' as const,
  
  // ... rest of config
};
```

## File Storage Locations

### Local Development
- **Upload Directory**: `public/uploads/`
- **URL Pattern**: `/uploads/filename.jpg`
- **File Naming**: `listing_timestamp_randomId.extension`

### Production (UploadThing)
- **Storage**: UploadThing cloud service
- **URL Pattern**: `https://uploadthing.com/filename.jpg`
- **File Naming**: Managed by UploadThing

## Migration from Development to Production

1. **Set Environment Variables**:
   ```bash
   NODE_ENV=production
   UPLOADTHING_SECRET=your_secret
   UPLOADTHING_APP_ID=your_app_id
   ```

2. **Build and Deploy**:
   ```bash
   pnpm build
   pnpm start
   ```

3. **Verify**: Check that uploads are going to UploadThing instead of local storage

## Security Considerations

### Local Development
- Files are publicly accessible via `/uploads/` URL
- No authentication required for file access
- Suitable only for development/testing

### Production
- Files are served through UploadThing's secure CDN
- Can implement access controls and authentication
- Proper file validation and sanitization

## Troubleshooting

### Local Upload Issues
- Ensure `public/uploads/` directory exists and is writable
- Check file permissions on the uploads directory
- Verify file size limits (4MB) and type restrictions

### Cloud Upload Issues
- Verify UploadThing credentials are correct
- Check network connectivity to UploadThing
- Ensure proper CORS configuration

## Components

- **`LocalImageUploader`**: Handles local file uploads in development
- **`UploadButton`**: Handles cloud uploads via UploadThing
- **`AdminImagesUploader`**: Automatically switches between modes based on environment
- **`upload-config.ts`**: Central configuration for upload behavior
