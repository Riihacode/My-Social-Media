const validateVideoMetadata = (req, res, next) => {
    const { video_id, title, description } = req.body;

    // validasi input data
    if (!title && !description) {
        return res.status(400).json({ error: "Required fields are missing" });
    }

    // Validasi awal sebelum operasi (menghindari operasi yang tidak perlu dengan validasi input)
    if (!video_id || isNaN(video_id)) {
        return res.status(400).json({ error: "Invalid video ID" });
    }
        next();
    };

export default validateVideoMetadata;