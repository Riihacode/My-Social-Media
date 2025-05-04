import fs from "fs";
import path from "path";
import { db } from "../../configDatabase/database.js";

const syncVideosWithStorage = async (req, res, next) => {
    try {
        // Ambil semua file di folder penyimpanan
        const videoFiles = fs.readdirSync(path.join(process.cwd(), 'public', 'upload', 'uploadedVideo'));

        // Ambil semua video dari database
        const [videos] = await db.query(
            `SELECT id, video_url FROM videos`
        );

        let deleteCount = 0;

        for (let video of videos) {
            const videoFileName = video.video_url.split('/').pop(); // Ambil nama dari URL

            // Jika file tidak ada di penyimpanan, hapus dari database
            if (!videoFiles.includes(videoFileName)) {
                await db.query(
                    `DELETE FROM videos WHERE id = ?`, 
                    [video.id]
                );

                console.log(`[SYNC-DELETE] Video ID ${video.id} deleted because the file was not found`);
                //res.status(200).json({ message: `Video ID ${video.id} was deleted because the file was missing` });
                deleteCount++;
            }
        }

        console.log(`[SYNC-COMPLETED] ${deleteCount} videos deleted from database.`);
        next(); // Lanjutkan ke getVideosByUser
    } catch (error) {
        console.error(`[SYNC-FAILED] Failed to sync videos: ${error.message}`);
        // res.status(500).json({ error: `Failed to sync videos: ${error.message}` });
        next(); // Lanjutkan ke getVideosByUser meskipun terjadi error
    }
};

export default syncVideosWithStorage;