export const uploadToCloudinary = async (file) => {
  const url = `https://api.cloudinary.com/v1_1/dtiuk5awc/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "unsigned_upload");

  try {
    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data.secure_url;
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return null;
  }
};
