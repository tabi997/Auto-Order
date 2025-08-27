// Upload configuration - easily switch between local and cloud storage
export const UPLOAD_CONFIG = {
  // Set to 'local' for development, 'cloud' for production
  mode: process.env.NODE_ENV === 'development' ? 'local' : 'cloud',
  
  // Local storage settings
  local: {
    uploadEndpoint: '/api/upload/local',
    maxFileSize: 4 * 1024 * 1024, // 4MB
    maxFileCount: 8,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    uploadsDir: 'public/uploads',
  },
  
  // Cloud storage settings (UploadThing)
  cloud: {
    uploadEndpoint: '/api/uploadthing',
    maxFileSize: 4 * 1024 * 1024, // 4MB
    maxFileCount: 8,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  }
} as const;

export type UploadMode = typeof UPLOAD_CONFIG.mode;

// Helper function to get current upload settings
export function getUploadSettings() {
  return UPLOAD_CONFIG[UPLOAD_CONFIG.mode];
}

// Helper function to check if we're in local mode
export function isLocalUpload() {
  return UPLOAD_CONFIG.mode === 'local';
}

// Helper function to check if we're in cloud mode
export function isCloudUpload() {
  return UPLOAD_CONFIG.mode === 'cloud';
}
