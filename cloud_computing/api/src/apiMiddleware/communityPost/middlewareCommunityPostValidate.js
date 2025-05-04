const validateCommunityPostBodyRequest = (req, res, next) => {
    const { user_id, title, description } = req.body;

    // validasi input data
    if (!user_id || !title || !description) {
        return res.status(400).json({ error: "Required fields are missing" });
    }

    if (isNaN(user_id)) {
        return res.status(400).json({ error: "Invalid user ID" });
    }

    // validasi file video 
    if (!req.file) {
        return res.status(400).json({ error: "No video file uploaded" });
    }

    next();
};

export default validateCommunityPostBodyRequest;