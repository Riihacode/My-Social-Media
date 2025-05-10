import express from "express";
import {
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
} from                              "../apiControllers/controllerVideo.js";
import videoUploadLimiter from      "../apiMiddleware/rateLimit/middlewareRateLimit.js";
import upload from                  "../apiMiddleware/video/middlewareVideo.js";
import validateUserId from          "../apiMiddleware/user/middlewareUserValidateUserId.js";
import validateVideoUpload from     "../apiMiddleware/video/middlewareVideoValidateVideoUpload.js";
import uploadThumbnail from         "../apiMiddleware/video/middlewareVideoThumbnail.js";
import validateVideoId from         "../apiMiddleware/video/middlewareVideoValidateVideoId.js";
import syncVideosWithStorage from   "../apiMiddleware/video/middlewareVideoSyncWithStorage.js";
import validateVideoMetadata from   "../apiMiddleware/video/middlewareVideoValidateMetadata.js";
import validateVideoThumbnailUpload from "../apiMiddleware/video/middlewareVideoValidateUploadThumbnail.js";

const router = express.Router();

console.log(typeof uploadVideo);            // Harus "function"
console.log(typeof validateUserId);         // Harus "function"
console.log(typeof validateVideoUpload);    // Harus "function"
console.log(typeof upload.single);          // Harus "function"

// Video
router.post("/users/:user_id/videos", videoUploadLimiter, uploadVideo);
router.get("/videos", getAllVideos);
router.get("/videos/:video_id", validateVideoId, getVideoId);
router.delete("/videos/:video_id", validateVideoId, deleteVideo);
router.put("/videos/:video_id", validateVideoMetadata, upload.none(), updateVideoMetadata); // upload.none() untuk menonaktifkan form data yang penyebab triggernya tidak diketahui

// Videos by user
router.get("/users/:user_id/videos", validateUserId, syncVideosWithStorage, getVideosByUser);

// Thumbnail
router.post("/videos/:video_id/thumbnail", validateVideoId, uploadVideoThumbnail);
router.put("/videos/:video_id/thumbnail", validateVideoId, updateVideoThumbnail);
router.get("/videos/:video_id/thumbnail", validateVideoId, getVideoThumbnail);
router.delete("/videos/:video_id/thumbnail", validateVideoId, deleteVideoThumbnail);

export default router;