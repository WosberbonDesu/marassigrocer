import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string = "marassi"
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "image",
          transformation: [{ quality: "auto", fetch_format: "auto" }],
        },
        (error, result) => {
          if (error || !result) return reject(error ?? new Error("Upload failed"));
          resolve({ url: result.secure_url, publicId: result.public_id });
        }
      )
      .end(buffer);
  });
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export async function listCloudinaryMedia(
  folder: string = "marassi",
  maxResults: number = 100
) {
  const result = await cloudinary.api.resources({
    type: "upload",
    prefix: folder,
    max_results: maxResults,
    resource_type: "image",
  });
  return result.resources as Array<{
    public_id: string;
    secure_url: string;
    format: string;
    bytes: number;
    created_at: string;
    width: number;
    height: number;
  }>;
}
