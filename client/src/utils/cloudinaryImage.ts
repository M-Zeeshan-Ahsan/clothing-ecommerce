export const optimizeCloudinaryImage = (imageUrl: string): string => {
  try {
    const url = new URL(imageUrl);

    if (url.hostname !== "res.cloudinary.com") {
      return imageUrl;
    }

    url.protocol = "https:";

    const uploadPath = "/upload/";
    const uploadIndex = url.pathname.indexOf(uploadPath);

    if (uploadIndex === -1) {
      return url.href;
    }

    const prefix = url.pathname.slice(0, uploadIndex + uploadPath.length);

    const remainingPath = url.pathname.slice(uploadIndex + uploadPath.length);

    // Keep existing transformations; don't add duplicates.
    const parts = remainingPath.split("/");
    const hasTransformations = parts[0]?.includes("_");

    if (hasTransformations) {
      return url.href;
    }

    url.pathname = `${prefix}f_auto/q_auto/${remainingPath}`;

    return url.href;
  } catch {
    return imageUrl;
  }
};
