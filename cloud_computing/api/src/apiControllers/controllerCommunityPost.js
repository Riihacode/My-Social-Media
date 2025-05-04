import fs from "fs";
import path from "path";
import moment from "moment-timezone";
import { fileURLToPath } from "url";
import { dirname } from "path";
import CommunityPostPhoto from "../models/modelsCommunityPostPhoto.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Upload Photo
// const uploadCommunityPostPhoto = async (req, res) => {
//     const { user_id, title } = req.body;

//     if (!req.file || !req.file.filename) {
//         return res.status(400).json({ error: "No community post photo file uploaded" });
//     }

//     const post_photo_url = `/upload/uploadedCommunityPostPhoto/${req.file.filename}`;
//     const timestamp = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');

//     try {
//         const newPhoto = await CommunityPostPhoto.create({
//             user_id,
//             title,
//             post_photo_url,
//             uploaded_at: timestamp
//         });

//         console.log(`[UPLOAD-PHOTO] User ID: ${user_id}, Title: ${title}, File: ${post_photo_url}, Timestamp: ${timestamp}`);
//         res.status(201).json({ id: newPhoto.id, title, post_photo_url });
//     } catch (error) {
//         console.error(`[UPLOAD-ERROR] ${error.message}`);
//         res.status(500).json({ error: error.message });
//     }
// };

const uploadCommunityPostPhoto = async (req, res) => {
    const { user_id, title } = req.body;

    if (!user_id || !title) {
        return res.status(400).json({ error: "Required fields missing" });
    }

    if (!req.file || !req.file.buffer) {
        return res.status(400).json({ error: "No image file uploaded" });
    }

    const filename = `${Date.now()}-${req.file.originalname}`;
    const savePath = path.join(process.cwd(), 'public', 'upload', 'uploadedCommunityPostPhoto', filename);
    const post_photo_url = `/upload/uploadedCommunityPostPhoto/${filename}`;
    const timestamp = new Date().toISOString();

    try {
        fs.writeFileSync(savePath, req.file.buffer);

        const newPhoto = await CommunityPostPhoto.create({
            user_id,
            title,
            post_photo_url,
            uploaded_at: timestamp
        });

        res.status(201).json({ id: newPhoto.id, title, post_photo_url });
    } catch (error) {
        console.error(`[UPLOAD ERROR] ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

// Get photos by user
const getCommunityPostPhotosByUser = async (req, res) => {
    const { user_id } = req.params;

    try {
        const photos = await CommunityPostPhoto.findAll({
            where: { user_id },
            attributes: ["id", "title", "post_photo_url", "uploaded_at"]
        });

        console.log(photos);
        res.status(200).json(photos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};

const getCommunityPostPhotoById = async (req, res) => {
    const { photo_id } = req.params;

    try {
        const photo = await CommunityPostPhoto.findByPk(photo_id, {
            attributes: ["id", "user_id", "title", "post_photo_url", "uploaded_at"]
        });

        if (!photo) {
            return res.status(404).json({ error: "Photo not found" });
        }

        res.status(200).json(photo);
    } catch (error) {
        console.error(`[GET-PHOTO-ERROR] ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

// Delete photo
const deleteCommunityPostPhoto = async (req, res) => {
    const { photo_id } = req.params;

    try {
        const photo = await CommunityPostPhoto.findByPk(photo_id);

        if (!photo) {
            return res.status(404).json({ error: "Photo not found" });
        }

        const postPhotoPath = path.join(process.cwd(), "public", photo.post_photo_url.replace(/^\/+/, ""));

        if (fs.existsSync(postPhotoPath)) {
            fs.unlinkSync(postPhotoPath);
            console.log(`[DELETE-PHOTO] File deleted: ${postPhotoPath}`);
        }

        await photo.destroy();

        console.log(`[DELETE-PHOTO] Photo with ID ${photo_id} deleted from database`);
        res.status(200).json({ message: "Photo deleted successfully" });
    } catch (error) {
        console.error(`[DELETE-ERROR] ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

export {
    uploadCommunityPostPhoto,
    getCommunityPostPhotosByUser,
    getCommunityPostPhotoById,
    deleteCommunityPostPhoto
};