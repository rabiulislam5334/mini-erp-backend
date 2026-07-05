import multer from "multer";
import ApiError from "../utils/ApiError";

const storage = multer.memoryStorage();

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new ApiError(400, "Only .jpg, .jpeg, .png and .webp images are allowed"),
    );
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
