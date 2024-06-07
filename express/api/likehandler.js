import { Router } from 'express';
import db from '../config/db.js';

const router = Router();

router.post('/post/like',async (req, res) => {
    const {postId} = req.body;

    if (!postId) {
        res.status(400).json({ success: false, message: 'Post ID is required' });
        return;
    }
    //讚加一
    try{
        const updateLikeQuery = `
            UPDATE post 
            SET like_tag = like_tag + 1 
            WHERE post_id = ?
        `;
        const [likeResult, fields] = await db.promise().query(updateLikeQuery, [post_id]);
            res.status(200).json({ success: true, message: 'like count updated' });

    }catch (err) {
        console.error('Error fetching post: ', err);
        res.status(500).send('Server error');
    }
});

export default router;
