import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export function getCloudinaryUploadSignature(params: {
  public_id?: string
  folder?: string
  transformation?: string
}) {
  const timestamp = Math.round(new Date().getTime() / 1000)
  
  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp,
      ...params,
    },
    process.env.CLOUDINARY_API_SECRET!
  )
  
  return {
    signature,
    timestamp,
    api_key: process.env.CLOUDINARY_API_KEY,
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  }
}

export function getUnsignedUploadUrl() {
  return `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`
}

export function getUploadPreset() {
  return process.env.CLOUDINARY_UPLOAD_PRESET || 'autoorder_unsigned'
}
