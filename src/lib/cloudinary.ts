// uploadImageToCloudinary.ts
export const uploadImageToCloudinary = async (file: File): Promise<string | null> => {
  const CLOUD_NAME = "dxze1vehc";
  const UPLOAD_PRESET = "project";

  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    console.error("Cloudinary configuration is missing!");
    return null;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.secure_url) {
      return data.secure_url; // Return the uploaded image URL
    } else {
      console.error("Cloudinary upload failed", data);
      return null;
    }
  } catch (error) {
    console.error("Upload error:", error);
    return null;
  }
};
