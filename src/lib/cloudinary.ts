import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

// Helper function to generate signed upload parameters
export function generateUploadSignature(params: {
  timestamp: number;
  folder?: string;
  eager?: string;
}) {
  const { timestamp, folder = 'auto-order/dev', eager } = params;
  
  const signatureParams: any = {
    timestamp,
    folder,
  };

  // Add eager to signature if provided
  if (eager) {
    signatureParams.eager = eager;
  }

  const signature = cloudinary.utils.api_sign_request(
    signatureParams,
    process.env.CLOUDINARY_API_SECRET!
  );

  return {
    timestamp,
    folder,
    signature,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
  };
}
