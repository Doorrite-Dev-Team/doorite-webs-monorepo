// src/app/api/uploadthing/core.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter: FileRouter = {
  businessLogo: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      return { uploadedBy: "signup-form" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("file url", file.ufsUrl);

      // Modern UploadThing apps serve files from:
      // https://<APP_ID>.ufs.sh/f/<FILE_KEY>

      return {
        uploadedBy: metadata.uploadedBy,
        url: file.ufsUrl,
        key: file.key,
      };
    }),
};

export type OurFileRouter = typeof ourFileRouter;
