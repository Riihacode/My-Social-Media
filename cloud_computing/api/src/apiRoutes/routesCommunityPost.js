import express from "express";
import {
    uploadCommunityPostPhoto, 
    getCommunityPostPhotosByUser, 
    getCommunityPostPhotoById,
    deleteCommunityPostPhoto 
} from                                  "../apiControllers/controllerCommunityPost.js";
import upload from                      "../apiMiddleware/communityPost/middlewareCommunityPostPhoto.js";
import validateCommunityPostBodyRequest from "../apiMiddleware/communityPost/middlewareCommunityPostValidate.js";

const router = express.Router();

router.post("/photos", upload.single("post_photo_url"), validateCommunityPostBodyRequest, uploadCommunityPostPhoto);
router.get("/users/:user_id/photos", getCommunityPostPhotosByUser);
router.get("/photos/:photo_id", getCommunityPostPhotoById);
router.delete("/photos/:photo_id", deleteCommunityPostPhoto);

export default router;