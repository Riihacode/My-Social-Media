const validateUserBodyRequest = (req, res, next) => {
    const { user_id} = req.params;

    // Vqlidasi user_id
    if(!user_id || isNaN(user_id)) {
        return res.status(400).json({ error: "Invalid or missing user_id in URL" });
    }

    // validasi file gambar
    if (!req.file || !req.file.originalname) {
        return res.status(400).json({ error: "No profile picture file uploaded" });
    }

    next();
};

export default validateUserBodyRequest;