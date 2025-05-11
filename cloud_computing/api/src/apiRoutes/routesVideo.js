import express from "express";
import {
    uploadVideo, 
    getAllVideos,
    deleteVideo, 
    updateVideoMetadata,
    uploadVideoThumbnail,
    getVideoThumbnail,
    deleteVideoThumbnail,
    updateVideoThumbnail,
    getVideoId,
    getUserBySlug,
    getVideosBySlug
} from                              "../apiControllers/controllerVideo.js";
import videoUploadLimiter from      "../apiMiddleware/rateLimit/middlewareRateLimit.js";
import upload from                  "../apiMiddleware/video/middlewareVideo.js";
import validateUserId from          "../apiMiddleware/user/middlewareUserValidateUserId.js";
import validateVideoId from         "../apiMiddleware/video/middlewareVideoValidateVideoId.js";
import syncVideosWithStorage from   "../apiMiddleware/video/middlewareVideoSyncWithStorage.js";

const router = express.Router();

console.log(typeof uploadVideo);            // Harus "function"
console.log(typeof validateUserId);         // Harus "function"
console.log(typeof upload.single);          // Harus "function"

// Content Creator
router.post("/users/:user_id/videos", videoUploadLimiter, uploadVideo);
router.put("/videos/:video_id", updateVideoMetadata);
router.post("/videos/:video_id/thumbnail", validateVideoId, uploadVideoThumbnail);
router.put("/videos/:video_id/thumbnail", validateVideoId, updateVideoThumbnail);
router.get("/videos/:video_id/thumbnail", validateVideoId, getVideoThumbnail);
router.delete("/videos/:video_id/thumbnail", validateVideoId, deleteVideoThumbnail);
router.delete("/videos/:video_id", validateVideoId, deleteVideo);

// VIewer
router.get("/videos", syncVideosWithStorage, getAllVideos);
router.get("/videos/:video_id", validateVideoId, getVideoId);
// Channel
// router.get("/users/slug/:slug", getUserBySlug); // untuk profil publik
router.get("/channels/:slug/profile", getUserBySlug);
// Public: Videos by slug (akses oleh viewer biasa)
router.get("/channels/:slug/videos", syncVideosWithStorage, getVideosBySlug);

export default router; 