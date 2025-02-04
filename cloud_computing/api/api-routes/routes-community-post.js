const express = require('express');
const {
    uploadCommunityPostPhoto, 
    getCommunityPostPhotosByUser, 
    deleteCommunityPostPhoto 
} = require('../api-controllers/controller-community-post');
const upload = require('../api-middleware/community-post/middleware-community-post-photo');
const router = express.Router();

// Endpoint untuk upload photo (dengan file fisik)
router.post('/upload', upload.single('post_photo_url'), uploadCommunityPostPhoto);

// Endpoint untuk mendapatkan semua photo oleh user tertentu
router.get('/:user_id', getCommunityPostPhotosByUser);

// Endpoint untuk menghapus photo
router.delete('/:photo_id', deleteCommunityPostPhoto);

module.exports = router;