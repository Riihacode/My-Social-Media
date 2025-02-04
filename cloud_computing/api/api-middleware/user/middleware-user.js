const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploaded-user-photo-profile');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('File harus berupa gambar (jpg, png, jpeg)'));
    }
};

// Middleware multer
const uploadProfilePic = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 },  //Batas ukuran file 2 MB
    fileFilter: fileFilter,
});

module.exports = uploadProfilePic;