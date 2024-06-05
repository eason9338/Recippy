import { Router } from 'express';
import db from '../config/db.js';

const router = Router();

router.get('/search', (req, res) => {

    const keyword = req.query.query;

    if (!keyword) {
        res.status(400).json({ success: false, message: 'Query is required' });
        return;
    }

    // Search post with keyword in DB
    const searchQuery = `
        SELECT p.post_id, p.title AS post_title, p.content AS post_content
        FROM post p
        WHERE p.title LIKE ?
    `;

    db.query(searchQuery, [`%${keyword}%`], (err, searchResults) => {
        if (err) {
            console.error('Error searching posts: ', err);
            res.status(500).send('Server error');
            return;
        }

        // Get id
        const postIds = searchResults.map(post => post.post_id);
        if (postIds.length === 0) {
            
            const postQuery = `
                SELECT post.post_id, post.user_id, post.title AS post_title, post.content AS post_content, user.user_name
                FROM post
                JOIN user ON post.user_id = user.user_id
            `;
            db.query(postQuery, [], (err, postResults) => {
                
                if (err) {
                    console.error('Error fetching tags: ', err);
                    res.status(500).send('Server error');
                    return;
                }
                
                if (postResults.length === 0) {
                    res.json({ posts: [] });
                    return;
                }

                const posts = postResults.map(post => {
                    return {
                        id: post.post_id,
                        title: post.post_title,
                        content: post.post_content,
                        tags: postResults
                            .filter(tag => tag.post_id === post.post_id)
                            .map(tag => tag.tag_name),
                        name: post.user_name
                    };
                });
                res.status(200).json({ success: true, posts, message: 'Posts fetched' });               
            });
        }

        // get tag
        const tagQuery = `
            SELECT pt.post_id, t.tag_name
            FROM post_tag pt
            JOIN tag t ON pt.tag_id = t.tag_id
            WHERE pt.post_id IN (?)
        `;

        db.query(tagQuery, [postIds], (err, tagResults) => {
            if (err) {
                console.error('Error fetching tags: ', err);
                res.status(500).send('Server error');
                return;
            }

            // 將標籤組合到貼文中
            const posts = searchResults.map(post => {
                return {
                    id: post.post_id,
                    title: post.post_title,
                    content: post.post_content,
                    tags: tagResults
                        .filter(tag => tag.post_id === post.post_id)
                        .map(tag => tag.tag_name),
                    name: post.user_name
                };
            });

            res.status(200).json({ success: true, posts, message: 'Posts fetched' });
        });
    });
});

router.get('/posts', (req, res) => {
    const userId = req.query.userId;

    // Acquired every post with user name
    const postQuery = `
        SELECT post.post_id, post.user_id, post.title AS post_title, post.content AS post_content, user.user_name
        FROM post
        JOIN user ON post.user_id = user.user_id
    `;

    db.query(postQuery, [userId], (err, postResults) => {
        if (err) {
            console.error('Error fetching posts: ', err);
            res.status(500).send('Server error');
            return;
        }

        // Dealing with tags 
        const postIds = postResults.map(post => post.post_id);
        if (postIds.length === 0) {
            res.json({ posts: [] });
            return;
        }

        const tagQuery = `
            SELECT pt.post_id, t.tag_name
            FROM post_tag pt
            JOIN tag t ON pt.tag_id = t.tag_id
            WHERE pt.post_id IN (?)
        `;

        db.query(tagQuery, [postIds], (err, tagResults) => {
            if (err) {
                console.error('Error fetching tags: ', err);
                res.status(500).send('Server error');
                return;
            }

            const posts = postResults.map(post => {
                return {
                    post_id: post.post_id,
                    post_title: post.post_title,
                    post_content: post.post_content,
                    post_tags: tagResults
                        .filter(tag => tag.post_id === post.post_id)
                        .map(tag => tag.tag_name),
                    user_name: post.user_name
                };
            });
            res.status(200).json({ success: true, posts, message: 'Posts fetched' });
        });
    });
});


router.post('/post', async (req, res) => {
    const { title, content, selectedTags, selectImage, user_id } = req.body;

    try {
        const imgResults = await db.promise().query('INSERT INTO image (image) VALUES (?)', [selectImage]);
        const imgId = imgResults[0].insertId;

        const postResults = await db.promise().query('INSERT INTO post (title, content, user_id, image_id) VALUES (?, ?, ?, ?)', [title, content, user_id, imgId]);
        const postId = postResults[0].insertId;

        await Promise.all(selectedTags.map(tag => {
            return db.promise().query('INSERT INTO post_tag (post_id, tag_id) VALUES (?, ?)', [postId, tag.value]);
        }));

        res.status(201).json({ success: true, message: 'Post created' });
    } catch (err) {
        console.error('Error during post creation: ', err);
        res.status(500).json({ success: false, message: 'Error during post creation' });
    }
});

router.post('/searchByTags', async (req, res) => {
    const { tags } = req.body; 

    if (!tags || tags.length === 0) {
        res.status(400).json({ success: false, message: 'No tags provided' });
        return;
    }

    const tagNames = tags.map(tag => tag.tag_name);

    try {

        const tagQuery = `
        SELECT 
            post.post_id, 
            post.title AS post_title, 
            post.content AS post_content, 
            user.user_name,
            (
                SELECT GROUP_CONCAT(t.tag_name SEPARATOR ', ')
                FROM post_tag pt
                JOIN tag t ON pt.tag_id = t.tag_id
                WHERE pt.post_id = post.post_id
            ) AS tags
        FROM post
        JOIN user ON post.user_id = user.user_id
        JOIN post_tag pt ON pt.post_id = post.post_id
        JOIN tag t ON pt.tag_id = t.tag_id
        WHERE t.tag_name IN (?)
        GROUP BY post.post_id
    
        `;

        const [results, fields] = await db.promise().query(tagQuery, [tagNames]);

        if (results.length > 0) {
            const posts = results.map(post => ({
                id: post.post_id,
                title: post.post_title,
                content: post.post_content,
                name: post.user_name,
                tags: post.tags.split(', ')
            }));
            res.status(200).json({ success: true, posts });
        } else {
            res.status(200).json({ success: false, message: 'No posts found with the provided tags', posts: []});
        }
    } catch (err) {
        console.error('Error fetching posts by tags: ', err);
        res.status(500).send('Server error');
    
    }
});

export default router;
