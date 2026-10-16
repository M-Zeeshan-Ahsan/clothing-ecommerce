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

    const parts = remainingPath.split("/");

    // Detect Cloudinary version or an existing transformation.
    const firstPart = parts[0] ?? "";
    const isVersion = /^v\d+$/.test(firstPart);
    const isTransformation =
      !isVersion &&
      /^(?=.*(?:^|,)f_auto(?:,|$)|^.*(?:^|,)q_auto(?:,|$)|^.*(?:^|,)c_[a-z]+(?:,|$)|^.*(?:^|,)w_\d+(?:,|$)|^.*(?:^|,)h_\d+(?:,|$))/.test(
        firstPart,
      );

    if (isTransformation) {
      return url.href;
    }

    url.pathname = `${prefix}f_auto,q_auto/${remainingPath}`;

    return url.href;
  } catch {
    return imageUrl;
  }
};
