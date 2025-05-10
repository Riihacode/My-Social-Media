import fs from "fs";
import path from "path";
import moment from "moment-timezone";
import { fileURLToPath } from "url";
import { dirname } from "path";
import Video from "../models/modelsVideo.js";
import User from "../models/modelsUser.js";
import Busboy from "busboy";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// const uploadVideo = (req, res) => {
//     const { user_id } = req.params;
//     const busboy = Busboy({ headers: req.headers });

//     let title = "";
//     let description = "";
//     let fileBuffer = [];
//     let filename = "";
//     let mimeType = "";
//     let fileReceived = false;
//     let uploadError = null;

//     // Tangkap field teks (title, description)
//     busboy.on("field", (fieldname, value) => {
//         console.log("[FIELD]", fieldname, value);
//         if (fieldname === "title") title = value;
//         if (fieldname === "description") description = value;
//     });

//     // Tangkap file video
//     busboy.on("file", (fieldname, file, info) => {
//         const { filename: fname, mimeType: mtype } = info;
//         console.log("[FILE]", fieldname, fname, mtype);

//         if (fieldname !== "video_url" || !mtype.startsWith("video/")) {
//             uploadError = "Only video files are allowed";
//             file.resume();
//             return;
//         }

//         filename = fname;
//         mimeType = mtype;
//         fileReceived = true;

//         file.on("data", (data) => fileBuffer.push(data));
//     });

//     // Saat semua parsing selesai
//     busboy.on("finish", async () => {
//         console.log("[FINISH] Busboy selesai parsing");

//         if (uploadError) return res.status(400).json({ error: uploadError });

//         if (!fileReceived || !title || !description || !user_id || isNaN(user_id)) {
//             return res.status(400).json({ error: "Required fields are missing or invalid" });
//         }

//         try {
//             const user = await User.findByPk(user_id);
//             if (!user) {
//                 return res.status(404).json({ error: "User not found" });
//             }

//             const buffer = Buffer.concat(fileBuffer);
//             const sanitized = filename.replace(/\s+/g, "_");
//             const finalFilename = `${Date.now()}-${sanitized}`;
//             const uploadDir = path.join(
//                 process.cwd(),
//                 "public",
//                 "upload",
//                 "users",
//                 user_id.toString(),
//                 "uploadedVideo"
//             );
//             fs.mkdirSync(uploadDir, { recursive: true });

//             const savePath = path.join(uploadDir, finalFilename);
//             const video_url = `/upload/users/${user_id}/uploadedVideo/${finalFilename}`;
//             const timestamp = moment.utc().format("YYYY-MM-DD HH:mm:ss");

//             fs.writeFileSync(savePath, buffer);

//             const newVideo = await Video.create({
//                 user_id,
//                 title,
//                 description,
//                 video_url,
//                 uploaded_at: timestamp,
//             });

//             return res.status(201).json(newVideo);
//         } catch (err) {
//             console.error("[UPLOAD VIDEO ERROR]", err.message);
//             return res.status(500).json({ error: "Internal server error" });
//         }
//     });

//     req.pipe(busboy);
// };
async function uploadVideo(req, res) {
    const { user_id } = req.params;

    // ✅ Validasi Content-Type
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.startsWith('multipart/form-data')) {
        return res.status(400).json({ error: "Invalid or missing Content-Type. Expected multipart/form-data" });
    }

    const busboy = Busboy({ headers: req.headers });

    let title = "";
    let description = "";
    let fileBuffer = [];
    let filename = "";
    let mimeType = "";
    let fileReceived = false;
    let uploadError = null;

    const parseForm = () => new Promise((resolve, reject) => {
        busboy.on("field", (fieldname, value) => {
            if (fieldname === "title") title = value;
            if (fieldname === "description") description = value;
        });

        busboy.on("file", (fieldname, file, info) => {
            const { filename: fname, mimeType: mtype } = info;

            if (fieldname !== "video_url" || !mtype.startsWith("video/")) {
                uploadError = "Only video files are allowed";
                file.resume();
                return;
            }

            filename = fname;
            mimeType = mtype;
            fileReceived = true;
            file.on("data", chunk => fileBuffer.push(chunk));
        });

        busboy.on("finish", resolve);
        busboy.on("error", reject);
        req.pipe(busboy);
    });

    try {
        await parseForm();

        if (uploadError) return res.status(400).json({ error: uploadError });
        if (!fileReceived || !title || !description || !user_id || isNaN(user_id)) {
            return res.status(400).json({ error: "Required fields are missing or invalid" });
        }

        const user = await User.findByPk(user_id);
        if (!user) return res.status(404).json({ error: "User not found" });

        const buffer = Buffer.concat(fileBuffer);
        const sanitized = filename.replace(/\s+/g, "_");
        const finalFilename = `${Date.now()}-${sanitized}`;
        const uploadDir = path.join(
            process.cwd(),
            "public",
            "upload",
            "users",
            user_id.toString(),
            "uploadedVideo"
        );
        fs.mkdirSync(uploadDir, { recursive: true });

        const savePath = path.join(uploadDir, finalFilename);
        const video_url = `/upload/users/${user_id}/uploadedVideo/${finalFilename}`;
        const timestamp = moment.utc().format("YYYY-MM-DD HH:mm:ss");

        fs.writeFileSync(savePath, buffer);

        const newVideo = await Video.create({
            user_id,
            title,
            description,
            video_url,
            uploaded_at: timestamp,
        });

        return res.status(201).json(newVideo);
    } catch (err) {
        console.error("[UPLOAD VIDEO ERROR]", err.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}



// const getAllVideos = async (req, res) => {
//     try {
//         const videos = await Video.findAll({
//             include: { model: User, attributes: ['username'] },
//             attributes: ['id', 'description', 'video_url', 'uploaded_at']
//         });

//         res.status(200).json({ videos });
//     } catch (error) {
//         console.error(`[GET-ALL-VIDEOS-ERROR] ${error.message}`);
//         res.status(500).json({ error: error.message });
//     }
// };
async function getAllVideos(req, res) {
    try {
        const videos = await Video.findAll({
            include: { model: User, attributes: ['username'] },
            attributes: ['id', 'description', 'video_url', 'uploaded_at']
        });
        res.status(200).json({ videos });
    } catch (error) {
        console.error(`[GET-ALL-VIDEOS-ERROR] ${error.message}`);
        res.status(500).json({ error: error.message });
    }
}



// const getVideosByUser = async (req, res) => {
//     const { user_id } = req.params;

//     try {
//         const videos = await Video.findAll({
//             where: { user_id },
//             attributes: ['id', 'title', 'description', 'video_url', 'uploaded_at']
//         });

//         if (videos.length === 0) {
//             return res.status(404).json({ message: "No videos found for this user" });
//         }

//         res.status(200).json({ message: "Videos retrieved", total: videos.length, data: videos });
//     } catch (error) {
//         console.error(`[GET-VIDEOS-ERROR] ${error.message}`);
//         res.status(500).json({ error: error.message });
//     }
// };
async function getVideosByUser(req, res) {
    const { user_id } = req.params;
    try {
        const videos = await Video.findAll({
            where: { user_id },
            attributes: ['id', 'title', 'description', 'video_url', 'uploaded_at']
        });
        if (videos.length === 0) {
        return res.status(404).json({ message: "No videos found for this user" });
        }
        res.status(200).json({ message: "Videos retrieved", total: videos.length, data: videos });
    } catch (error) {
        console.error(`[GET-VIDEOS-ERROR] ${error.message}`);
        res.status(500).json({ error: error.message });
    }
}

// const deleteVideo = async (req, res) => {
//     const { video_id } = req.params;

//     try {
//         const video = await Video.findByPk(video_id);
//         if (!video) return res.status(404).json({ error: "Video not found" });

//         //const videoPath = path.join(__dirname, '..', video.video_url);
//         const videoPath = path.join(process.cwd(), "public", video.video_url.replace(/^\/+/, ""));

//         if (fs.existsSync(videoPath)) {
//             fs.unlinkSync(videoPath);
//             console.log(`[DELETE-FILE] Deleted: ${videoPath}`);
//         } else {
//             console.warn(`[DELETE-FILE] File not found: ${videoPath}`);
//         }

//         await video.destroy();
//         res.status(200).json({ message: "Video deleted", video_id });
//     } catch (error) {
//         console.error(`[DELETE-VIDEO-ERROR] ${error.message}`);
//         res.status(500).json({ error: error.message });
//     }
// };
async function deleteVideo(req, res) {
    const { video_id } = req.params;
    try {
        const video = await Video.findByPk(video_id);
        if (!video) return res.status(404).json({ error: "Video not found" });

        const videoPath = path.join(process.cwd(), "public", video.video_url.replace(/^\/+/g, ""));
        if (fs.existsSync(videoPath)) {
            fs.unlinkSync(videoPath);
            console.log(`[DELETE-FILE] Deleted: ${videoPath}`);
        }

        await video.destroy();
        res.status(200).json({ message: "Video deleted", video_id });
    } catch (error) {
        console.error(`[DELETE-VIDEO-ERROR] ${error.message}`);
        res.status(500).json({ error: error.message });
    }
}

// const updateVideoMetadata = async (req, res) => {
//     const { video_id } = req.params;
//     const { title, description } = req.body;

//     try {
//         const video = await Video.findByPk(video_id);
//         if (!video) return res.status(404).json({ error: "Video not found" });

//         if (title) video.title = title;
//         if (description) video.description = description;

//         await video.save();

//         res.status(200).json({ message: "Video metadata updated", video });
//     } catch (error) {
//         console.error(`[UPDATE-VIDEO-METADATA-ERROR] ${error.message}`);
//         res.status(500).json({ error: error.message });
//     }
// };
async function updateVideoMetadata(req, res) {
    const { video_id } = req.params;
    const { title, description } = req.body;
    try {
        const video = await Video.findByPk(video_id);
        if (!video) return res.status(404).json({ error: "Video not found" });

        if (title) video.title = title;
        if (description) video.description = description;
        await video.save();

        res.status(200).json({ message: "Video metadata updated", video });
    } catch (error) {
        console.error(`[UPDATE-VIDEO-METADATA-ERROR] ${error.message}`);
        res.status(500).json({ error: error.message });
    }
}

// const uploadVideoThumbnail = (req, res) => {
//     const { video_id } = req.params;
//     const busboy = Busboy({ headers: req.headers });

//     let fileBuffer = [];
//     let filename = "";
//     let fileReceived = false;
//     let uploadError = null;

//     busboy.on("file", (fieldname, file, info) => {
//         const { filename: fname, mimeType } = info;

//         if (fieldname !== "thumbnail_url" || !mimeType.startsWith("image/")) {
//             uploadError = "Only image files are allowed";
//             file.resume();
//             return;
//         }

//         filename = fname;
//         fileReceived = true;

//         file.on("data", chunk => fileBuffer.push(chunk));
//     });

//     busboy.on("finish", async () => {
//         if (uploadError) return res.status(400).json({ error: uploadError });
//         if (!fileReceived) return res.status(400).json({ error: "No thumbnail file uploaded" });

//         try {
//             const video = await Video.findByPk(video_id);
//             if (!video) return res.status(404).json({ error: "Video not found" });

//             if (video.thumbnail_url) {
//                 return res.status(400).json({ error: "Thumbnail already exists" });
//             }

//             const sanitized = filename.replace(/\s+/g, "_");
//             const finalFilename = `${Date.now()}-${sanitized}`;
//             const uploadDir = path.join(process.cwd(), "public", "upload", "users", video.user_id.toString(), "uploadedVideoThumbnail");
//             fs.mkdirSync(uploadDir, { recursive: true });

//             const savePath = path.join(uploadDir, finalFilename);
//             const thumbnailUrl = `/upload/users/${video.user_id}/uploadedVideoThumbnail/${finalFilename}`;
//             fs.writeFileSync(savePath, Buffer.concat(fileBuffer));

//             video.thumbnail_url = thumbnailUrl;
//             await video.save();

//             res.status(200).json({ message: "Thumbnail uploaded", thumbnail_url: thumbnailUrl });
//         } catch (err) {
//             console.error("[THUMBNAIL-UPLOAD-ERROR]", err.message);
//             res.status(500).json({ error: "Internal server error" });
//         }
//     });

//     req.pipe(busboy);
// };
async function uploadVideoThumbnail(req, res) {
    const { video_id } = req.params;

    // ✅ Validasi Content-Type
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.startsWith('multipart/form-data')) {
        return res.status(400).json({ error: "Invalid or missing Content-Type. Expected multipart/form-data" });
    }

    const busboy = Busboy({ headers: req.headers });

    let fileBuffer = [];
    let filename = "";
    let fileReceived = false;
    let uploadError = null;

    const parseForm = () =>
        new Promise((resolve, reject) => {
            busboy.on("file", (fieldname, file, info) => {
                const { filename: fname, mimeType } = info;

                if (fieldname !== "thumbnail_url" || !mimeType.startsWith("image/")) {
                    uploadError = "Only image files are allowed";
                    file.resume();
                    return;
                }

                filename = fname;
                fileReceived = true;
                file.on("data", chunk => fileBuffer.push(chunk));
            });

            busboy.on("finish", resolve);
            busboy.on("error", reject);
            req.pipe(busboy);
        });

    try {
        await parseForm();

        if (uploadError) return res.status(400).json({ error: uploadError });
        if (!fileReceived) return res.status(400).json({ error: "No thumbnail file uploaded" });

        const video = await Video.findByPk(video_id);
        if (!video) return res.status(404).json({ error: "Video not found" });

        if (video.thumbnail_url) {
            return res.status(400).json({ error: "Thumbnail already exists" });
        }

        const sanitized = filename.replace(/\s+/g, "_");
        const finalFilename = `${Date.now()}-${sanitized}`;
        const uploadDir = path.join(
            process.cwd(),
            "public",
            "upload",
            "users",
            video.user_id.toString(),
            "uploadedVideoThumbnail"
        );
        fs.mkdirSync(uploadDir, { recursive: true });

        const savePath = path.join(uploadDir, finalFilename);
        const thumbnailUrl = `/upload/users/${video.user_id}/uploadedVideoThumbnail/${finalFilename}`;
        fs.writeFileSync(savePath, Buffer.concat(fileBuffer));

        video.thumbnail_url = thumbnailUrl;
        await video.save();

        return res.status(200).json({
            message: "Thumbnail uploaded",
            thumbnail_url: thumbnailUrl,
        });
    } catch (err) {
        console.error("[UPLOAD-THUMBNAIL-ERROR]", err.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}


// const getVideoThumbnail = async (req, res) => {
//     const { video_id } = req.params;

//     try {
//         const video = await Video.findByPk(video_id);
//         if (!video) return res.status(404).json({ error: "Video not found" });

//         res.status(200).json(video);
//     } catch (error) {
//         console.error(`[GET-THUMBNAIL-ERROR] ${error.message}`);
//         res.status(500).json({ error: error.message });
//     }
// };
async function getVideoThumbnail(req, res) {
    const { video_id } = req.params;
    try {
        const video = await Video.findByPk(video_id);
        if (!video) return res.status(404).json({ error: "Video not found" });
        res.status(200).json(video);
    } catch (error) {
        console.error(`[GET-THUMBNAIL-ERROR] ${error.message}`);
        res.status(500).json({ error: error.message });
    }
}


// const deleteVideoThumbnail = async (req, res) => {
//     const { video_id } = req.params;

//     try {
//         const video = await Video.findByPk(video_id);
//         if (!video) return res.status(404).json({ error: "Video not found" });
        
//         const thumbnailPath = path.join(process.cwd(), "public", video.thumbnail_url.replace(/^\/+/, ""));

//         if (fs.existsSync(thumbnailPath)) {
//             fs.unlinkSync(thumbnailPath);
//             console.log(`[DELETE-FILE] Deleted: ${thumbnailPath}`);
//         } else {
//             console.warn(`[DELETE-FILE] File not found: ${thumbnailPath}`);
//         }
//         video.thumbnail_url = null;
//         await video.save();

//         res.status(200).json({ message: "Thumbnail deleted" });
//     } catch (error) {
//         console.error(`[DELETE-THUMBNAIL-ERROR] ${error.message}`);
//         res.status(500).json({ error: error.message });
//     }
// };
async function deleteVideoThumbnail(req, res) {
    const { video_id } = req.params;
    try {
        const video = await Video.findByPk(video_id);
        if (!video) return res.status(404).json({ error: "Video not found" });

        const thumbnailPath = path.join(process.cwd(), "public", video.thumbnail_url.replace(/^\/+/g, ""));
        if (fs.existsSync(thumbnailPath)) fs.unlinkSync(thumbnailPath);

        video.thumbnail_url = null;
        await video.save();
        res.status(200).json({ message: "Thumbnail deleted" });
    } catch (error) {
        console.error(`[DELETE-THUMBNAIL-ERROR] ${error.message}`);
        res.status(500).json({ error: error.message });
    }
}

// const updateVideoThumbnail = (req, res) => {
//     const { video_id } = req.params;
//     const busboy = Busboy({ headers: req.headers });

//     let fileBuffer = [];
//     let filename = "";
//     let fileReceived = false;
//     let uploadError = null;

//     busboy.on("file", (fieldname, file, info) => {
//         const { filename: fname, mimeType } = info;

//         if (fieldname !== "thumbnail_url" || !mimeType.startsWith("image/")) {
//             uploadError = "Only image files are allowed";
//             file.resume();
//             return;
//         }

//         filename = fname;
//         fileReceived = true;

//         file.on("data", chunk => fileBuffer.push(chunk));
//     });

//     busboy.on("finish", async () => {
//         if (uploadError) return res.status(400).json({ error: uploadError });
//         if (!fileReceived) return res.status(400).json({ error: "No thumbnail file uploaded" });

//         try {
//             const video = await Video.findByPk(video_id);
//             if (!video) return res.status(404).json({ error: "Video not found" });

//             const user_id = video.user_id;

//             if (video.thumbnail_url) {
//                 const oldPath = path.join(process.cwd(), "public", video.thumbnail_url.replace(/^\/+/, ""));
//                 if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
//             }

//             const sanitized = filename.replace(/\s+/g, "_");
//             const finalFilename = `${Date.now()}-${sanitized}`;
//             const uploadDir = path.join(process.cwd(), "public", "upload", "users", user_id.toString(), "uploadedVideoThumbnail");
//             fs.mkdirSync(uploadDir, { recursive: true });

//             const savePath = path.join(uploadDir, finalFilename);
//             const newThumbnailUrl = `/upload/users/${user_id}/uploadedVideoThumbnail/${finalFilename}`;
//             fs.writeFileSync(savePath, Buffer.concat(fileBuffer));

//             video.thumbnail_url = newThumbnailUrl;
//             await video.save();

//             res.status(200).json({ message: "Thumbnail updated", thumbnail_url: newThumbnailUrl });
//         } catch (err) {
//             console.error("[UPDATE-THUMBNAIL-ERROR]", err.message);
//             res.status(500).json({ error: "Internal server error" });
//         }
//     });

//     req.pipe(busboy);
// };
async function updateVideoThumbnail(req, res) {
    const { video_id } = req.params;

    // ✅ Validasi Content-Type
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.startsWith('multipart/form-data')) {
        return res.status(400).json({ error: "Invalid or missing Content-Type. Expected multipart/form-data" });
    }

    const busboy = Busboy({ headers: req.headers });

    let fileBuffer = [];
    let filename = "";
    let fileReceived = false;
    let uploadError = null;

    const parseForm = () =>
        new Promise((resolve, reject) => {
            busboy.on("file", (fieldname, file, info) => {
                const { filename: fname, mimeType } = info;

                if (fieldname !== "thumbnail_url" || !mimeType.startsWith("image/")) {
                    uploadError = "Only image files are allowed";
                    file.resume();
                    return;
                }

                filename = fname;
                fileReceived = true;
                file.on("data", (chunk) => fileBuffer.push(chunk));
            });

            busboy.on("finish", resolve);
            busboy.on("error", reject);
        });

    req.pipe(busboy);

    try {
        await parseForm();

        if (uploadError) return res.status(400).json({ error: uploadError });
        if (!fileReceived) return res.status(400).json({ error: "No thumbnail file uploaded" });

        const video = await Video.findByPk(video_id);
        if (!video) return res.status(404).json({ error: "Video not found" });

        const user_id = video.user_id;

        if (video.thumbnail_url) {
            const oldPath = path.join(process.cwd(), "public", video.thumbnail_url.replace(/^\/+/g, ""));
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        const sanitized = filename.replace(/\s+/g, "_");
        const finalFilename = `${Date.now()}-${sanitized}`;
        const uploadDir = path.join(process.cwd(), "public", "upload", "users", user_id.toString(), "uploadedVideoThumbnail");
        fs.mkdirSync(uploadDir, { recursive: true });

        const savePath = path.join(uploadDir, finalFilename);
        const newThumbnailUrl = `/upload/users/${user_id}/uploadedVideoThumbnail/${finalFilename}`;
        fs.writeFileSync(savePath, Buffer.concat(fileBuffer));

        video.thumbnail_url = newThumbnailUrl;
        await video.save();

        return res.status(200).json({ message: "Thumbnail updated", thumbnail_url: newThumbnailUrl });
    } catch (err) {
        console.error("[UPDATE-THUMBNAIL-ERROR]", err.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}


// const getVideoId = async (req, res) => {
//     const { video_id } = req.params;

//     try {
//         const video = await Video.findByPk(video_id);
//         if (!video) return res.status(404).json({ error: "Video not found" });

//         res.status(200).json(video);
//     } catch (error) {
//         console.error(`[GET-VIDEO-DETAIL-ERROR] ${error.message}`);
//         res.status(500).json({ error: error.message });
//     }
// };
async function getVideoId(req, res) {
    const { video_id } = req.params;
    try {
        const video = await Video.findByPk(video_id);
        if (!video) return res.status(404).json({ error: "Video not found" });
        res.status(200).json(video);
    } catch (error) {
        console.error(`[GET-VIDEO-DETAIL-ERROR] ${error.message}`);
        res.status(500).json({ error: error.message });
    }
} 


export { 
    uploadVideo, 
    getAllVideos, 
    getVideosByUser, 
    deleteVideo, 
    updateVideoMetadata,
    uploadVideoThumbnail, 
    getVideoThumbnail, 
    deleteVideoThumbnail, 
    updateVideoThumbnail,
    getVideoId 
};