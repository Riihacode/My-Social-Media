// import multer from "multer";
// import path from "path";

// // Konfigurasi penyimpanan file
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/upload/uploadedUserPhotoProfile');
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname));
//     }
// });

// const fileFilter = (req, file, cb) => {
//     if (file.mimetype.startsWith('image/')) {
//         cb(null, true);
//     } else {
//         cb(new Error('File harus berupa gambar (jpg, png, jpeg)'));
//     }
// };

// // Middleware multer
// const uploadProfilePic = multer({
//     storage: storage,
//     limits: { fileSize: 2 * 1024 * 1024 },  //Batas ukuran file 2 MB
//     fileFilter: fileFilter,
// });

// export default uploadProfilePic;

import multer from "multer";

// gunakan memoryStorage agar tidak langsung tulis ke disk
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowed = ["image/jpeg", "image/jpg", "image/png"];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPG, JPEG, PNG allowed"), false);
    }
};

const uploadProfile = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

export default uploadProfile;
