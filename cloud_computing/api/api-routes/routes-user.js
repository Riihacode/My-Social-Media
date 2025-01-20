const express = require('express');
const { 
    registerUser, 
    loginUser, 
    deleteUser, 
    uploadProfilePic, 
    deleteProfilePic, 
    updateProfilePic 
} = require('../api-controllers/controller-user');
const router = express.Router();
const uploadProfile = require('../api-middleware/user/middleware-user');

// Endpoint register dan login
router.post('/register', registerUser);
router.post('/login', loginUser);
router.delete('/:user_id', deleteUser);
router.post('/profile-pic/:user_id', uploadProfile.single('profile_pic'), uploadProfilePic);
router.delete('/delete-profile/:user_id', deleteProfilePic);
router.put('/update-profile/:user_id', uploadProfile.single('profile_pic'), updateProfilePic);

module.exports = router;