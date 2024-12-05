import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localPath) => {
    try {
        if (!localPath) return null;

        const response = await cloudinary.uploader.upload(localPath, {
            resource_type: "auto",
        });

        fs.unlinkSync(localPath);
        return response; 
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        if (fs.existsSync(localPath)) {
            fs.unlinkSync(localPath);
        }
        
        return null;  
    }
};
const deleteOnCloudinary = async (public_id, resource_type="image") => {
    try {
        if (!public_id) return null;
        const result = await cloudinary.uploader.destroy(public_id, {
            resource_type: `${resource_type}`
        });
    } catch (error) {
        console.log("delete on cloudinary failed", error);
        return error;
    }
};


export { uploadOnCloudinary, deleteOnCloudinary };
