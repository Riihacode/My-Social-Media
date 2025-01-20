const db = require('../db');
const fs = require('fs');
const path = require('path');

// Register user 
const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const [result] = await db.query (
            `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`,
            [username, email, password]
        );

        console.log(`[REGISTER] New user registered: ID = ${result.insertId}, Username = ${username}, Email = ${email}`);
        res.status(201).json({ 
            message: "Register successful", 
            user: {
                id: result.insertId,
                username: username,
                email: email,       // Implementasi teori Trailing Comma (opsional)
            } 
        });
    } catch (error) {
        console.log(`[REGISTER-ERROR] Failed to register user: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
}


// Login User
const loginUser =  async (req, res) => {
    const { email, password } = req.body;

    try {
         // Cari pengguna berdasarkan email dan password
         const [user] = await db.query(
            `SELECT id, username, email FROM users WHERE email = ? AND password = ?`,
            [email, password]
         );

         if(user.length === 0){
            // Jika pengguna tidak ditemukan 
            return res.status(401).json({ error: "Invalid email or password" });
         }

         // Login berhasil
         console.log(`[LOGIN] User logged in: ID = ${user[0].id}, Username = ${user[0].username}, Email = ${user[0].email}`);  // Log pengguna yang berhasil login
         res.status(200).json({ 
            message: "Login successful", 
            user: user[0] 
        });
    } catch (error) {
        console.error(`[LOGIN-ERROR] Failed to process login: ${error.message}`); 
        res.status(500).json({ error: error.message});
    }
};

const deleteUser = async(req, res) => {
    const { user_id } = req.params;

    try {
        // Cari user di database
        const [users] = await db.query(
            `SELECT id, username, email FROM users WHERE id = ?`,
            [user_id]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        // Menyimpan detail user sebelum dihapus agar dapat digunakan untuk tracking logging prosess
        const userToDelete = users[0];

        // Hapus user dari database
        await db.query(
            `DELETE FROM users WHERE id = ?`,
            [user_id]
        );

        console.log(`[DELETE-USER] User Deleted from database: ID = ${userToDelete.id}, Username = ${userToDelete.username}, Email = ${userToDelete.email}`);
        res.status(200).json({ 
            message: "User deleted successfully",
            user: {
                user: userToDelete.id,
                username: userToDelete.username,
                email: userToDelete.email,
            } 
        });
    } catch (error) {
        console.error(`[DELETE-USER] Failed to delete user: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};


// POST user profile picture
const uploadProfilePic = async (req, res) => {
    const { user_id } = req.body ;
    const profile_pic = `/profile-uploaded/${req.file.filename}`; // URL file photo profile
    
    try {
        // Update kolom profile_pic di tabel users
        await db.query(
            `UPDATE users SET profile_pic = ? WHERE id = ?`,
            [profile_pic, user_id]
        );

        console.log(`[UPLOAD-PROFILE] User ID: ${user_id}, Profile Picture: ${profile_pic}`);
        res.status(200).json({ message: "Profile picture uploaded successfully" });
    } catch (error) {
        console.error(`[UPLOAD-PROFILE] Failed to upload profile picture: ${error.message}`);
        res.status(500).json({ error: error.message });
    };
};


// GET user profile picter
const getUserProfile = async (req, res) => {
    const { user_id } = req.params;

    try {
        const [user] = await db.query(
            `SELECT id, username, email, profile_pic, created_at FROM users WHERE id = ?`,
            [user_id]
        );

        if ( user.length === 0 ) {
            return res.status(404).json({ error: "User not found" });
        }

        console.log(`[GET-USER] User ID: ${user[0].id}, Username: ${user[0].username}`);
        res.status(200).json(user[0]);
    } catch (error) {
        console.error(`[GET-USER-ERROR] Failed to get user profile: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};


const deleteProfilePic = async (req, res) => {
    const { user_id } = req.params;

    try {
        // Cari file foto profile di database
        const [users] = await db.query(
            `SELECT profile_pic FROM users WHERE id = ?`,
            [user_id]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const profilePicPath = path.join(__dirname, '..', users[0].profile_pic);

        // Hapus file fisik jika ada
        if (fs.existsSync(profilePicPath)) {
            fs.unlinkSync(profilePicPath);
            console.log(`[DELETE-PROFILE] File deleted: ${profilePicPath}`);
        }

        // Update database untuk menghapus referensi foto profil
        await db.query(
            `UPDATE users SET profile_pic = NULL WHERE id = ?`,
            [user_id]
        );

        res.status(200).json({ message: 'Profile picture deleted successfully' });
    } catch (error) {
        console.error(`[DELETED-PROFILE-ERROR] Failed to delete profile picture: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};


const updateProfilePic = async (req, res) => {
    const { user_id } = req.params;
    const newProfilePicUrl = `/profile-uploaded/${req.file.filename}`;  // File baru yang diunggah

    try {
        // Cari file foto profil lama di database
        const [users] = await db.query(
            `SELECT profile_pic FROM users WHERE id = ?`,
            [user_id]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const oldProfilePicPath = path.join(__dirname, '..', users[0].profile_pic);

        // Hapus file lama jika ada
        if (fs.existsSync(oldProfilePicPath)) {
            fs.unlinkSync(oldProfilePicPath);
            console.log(`[UPDATE-PROFILE] Old file deleted: ${oldProfilePicPath}`);
        }

        // Update database dengan file baru
        await db.query(
            `UPDATE users SET profile_pic = ? WHERE id = ?`,
            [newProfilePicUrl, user_id]
        );

        console.log(`[UPDATE-PROFILE] User ID: ${user_id}, New File: ${newProfilePicUrl}`);
        res.status(200).json({
            message: 'Profile picture updated successfully',
            profile_pic: newProfilePicUrl,
        });
    } catch (error) {
        console.error(`[UPDATE-PROFILE-ERROR] Failed to update profile picture: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { 
    registerUser, 
    loginUser, 
    deleteUser, 
    uploadProfilePic, 
    getUserProfile, 
    deleteProfilePic, 
    updateProfilePic 
};