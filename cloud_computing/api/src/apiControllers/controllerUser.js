import User from "../models/modelsUser.js";
import fs from "fs";
import path from "path";

// Register user 
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const newUser = await User.create({ username, email, password });

        console.log(`[REGISTER] New user registered: ID = ${newUser.id}, Username = ${username}, Email = ${email}`);
        res.status(201).json({ 
            message: "Register successful", 
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
            } 
        });
    } catch (error) {
        console.log(`[REGISTER-ERROR] Failed to register user: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({
            where: { email, password },
            attributes: ["id", "username", "email"]
        });

        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        console.log(`[LOGIN] User logged in: ID = ${user.id}, Username = ${user.username}, Email = ${user.email}`);
        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        console.error(`[LOGIN-ERROR] Failed to process login: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

const getUserById = async (req, res) => {
    const { user_id } = req.params;

    try {
        const user = await User.findByPk(user_id, {
            attributes: ['id', 'username', 'email', 'profile_pic']
        });

        if (!user) return res.status(404).json({ error: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        console.error(`[GET-USER-ERROR] ${error.message}`);
        res.status(500).json({ error: "Failed to get user details" });
    }
};


const deleteUser = async (req, res) => {
    const { user_id } = req.params;

    try {
        const user = await User.findByPk(user_id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        await user.destroy();

        console.log(`[DELETE-USER] User Deleted: ID = ${user.id}, Username = ${user.username}, Email = ${user.email}`);
        res.status(200).json({ 
            message: "User deleted successfully",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            }
        });
    } catch (error) {
        console.error(`[DELETE-USER] Failed to delete user: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

const updateUsername = async (req, res) => {
    const { user_id } = req.params;
    const { username } = req.body;

    if (!username || username.trim() === "") {
        return res.status(400).json({ error: "Username is required" });
    }

    try {
        const user = await User.findByPk(user_id);
        if (!user) return res.status(404).json({ error: "User not found" });

        user.username = username;
        await user.save();

        res.status(200).json({ message: "Username updated successfully", username });
    } catch (error) {
        console.error(`[UPDATE-USERNAME-ERROR] ${error.message}`);
        res.status(500).json({ error: "Failed to update username" });
    }
};

// POST user profile picture
const uploadProfilePic = async (req, res) => {
    const { user_id } = req.params;

    // Validasi file upload
    if (!req.file || !req.file.filename) {
        return res.status(400).json({
            error: "No profile picture uploaded or file format is invalid",
        });
    }

    const profile_pic = `/upload/uploadedUserPhotoProfile/${req.file.filename}`;

    try {
        const user = await User.findByPk(user_id);
        if (!user) return res.status(404).json({ error: "User not found" });

        user.profile_pic = profile_pic;
        await user.save();

        console.log(`[UPLOAD-PROFILE] User ID: ${user_id}, Profile Picture: ${profile_pic}`);
        res.status(200).json({ message: "Profile picture uploaded successfully" });
    } catch (error) {
        console.error(`[UPLOAD-PROFILE] Error: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

// GET user profile picter
const getUserProfile = async (req, res) => {
    const { user_id } = req.params;

    try {
        const user = await User.findByPk(user_id, {
            attributes: ["id", "username", "email", "profile_pic", "created_at"]
        });

        if (!user) return res.status(404).json({ error: "User not found" });

        console.log(`[GET-USER] User ID: ${user.id}, Username: ${user.username}`);
        res.status(200).json(user);
    } catch (error) {
        console.error(`[GET-USER-ERROR] ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};



const deleteProfilePic = async (req, res) => {
    const { user_id } = req.params;

    try {
        const user = await User.findByPk(user_id);
        if (!user) return res.status(404).json({ error: "User not found" });

        const profilePicPath = path.join(process.cwd(), "public", user.profile_pic);

        // Hapus file jika ada
        if (fs.existsSync(profilePicPath)) {
            fs.unlinkSync(profilePicPath);
            console.log(`[DELETE-PROFILE] File deleted: ${profilePicPath}`);
        }

        user.profile_pic = null;
        await user.save();

        res.status(200).json({ message: "Profile picture deleted successfully" });
    } catch (error) {
        console.error(`[DELETE-PROFILE-ERROR] ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};


const updateProfilePic = async (req, res) => {
    const { user_id } = req.params;
    const newProfilePicUrl = `/upload/uploadedUserPhotoProfile/${req.file.filename}`;

    try {
        const user = await User.findByPk(user_id);
        if (!user) return res.status(404).json({ error: "User not found" });

        const oldProfilePicPath = path.join(process.cwd(), "public", user.profile_pic);
        if (fs.existsSync(oldProfilePicPath)) {
            fs.unlinkSync(oldProfilePicPath);
            console.log(`[UPDATE-PROFILE] Old file deleted: ${oldProfilePicPath}`);
        }

        user.profile_pic = newProfilePicUrl;
        await user.save();

        res.status(200).json({
            message: "Profile picture updated successfully",
            profile_pic: newProfilePicUrl,
        });
    } catch (error) {
        console.error(`[UPDATE-PROFILE-ERROR] ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};


export {
    registerUser, 
    loginUser, 
    getUserById,
    deleteUser, 
    updateUsername,
    uploadProfilePic, 
    getUserProfile, 
    deleteProfilePic,
    updateProfilePic 
};