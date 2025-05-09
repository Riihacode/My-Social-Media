import fs from "fs";
import path from "path";
import moment from "moment-timezone";
import { fileURLToPath } from "url";
import { dirname } from "path";
import CommunityPostPhoto from "../models/modelsCommunityPostPhoto.js";
import Busboy from "busboy";

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

// const uploadCommunityPostPhoto = async (req, res) => {
//     const { user_id, title } = req.body;

//     if (!user_id || !title) {
//         return res.status(400).json({ error: "Required fields missing" });
//     }

//     if (!req.file || !req.file.buffer) {
//         return res.status(400).json({ error: "No image file uploaded" });
//     }

//     const filename = `${Date.now()}-${req.file.originalname}`;
//     const savePath = path.join(process.cwd(), 'public', 'upload', 'uploadedCommunityPostPhoto', filename);
//     const post_photo_url = `/upload/uploadedCommunityPostPhoto/${filename}`;
//     const timestamp = new Date().toISOString();

//     try {
//         fs.writeFileSync(savePath, req.file.buffer);

//         const newPhoto = await CommunityPostPhoto.create({
//             user_id,
//             title,
//             post_photo_url,
//             uploaded_at: timestamp
//         });

//         res.status(201).json({ id: newPhoto.id, title, post_photo_url });
//     } catch (error) {
//         console.error(`[UPLOAD ERROR] ${error.message}`);
//         res.status(500).json({ error: error.message });
//     }
// };

// const uploadCommunityPostPhoto = (req, res) => {
//     const busboy = Busboy({ headers: req.headers });

//     let user_id = "";
//     let title = "";
//     let description = "";
//     let fileReceived = false;
//     let imageInfo = null;
//     let uploadError = null;

//     busboy.on("field", (fieldname, value) => {
//         if (fieldname === "user_id") user_id = value;
//         if (fieldname === "title") title = value;
//         if (fieldname === "description") description = value;
//     });

//     busboy.on("file", (fieldname, file, info) => {
//         // const { filename, mimeType } = info;
//         const { filename, mimeType: mime } = info;

//         // if (fieldname !== "post_photo_url" || !mimeType.startsWith("image/")) {
//         if (fieldname !== "post_photo_url" || !mime.startsWith("image/")) {
//             uploadError = "Only image files are allowed";
//             file.resume();
//             return;
//             // return res.status(400).json({ error: "Only image files are allowed" });
//         }

//         fileReceived = true;
//         // imageInfo = { filename, file, mimeType };
//         imageInfo = { filename, file, mime };
//     });

//     busboy.on("finish", async () => {
//         if (uploadError) {
//             return res.status(400).json({ error: uploadError });
//         }

//         if (!fileReceived || !user_id || !title  || !description  || isNaN(user_id)) {
//             return res.status(400).json({ error: "Required fields are missing or invalid" });
//         }

//         try {
//             const sanitized = imageInfo.filename.replace(/\s+/g, "_");
//             const finalFilename = `${Date.now()}-${sanitized}`;
//             const uploadDir = path.join(
//                 process.cwd(),
//                 "public",
//                 "upload",
//                 "users",
//                 user_id.toString(),
//                 "uploadedCommunityPostPhoto"
//             );
//             fs.mkdirSync(uploadDir, { recursive: true });

//             const savePath = path.join(uploadDir, finalFilename);
//             const post_photo_url = `/upload/users/${user_id}/uploadedCommunityPostPhoto/${finalFilename}`;
//             const timestamp = moment.utc().toISOString();

//             const writeStream = fs.createWriteStream(savePath);
//             imageInfo.file.pipe(writeStream);

//             writeStream.on("finish", async () => {
//                 const newPost = await CommunityPostPhoto.create({
//                     user_id,
//                     title,
//                     description,
//                     post_photo_url,
//                     uploaded_at: timestamp,
//                 });

//                 return res.status(201).json({
//                     id: newPost.id,
//                     title,
//                     post_photo_url,
//                 });
//             });

//             // writeStream.on("error", (err) => {
//             //     console.error("[COMMUNITY-POST-WRITE-ERROR]", err.message);
//             //     return res.status(500).json({ error: "Failed to write image file" });
//             // });
//             writeStream.on("error", (err) => {
//                 console.error("[WRITE ERROR]", err.message);
//                 return res.status(500).json({ error: "Failed to write file" });
//             });
//         } catch (err) {
//             // console.error("[COMMUNITY-POST-ERROR]", err.message);
//             // return res.status(500).json({ error: "Internal server error" });
//             console.error("[UPLOAD ERROR]", err.message);
//             return res.status(500).json({ error: "Internal server error" });
//         }
//     });

//     req.pipe(busboy);
// };

// const uploadCommunityPostPhoto = (req, res) => {
//     const busboy = Busboy({ headers: req.headers });

//     let user_id = "";
//     let title = "";
//     let description = "";
//     let fileReceived = false;
//     let imageInfo = null;
//     let uploadError = null;

//     busboy.on("field", (fieldname, value) => {
//         console.log("[FIELD]", fieldname, value);
//         if (fieldname === "user_id") user_id = value;
//         if (fieldname === "title") title = value;
//         if (fieldname === "description") description = value;
//     });

//     busboy.on("file", (fieldname, file, info) => {
//         console.log("[FILE]", fieldname, info);
//         const { filename, mimeType } = info;

//         if (fieldname !== "post_photo_url" || !mimeType.startsWith("image/")) {
//             uploadError = "Only image files are allowed";
//             file.resume();
//             return;
//         }

//         fileReceived = true;
//         imageInfo = { filename, file };
//     });

//     busboy.on("finish", async () => {
//         console.log("[FINISH] parsing selesai");

//         if (uploadError) return res.status(400).json({ error: uploadError });

//         if (!fileReceived || !user_id || !title || !description || isNaN(user_id)) {
//             return res.status(400).json({ error: "Required fields are missing or invalid" });
//         }

//         try {
//             const sanitized = imageInfo.filename.replace(/\s+/g, "_");
//             const finalFilename = `${Date.now()}-${sanitized}`;
//             const uploadDir = path.join(process.cwd(), "public", "upload", "users", user_id, "uploadedCommunityPostPhoto");
//             fs.mkdirSync(uploadDir, { recursive: true });

//             const savePath = path.join(uploadDir, finalFilename);
//             const post_photo_url = `/upload/users/${user_id}/uploadedCommunityPostPhoto/${finalFilename}`;
//             const timestamp = moment.utc().toISOString();

//             const writeStream = fs.createWriteStream(savePath);
//             imageInfo.file.pipe(writeStream);

//             // writeStream.on("finish", async () => {
//             //     const newPost = await CommunityPostPhoto.create({
//             //         user_id,
//             //         title,
//             //         description,
//             //         post_photo_url,
//             //         uploaded_at: timestamp,
//             //     });

//             //     res.status(201).json({
//             //         id: newPost.id,
//             //         title,
//             //         post_photo_url,
//             //     });
//             // });

//             writeStream.on("close", async () => {
//                 try {
//                     const newPost = await CommunityPostPhoto.create({
//                         user_id,
//                         title,
//                         description,
//                         post_photo_url,
//                         uploaded_at: timestamp,
//                     });

//                     return res.status(201).json({
//                         id: newPost.id,
//                         title,
//                         post_photo_url,
//                     });
//                 } catch (err) {
//                     console.error("[DB ERROR]", err.message);
//                     return res.status(500).json({ error: "Database error" });
//                 }
//             });


//             writeStream.on("error", (err) => {
//                 console.error("[WRITE ERROR]", err.message);
//                 res.status(500).json({ error: "Failed to save image file" });
//             });
//         } catch (err) {
//             console.error("[UPLOAD ERROR]", err.message);
//             res.status(500).json({ error: "Internal server error" });
//         }
//     });

//     req.pipe(busboy);
// };

// const uploadCommunityPostPhoto = (req, res) => {
//     const busboy = Busboy({ headers: req.headers });

//     let user_id = "";
//     let title = "";
//     let description = "";
//     let fileReceived = false;
//     let imageInfo = null;
//     let uploadError = null;

//     // Tangkap input form
//     busboy.on("field", (fieldname, value) => {
//         console.log("[FIELD]", fieldname, value);
//         if (fieldname === "user_id") user_id = value;
//         if (fieldname === "title") title = value;
//         if (fieldname === "description") description = value;
//     });

//     // Tangkap file
//     busboy.on("file", (fieldname, file, info) => {
//         console.log("[FILE]", fieldname, info);
//         const { filename, mimeType } = info;

//         if (fieldname !== "post_photo_url" || !mimeType.startsWith("image/")) {
//             uploadError = "Only image files are allowed";
//             file.resume(); // jangan biarkan stream menggantung
//             return;
//         }

//         fileReceived = true;
//         imageInfo = { filename, file };
//     });

//     // busboy.on("finish", async () => {
//     //     console.log("[FINISH] parsing selesai");

//     //     if (uploadError) return res.status(400).json({ error: uploadError });

//     //     if (!fileReceived || !user_id || !title || !description || isNaN(user_id)) {
//     //         return res.status(400).json({ error: "Required fields are missing or invalid" });
//     //     }

//     //     try {
//     //         const sanitized = imageInfo.filename.replace(/\s+/g, "_");
//     //         const finalFilename = `${Date.now()}-${sanitized}`;
//     //         const uploadDir = path.join(
//     //             process.cwd(),
//     //             "public",
//     //             "upload",
//     //             "users",
//     //             user_id.toString(),
//     //             "uploadedCommunityPostPhoto"
//     //         );
//     //         fs.mkdirSync(uploadDir, { recursive: true });

//     //         const savePath = path.join(uploadDir, finalFilename);
//     //         const post_photo_url = `/upload/users/${user_id}/uploadedCommunityPostPhoto/${finalFilename}`;
//     //         const timestamp = moment.utc().toISOString();

//     //         console.log("[WRITE] saving to:", savePath);

//     //         const writeStream = fs.createWriteStream(savePath);
//     //         imageInfo.file.pipe(writeStream);

//     //         writeStream.on("close", async () => {
//     //             try {
//     //                 const newPost = await CommunityPostPhoto.create({
//     //                     user_id,
//     //                     title,
//     //                     description,
//     //                     post_photo_url,
//     //                     uploaded_at: timestamp,
//     //                 });

//     //                 return res.status(201).json({
//     //                     id: newPost.id,
//     //                     title,
//     //                     post_photo_url,
//     //                 });
//     //             } catch (err) {
//     //                 console.error("[DB ERROR]", err.message);
//     //                 return res.status(500).json({ error: "Database error" });
//     //             }
//     //         });

//     //         writeStream.on("error", (err) => {
//     //             console.error("[WRITE ERROR]", err.message);
//     //             return res.status(500).json({ error: "Failed to write image file" });
//     //         });
//     //     } catch (err) {
//     //         console.error("[UPLOAD ERROR]", err.message);
//     //         return res.status(500).json({ error: "Internal server error" });
//     //     }
//     // });
//     busboy.on("finish", () => {
//         console.log("[FINISH] parsing selesai");
    
//         if (uploadError) {
//             res.status(400).json({ error: uploadError });
//             return;
//         }
    
//         if (!fileReceived || !user_id || !title || !description || isNaN(user_id)) {
//             res.status(400).json({ error: "Required fields are missing or invalid" });
//             return;
//         }
    
//         // Lanjutkan stream ke file system
//         try {
//             const sanitized = imageInfo.filename.replace(/\s+/g, "_");
//             const finalFilename = `${Date.now()}-${sanitized}`;
//             const uploadDir = path.join(
//                 process.cwd(),
//                 "public",
//                 "upload",
//                 "users",
//                 user_id.toString(),
//                 "uploadedCommunityPostPhoto"
//             );
//             fs.mkdirSync(uploadDir, { recursive: true });
    
//             const savePath = path.join(uploadDir, finalFilename);
//             const post_photo_url = `/upload/users/${user_id}/uploadedCommunityPostPhoto/${finalFilename}`;
//             const timestamp = moment.utc().toISOString();
    
//             console.log("[WRITE] saving to:", savePath);
    
//             const writeStream = fs.createWriteStream(savePath);
//             imageInfo.file.pipe(writeStream);
    
//             writeStream.on("close", async () => {
//                 try {
//                     const newPost = await CommunityPostPhoto.create({
//                         user_id,
//                         title,
//                         description,
//                         post_photo_url,
//                         uploaded_at: timestamp,
//                     });
    
//                     return res.status(201).json({
//                         id: newPost.id,
//                         title,
//                         post_photo_url,
//                     });
//                 } catch (err) {
//                     console.error("[DB ERROR]", err.message);
//                     return res.status(500).json({ error: "Database error" });
//                 }
//             });
    
//             writeStream.on("error", (err) => {
//                 console.error("[WRITE ERROR]", err.message);
//                 return res.status(500).json({ error: "Failed to write image file" });
//             });
//         } catch (err) {
//             console.error("[UPLOAD ERROR]", err.message);
//             return res.status(500).json({ error: "Internal server error" });
//         }
//     });
    

//     req.pipe(busboy);
// };

const uploadCommunityPostPhoto = (req, res) => {
    const busboy = Busboy({ headers: req.headers });

    let user_id = "";
    let title = "";
    let description = "";
    let fileReceived = false;
    let imageInfo = null;
    let uploadError = null;

    busboy.on("field", (fieldname, value) => {
        console.log("[FIELD]", fieldname, value);
        if (fieldname === "user_id") user_id = value;
        if (fieldname === "title") title = value;
        if (fieldname === "description") description = value;
    });

    busboy.on("file", (fieldname, file, info) => {
        const { filename, mimeType } = info;
        console.log("[FILE]", fieldname, info);

        if (fieldname !== "post_photo_url" || !mimeType.startsWith("image/")) {
            uploadError = "Only image files are allowed";
            file.resume();
            return;
        }

        fileReceived = true;
        imageInfo = { filename, file };
    });

    busboy.on("finish", async () => {
        console.log("[FINISH] parsing selesai");

        if (uploadError) return res.status(400).json({ error: uploadError });
        if (!fileReceived || !user_id || !title || !description || isNaN(user_id)) {
            return res.status(400).json({ error: "Required fields are missing or invalid" });
        }

        try {
            const sanitized = imageInfo.filename.replace(/\s+/g, "_");
            const finalFilename = `${Date.now()}-${sanitized}`;
            const uploadDir = path.join(
                process.cwd(),
                "public",
                "upload",
                "users",
                user_id.toString(),
                "uploadedCommunityPostPhoto"
            );
            fs.mkdirSync(uploadDir, { recursive: true });

            const savePath = path.join(uploadDir, finalFilename);
            const post_photo_url = `/upload/users/${user_id}/uploadedCommunityPostPhoto/${finalFilename}`;
            const timestamp = moment.utc().toISOString();

            const writeStream = fs.createWriteStream(savePath);
            imageInfo.file.pipe(writeStream);

            writeStream.on("error", (err) => {
                console.error("[WRITE ERROR]", err.message);
                if (!res.headersSent) {
                    res.status(500).json({ error: "Failed to write image file" });
                }
            });

            writeStream.on("finish", async () => {
                try {
                    const newPost = await CommunityPostPhoto.create({
                        user_id,
                        title,
                        description,
                        post_photo_url,
                        uploaded_at: timestamp,
                    });

                    if (!res.headersSent) {
                        res.status(201).json({
                            id: newPost.id,
                            title,
                            post_photo_url,
                        });
                    }
                } catch (err) {
                    console.error("[DB ERROR]", err.message);
                    if (!res.headersSent) {
                        res.status(500).json({ error: "Database error" });
                    }
                }
            });
        } catch (err) {
            console.error("[UPLOAD ERROR]", err.message);
            if (!res.headersSent) {
                res.status(500).json({ error: "Internal server error" });
            }
        }
    });

    req.pipe(busboy);
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