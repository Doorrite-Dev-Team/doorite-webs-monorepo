"server-only";

import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function deleteImage(url: string) {
  try {
    // Extract fileKey from URL (https://utfs.io/f/FILE_KEY)
    const fileKey = url.split("/").pop();

    if (!fileKey) {
      throw new Error("Invalid file URL");
    }

    const response = await utapi.deleteFiles(fileKey);

    if (!response.success) {
      throw new Error("Failed to delete from UploadThing");
    }
  } catch (error) {
    console.error("UT Deletion Error:", error);
    throw new Error("Internal Server Error during deletion");
  }
}
