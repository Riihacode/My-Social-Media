import express from "express";
import {
    registerUser, 
    loginUser, 
    getUserById,
    deleteUser, 
    updateUsername,
    uploadProfilePic, 
    deleteProfilePic, 
    updateProfilePic 
} from "../apiControllers/controllerUser.js";

const router = express.Router();

router.post("/users/register", registerUser);
router.post("/users/login", loginUser);
router.get("/users/:user_id", getUserById);  // Tambahan route GET
router.delete("/users/:user_id", deleteUser);
router.put("/users/:user_id/username", updateUsername);

// Profile picture
router.post("/users/:user_id/profile-picture", uploadProfilePic);
router.put("/users/:user_id/profile-picture", updateProfilePic);
router.delete("/users/:user_id/profile-picture", deleteProfilePic);

export default router;