const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const routesUser = require('./api-routes/routes-user');
const routesVideo = require('./api-routes/routes-video');
const routesPhoto = require('./api-routes/routes-photo');
const app = express();

// Middleware untuk parsing JSON request body
app.use(bodyParser.json()); // untuk parsing JSON request body
// Middleware untuk parsing urlencoded (klo di Postman make x-www-form-urlencoded)
app.use(bodyParser.urlencoded({ extended : true }));

// Middleware untuk akses file yang diunggah
app.use('/photo-uploaded', express.static(path.join(__dirname, 'photo-uploaded')));
app.use('/video-uploaded', express.static(path.join(__dirname, 'video-uploaded')));

// Menggunakan routes yang sudah dimodularisasi
app.use('/api/users', routesUser);
app.use('/api/videos', routesVideo);
app.use('/api/photos', routesPhoto);

// Menjalankan server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});