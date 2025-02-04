const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const routesUser = require('./api-routes/routes-user');
const routesVideo = require('./api-routes/routes-video');
const routesCommunityPost = require('./api-routes/routes-community-post');
const app = express();

// Middleware untuk parsing JSON request body
app.use(bodyParser.json()); // untuk parsing JSON request body
// Middleware untuk parsing urlencoded (klo di Postman make x-www-form-urlencoded)
app.use(bodyParser.urlencoded({ extended : true }));

// Middleware untuk akses file yang diunggah
app.use('/uploaded-community-post-photo', express.static(path.join(__dirname, 'uploaded-community-post-photo')));
app.use('/uploaded-video', express.static(path.join(__dirname, 'uploaded-video')));

// Menggunakan routes yang sudah dimodularisasi
app.use('/api/users', routesUser);      // Auetentikasi user
app.use('/api/videos', routesVideo);    // Video 
app.use('/api/community-post', routesCommunityPost);

// Menjalankan server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});