const express = require('express');
const {
    uploadPhoto, 
    getPhotosByUser, 
    deletePhoto 
} = require('../api-controllers/controller-photo');
const upload = require('../api-middleware/photo/middleware-photo');
const router = express.Router();

// Endpoint untuk upload photo (dengan file fisik)
router.post('/upload', upload.single('photo_url'), uploadPhoto);

// Endpoint untuk mendapatkan semua photo oleh user tertentu
router.get('/:user_id', getPhotosByUser);

// Endpoint untuk menghapus photo
router.delete('/:photo_id', deletePhoto);

module.exports = router;