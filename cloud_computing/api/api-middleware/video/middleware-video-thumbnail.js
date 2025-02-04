const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploaded-video-thumbnail')); // Folder penyimpanan thumbnail
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Nama file dengan timestamp
    },
});

// Filter untuk memastikan hanya file gambar yang diunggah
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG, JPG, adn PNG files are allowed!'), false);
    }
};

// Konfigurasi multer
const uploadThumbnail = multer({ 
    storage: storage,
    fileFilter: fileFilter,
});

module.exports = uploadThumbnail;