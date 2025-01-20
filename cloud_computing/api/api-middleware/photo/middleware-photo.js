const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'photo-uploaded/'); // Folder tempat file disimpan
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Nama file unik
    }
});


// Filter untuk memastikan file yang diunggah adalah foto
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)){
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// inisialisasi multer
const upload = multer({ 
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }   // Batas ukuran file: 5 MB
});

module.exports = upload;