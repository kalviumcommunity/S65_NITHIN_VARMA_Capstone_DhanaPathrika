import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        // console.log("API Key:", process.env.CLOUDINARY_API_KEY); 
        if (!localFilePath) {
            console.log("No file path provided.");
            return null;
        }
        // console.log("Uploading file:", localFilePath);

        const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "auto" });

        // console.log("File uploaded successfully:", response.url);

        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
        return null;
    }
};

export { uploadOnCloudinary };
