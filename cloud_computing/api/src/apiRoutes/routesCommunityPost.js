import express from "express";
import {
    uploadCommunityPostPhoto, 
    getCommunityPostPhotosByUser, 
    getCommunityPostPhotoById,
    deleteCommunityPostPhoto,
    getCommunityPostsBySlug
} from                                  "../apiControllers/controllerCommunityPost.js";

const router = express.Router();

router.post("/photos", uploadCommunityPostPhoto);
// router.get("/users/:user_id/photos", getCommunityPostPhotosByUser);
router.get("/channels/:slug/community", getCommunityPostsBySlug);
router.get("/photos/:photo_id", getCommunityPostPhotoById);
router.delete("/photos/:photo_id", deleteCommunityPostPhoto);

export default router;