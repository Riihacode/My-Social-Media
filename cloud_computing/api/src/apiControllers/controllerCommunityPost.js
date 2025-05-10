import fs from "fs";
import path from "path";
import moment from "moment-timezone";
import { fileURLToPath } from "url";
import { dirname } from "path";
import CommunityPostPhoto from "../models/modelsCommunityPostPhoto.js";
import Busboy from "busboy";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// const uploadCommunityPostPhoto = (req, res) => {
//     const busboy = Busboy({ headers: req.headers });

//     let user_id = "";
//     let title = "";
//     let description = "";
//     let fileReceived = false;
//     let fileBuffer = [];
//     let filename = "";
//     let mimeType = "";
//     let uploadError = null;

//     busboy.on("field", (fieldname, value) => {
//         console.log("[FIELD]", fieldname, value);
//         if (fieldname === "user_id") user_id = value;
//         if (fieldname === "title") title = value;
//         if (fieldname === "description") description = value;
//     });

//     busboy.on("file", (fieldname, file, info) => {
//         console.log("[FILE]", fieldname, info);
//         if (fieldname !== "post_photo_url" || !info.mimeType.startsWith("image/")) {
//             uploadError = "Only image files are allowed";
//             file.resume();
//             return;
//         }

//         filename = info.filename;
//         mimeType = info.mimeType;
//         fileReceived = true;

//         file.on("data", (data) => fileBuffer.push(data));
//     });

//     busboy.on("finish", async () => {
//         console.log("[FINISH] Parsing selesai");

//         if (uploadError) return res.status(400).json({ error: uploadError });

//         if (!fileReceived || !user_id || !title || !description || isNaN(user_id)) {
//             return res.status(400).json({ error: "Required fields are missing or invalid" });
//         }

//         try {
//             const buffer = Buffer.concat(fileBuffer);
//             const sanitized = filename.replace(/\s+/g, "_");
//             const finalFilename = `${Date.now()}-${sanitized}`;
//             const uploadDir = path.join(process.cwd(), "public", "upload", "users", user_id, "uploadedCommunityPostPhoto");
//             fs.mkdirSync(uploadDir, { recursive: true });

//             const savePath = path.join(uploadDir, finalFilename);
//             const post_photo_url = `/upload/users/${user_id}/uploadedCommunityPostPhoto/${finalFilename}`;
//             const timestamp = moment.utc().toISOString();

//             fs.writeFileSync(savePath, buffer);

//             const newPost = await CommunityPostPhoto.create({
//                 user_id,
//                 title,
//                 description,
//                 post_photo_url,
//                 uploaded_at: timestamp,
//             });

//             return res.status(201).json({
//                 id: newPost.id,
//                 title,
//                 description,
//                 post_photo_url,
//             });
//         } catch (err) {
//             console.error("[UPLOAD ERROR]", err.message);
//             return res.status(500).json({ error: "Internal server error" });
//         }
//     });

//     req.pipe(busboy);
// };
async function uploadCommunityPostPhoto(req, res) {
    // ⛔️ Validasi: Content-Type harus multipart/form-data
    const contentType = req.headers["content-type"];
    if (!contentType || !contentType.includes("multipart/form-data")) {
        return res.status(400).json({ error: "Invalid Content-Type. Expected multipart/form-data." });
    }

    const busboy = Busboy({ headers: req.headers });

    let user_id = "";
    let title = "";
    let description = "";
    let fileReceived = false;
    let fileBuffer = [];
    let filename = "";
    let mimeType = "";
    let uploadError = null;

    const parseForm = () =>
        new Promise((resolve, reject) => {
            busboy.on("field", (fieldname, value) => {
                if (fieldname === "user_id") user_id = value;
                if (fieldname === "title") title = value;
                if (fieldname === "description") description = value;
            });

            busboy.on("file", (fieldname, file, info) => {
                const { filename: fname, mimeType: mtype } = info;

                if (fieldname !== "post_photo_url" || !mtype.startsWith("image/")) {
                    uploadError = "Only image files are allowed";
                    file.resume();
                    return;
                }

                filename = fname;
                mimeType = mtype;
                fileReceived = true;

                file.on("data", (data) => fileBuffer.push(data));
            });

            busboy.on("finish", resolve);
            busboy.on("error", reject);
            req.pipe(busboy);
        });

    try {
        await parseForm();

        if (uploadError) return res.status(400).json({ error: uploadError });

        if (!fileReceived || !user_id || !title || !description || isNaN(user_id)) {
            return res.status(400).json({ error: "Required fields are missing or invalid" });
        }

        const buffer = Buffer.concat(fileBuffer);
        const sanitized = filename.replace(/\s+/g, "_");
        const finalFilename = `${Date.now()}-${sanitized}`;
        const uploadDir = path.join(process.cwd(), "public", "upload", "users", user_id, "uploadedCommunityPostPhoto");
        fs.mkdirSync(uploadDir, { recursive: true });

        const savePath = path.join(uploadDir, finalFilename);
        const post_photo_url = `/upload/users/${user_id}/uploadedCommunityPostPhoto/${finalFilename}`;
        const timestamp = moment.utc().toISOString();

        fs.writeFileSync(savePath, buffer);

        const newPost = await CommunityPostPhoto.create({
            user_id,
            title,
            description,
            post_photo_url,
            uploaded_at: timestamp,
        });

        return res.status(201).json({
            id: newPost.id,
            title,
            description,
            post_photo_url,
        });
    } catch (err) {
        console.error("[UPLOAD ERROR]", err.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}


// Get photos by user
// const getCommunityPostPhotosByUser = async (req, res) => {
//     const { user_id } = req.params;

//     try {
//         const photos = await CommunityPostPhoto.findAll({
//             where: { user_id },
//             attributes: ["id", "title", "post_photo_url", "uploaded_at"]
//         });

//         console.log(photos);
//         res.status(200).json(photos);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: error.message });
//     }
// };
async function getCommunityPostPhotosByUser(req, res) {
    const { user_id } = req.params;

    try {
        const photos = await CommunityPostPhoto.findAll({
            where: { user_id },
            attributes: ["id", "title", "post_photo_url", "description", "uploaded_at"]
        });

        console.log(photos);
        return res.status(200).json(photos);
    } catch (error) {
        console.error("[GET-PHOTOS-ERROR]", error.message);
        return res.status(500).json({ error: error.message });
    }
}



// const getCommunityPostPhotoById = async (req, res) => {
//     const { photo_id } = req.params;

//     try {
//         const photo = await CommunityPostPhoto.findByPk(photo_id, {
//             attributes: ["id", "user_id", "title", "post_photo_url", "uploaded_at"]
//         });

//         if (!photo) {
//             return res.status(404).json({ error: "Photo not found" });
//         }

//         res.status(200).json(photo);
//     } catch (error) {
//         console.error(`[GET-PHOTO-ERROR] ${error.message}`);
//         res.status(500).json({ error: error.message });
//     }
// };
async function getCommunityPostPhotoById(req, res) {
    const { photo_id } = req.params;

    try {
        const photo = await CommunityPostPhoto.findByPk(photo_id, {
            attributes: ["id", "user_id", "title", "post_photo_url", "description", "uploaded_at"]
        });

        if (!photo) {
            return res.status(404).json({ error: "Photo not found" });
        }

        return res.status(200).json(photo);
    } catch (error) {
        console.error(`[GET-PHOTO-ERROR] ${error.message}`);
        return res.status(500).json({ error: error.message });
    }
}


// Delete photo
// const deleteCommunityPostPhoto = async (req, res) => {
//     const { photo_id } = req.params;

//     try {
//         const photo = await CommunityPostPhoto.findByPk(photo_id);

//         if (!photo) {
//             return res.status(404).json({ error: "Photo not found" });
//         }

//         const postPhotoPath = path.join(process.cwd(), "public", photo.post_photo_url.replace(/^\/+/, ""));

//         if (fs.existsSync(postPhotoPath)) {
//             fs.unlinkSync(postPhotoPath);
//             console.log(`[DELETE-PHOTO] File deleted: ${postPhotoPath}`);
//         }

//         await photo.destroy();

//         console.log(`[DELETE-PHOTO] Photo with ID ${photo_id} deleted from database`);
//         res.status(200).json({ message: "Photo deleted successfully" });
//     } catch (error) {
//         console.error(`[DELETE-ERROR] ${error.message}`);
//         res.status(500).json({ error: error.message });
//     }
// };
async function deleteCommunityPostPhoto(req, res) {
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
        return res.status(200).json({ message: "Photo deleted successfully" });
    } catch (error) {
        console.error(`[DELETE-ERROR] ${error.message}`);
        return res.status(500).json({ error: error.message });
    }
}

export {
    uploadCommunityPostPhoto,
    getCommunityPostPhotosByUser,
    getCommunityPostPhotoById,
    deleteCommunityPostPhoto
};