import { Router } from 'express';
import db from '../config/db.js';

const router = Router();

// 拿到點讚狀態（有沒有點讚） 以及點讚數量
router.get('/post/like-status/:post_id/:user_id', async (req, res) => {
    const postId = req.params.post_id;
    const userId = req.params.user_id;  

    try {
        const [likeResult] = await db.promise().query('SELECT like_tag FROM post WHERE post_id = ?', [postId]);
        const [userLikeResult] = await db.promise().query('SELECT * FROM user_like WHERE post_id = ? AND user_id = ?', [postId, userId]);
        if (likeResult.length === 0) {
            res.status(404).json({ success: false, message: 'Post not found' });
            return;
        }

        res.status(200).json({
            success: true,
            like_tag: likeResult[0].like_tag, 
            hasLiked: userLikeResult.length > 0  // 回傳true or false
        });
    } catch (err) {
        console.error('Error fetching like status: ', err);
        res.status(500).send('Server error');
    }
});

// 點讚跟取消點讚
router.post('/post/:post_id/:user_id/like', async (req, res) => {
    const postId = req.params.post_id;
    const userId = req.params.user_id;   

    try {
        const [userLikeResult] = await db.promise().query('SELECT * FROM user_like WHERE post_id = ? AND user_id = ?', [postId, userId]);

        if (userLikeResult.length > 0) { // >0 這個user已經點讚，要取消點讚
            await db.promise().query('DELETE FROM user_like WHERE post_id = ? AND user_id = ?', [postId, userId]);
            await db.promise().query('UPDATE post SET like_tag = like_tag - 1 WHERE post_id = ?', [postId]);
            const [updatedPostResult] = await db.promise().query('SELECT like_tag from post WHERE post_id = ?', [postId]);
            const updatedLikeTag = updatedPostResult[0].like_tag;
            res.status(200).json({ success: true, message: 'Like removed', like_tag: updatedLikeTag });

        } else {// <0 還沒點讚，要點讚
            await db.promise().query('INSERT INTO user_like (post_id, user_id) VALUES (?, ?)', [postId, userId]);
            await db.promise().query('UPDATE post SET like_tag = like_tag + 1 WHERE post_id = ?', [postId]);
            const [updatedPostResult] = await db.promise().query('SELECT like_tag from post WHERE post_id = ?', [postId]);
            const updatedLikeTag = updatedPostResult[0].like_tag;
            res.status(200).json({ success: true, message: 'Like removed', like_tag: updatedLikeTag });
        }

    } catch (err) {
        console.error('Error updating like status: ', err);
        res.status(500).send('Server error');
    }
});

export default router;
