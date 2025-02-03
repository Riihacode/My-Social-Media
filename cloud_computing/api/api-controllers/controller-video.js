const db = require('../db');
const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');
const { error } = require('console');

// Upload Video
const uploadVideo = async (req, res) => {
    const { user_id, title, description} = req.body;

    const video_url = `/video-uploaded/${req.file.filename}`;
    // const timestamp = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');    // Timestamp aktivitas asia jakarta
    const timestamp = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    
    try {
        // Insert video ke database
        const [result] = await db.query(
            `INSERT INTO videos (user_id, title, description, video_url, uploaded_at) VALUES (?, ?, ?, ?, ?)`,
            [user_id, title, description, video_url, timestamp]
        );

        // console.log(req.body);
        console.log(`[UPLOAD-VIDEOS] User ID: ${user_id}, Title: ${title}, Description: ${description}, File: ${video_url}, Timestamp: ${timestamp}`);
        res.status(201).json({ 
            id: result.insertId, 
            title, 
            description, 
            video_url }
        );
    } catch (error) {
        console.log(`[UPLOAD-VIDEOS-ERROR] Failed to upload video: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};


// Get all video
const getAllVideos = async (req, res) =>{
    try {
        /*
        const [videos] = await db.query(
            `SELECT v.id, v.description, v.video_url, v.uploaded_at, u.username
            FROM videos v
            JOIN users u ON v.user_id = u.id`
        );
        */
        const [videos] = await db.query(
            `SELECT v.id, v.description, v.video_url, CONVERT_TZ(v.uploaded_at, '+00:00', '+07:00') AS uploaded_at, u.username
            FROM videos v
            JOIN users u ON v.user_id = u.id`
        );

        // Cek apakah hasil query kosong
        if (videos.length === 0) {
            console.log(`[GET-ALL-VIDEOS] No videos found.`);
            return res.status(200).json({ message: "No videos available.", videos: [] });
        }

        console.log(`[GET-ALL-VIDEOS] Found ${videos.length} videos.`);
        res.status(200).json({ videos });
    } catch (error) {
        console.error(`[GET-ALL-VIDEOS-ERROR] Failed to fetch videos: ${error.message}`);   // Log hasil query
        res.status(500).json({ error: "Failed to fetch videos." });
    }
};


// Get video by user
const getVideosByUser = async (req, res) => {
    const { user_id } = req.params;

    try {
        // Query ke database
        /*
        const [videos] = await db.query(
            `SELECT id, title, description, video_url, uploaded_at 
            FROM videos 
            WHERE user_id = ?`,
            [user_id]
        );
        */
        const [videos] = await db.query(
            `SELECT id, title, description, video_url, CONVERT_TZ(uploaded_at, '+00:00', '+07:00') AS uploaded_at 
            FROM videos 
            WHERE user_id = ?`,
            [user_id]
        );

        // Jika tidak ada video yang ditemukan
        if (videos.length === 0) {
            return res.status(404).json({ message: "No videos found for this user" });
        }

        console.log(videos);    // Log hasil query
        res.status(201).json({
            message: "Videos retrived successfully",
            total: videos.length,
            data: videos, 
        });
    } catch (error) {
        console.error(`[GET-VIDEOS-ERROR] Failed to get videos for user ID ${user_id}: ${error.message}`);   // Log error
        res.status(500).json({ error: "Failed to fetch videos. Please try again later" })
    }
};


// Delete video
const deleteVideo = async (req, res) => {
    const { video_id } = req.params;

    try {
        // Cari data video di database
        const [videos] = await db.query (
            `SELECT video_url FROM videos WHERE id = ?`,
            [video_id]
        );

        if (videos.length === 0) {
            return res.status(404).json({ error: "Video not found" });
        }

        // Ambil path video
        const videoPath = path.join(__dirname, '..', videos[0].video_url);

        // Pengecekan apakah file ada sebelum mencoba menghapus
        if (fs.existsSync(videoPath)) {
            try {
                await fs.promises.unlink(videoPath);
                console.log(`File deleted: ${videoPath}`);
            } catch (err) {
                console.error(`Failed to delete file: ${videoPath}`);
                return res.status(500).json({ error: "Failed to delete file" });
            }
        } else {
            console.warn(`File not found: ${videoPath}`);
        }

        // Hapus data dari database
        await db.query(
            `DELETE FROM videos WHERE id = ?`,
            [video_id]
        )

        console.log(`[DELETE-VIDEO] Video with ID ${video_id} deleted from database`);
        res.status(200).json({ 
            message: "Video deleted successfully",
            video_id: [video_id] 
        });
    } catch (error) {
        console.error(`[DELETE-VIDEOS-ERROR] ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};


const uploadVideoThumbnail = async (req, res) => {
    const { video_id } = req.params;
    const thumbnail_url = `/thumbnail-uploaded/${req.file.filename}`;   // URL file thumbnail

    try {
        // debugging untuk melihat file yang diterima
        console.log(req.file);

        // Perbarui kolom thumbnail_url di tabel videos
        await db.query(
            `UPDATE videos SET thumbnail_url = ? WHERE id = ?`,
            [thumbnail_url, video_id]
        );

        console.log(`[UPLOAD-THUMBNAIL] Video ID: ${video_id}, Thumbnail URL: ${thumbnail_url}`);
        res.status(200).json({
            message: "Thumbnail uploaded successfully",
            thumbnail_url: thumbnail_url,
        });
    } catch (error) {
        console.error(`[UPLOAD-THUMBNAIL-ERROR] Failed to upload thumbnail: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};


const getVideoThumbnail = async  (req, res) => {
    const { video_id } = req.params;

    try {
        // Cari video berdasarkan ID
        const [videos] = await db.query(
            `SELECT id, title, description, video_url, uploaded_at FROM videos WHERE id =?`,
            [video_id]
        );

        if (videos.length === 0) {
            return res.status(404).json({ error: "Video not found" });
        }

        console.log(`[GET-THUMBNAIL] Video ID: ${videos[0].id}, Thumbnail: ${videos[0].thumbnail_url}`);
        res.status(200).json(videos[0]);
    } catch (error) {
        console.error(`[GET-THUMBNAIL-ERROR] Failed to get video thumbnail: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
}


const deleteVideoThumbnail = async (req, res) => {
    const {video_id} = req.params;

    try {
        const [videos] = await db.query(
            // Cari video berdasarkan ID
            `SELECT thumbnail_url FROM videos WHERE id = ?`,
            [video_id]
        );
        
        if (videos.length === 0) {
            return res.status(404).json({ error: "Video not found" });
        }

        const thumbnailPath = path.join(__dirname, '..', videos[0].thumbnail_url);

        // Hapus file thumbnail jika ada
        if (fs.existsSync(thumbnailPath)){
            fs.unlinkSync(thumbnailPath);
            console.log(`[DELETE-THUMBNAIL] File deleted: ${thumbnailPath}`);
        }
            
        // Update database untuk menghapuse referensi thumbnail
        await db.query(
            `UPDATE videos SET thumbnail_url = NULL WHERE id = ?`,
            [video_id]
        );

        console.log(`[DELETE-THUMBNAIL] Thumbnail deleted succesfully: ${thumbnailPath}`);
        res.status(200).json({ message: "Thumbnail deleted succesfully" });
    } catch (error) {
        console.error(`[DELETED-THUMBNAIL-ERROR] Failed to delete thumbnail: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};


const updateVideoThumbnail = async (req, res) => {
    const { video_id } = req.params;
    const newThumbnailUrl = `/thumbnail-uploaded/${req.file.filename}`;

    try {
        // Cari video berdasarkan ID 
        const [videos] = await db.query(
            `SELECT thumbnail_url FROM videos WHERE id = ?`,
            [video_id] 
        );

        if (videos.length === 0) {
            return res.status(404).json({ error: "Video not found" });
        }

        const oldThumbnailPath = path.join(__dirname, '..', videos[0].thumbnail_url);

        // Hapus file thumbnail lama jika ada
        if (fs.existsSync(oldThumbnailPath)) {
            fs.unlinkSync(oldThumbnailPath)
            console.log(`[UPDATE-THUMBNAIL] Old file deleted: ${oldThumbnailPath}`);
        }

        // Update database dengan query baru
        await db.query(
            `UPDATE videos SET thumbnail_url = ? WHERE id =?`,
            [newThumbnailUrl, video_id]
        );

        console.log(`[UPDATE-THUMBNAIL] Videos ID: ${video_id}, New File: ${newThumbnailUrl}`);
        res.status(200).json({
            message: "Thumbnail updated successfully",
            thumbnail_url: newThumbnailUrl,
        });
    } catch (error) {
        console.error(`[UPDATE-THUMBNAIL-ERROR] Failed to update thumbnail: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

const getVideoId = async (req, res) => {
    const { video_id } = req.params;

    try {
        const [videos] = await db.query (
            `SELECT id, title, description, video_url, uploaded_at, user_id
            FROM videos WHERE id = ?`,
            [video_id]
        );

        if (videos.length === 0) {
            return res.status(404).json({ error: "Video not found" });
        }

        console.log(`[GET-VIDEO-DETAIL] GET video: ${videos[0]}`);
        res.status(200).json(videos[0]);
    } catch (error) {
        console.log(`[GET-VIDEO-DETAIL-ERROR] ${error.message}`);
        res.status(500).json({ error: error.message });
    } 
};

module.exports = { 
    uploadVideo, 
    getAllVideos, 
    getVideosByUser, 
    deleteVideo, 
    uploadVideoThumbnail, 
    getVideoThumbnail, 
    deleteVideoThumbnail, 
    updateVideoThumbnail,
    getVideoId 
};