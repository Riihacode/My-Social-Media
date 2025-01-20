const db = require('../db');
const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');

// Upload Photo
const uploadPhoto = async(req, res) => {
    const { user_id, title } = req.body;
    const photo_url = `/photo-uploaded/${req.file.filename}`; // URL file foto yang diunggah
    const timestamp = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss'); // timestamp aktivitas asia jakarta

    try {
        const [result] = await db.query(
            `INSERT INTO photos (user_id, title, photo_url, uploaded_at) VALUES (?, ?, ?, ?)`,
            [user_id, title, photo_url, timestamp]
        );
        console.log(`[UPLOAD-PHOTO] User ID: ${user_id}, Title: ${title}, File: ${photo_url}, Timestamp: ${timestamp}`);
        res.status(201).json({ id: result.insertId, title, photo_url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


// Get photos by user
const getPhotosByUser = async (req, res) => {
    const { user_id } = req.params;

    try {
        const [photos] = await db.query(
            `SELECT id, title, photo_url, uploaded_at FROM photos WHERE user_id = ?`,
            [user_id]
        );
        console.log(photos);
        req.status(200).json(photos);
    } catch (error) {
        console.error(error);
        req.status(500).json({ error: error.message });
    }
};


const deletePhoto = async (req, res) => {
    const { photo_id } = req.params;
    
    try {
        // Cari data foto di database
        const [photos] = await db.query(
            `SELECT photo_url FROM photos WHERE id = ?`,
            [photo_id]
        );

        if (photos.length === 0) {
            return res.status(404).json({ error: "Photo not found" });
        }

        // Ambil path foto
        const photoPath = path.join(__dirname, '..', photos[0].photo_url);

        // Hapus file dari folder
        fs.unlink(photoPath, (err) => {
            if (err) {
                console.error(`Failed to delete file: ${photoPath}`, err);
                return res.status(500).json({ error: "Failed to delete file" });
            }
        });

        // Hapus data dari database
        await db.query(
            `DELETE FROM photos WHERE id = ?`,
            [photo_id]
        );

        console.log(`Photo with ID ${photo_id} deleted from database`);
        res.status(200).json({ message: "Photo deleted succesfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


module.exports = { 
    uploadPhoto, 
    getPhotosByUser, 
    deletePhoto 
};