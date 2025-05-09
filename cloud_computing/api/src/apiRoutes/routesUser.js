// import express from "express";
// import {
//     registerUser, 
//     loginUser, 
//     getUserById,
//     deleteUser, 
//     updateUsername,
//     uploadProfilePic, 
//     deleteProfilePic, 
//     updateProfilePic 
// } from                              "../apiControllers/controllerUser.js";
// import uploadProfile from           "../apiMiddleware/user/middlewareUser.js";
// import validateUserBodyRequest from "../apiMiddleware/user/middlewareUserValidateRequest.js";

// const router = express.Router();

// router.post("/users/register", registerUser);
// router.post("/users/login", loginUser);
// router.get("/users/:user_id", getUserById);  // Tambahan route GET
// router.delete("/users/:user_id", deleteUser);
// router.put("/users/:user_id/username", updateUsername);

// // Profile picture
// router.post("/users/:user_id/profile-picture", validateUserBodyRequest, uploadProfile.single("profile_pic"), uploadProfilePic);
// router.put("/users/:user_id/profile-picture", uploadProfile.single("profile_pic"), updateProfilePic);
// router.delete("/users/:user_id/profile-picture", deleteProfilePic);

// export default router;

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
} from                              "../apiControllers/controllerUser.js";
import uploadProfile from           "../apiMiddleware/user/middlewareUser.js";
import validateProfilePicUpload from "../apiMiddleware/user/middleware_userValidateProfilePicUpload.js";
import validateUserId from "../apiMiddleware/user/middlewareUserValidateUserId.js";

const router = express.Router();

router.post("/users/register", registerUser);
router.post("/users/login", loginUser);
router.get("/users/:user_id", getUserById);  // Tambahan route GET
router.delete("/users/:user_id", deleteUser);
router.put("/users/:user_id/username", updateUsername);

// Profile picture
//router.post("/users/:user_id/profile-picture", validateProfilePicUpload, uploadProfile.single("profile_pic"), uploadProfilePic);
// router.post("/users/:user_id/profile-picture", validateProfilePicUpload, validateUserId, uploadProfilePic);
router.post("/users/:user_id/profile-picture", uploadProfilePic);
// router.put("/users/:user_id/profile-picture", uploadProfile.single("profile_pic"), updateProfilePic);
router.put("/users/:user_id/profile-picture", updateProfilePic);
router.delete("/users/:user_id/profile-picture", deleteProfilePic);

export default router;