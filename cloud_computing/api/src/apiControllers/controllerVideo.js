import fs from "fs";
import path from "path";
import moment from "moment-timezone";
import { fileURLToPath } from "url";
import { dirname } from "path";
import Video from "../models/modelsVideo.js";
import User from "../models/modelsUser.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadVideo = async (req, res) => {
    const { user_id, title, description } = req.body;

    if (!user_id) {
        return res.status(400).json({ error: "user_id is required" });
    }

    if ( !title) {
        return res.status(400).json({ error: "title is required" });
    }

    if (!req.file) {
        return res.status(400).json({ error: "video_file is required" });
    }

    const filename = `${Date.now()}-${req.file.originalname}`;
    const savePath = path.join(process.cwd(), 'public', 'upload', 'uploadedVideo', filename);
    const video_url = `/upload/uploadedVideo/${filename}`;
    const timestamp = moment.utc().format('YYYY-MM-DD HH:mm:ss');

    try {
        // Simpan file ke disk secara manual
        fs.writeFileSync(savePath, req.file.buffer);

        const newVideo = await Video.create({
            user_id,
            title,
            description,
            video_url,
            uploaded_at: timestamp
        });

        console.log(`[UPLOAD-VIDEOS] User ID: ${user_id}, Title: ${title}, Description: ${description}, Video: ${video_url}, Uploaded at: ${timestamp}`);
        res.status(201).json(newVideo);
    } catch (error) {
        console.error(`[UPLOAD-VIDEOS-ERROR] ${error.message}`);
        res.status(500).json({ error: error.message });
    }
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

const uploadVideoThumbnail = async (req, res) => {
    const { video_id } = req.params;

    // Validasi: ada file?
    if (!req.file || !req.file.buffer) {
        return res.status(400).json({ error: "No thumbnail file uploaded" });
    }

    try {
        // Validasi: video_id harus ditemukan di database
        const video = await Video.findByPk(video_id);
        if (!video) return res.status(404).json({ error: "Video not found" });

        // Buat nama file dengan timestamp dan hilangkan spasi
        const sanitizedOriginal = req.file.originalname.replace(/\s+/g, "_");
        const filename = `${Date.now()}-${sanitizedOriginal}`;
        const savePath = path.join(process.cwd(), 'public', 'upload', 'uploadedVideoThumbnail', filename);

        // Tulis file ke disk (setelah semua validasi lulus)
        fs.writeFileSync(savePath, req.file.buffer);

        // Simpan path ke database
        video.thumbnail_url = `/upload/uploadedVideoThumbnail/${filename}`;
        await video.save();

        res.status(200).json({ message: "Thumbnail uploaded", thumbnail_url: video.thumbnail_url });
    } catch (error) {
        console.error(`[UPLOAD-THUMBNAIL-ERROR] ${error.message}`);
        res.status(500).json({ error: error.message });
    }
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

const updateVideoThumbnail = async (req, res) => {
    const { video_id } = req.params;

    // Validasi file
    if (!req.file || !req.file.buffer) {
        return res.status(400).json({ error: "No thumbnail file uploaded" });
    }

    try {
        // Validasi keberadaan video
        const video = await Video.findByPk(video_id);
        if (!video) return res.status(404).json({ error: "Video not found" });

        // Hapus file lama jika ada
        if (video.thumbnail_url) {
            const oldPath = path.join(process.cwd(), "public", video.thumbnail_url.replace(/^\/+/, ""));
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
                console.log(`[DELETE-OLD-THUMBNAIL] ${oldPath}`);
            }
        }

        // Buat nama file baru
        const sanitizedOriginal = req.file.originalname.replace(/\s+/g, "_");
        const filename = `${Date.now()}-${sanitizedOriginal}`;
        const savePath = path.join(process.cwd(), 'public', 'upload', 'uploadedVideoThumbnail', filename);

        // Simpan file baru ke disk
        fs.writeFileSync(savePath, req.file.buffer);

        // Update database
        video.thumbnail_url = `/upload/uploadedVideoThumbnail/${filename}`;
        await video.save();

        res.status(200).json({ message: "Thumbnail updated", thumbnail_url: video.thumbnail_url });
    } catch (error) {
        console.error(`[UPDATE-THUMBNAIL-ERROR] ${error.message}`);
        res.status(500).json({ error: error.message });
    }
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