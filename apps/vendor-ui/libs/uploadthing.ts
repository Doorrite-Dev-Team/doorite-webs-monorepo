import {
  generateUploadButton,
  generateUploadDropzone,
  generateReactHelpers,
} from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

// 1. You don't necessarily need to import the exact internal type;
//    often, just adding any explicit annotation or ensuring
//    @uploadthing/shared is in your devDependencies works.

export const UploadButton: ReturnType<
  typeof generateUploadButton<OurFileRouter>
> = generateUploadButton<OurFileRouter>();
export const UploadDropzone: ReturnType<
  typeof generateUploadDropzone<OurFileRouter>
> = generateUploadDropzone<OurFileRouter>();

export const { useUploadThing } = generateReactHelpers<OurFileRouter>();
