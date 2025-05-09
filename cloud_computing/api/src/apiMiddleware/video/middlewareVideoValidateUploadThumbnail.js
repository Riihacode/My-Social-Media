import Video from '../../models/modelsVideo.js';

const validateVideoThumbnailUpload = async (req, res, next) => {
    const { video_id } = req.params;

    if (!video_id || isNaN(video_id)) {
        return res.status(400).json({ error: 'Invalid video ID' });
    }

    try {
        const video = await Video.findByPk(video_id);
        if (!video) {
            return res.status(404).json({ error: 'Video not found' });
        }

        if (video.thumbnail_url) {
            return res.status(400).json({
                error: 'Thumbnail already uploaded. Use update endpoint instead.',
            });
        }

        req.video = video; // Simpan ke req
        next();
    } catch (error) {
        console.error('[VALIDATE-THUMBNAIL] Error:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export default validateVideoThumbnailUpload;
