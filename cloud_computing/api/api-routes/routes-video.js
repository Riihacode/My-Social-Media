const express = require('express');
const { 
    uploadVideo, 
    getAllVideos, 
    getVideosByUser, 
    deleteVideo,
    uploadVideoThumbnail,
    getVideoThumbnail,
    deleteVideoThumbnail,
    updateVideoThumbnail
} = require('../api-controllers/controller-video');
const upload = require('../api-middleware/video/middleware-video');   // Import konfigurasi multer
const uploadThumbnail = require('../api-middleware/video/middleware-thumbnail');
const validateVideoUpload = require('../api-middleware/photo/middleware-validate');
const validateUserId = require('../api-middleware/user/middleware-validateUserId');
const validateVideoId = require('../api-middleware/video/middleware-validateVideoId');
const router = express.Router();

// Endpoint untuk video
router.post('/upload', upload.single('video_url'), validateUserId, validateVideoUpload, uploadVideo);
router.get('/', getAllVideos);
router.get('/:user_id', validateUserId, getVideosByUser);
router.delete('/:video_id', validateVideoId, deleteVideo);

// Endpoint untuk thumbnail
router.post('/thumbnail/:video_id', uploadThumbnail.single('thumbnail_url'), validateVideoId, uploadVideoThumbnail);
router.get('/thumbnail/:video_id', validateVideoId, getVideoThumbnail);
router.put('/thumbnail/:video_id', uploadThumbnail.single('thumbnail_url'), validateVideoId, updateVideoThumbnail);
router.delete('/thumbnail/:video_id', validateVideoId, deleteVideoThumbnail);

module.exports = router;