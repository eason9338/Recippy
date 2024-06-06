import { Router } from 'express';
import db from '../config/db.js';

const router = Router();

router.post('/post/:postId/like', (req, res) => {
    const postId = req.params.postId;

    if (!postId) {
        res.status(400).json({ success: false, message: 'Post ID is required' });
        return;
    }
    //讚加一
    const updateLikeQuery = `
        UPDATE post 
        SET like_tag = like_tag + 1 
        WHERE post_id = ?
    `;

    const getLikeQuery = `
        SELECT like_tag 
        FROM post 
        WHERE post_id = ?
    `;
    db.query(updateLikeQuery, [postId], (err, updateResults) => {
        if (err) {
            console.error('Error updating like count: ', err);
            res.status(500).json({ success: false, message: 'Error updating like count' });
            return;
        }

        db.query(getLikeQuery, [postId], (err, likeResults) => {
            if (err) {
                console.error('Error fetching like count: ', err);
                res.status(500).json({ success: false, message: 'Error fetching like count' });
                return;
            }

            res.status(200).json({ success: true, like_count: likeResults[0].like_tag });
        });
    });
});

export default router;
