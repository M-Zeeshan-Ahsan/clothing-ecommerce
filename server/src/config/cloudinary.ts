import { v2 as cloudinary } from "cloudinary";

import "dotenv/config";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

console.log("Cloudinary Debug:", {
  cloudName,
  apiKey,
  apiKeyLength: apiKey?.length,
  apiSecretLength: apiSecret?.length,
  apiSecretHasLeadingSpace: apiSecret?.startsWith(" "),
  apiSecretHasTrailingSpace: apiSecret?.endsWith(" "),
});

if (!cloudName || !apiKey || !apiSecret) {
  throw new Error("Cloudinary environment variables are not configured");
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export default cloudinary;
