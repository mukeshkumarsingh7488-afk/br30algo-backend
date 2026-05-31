import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME?.trim(),
  api_key: process.env.CLOUD_API_KEY?.trim(),
  api_secret: process.env.CLOUD_API_SECRET?.trim(),
});

export const uploadImageToCloud = async (fileData, folderName) => {
  try {
    if (!fileData) {
      return null;
    }

    if (typeof fileData === "string" && fileData.startsWith("http")) {
      return fileData;
    }

    let uploadSource;

    if (typeof fileData === "string") {
      uploadSource = fileData;
    } else if (fileData.buffer) {
      const base64 = fileData.buffer.toString("base64");

      uploadSource = `data:${fileData.mimetype};base64,${base64}`;
    } else if (fileData.path) {
      uploadSource = fileData.path;
    } else {
      throw new Error("Invalid file format");
    }

    const uploadResponse = await cloudinary.uploader.upload(uploadSource, {
      folder: `sudha_dairy/${folderName}`,
      resource_type: "auto",
    });

    return uploadResponse.secure_url;
  } catch (error) {
    console.error("❌ FULL CLOUDINARY ERROR:", error);

    throw new Error(error?.message || "Cloudinary upload failed");
  }
};
