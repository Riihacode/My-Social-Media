const db = require('../db');
const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');

// Upload Photo
const uploadCommunityPostPhoto = async(req, res) => {
    const { user_id, title } = req.body;
    const post_photo_url = `/uploaded-community-post-photo/${req.file.filename}`; // URL file foto yang diunggah
    const timestamp = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'); // timestamp aktivitas asia jakarta

    try {
        const [result] = await db.query(
            `INSERT INTO community_post_photo (user_id, title, post_photo_url, uploaded_at) VALUES (?, ?, ?, ?)`,
            [user_id, title, post_photo_url, timestamp]
        );
        console.log(`[UPLOAD-PHOTO] User ID: ${user_id}, Title: ${title}, File: ${post_photo_url}, Timestamp: ${timestamp}`);
        res.status(201).json({ id: result.insertId, title, post_photo_url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


// Get photos by user
const getCommunityPostPhotosByUser = async (req, res) => {
    const { user_id } = req.params;

    try {
        const [post_photos] = await db.query(
            `SELECT id, title, post_photo_url, uploaded_at FROM community_post_photo WHERE user_id = ?`,
            [user_id]
        );
        console.log(post_photos);
        res.status(200).json(post_photos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


const deleteCommunityPostPhoto = async (req, res) => {
    const { post_photo_id } = req.params;
    
    try {
        // Cari data foto di database
        const [post_photo] = await db.query(
            `SELECT post_photo_url FROM community_post_photo WHERE id = ?`,
            [post_photo_id]
        );

        if (photos.length === 0) {
            return res.status(404).json({ error: "Photo not found" });
        }

        // Ambil path foto
        const postPhotoPath = path.join(__dirname, '..', post_photo[0].post_photo_url);

        // Hapus file dari folder
        fs.unlink(postPhotoPath, (err) => {
            if (err) {
                console.error(`Failed to delete file: ${postPhotoPath}`, err);
                return res.status(500).json({ error: "Failed to delete file" });
            }
        });

        // Hapus data dari database
        await db.query(
            `DELETE FROM community_post_photo WHERE id = ?`,
            [post_photo_id]
        );

        console.log(`Photo with ID ${post_photo_id} deleted from database`);
        res.status(200).json({ message: "Photo deleted succesfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


module.exports = { 
    uploadCommunityPostPhoto, 
    getCommunityPostPhotosByUser, 
    deleteCommunityPostPhoto 
};