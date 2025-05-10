import User from "../models/modelsUser.js";
import fs from "fs";
import path from "path";
import Busboy from "busboy";
import slugify from "slugify";

// async function registerUser(req, res) {
//     const { username, email, password } = req.body;

//     try {
//         const newUser = await User.create({ username, email, password });

//         console.log(`[REGISTER] New user registered: ID = ${newUser.id}, Username = ${username}, Email = ${email}`);
//         res.status(201).json({ 
//             message: "Register successful", 
//             user: {
//                 id: newUser.id,
//                 username: newUser.username,
//                 email: newUser.email,
//             } 
//         });
//     } catch (error) {
//         console.log(`[REGISTER-ERROR] Failed to register user: ${error.message}`);
//         res.status(500).json({ error: error.message });
//     }
// }

async function registerUser(req, res) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        // Buat slug awal
        let baseSlug = slugify(username, { lower: true, strict: true });

        // Pastikan slug unik
        let slug = baseSlug;
        let counter = 1;
        while (await User.findOne({ where: { slug } })) {
            slug = `${baseSlug}-${counter++}`;
        }

        // Simpan user baru
        const newUser = await User.create({
            username,
            slug,
            email,
            password
        });

        console.log(`[REGISTER] New user: ${username} -> slug: ${slug}`);
        res.status(201).json({
            message: "Register successful",
            user: {
                id: newUser.id,
                username: newUser.username,
                slug: newUser.slug,
                email: newUser.email,
            }
        });

    } catch (error) {
        console.error("[REGISTER ERROR]", error.message);
        res.status(500).json({ error: error.message });
    }
}

async function loginUser(req, res) {
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
}

async function getUserById(req, res) {
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
}

async function deleteUser(req, res) {
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
}

async function updateUsername(req, res) {
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
}

async function uploadProfilePic(req, res) {
    const user_id = req.params.user_id;

    // ✅ Validasi awal: pastikan content-type ada dan multipart
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.startsWith('multipart/form-data')) {
        return res.status(400).json({ error: "Invalid or missing Content-Type. Expected multipart/form-data" });
    }

    const busboy = Busboy({ headers: req.headers });

    let fileBuffer = [];
    let filename = "";
    let fileReceived = false;
    let uploadError = null;

    const parseForm = () =>
        new Promise((resolve, reject) => {
            busboy.on("file", (fieldname, file, info) => {
                const { filename: fname, mimeType } = info;

                if (fieldname !== "profile_pic" || !mimeType.startsWith("image/")) {
                    uploadError = "Only image files are allowed";
                    file.resume();
                    return;
                }

                filename = fname;
                fileReceived = true;
                file.on("data", (chunk) => fileBuffer.push(chunk));
            });

            busboy.on("finish", resolve);
            busboy.on("error", reject);
        });

    req.pipe(busboy);

    try {
        await parseForm();

        if (uploadError) {
            return res.status(400).json({ error: uploadError });
        }

        if (!fileReceived) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.profile_pic) {
            return res.status(409).json({
                error: "Profile picture already exists."
            });
        }

        const sanitized = filename.replace(/\s+/g, "_");
        const finalFilename = `${Date.now()}-${sanitized}`;
        const uploadDir = path.join(process.cwd(), "public", "upload", "users", user_id, "uploadedUserPhotoProfile");
        fs.mkdirSync(uploadDir, { recursive: true });

        const savePath = path.join(uploadDir, finalFilename);
        const fileUrl = `/upload/users/${user_id}/uploadedUserPhotoProfile/${finalFilename}`;
        fs.writeFileSync(savePath, Buffer.concat(fileBuffer));

        user.profile_pic = fileUrl;
        await user.save();

        return res.status(200).json({ message: "Profile picture uploaded", url: fileUrl });
    } catch (err) {
        console.error("[UPLOAD-PROFILE-ERROR]", err.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}

async function getUserProfile(req, res) {
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
}

async function deleteProfilePic(req, res) {
    const { user_id } = req.params;

    try {
        const user = await User.findByPk(user_id);
        if (!user) return res.status(404).json({ error: "User not found" });

        const profilePicPath = path.join(process.cwd(), "public", user.profile_pic);

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
}

async function updateProfilePic(req, res) {
    const user_id = req.params.user_id;

    // ✅ Validasi Content-Type terlebih dahulu
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.startsWith('multipart/form-data')) {
        return res.status(400).json({ error: "Invalid or missing Content-Type. Expected multipart/form-data" });
    }

    const busboy = Busboy({ headers: req.headers });

    let fileBuffer = [];
    let filename = "";
    let fileReceived = false;
    let uploadError = null;

    const parseForm = () =>
        new Promise((resolve, reject) => {
            busboy.on("file", (fieldname, file, info) => {
                const { filename: fname, mimeType } = info;

                if (fieldname !== "profile_pic" || !mimeType.startsWith("image/")) {
                    uploadError = "Only image files are allowed";
                    file.resume();
                    return;
                }

                filename = fname;
                fileReceived = true;
                file.on("data", (chunk) => fileBuffer.push(chunk));
            });

            busboy.on("finish", resolve);
            busboy.on("error", reject);
        });

    req.pipe(busboy);

    try {
        await parseForm();

        if (uploadError) return res.status(400).json({ error: uploadError });
        if (!fileReceived) return res.status(400).json({ error: "No file uploaded" });

        const user = await User.findByPk(user_id);
        if (!user) return res.status(404).json({ error: "User not found" });

        // Hapus foto lama jika ada
        if (user.profile_pic) {
            const oldPath = path.join(process.cwd(), "public", user.profile_pic.replace(/^\/+/, ""));
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        const sanitized = filename.replace(/\s+/g, "_");
        const finalFilename = `${Date.now()}-${sanitized}`;
        const uploadDir = path.join(process.cwd(), "public", "upload", "users", user_id, "uploadedUserPhotoProfile");
        fs.mkdirSync(uploadDir, { recursive: true });

        const savePath = path.join(uploadDir, finalFilename);
        const newProfilePicUrl = `/upload/users/${user_id}/uploadedUserPhotoProfile/${finalFilename}`;
        fs.writeFileSync(savePath, Buffer.concat(fileBuffer));

        user.profile_pic = newProfilePicUrl;
        await user.save();

        return res.status(200).json({
            message: "Profile picture updated successfully",
            profile_pic: newProfilePicUrl,
        });
    } catch (err) {
        console.error("[UPDATE-PROFILE-ERROR]", err.message);
        return res.status(500).json({ error: "Internal server error" });
    }
}

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