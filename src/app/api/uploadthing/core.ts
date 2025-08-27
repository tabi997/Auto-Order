import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const uploadRouter = {
  listingImages: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 8,
    },
  })
    .middleware(async () => {
      return {};
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete:", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof uploadRouter;
