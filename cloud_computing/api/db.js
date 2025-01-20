const mysql = require('mysql2');

// konfigurasi koneksi database
const pool = mysql.createPool({
    host        : 'localhost',
    user        : 'root',
    password    : '',
    database    : 'sosial_media'
});

module.exports = pool.promise();