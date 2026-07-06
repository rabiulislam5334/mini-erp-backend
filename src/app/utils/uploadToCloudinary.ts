import cloudinary from "../config/cloudinary";
import ApiError from "./ApiError";

export const uploadBufferToCloudinary = (
  buffer: Buffer,
  folder = "mini-erp/products",
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => {
        if (error || !result) {
          console.error("Cloudinary error:", error);
          return reject(new ApiError(500, "Image upload failed"));
        }
        resolve(result.secure_url);
      },
    );
    stream.end(buffer);
  });
};
