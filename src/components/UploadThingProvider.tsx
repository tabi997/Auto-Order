'use client';

import { generateReactHelpers, generateUploadButton } from '@uploadthing/react';
import type { OurFileRouter } from '@/app/api/uploadthing/core';

export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();
export const UploadButton = generateUploadButton<OurFileRouter>();

export function UploadThingProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
