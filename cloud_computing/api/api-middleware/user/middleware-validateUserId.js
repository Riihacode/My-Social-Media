const db = require('../../db');

const validateUserId = async (req, res, next) => {
    // const { user_id } = req.params;
    const user_id = req.body.user_id || req.params.user_id;

    if (!user_id || isNaN(user_id)){
        return res.status(400).json({ error: "Invalid user ID" });
    }

    try {
        // Validasi eksistensi user_id
        const [user] = await db.query(
            `SELECT id FROM users WHERE id = ?`,
            [user_id]
        );

        if (user.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        next();
    } catch (error) {
        console.error(`[VALIDATE-USER-ID-ERROR] Failed to validate user ID: ${error.message}`);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = validateUserId;