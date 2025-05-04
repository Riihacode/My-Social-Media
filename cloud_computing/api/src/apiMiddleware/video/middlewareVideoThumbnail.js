// import multer from "multer";
// import path from "path";

// // Konfigurasi penyimpanan file
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, path.join(process.cwd(), 'public', 'upload', 'uploadedVideoThumbnail'));
//     },
//     filename: (req, file, cb) => {
//         const sanitizedFilename = file.originalname.replace(/\s+/g, "_"); // Ganti spasi dengan "_"
//         cb(null, Date.now() + '-' + sanitizedFilename); // Nama file dengan timestamp
//     },
// });

// // Filter untuk memastikan hanya file gambar yang diunggah
// const fileFilter = (req, file, cb) => {
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
//         cb(null, true);
//     } else {
//         cb(new Error('Only JPEG, JPG, adn PNG files are allowed!'), false);
//     }
// };

// // Konfigurasi multer
// const uploadThumbnail = multer({ 
//     storage: storage,
//     fileFilter: fileFilter,
// });

// export default uploadThumbnail;

import multer from "multer";

// Gunakan memoryStorage agar file tidak langsung disimpan ke disk
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG, JPG, and PNG files are allowed!'), false);
    }
};

const uploadThumbnail = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Max 5 MB
});

export default uploadThumbnail;
