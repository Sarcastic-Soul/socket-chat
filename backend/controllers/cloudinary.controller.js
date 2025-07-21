import cloudinary from '../utils/cloudinary.js';

export const getMediaCloudinarySignature = (req, res) => {
    try {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const folder = "MERN-ChatApp/chat_app_media";

        const signature = cloudinary.utils.api_sign_request(
            {
                timestamp: timestamp,
                folder: folder,
            },
            process.env.CLOUDINARY_API_SECRET
        );

        res.status(200).json({
            signature,
            timestamp,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY,
            folder,
        });

    } catch (error) {
        console.error("Error generating Cloudinary signature:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const getProfilePicSignature = (req, res) => {
    try {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const folder = "MERN-ChatApp/profile_pic";

        const signature = cloudinary.utils.api_sign_request(
            {
                timestamp: timestamp,
                folder: folder,
            },
            process.env.CLOUDINARY_API_SECRET
        );

        res.status(200).json({
            signature,
            timestamp,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY,
            folder,
        });

    } catch (error) {
        console.error("Error generating Profile Pic signature:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
