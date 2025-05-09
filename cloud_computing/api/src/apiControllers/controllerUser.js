import User from "../models/modelsUser.js";
import fs from "fs";
import path from "path";
import Busboy from "busboy";

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


// // POST user profile picture
// const uploadProfilePic = async (req, res) => {
//     const { user_id } = req.params;

//     // Validasi file upload
//     if (!req.file || !req.file.filename) {
//         return res.status(400).json({
//             error: "No profile picture uploaded or file format is invalid",
//         });
//     }

//     const profile_pic = `/upload/uploadedUserPhotoProfile/${req.file.filename}`;

//     try {
//         const user = await User.findByPk(user_id);
//         if (!user) return res.status(404).json({ error: "User not found" });

//         user.profile_pic = profile_pic;
//         await user.save();

//         console.log(`[UPLOAD-PROFILE] User ID: ${user_id}, Profile Picture: ${profile_pic}`);
//         res.status(200).json({ message: "Profile picture uploaded successfully" });
//     } catch (error) {
//         console.error(`[UPLOAD-PROFILE] Error: ${error.message}`);
//         res.status(500).json({ error: error.message });
//     }
// };

// // POST user profile picture
// const uploadProfilePic = async (req, res) => {
//     const { user_id } = req.params;

//     // Validasi file upload
//     if (!req.file || !req.file.filename) {
//         return res.status(400).json({
//             error: "No profile picture uploaded or file format is invalid",
//         });
//     }

//     const baseFolder = path.join("public", "upload", "users", user_id.toString(), "uploadedUserPhotoProfile");
//     if(!fs.existsSync(baseFolder)) {
//         fs.mkdirSync(baseFolder, { recursive: true });
//     }

//     const userPicDir = path.join(process.cwd(), "public", "upload", "users", user_id.toString(), "uploadedUserPhotoProfile");
//     fs.mkdirSync(userPicDir, { recursive: true });  // pastikan folder ada

//     const filename =  `${Date.now()}-${req.file.originalname}` // req.file.filename;
//     const savePath = path.join(userPicDir, filename);

//     fs.writeFileSync(savePath, req.file.buffer);

//     const user_pic_file_url = `/upload/users/${user_id}/uploadedUserPhotoProfile/${filename}`;

//     try {
//         const user = await User.findByPk(user_id);
//         if (!user) return res.status(404).json({ error: "User not found" });

//         user.profile_pic = user_pic_file_url;
//         await user.save();

//         console.log(`[UPLOAD-PROFILE] User ID: ${user_id}, Profile Picture: ${profile_pic}`);
//         res.status(200).json({ message: "Profile picture uploaded successfully" });
//     } catch (error) {
//         console.error(`[UPLOAD-PROFILE] Error: ${error.message}`);
//         res.status(500).json({ error: error.message });
//     }
// };


// const uploadProfilePic = async (req, res) => {
//     const { user_id } = req.params;
  
//     // Validasi ID user terlebih dahulu
//     // if (!user_id || isNaN(user_id)) {
//     //     return res.status(400).json({ error: "Invalid user_id" });
//     // }
  
//     // const user = await User.findByPk(user_id);
//     const user = req.user;
//     // if (!user) {
//     //     return res.status(404).json({ error: "User not found" });
//     // }
  
//     const busboy = Busboy({ headers: req.headers });

//     let fileUploaded = false;
//     let uploadError = null;

    
//     busboy.on('file', (fieldname, file, info) => {
//         const { filename, encoding, mimeType } = info;
//         //const { filename, mimeType } = info;

//         console.log('Fieldname:', fieldname);
//         console.log('Filename:', filename);
//         console.log('Mimetype:', mimeType);

//         if (!mimeType || !mimeType.startsWith('image/')) {
//             uploadError = 'Only image files are allowed';
//             file.resume();
//             return;
//         }

//         const uploadDir = path.join(process.cwd(), 'public', 'upload', 'users', user_id.toString(), 'uploadedUserPhotoProfile');
//         fs.mkdirSync(uploadDir, { recursive: true });

//         const sanitized = filename.replace(/\s+/g, '_');
//         const finalFilename = `${Date.now()}-${sanitized}`;
//         const filePath = path.join(uploadDir, finalFilename);

//         const writeStream = fs.createWriteStream(filePath);
//         file.pipe(writeStream);
//         fileUploaded = true;

//         writeStream.on('finish', async () => {
//             if (uploadError) return;

//             const fileUrl = `/upload/users/${user_id}/uploadedUserPhotoProfile/${finalFilename}`;
//             try {
//                 user.profile_pic = fileUrl;
//                 await user.save();
//                 res.status(200).json({ message: 'Profile picture uploaded', url: fileUrl });
//             } catch (err) {
//                 console.error(`[BUSBOY-DB] ${err.message}`);
//                 res.status(500).json({ error: err.message });
//             }
//         });

//         writeStream.on('error', (err) => {
//             console.error(`[WRITE-ERROR] ${err.message}`);
//             res.status(500).json({ error: 'Error saving file' });
//         });
//     });

//     busboy.on("finish", () => {
//         if (uploadError) {
//             return res.status(400).json({ error: uploadError });
//         }

//         if (!fileUploaded) {
//             return res.status(400).json({ error: "No valid image file uploaded" });
//         }

//         // Jika semua berjalan baik, respons sudah dikirim di writeStream.on('finish')
//     });

//     req.pipe(busboy)
// };

const uploadProfilePic = (req, res) => {
    const user_id = req.params.user_id;
    const busboy = Busboy({ headers: req.headers });

    let fileUploaded = false;
    let uploadError = null;
    let finalFilename = '';
    let fileUrl = '';

    busboy.on('file', async (fieldname, file, info) => {
        const { filename, mimeType } = info;

        if (fieldname !== 'profile_pic' || !mimeType?.startsWith('image/')) {
            uploadError = 'Only image files are allowed';
            file.resume();
            return;
        }

        fileUploaded = true;
        const sanitized = filename.replace(/\s+/g, '_');
        finalFilename = `${Date.now()}-${sanitized}`;
        const uploadDir = path.join(process.cwd(), 'public', 'upload', 'users', user_id, 'uploadedUserPhotoProfile');
        fs.mkdirSync(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, finalFilename);
        const writeStream = fs.createWriteStream(filePath);
        file.pipe(writeStream);

        writeStream.on('finish', async () => {
            if (uploadError) return;

            // Baru query DB di sini, setelah file valid
            try {
                const user = await User.findByPk(user_id);
                if (!user) {
                    return res.status(404).json({ error: "User not found" });
                }

                fileUrl = `/upload/users/${user_id}/uploadedUserPhotoProfile/${finalFilename}`;
                user.profile_pic = fileUrl;
                await user.save();

                return res.status(200).json({ message: 'Profile picture uploaded', url: fileUrl });
            } catch (err) {
                console.error("[BUSBOY-DB]", err.message);
                return res.status(500).json({ error: "Internal server error" });
            }
        });

        writeStream.on('error', (err) => {
            console.error("[WRITE-ERROR]", err.message);
            return res.status(500).json({ error: 'Error saving file' });
        });
    });

    busboy.on('finish', () => {
        if (uploadError) {
            return res.status(400).json({ error: uploadError });
        }
        if (!fileUploaded) {
            return res.status(400).json({ error: "No valid image file uploaded" });
        }
    });

    req.pipe(busboy);
};



// const uploadProfilePic = async (req, res) => {
//     const { user_id } = req.params;
//     const user = req.user;
//     const { filename, mimeType } = req.fileMeta;
//     const buffer = req.fileBuffer;

//     const uploadDir = path.join(process.cwd(), 'public', 'upload', 'users', user_id.toString(), 'uploadedUserPhotoProfile');
//     fs.mkdirSync(uploadDir, { recursive: true });

//     const sanitized = filename.replace(/\s+/g, '_');
//     const finalFilename = `${Date.now()}-${sanitized}`;
//     const filePath = path.join(uploadDir, finalFilename);
//     const fileUrl = `/upload/users/${user_id}/uploadedUserPhotoProfile/${finalFilename}`;

//     try {
//         fs.writeFileSync(filePath, buffer);
//         user.profile_pic = fileUrl;
//         await user.save();

//         res.status(200).json({ message: 'Profile picture uploaded successfully', url: fileUrl });
//     } catch (err) {
//         console.error('[SAVE-FILE] Error:', err.message);
//         res.status(500).json({ error: 'Failed to save profile picture' });
//     }
// };


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


// const updateProfilePic = async (req, res) => {
//     const { user_id } = req.params;
//     const newProfilePicUrl = `/upload/uploadedUserPhotoProfile/${req.file.filename}`;

//     try {
//         const user = await User.findByPk(user_id);
//         if (!user) return res.status(404).json({ error: "User not found" });

//         const oldProfilePicPath = path.join(process.cwd(), "public", user.profile_pic);
//         if (fs.existsSync(oldProfilePicPath)) {
//             fs.unlinkSync(oldProfilePicPath);
//             console.log(`[UPDATE-PROFILE] Old file deleted: ${oldProfilePicPath}`);
//         }

//         user.profile_pic = newProfilePicUrl;
//         await user.save();

//         res.status(200).json({
//             message: "Profile picture updated successfully",
//             profile_pic: newProfilePicUrl,
//         });
//     } catch (error) {
//         console.error(`[UPDATE-PROFILE-ERROR] ${error.message}`);
//         res.status(500).json({ error: error.message });
//     }
// };


// const updateProfilePic = async (req, res) => {
//     const { user_id } = req.params;
//     // const newProfilePicUrl = `/upload/uploadedUserPhotoProfile/${req.file.filename}`;
//      // Buat folder user jika belum ada
//     const userPicDir = path.join(process.cwd(), "public", "upload", "users", user_id.toString(), "uploadedUserPhotoProfile");
//     fs.mkdirSync(userPicDir, { recursive: true });

//     if (!req.file || !req.file.filename) {
//         return res.status(400).json({
//             error: "No profile picture uploaded or file format is invalid",
//         });
//     }

//     try {
//         const user = await User.findByPk(user_id);
//         if (!user) return res.status(404).json({ error: "User not found" });

//         const oldProfilePicPath = path.join(process.cwd(), "public", user.profile_pic.replace(/^\/+/, ""));
//         if (fs.existsSync(oldProfilePicPath)) {
//             fs.unlinkSync(oldProfilePicPath);
//             console.log(`[UPDATE-PROFILE] Old file deleted: ${oldProfilePicPath}`);
//         }

//         const sanitized = req.file.originalname.replace(/|s+/g,"_");
//         const filename = `${Date.now()}-${sanitized}`;
//         const savePath = path.join(userPicDir, filename);
//         fs.writeFileSync(savePath, req.file.buffer);

//         const newProfilePicUrl = `/upload/users/${user_id}/uploadedUserPhotoProfile/${filename}`;
//         user.profile_pic = newProfilePicUrl;
//         await user.save();

//         res.status(200).json({
//             message: "Profile picture updated successfully",
//             profile_pic: newProfilePicUrl,
//         });
//     } catch (error) {
//         console.error(`[UPDATE-PROFILE-ERROR] ${error.message}`);
//         res.status(500).json({ error: error.message });
//     }
// };

const updateProfilePic = async (req, res) => {
    const { user_id } = req.params;
    const busboy = Busboy({ headers: req.headers });

    let uploadError = null;
    let fileUploaded = false;
    let finalFilename = '';

    busboy.on("file", async (fieldname, file, info) => {
        const { filename, mimeType } = info;

        // Validasi file harus image
        if (fieldname !== "profile_pic" || !mimeType?.startsWith("image/")) {
            uploadError = "Only image files are allowed";
            file.resume(); // Abaikan
            return;
        }

        try {
            // Cari user dulu
            const user = await User.findByPk(user_id);
            if (!user) {
                uploadError = "User not found";
                file.resume();
                return;
            }

            const sanitized = filename.replace(/\s+/g, "_");
            finalFilename = `${Date.now()}-${sanitized}`;

            const userPicDir = path.join(
                process.cwd(),
                "public",
                "upload",
                "users",
                user_id.toString(),
                "uploadedUserPhotoProfile"
            );
            fs.mkdirSync(userPicDir, { recursive: true });

            // Hapus file lama kalau ada
            if (user.profile_pic) {
                const oldPath = path.join(
                    process.cwd(),
                    "public",
                    user.profile_pic.replace(/^\/+/, "")
                );
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                    console.log(`[UPDATE-PROFILE] Deleted old: ${oldPath}`);
                }
            }

            const savePath = path.join(userPicDir, finalFilename);
            const writeStream = fs.createWriteStream(savePath);
            file.pipe(writeStream);
            fileUploaded = true;

            writeStream.on("finish", async () => {
                const newProfilePicUrl = `/upload/users/${user_id}/uploadedUserPhotoProfile/${finalFilename}`;
                user.profile_pic = newProfilePicUrl;
                await user.save();

                return res.status(200).json({
                    message: "Profile picture updated successfully",
                    profile_pic: newProfilePicUrl,
                });
            });

            writeStream.on("error", (err) => {
                console.error("[WRITE-ERROR]", err.message);
                return res.status(500).json({ error: "Error saving file" });
            });
        } catch (err) {
            console.error("[UPDATE-PROFILE-ERROR]", err.message);
            return res.status(500).json({ error: err.message });
        }
    });

    busboy.on("finish", () => {
        if (uploadError) {
            return res.status(400).json({ error: uploadError });
        }

        if (!fileUploaded) {
            return res.status(400).json({ error: "No valid image file uploaded" });
        }
    });

    req.pipe(busboy);
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