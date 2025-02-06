const express = require('express');
const { 
    uploadVideo, 
    getAllVideos, 
    getVideosByUser, 
    deleteVideo,
    uploadVideoThumbnail,
    getVideoThumbnail,
    deleteVideoThumbnail,
    updateVideoThumbnail,
    getVideoId
} = require                             ('../api-controllers/controller-video');
const upload = require                  ('../api-middleware/video/middleware-video');   // Import konfigurasi multer
const uploadThumbnail = require         ('../api-middleware/video/middleware-video-thumbnail');
const validateVideoUpload = require     ('../api-middleware/community-post/middleware-community-post-photo');
const validateUserId = require          ('../api-middleware/user/middleware-user-validateUserId');
const validateVideoId = require         ('../api-middleware/video/middleware-video-validateVideoId');
const syncVideosWithStorage = require   ('../api-middleware/video/middleware-video-syncWithStorage');
const router = express.Router();

// Endpoint untuk video
router.post('/upload', upload.single('video_url'), validateUserId, validateVideoUpload, uploadVideo);
router.get('/videos', getAllVideos);
router.get('/user/:user_id', validateUserId, syncVideosWithStorage, getVideosByUser);
router.delete('/videos/:video_id', validateVideoId, deleteVideo);
router.get('/videos/:video_id', validateVideoId, getVideoId);

// Endpoint untuk thumbnail
router.post('/thumbnail/:video_id', uploadThumbnail.single('thumbnail_url'), validateVideoId, uploadVideoThumbnail);
router.get('/thumbnail/:video_id', validateVideoId, getVideoThumbnail);
router.put('/thumbnail/:video_id', uploadThumbnail.single('thumbnail_url'), validateVideoId, updateVideoThumbnail);
router.delete('/thumbnail/:video_id', validateVideoId, deleteVideoThumbnail);

module.exports = router;