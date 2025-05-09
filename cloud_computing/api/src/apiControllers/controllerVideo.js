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

// const uploadVideo = async (req, res) => {
//     const { user_id, title, description } = req.body;

//     if (!user_id) {
//         return res.status(400).json({ error: "user_id is required" });
//     }

//     if ( !title) {
//         return res.status(400).json({ error: "title is required" });
//     }

//     if (!req.file) {
//         return res.status(400).json({ error: "video_file is required" });
//     }

//     const filename = `${Date.now()}-${req.file.originalname}`;
//     const savePath = path.join(process.cwd(), 'public', 'upload', 'uploadedVideo', filename);
//     const video_url = `/upload/uploadedVideo/${filename}`;
//     const timestamp = moment.utc().format('YYYY-MM-DD HH:mm:ss');

//     try {
//         // Simpan file ke disk secara manual
//         fs.writeFileSync(savePath, req.file.buffer);

//         const newVideo = await Video.create({
//             user_id,
//             title,
//             description,
//             video_url,
//             uploaded_at: timestamp
//         });

//         console.log(`[UPLOAD-VIDEOS] User ID: ${user_id}, Title: ${title}, Description: ${description}, Video: ${video_url}, Uploaded at: ${timestamp}`);
//         res.status(201).json(newVideo);
//     } catch (error) {
//         console.error(`[UPLOAD-VIDEOS-ERROR] ${error.message}`);
//         res.status(500).json({ error: error.message });
//     }
// };

// const uploadVideo = (req, res) => {
//     const { user_id } = req.params;
//     const busboy = Busboy({ headers: req.headers });

//     let title = "";
//     let description = "";
//     let videoFilename = "";
//     let fileUploaded = false;
//     let uploadError = null;

//     busboy.on("field", (fieldname, val) => {
//         if (fieldname === "title") title = val;
//         if (fieldname === "description") description = val;
//     });

//     busboy.on("file", async (fieldname, file, info) => {
//         const { filename, mimeType } = info;

//         if (fieldname !== "video_url" || !mimeType?.startsWith("video/")) {
//             uploadError = "Only video files are allowed";
//             file.resume();
//             return;
//         }

//         if (!user_id || isNaN(user_id)) {
//             uploadError = "Invalid or missing user_id";
//             file.resume();
//             return;
//         }

//         // Tunggu sampai field title & description sudah ditangkap
//         busboy.on("finish", async () => {
//             if (!title || !description) {
//                 return res.status(400).json({ error: "title and description are required" });
//             }

//             try {
//                 const user = await User.findByPk(user_id);
//                 if (!user) {
//                     return res.status(404).json({ error: "User not found" });
//                 }

//                 const sanitized = filename.replace(/\s+/g, "_");
//                 videoFilename = `${Date.now()}-${sanitized}`;
//                 const savePath = path.join(process.cwd(), "public", "upload", "uploadedVideo", videoFilename);
//                 const writeStream = fs.createWriteStream(savePath);
//                 const video_url = `/upload/uploadedVideo/${videoFilename}`;
//                 const timestamp = moment.utc().format("YYYY-MM-DD HH:mm:ss");

//                 file.pipe(writeStream);
//                 fileUploaded = true;

//                 writeStream.on("finish", async () => {
//                     const newVideo = await Video.create({
//                         user_id,
//                         title,
//                         description,
//                         video_url,
//                         uploaded_at: timestamp
//                     });

//                     console.log(`[UPLOAD-VIDEOS] Uploaded: ${video_url}`);
//                     return res.status(201).json(newVideo);
//                 });

//                 writeStream.on("error", (err) => {
//                     console.error(`[WRITE-ERROR] ${err.message}`);
//                     return res.status(500).json({ error: "Failed to write video" });
//                 });
//             } catch (err) {
//                 console.error(`[UPLOAD-VIDEOS-ERROR] ${err.message}`);
//                 return res.status(500).json({ error: err.message });
//             }
//         });
//     });

//     busboy.on("finish", () => {
//         if (uploadError) return res.status(400).json({ error: uploadError });
//         if (!fileUploaded) return res.status(400).json({ error: "No valid video uploaded" });
//     });

//     req.pipe(busboy);
// };

// const uploadVideo = (req, res) => {
//     const { user_id } = req.params; // Ambil dari params
//     const busboy = Busboy({ headers: req.headers });

//     let title = "";
//     let description = "";
//     let videoFilename = "";
//     let fileUploaded = false;
//     let uploadError = null;

//     busboy.on("field", (fieldname, val) => {
//         if (fieldname === "title") title = val;
//         if (fieldname === "description") description = val;
//     });

//     busboy.on("file", async (fieldname, file, info) => {
//         const { filename, mimeType } = info;

//         // Validasi awal field dan MIME type
//         if (fieldname !== "video_url" || !mimeType?.startsWith("video/")) {
//             uploadError = "Only video files are allowed";
//             file.resume();
//             return;
//         }

//         if (!user_id || isNaN(user_id)) {
//             uploadError = "Invalid or missing user_id";
//             file.resume();
//             return;
//         }

//         // Lanjutkan setelah busboy selesai menerima semua field
//         busboy.on("finish", async () => {
//             if (!title || !description) {
//                 return res.status(400).json({ error: "title and description are required" });
//             }

//             try {
//                 // Cari user setelah file dan input divalidasi
//                 const user = await User.findByPk(user_id);
//                 if (!user) {
//                     return res.status(404).json({ error: "User not found" });
//                 }

//                 // Persiapan penamaan file & folder
//                 const sanitized = filename.replace(/\s+/g, "_");
//                 videoFilename = `${Date.now()}-${sanitized}`;

//                 const uploadDir = path.join(
//                     process.cwd(),
//                     "public",
//                     "upload",
//                     "users",
//                     user_id.toString(),
//                     "uploadedVideo"
//                 );
//                 fs.mkdirSync(uploadDir, { recursive: true });

//                 const savePath = path.join(uploadDir, videoFilename);
//                 const video_url = `/upload/users/${user_id}/uploadedVideo/${videoFilename}`;
//                 const timestamp = moment.utc().format("YYYY-MM-DD HH:mm:ss");

//                 const writeStream = fs.createWriteStream(savePath);
//                 file.pipe(writeStream);
//                 fileUploaded = true;

//                 writeStream.on("finish", async () => {
//                     const newVideo = await Video.create({
//                         user_id,
//                         title,
//                         description,
//                         video_url,
//                         uploaded_at: timestamp,
//                     });

//                     console.log(`[UPLOAD-VIDEO] User: ${user_id}, File: ${video_url}`);
//                     return res.status(201).json(newVideo);
//                 });

//                 writeStream.on("error", (err) => {
//                     console.error("[WRITE-ERROR]", err.message);
//                     return res.status(500).json({ error: "Failed to save video" });
//                 });
//             } catch (err) {
//                 console.error("[UPLOAD-ERROR]", err.message);
//                 return res.status(500).json({ error: err.message });
//             }
//         });
//     });

//     busboy.on("finish", () => {
//         if (uploadError) return res.status(400).json({ error: uploadError });
//         if (!fileUploaded) return res.status(400).json({ error: "No valid video uploaded" });
//     });

//     req.pipe(busboy);
// };


// const uploadVideo = (req, res) => {
//     const { user_id } = req.params;
//     const busboy = Busboy({ headers: req.headers });

//     let title = "";
//     let description = "";
//     let videoFilename = "";
//     let fileUploaded = false;
//     let uploadError = null;
//     let videoInfo = null;
//     let fileStream = null;

//     busboy.on("field", (fieldname, val) => {
//         if (fieldname === "title") title = val;
//         if (fieldname === "description") description = val;
//     });

//     busboy.on("file", (fieldname, file, info) => {
//         const { filename, mimeType } = info;

//         if (fieldname !== "video_url" || !mimeType?.startsWith("video/")) {
//             uploadError = "Only video files are allowed";
//             file.resume();
//             return;
//         }

//         fileUploaded = true;
//         videoInfo = { filename, mimeType };
//         fileStream = file;
//     });

//     busboy.on("finish", async () => {
//         if (uploadError) return res.status(400).json({ error: uploadError });
//         if (!fileUploaded || !title || !description) {
//             return res.status(400).json({ error: "Required fields are missing" });
//         }

//         try {
//             const user = await User.findByPk(user_id);
//             if (!user) return res.status(404).json({ error: "User not found" });

//             const sanitized = videoInfo.filename.replace(/\s+/g, "_");
//             videoFilename = `${Date.now()}-${sanitized}`;

//             const uploadDir = path.join(
//                 process.cwd(),
//                 "public",
//                 "upload",
//                 "users",
//                 user_id.toString(),
//                 "uploadedVideo"
//             );
//             fs.mkdirSync(uploadDir, { recursive: true });

//             const savePath = path.join(uploadDir, videoFilename);
//             const video_url = `/upload/users/${user_id}/uploadedVideo/${videoFilename}`;
//             const timestamp = moment.utc().format("YYYY-MM-DD HH:mm:ss");

//             const writeStream = fs.createWriteStream(savePath);
//             fileStream.pipe(writeStream);

//             writeStream.on("finish", async () => {
//                 const newVideo = await Video.create({
//                     user_id,
//                     title,
//                     description,
//                     video_url,
//                     uploaded_at: timestamp,
//                 });

//                 console.log(`[UPLOAD-VIDEO] User: ${user_id}, File: ${video_url}`);
//                 return res.status(201).json(newVideo);
//             });

//             writeStream.on("error", (err) => {
//                 console.error("[WRITE-ERROR]", err.message);
//                 return res.status(500).json({ error: "Failed to save video" });
//             });
//         } catch (err) {
//             console.error("[UPLOAD-ERROR]", err.message);
//             return res.status(500).json({ error: err.message });
//         }
//     });

//     req.pipe(busboy);
// };

// const uploadVideo = (req, res) => {
//     const { user_id } = req.params;
//     const busboy = Busboy({ headers: req.headers });

//     let title = "";
//     let description = "";
//     let videoFilename = "";
//     let fileUploaded = false;
//     let videoInfo = null;

//     // Ambil field teks
//     busboy.on("field", (fieldname, value) => {
//         console.log(`[FIELD] ${fieldname}: ${value}`);
//         if (fieldname === "title") title = value;
//         if (fieldname === "description") description = value;
//     });

//     // // Saat file diterima
//     // busboy.on("file", (fieldname, file, info) => {
//     //     const { filename, mimeType } = info;

//     //     console.log(`[FILE] ${fieldname}: ${info.filename}`);

//     //     // Tambahkan counter stream
//     //     let size = 0;
//     //     file.on("data", (data) => {
//     //         size += data.length;
//     //         console.log(`[DATA] received ${size} bytes`);
//     //     });

//     //     file.on("end", () => {
//     //         console.log("[FILE] file stream ended");
//     //     });

//     //     if (fieldname !== "video_url") {
//     //         file.resume();
//     //         return;
//     //     }

//     //     if (!mimeType?.startsWith("video/")) {
//     //         file.resume();
//     //         return res.status(400).json({ error: "Invalid file type" });
//     //     }

//     //     fileUploaded = true;
//     //     videoInfo = { filename, file };
//     // });

//     busboy.on("file", async (fieldname, file, info) => {
//         const { filename, mimeType } = info;
    
//         if (fieldname !== "video_url" || !mimeType?.startsWith("video/")) {
//             file.resume();
//             return;
//         }
    
//         if (!title || !description || !user_id) {
//             file.resume();
//             return res.status(400).json({ error: "Required fields are missing" });
//         }
    
//         const user = await User.findByPk(user_id);
//         if (!user) {
//             file.resume();
//             return res.status(404).json({ error: "User not found" });
//         }
    
//         const sanitized = filename.replace(/\s+/g, "_");
//         const finalFilename = `${Date.now()}-${sanitized}`;
    
//         const uploadDir = path.join(
//             process.cwd(),
//             "public",
//             "upload",
//             "users",
//             user_id.toString(),
//             "uploadedVideo"
//         );
//         fs.mkdirSync(uploadDir, { recursive: true });
    
//         const savePath = path.join(uploadDir, finalFilename);
//         const video_url = `/upload/users/${user_id}/uploadedVideo/${finalFilename}`;
//         const timestamp = moment.utc().format("YYYY-MM-DD HH:mm:ss");
    
//         const writeStream = fs.createWriteStream(savePath);
//         file.pipe(writeStream);
    
//         writeStream.on("finish", async () => {
//             try {
//                 const newVideo = await Video.create({
//                     user_id,
//                     title,
//                     description,
//                     video_url,
//                     uploaded_at: timestamp,
//                 });
    
//                 return res.status(201).json(newVideo);
//             } catch (err) {
//                 return res.status(500).json({ error: "Database error" });
//             }
//         });
    
//         writeStream.on("error", (err) => {
//             console.error("Write error:", err);
//             return res.status(500).json({ error: "Failed to write video" });
//         });
//     });
    

//     // Setelah semua selesai diparse
//     busboy.on("finish", async () => {
//         console.log("[FINISH] busboy finished");
//         if (!fileUploaded || !title || !description) {
//             return res.status(400).json({ error: "Required fields are missing" });
//         }

//         try {
//             const user = await User.findByPk(user_id);
//             if (!user) return res.status(404).json({ error: "User not found" });

//             const sanitized = videoInfo.filename.replace(/\s+/g, "_");
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

//             const writeStream = fs.createWriteStream(savePath);
//             videoInfo.file.pipe(writeStream);

//             writeStream.on("finish", async () => {
//                 const newVideo = await Video.create({
//                     user_id,
//                     title,
//                     description,
//                     video_url,
//                     uploaded_at: timestamp,
//                 });

//                 return res.status(201).json(newVideo);
//             });

//             writeStream.on("error", (err) => {
//                 console.error("Write error:", err);
//                 return res.status(500).json({ error: "Failed to save video" });
//             });
//         } catch (err) {
//             console.error("Upload error:", err);
//             return res.status(500).json({ error: "Internal server error" });
//         }
//     });

//     req.pipe(busboy);
// };
const uploadVideo = (req, res) => {
    const { user_id } = req.params;
    const busboy = Busboy({ headers: req.headers });

    let title = "";
    let description = "";
    let fileReceived = false;

    busboy.on("field", (fieldname, value) => {
        if (fieldname === "title") title = value;
        if (fieldname === "description") description = value;
    });

    busboy.on("file", async (fieldname, file, info) => {
        const { filename, mimeType } = info;

        if (fieldname !== "video_url" || !mimeType?.startsWith("video/")) {
            file.resume();
            return;
        }

        fileReceived = true;

        if (!title || !description || !user_id || isNaN(user_id)) {
            file.resume();
            return res.status(400).json({ error: "Required fields are missing" });
        }

        try {
            const user = await User.findByPk(user_id);
            if (!user) {
                file.resume();
                return res.status(404).json({ error: "User not found" });
            }

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

            const writeStream = fs.createWriteStream(savePath);
            file.pipe(writeStream);

            writeStream.on("finish", async () => {
                try {
                    const newVideo = await Video.create({
                        user_id,
                        title,
                        description,
                        video_url,
                        uploaded_at: timestamp,
                    });

                    return res.status(201).json(newVideo);
                } catch (err) {
                    return res.status(500).json({ error: "Database error" });
                }
            });

            writeStream.on("error", (err) => {
                console.error("Write error:", err);
                return res.status(500).json({ error: "Failed to write video" });
            });
        } catch (err) {
            console.error("Upload error:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
    });

    busboy.on("finish", () => {
        if (!fileReceived) {
            return res.status(400).json({ error: "No video file uploaded" });
        }
    });

    req.pipe(busboy);
};



const getAllVideos = async (req, res) => {
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
};

const getVideosByUser = async (req, res) => {
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
};

const deleteVideo = async (req, res) => {
    const { video_id } = req.params;

    try {
        const video = await Video.findByPk(video_id);
        if (!video) return res.status(404).json({ error: "Video not found" });

        //const videoPath = path.join(__dirname, '..', video.video_url);
        const videoPath = path.join(process.cwd(), "public", video.video_url.replace(/^\/+/, ""));

        if (fs.existsSync(videoPath)) {
            fs.unlinkSync(videoPath);
            console.log(`[DELETE-FILE] Deleted: ${videoPath}`);
        } else {
            console.warn(`[DELETE-FILE] File not found: ${videoPath}`);
        }

        await video.destroy();
        res.status(200).json({ message: "Video deleted", video_id });
    } catch (error) {
        console.error(`[DELETE-VIDEO-ERROR] ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

const updateVideoMetadata = async (req, res) => {
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
};

// const uploadVideoThumbnail = async (req, res) => {
//     const { video_id } = req.params;

//     // Validasi: ada file?
//     if (!req.file || !req.file.buffer) {
//         return res.status(400).json({ error: "No thumbnail file uploaded" });
//     }

//     try {
//         // Validasi: video_id harus ditemukan di database
//         const video = await Video.findByPk(video_id);
//         if (!video) return res.status(404).json({ error: "Video not found" });

//         // Buat nama file dengan timestamp dan hilangkan spasi
//         const sanitizedOriginal = req.file.originalname.replace(/\s+/g, "_");
//         const filename = `${Date.now()}-${sanitizedOriginal}`;
//         const savePath = path.join(process.cwd(), 'public', 'upload', 'uploadedVideoThumbnail', filename);

//         // Tulis file ke disk (setelah semua validasi lulus)
//         fs.writeFileSync(savePath, req.file.buffer);

//         // Simpan path ke database
//         video.thumbnail_url = `/upload/uploadedVideoThumbnail/${filename}`;
//         await video.save();

//         res.status(200).json({ message: "Thumbnail uploaded", thumbnail_url: video.thumbnail_url });
//     } catch (error) {
//         console.error(`[UPLOAD-THUMBNAIL-ERROR] ${error.message}`);
//         res.status(500).json({ error: error.message });
//     }
// };

const uploadVideoThumbnail = (req, res) => {
    const { video_id } = req.params;
    const busboy = Busboy({ headers: req.headers });

    let fileReceived = false;

    busboy.on("file", async (fieldname, file, info) => {
        const { filename, mimeType } = info;

        if (fieldname !== "thumbnail_url" || !mimeType?.startsWith("image/")) {
            file.resume();
            return res.status(400).json({ error: "Only image files are allowed for thumbnails" });
        }

        fileReceived = true;

        try {
            const video = await Video.findByPk(video_id);
            if (!video) {
                file.resume();
                return res.status(404).json({ error: "Video not found" });
            }

            // 🚫 Tambahkan validasi thumbnail sudah ada
            if (video.thumbnail_url) {
                file.resume(); // hentikan baca stream
                return res.status(400).json({
                    error: "Thumbnail already exists!"
                });
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

            const writeStream = fs.createWriteStream(savePath);
            file.pipe(writeStream);

            writeStream.on("finish", async () => {
                video.thumbnail_url = thumbnailUrl;
                await video.save();
                return res.status(200).json({
                    message: "Thumbnail uploaded",
                    thumbnail_url: thumbnailUrl,
                });
            });

            writeStream.on("error", (err) => {
                console.error("[THUMBNAIL-WRITE-ERROR]", err.message);
                return res.status(500).json({ error: "Failed to write thumbnail" });
            });
        } catch (err) {
            console.error("[THUMBNAIL-UPLOAD-ERROR]", err.message);
            return res.status(500).json({ error: "Internal server error" });
        }
    });

    busboy.on("finish", () => {
        if (!fileReceived) {
            return res.status(400).json({ error: "No thumbnail file uploaded" });
        }
    });

    req.pipe(busboy);
};

const getVideoThumbnail = async (req, res) => {
    const { video_id } = req.params;

    try {
        const video = await Video.findByPk(video_id);
        if (!video) return res.status(404).json({ error: "Video not found" });

        res.status(200).json(video);
    } catch (error) {
        console.error(`[GET-THUMBNAIL-ERROR] ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

const deleteVideoThumbnail = async (req, res) => {
    const { video_id } = req.params;

    try {
        const video = await Video.findByPk(video_id);
        if (!video) return res.status(404).json({ error: "Video not found" });
        
        const thumbnailPath = path.join(process.cwd(), "public", video.thumbnail_url.replace(/^\/+/, ""));

        if (fs.existsSync(thumbnailPath)) {
            fs.unlinkSync(thumbnailPath);
            console.log(`[DELETE-FILE] Deleted: ${thumbnailPath}`);
        } else {
            console.warn(`[DELETE-FILE] File not found: ${thumbnailPath}`);
        }
        video.thumbnail_url = null;
        await video.save();

        res.status(200).json({ message: "Thumbnail deleted" });
    } catch (error) {
        console.error(`[DELETE-THUMBNAIL-ERROR] ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

// const updateVideoThumbnail = async (req, res) => {
//     const { video_id } = req.params;

//     // Validasi file
//     if (!req.file || !req.file.buffer) {
//         return res.status(400).json({ error: "No thumbnail file uploaded" });
//     }

//     try {
//         // Validasi keberadaan video
//         const video = await Video.findByPk(video_id);
//         if (!video) return res.status(404).json({ error: "Video not found" });

//         // Hapus file lama jika ada
//         if (video.thumbnail_url) {
//             const oldPath = path.join(process.cwd(), "public", video.thumbnail_url.replace(/^\/+/, ""));
//             if (fs.existsSync(oldPath)) {
//                 fs.unlinkSync(oldPath);
//                 console.log(`[DELETE-OLD-THUMBNAIL] ${oldPath}`);
//             }
//         }

//         // Buat nama file baru
//         const sanitizedOriginal = req.file.originalname.replace(/\s+/g, "_");
//         const filename = `${Date.now()}-${sanitizedOriginal}`;
//         const savePath = path.join(process.cwd(), 'public', 'upload', 'uploadedVideoThumbnail', filename);

//         // Simpan file baru ke disk
//         fs.writeFileSync(savePath, req.file.buffer);

//         // Update database
//         video.thumbnail_url = `/upload/uploadedVideoThumbnail/${filename}`;
//         await video.save();

//         res.status(200).json({ message: "Thumbnail updated", thumbnail_url: video.thumbnail_url });
//     } catch (error) {
//         console.error(`[UPDATE-THUMBNAIL-ERROR] ${error.message}`);
//         res.status(500).json({ error: error.message });
//     }
// };

const updateVideoThumbnail = (req, res) => {
    const { video_id } = req.params;
    const busboy = Busboy({ headers: req.headers });

    let fileReceived = false;

    busboy.on("file", async (fieldname, file, info) => {
        const { filename, mimeType } = info;

        if (fieldname !== "thumbnail_url" || !mimeType?.startsWith("image/")) {
            file.resume();
            return res.status(400).json({ error: "Only image files are allowed for thumbnail update" });
        }

        fileReceived = true;

        try {
            const video = await Video.findByPk(video_id);
            if (!video) {
                file.resume();
                return res.status(404).json({ error: "Video not found" });
            }

            const user_id = video.user_id;

            // 🔥 Hapus file lama jika ada
            if (video.thumbnail_url) {
                const oldPath = path.join(process.cwd(), "public", video.thumbnail_url.replace(/^\/+/, ""));
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                    console.log(`[DELETE-OLD-THUMBNAIL] ${oldPath}`);
                }
            }

            // 📝 Siapkan file path baru
            const sanitized = filename.replace(/\s+/g, "_");
            const finalFilename = `${Date.now()}-${sanitized}`;
            const uploadDir = path.join(
                process.cwd(),
                "public",
                "upload",
                "users",
                user_id.toString(),
                "uploadedVideoThumbnail"
            );
            fs.mkdirSync(uploadDir, { recursive: true });

            const savePath = path.join(uploadDir, finalFilename);
            const newThumbnailUrl = `/upload/users/${user_id}/uploadedVideoThumbnail/${finalFilename}`;

            const writeStream = fs.createWriteStream(savePath);
            file.pipe(writeStream);

            writeStream.on("finish", async () => {
                video.thumbnail_url = newThumbnailUrl;
                await video.save();

                return res.status(200).json({
                    message: "Thumbnail updated",
                    thumbnail_url: newThumbnailUrl,
                });
            });

            writeStream.on("error", (err) => {
                console.error("[UPDATE-THUMBNAIL-WRITE-ERROR]", err.message);
                return res.status(500).json({ error: "Failed to save updated thumbnail" });
            });
        } catch (err) {
            console.error("[UPDATE-THUMBNAIL-ERROR]", err.message);
            return res.status(500).json({ error: "Internal server error" });
        }
    });

    busboy.on("finish", () => {
        if (!fileReceived) {
            return res.status(400).json({ error: "No thumbnail file uploaded" });
        }
    });

    req.pipe(busboy);
};

const getVideoId = async (req, res) => {
    const { video_id } = req.params;

    try {
        const video = await Video.findByPk(video_id);
        if (!video) return res.status(404).json({ error: "Video not found" });

        res.status(200).json(video);
    } catch (error) {
        console.error(`[GET-VIDEO-DETAIL-ERROR] ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

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