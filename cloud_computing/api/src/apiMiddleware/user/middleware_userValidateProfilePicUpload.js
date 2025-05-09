// import busboy from 'busboy';

// const validateProfilePicUpload = (req, res, next) => {
//     const contentType = req.headers['content-type'] || '';

//     // Cek apakah request menggunakan form-data
//     if (!contentType.includes('multipart/form-data')) {
//         return res.status(400).json({ error: 'Invalid content type' });
//     }

//     const bb = busboy({ headers: req.headers });
//     let isImage = false;

//     bb.on('file', (fieldname, file, { mimetype }) => {
//         if (fieldname === 'profile_pic' && mimetype && mimetype.startsWith('image/')) {
//             isImage = true;
//         } else {
//             file.resume(); // discard file
//         }
//     });
  
//     bb.on('finish', () => {
//         if (!isImage) {
//             return res.status(400).json({ error: 'No valid image file uploaded' });
//         }
//         next();
//     });

//     req.pipe(bb);
// };

// export default validateProfilePicUpload;

// import busboy from 'busboy';

// const validateProfilePicUpload = (req, res, next) => {
//     const contentType = req.headers['content-type'] || '';

//     // Cek apakah request menggunakan form-data
//     if (!contentType.includes('multipart/form-data')) {
//         return res.status(400).json({ error: 'Invalid content type' });
//     }

//     const bb = busboy({ headers: req.headers });
//     let isImage = false;

//     bb.on('file', (fieldname, file, info) => {
//         const { mimeType } = info;

//         if (fieldname === 'profile_pic' && mimeType && mimeType.startsWith('image/')) {
//             isImage = true;
//         } else {
//             file.resume(); // discard file
//         }
//     });

//     bb.on('finish', () => {
//         if (!isImage) {
//             return res.status(400).json({ error: 'No valid image file uploaded' });
//         }
//         next();
//     });

//     req.pipe(bb);
// };


// const validateProfilePicUpload = (req, res, next) => {
//     const contentType = req.headers['content-type'] || '';

//     if (!contentType.includes('multipart/form-data')) {
//         return res.status(400).json({ error: 'Invalid content type' });
//     }

//     const bb = busboy({ headers: req.headers });
//     let isImage = false;

//     bb.on('file', (fieldname, file, info) => {
//         console.log('File event triggered');
//         const { filename, mimeType } = info;
//         console.log('fieldname:', fieldname);
//         console.log('filename:', filename);
//         console.log('mimeType:', mimeType);

//         if (fieldname === 'profile_pic' && mimeType && mimeType.startsWith('image/')) {
//             isImage = true;
//         } else {
//             file.resume();
//         }
//     });

//     bb.on('finish', () => {
//         console.log('Busboy finish triggered');
//         if (!isImage) {
//             console.log('No valid image file uploaded');
//             return res.status(400).json({ error: 'No valid image file uploaded' });
//         }

//         console.log('Valid image file uploaded, calling next()');
//         next();
//     });

//     bb.on('error', (err) => {
//         console.error('Busboy error:', err);
//         res.status(500).json({ error: 'Upload error' });
//     });

//     req.pipe(bb);
// };


import busboy from 'busboy';

const validateProfilePicUpload = (req, res, next) => {
    const contentType = req.headers['content-type'] || '';

    if (!contentType.includes('multipart/form-data')) {
        return res.status(400).json({ error: 'Invalid content type' });
    }

    const bb = busboy({ headers: req.headers });
    let isImage = false;

    req.fileBuffer = null;
    req.fileMeta = null;

    bb.on('file', (fieldname, file, info) => {
        const { filename, mimeType } = info;

        if (fieldname === 'profile_pic' && mimeType && mimeType.startsWith('image/')) {
            isImage = true;
            const chunks = [];
            file.on('data', chunk => chunks.push(chunk));
            file.on('end', () => {
                req.fileBuffer = Buffer.concat(chunks);
                req.fileMeta = { filename, mimeType };
            });
        } else {
            file.resume(); // Buang file tidak valid
        }
    });

    bb.on('finish', () => {
        if (!isImage || !req.fileBuffer) {
            return res.status(400).json({ error: 'No valid image file uploaded' });
        }
        next();
    });

    bb.on('error', err => {
        console.error('[BUSBOY-VALIDATION] Error:', err.message);
        res.status(500).json({ error: 'Upload validation failed' });
    });

    req.pipe(bb);
};


export default validateProfilePicUpload;
