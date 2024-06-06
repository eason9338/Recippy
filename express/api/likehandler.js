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

   
    db.beginTransaction((err) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Database transaction failed' });
            return;
        }

        db.query(updateLikeQuery, [postId], (err, results) => {
            if (err) {
                return db.rollback(() => {
                    res.status(500).json({ success: false, message: 'Database update failed' });
                });
            }

            db.query(getLikeQuery, [postId], (err, results) => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).json({ success: false, message: 'Database query failed' });
                    });
                }

                db.commit((err) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({ success: false, message: 'Database commit failed' });
                        });
                    }

                    res.status(200).json({ success: true, like_count: results[0].like_tag });
                });
            });
        });
    });
});

export default router;
