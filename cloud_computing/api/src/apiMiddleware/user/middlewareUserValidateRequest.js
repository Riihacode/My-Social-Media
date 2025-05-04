const validateUserBodyRequest = (req, res, next) => {
    const { username, email, password } = req.body;

    // validasi input data
    if (!username || !email || !password) {
        return res.status(400).json({ error: "Required fields are missing" });
    } else {
        next();
    }
};

export default validateUserBodyRequest;