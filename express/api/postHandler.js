import { Router } from 'express';
import db from '../config/db.js';

const router = Router();

// Keyword search api
router.get('/search', (req, res) => {
    const keyword = req.query.q;

    if (!keyword) {
        res.status(400).json({ success: false, message: 'Query is required' });
        return;
    }

    const searchQuery = `
    
        SELECT p.post_id, p.title AS post_title, p.content AS post_content, u.user_name, i.url_string, p.like_tag
        FROM post p
        JOIN user u ON p.user_id = u.user_id
        JOIN image i ON p.image_id = i.image_id
        WHERE p.title LIKE ?
    `;

    db.query(searchQuery, [`%${keyword}%`], (err, searchResults) => {
        if (err) {
            console.error('Error searching posts: ', err);
            res.status(500).send('Server error');
            return;
        }

        const postIds = searchResults.map(post => post.post_id);
        if (postIds.length === 0) {
            res.json({ success: true, posts: [] });
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

            const posts = searchResults.map(post => ({
                id: post.post_id,
                title: post.post_title,
                content: post.post_content,
                tags: tagResults
                    .filter(tag => tag.post_id === post.post_id)
                    .map(tag => tag.tag_name),
                name: post.user_name,
                likeCount: post.like_tag,
                img_url: post.url_string,
            }));

            res.status(200).json({ success: true, posts });
        });
    });
});

// get personal page post api 1
router.get('/homePost', (req, res) => {
    const userId = req.query.userId;

    // Acquired every post with user name
    const postQuery = `
        SELECT post.post_id, post.user_id, post.title AS post_title, post.content AS post_content, user.user_name, post.image_id AS image_id,  image.url_string AS img_url, 
        COUNT(user_like.user_id) AS like_count
        FROM post
        JOIN user ON post.user_id = user.user_id
        LEFT JOIN user_like ON post.post_id = user_like.post_id
        left join image on image.image_id = post.image_id
        WHERE post.user_id = ?
        GROUP BY post.post_id
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
                    id: post.post_id,
                    title: post.post_title,
                    content: post.post_content,
                    tags: tagResults
                        .filter(tag => tag.post_id === post.post_id)
                        .map(tag => tag.tag_name),
                    name: post.user_name,
                    like_count: post.like_count,
                    img_url: post.img_url
                };
            });
            res.status(200).json({ success: true, posts, message: 'Posts fetched' });
        });
    });
});

// delete personal post api
router.delete('/delete_Post/:post_id', (req, res) => {
    const postId = req.params.post_id;

    const deletePostQuery = `
        DELETE FROM post WHERE post_id = ?
    `;

    db.query(deletePostQuery, [postId], (err, result) => {
        if (err) {
            console.error('Error deleting post: ', err);
            res.status(500).send('Server error');
            return;
        }

        res.status(200).json({ success: true, message: 'Post deleted' });
    });
});

// edit post
router.put('/updatePost/:post_id', (req, res) => {
    const postId = req.params.post_id;
    const { title, content, tags } = req.body;

    console.log(`Updating post ${postId} with title: ${title}, content: ${content}, tags: ${tags}`);

    const updatePostQuery = `
        UPDATE post
        SET title = ?, content = ?
        WHERE post_id = ?
    `;

    db.query(updatePostQuery, [title, content, postId], (err, result) => {
        if (err) {
            console.error('Error updating post: ', err);
            res.status(500).send('Server error');
            return;
        } else {
            console.log(`Tags for post ${postId} updated successfully`);
            res.status(200).json({ success: true, message: 'Post updated' });
        }
    });
});

router.get('/homePost', (req, res) => {
    const userId = req.query.userId;

    // Acquired every post with user name
    const postQuery = `
        SELECT post.post_id, post.user_id, post.title AS post_title, post.content AS post_content, user.user_name, image.url_string AS img_url, 
        COUNT(user_like.user_id) AS like_count
        FROM post
        JOIN user ON post.user_id = user.user_id
        LEFT JOIN user_like ON post.post_id = user_like.post_id
        left join image on image.image_id = post.image_id
        WHERE post.user_id = ?
        GROUP BY post.post_id
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
                    id: post.post_id,
                    title: post.post_title,
                    content: post.post_content,
                    tags: tagResults
                        .filter(tag => tag.post_id === post.post_id)
                        .map(tag => tag.tag_name),
                    name: post.user_name,
                    like_count: post.like_count,
                    img_url: post.img_url
                };
            });
            res.status(200).json({ success: true, posts, message: 'Posts fetched' });
        });
    });
});

// get home page post api
router.get('/posts', (req, res) => {
    const userId = req.query.userId;

    // Acquired every post with user name
    const postQuery = `


        SELECT 
            post.post_id, 
            post.user_id, 
            post.title AS post_title, 
            post.content AS post_content, 
            user.user_name, 
            post.like_tag, 
            image.url_string AS img_url
        FROM 
            post
        JOIN 
            user ON post.user_id = user.user_id
        LEFT JOIN 
            image ON post.image_id = image.image_id
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
                    id: post.post_id,
                    title: post.post_title,
                    content: post.post_content,
                    tags: tagResults
                        .filter(tag => tag.post_id === post.post_id)
                        .map(tag => tag.tag_name),
                    like_tag: post.like_tag,
                    img_url: post.img_url,
                    name: post.user_name
                };
            });
            res.status(200).json({ success: true, posts, message: 'Posts fetched' });
        });
    });
});

// post - post
router.post('/post', async (req, res) => {
    const { title, content, selectedTags, selectedImg, user_id } = req.body;

    try {
        const imgResults = await db.promise().query('INSERT INTO image (url_string) VALUES (?)', [selectedImg]);
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

// Tags search api
router.post('/searchByTags', async (req, res) => {
    const { tags } = req.body; 

    if (!tags || tags.length === 0) {
        res.status(400).json({ success: false, message: 'No tags provided' });
        return;
    }

    try {
        // 用于標籤匹配的查詢
        const tagQuery = `
        SELECT 
            p.post_id, 
            p.title AS post_title, 
            p.content AS post_content, 
            u.user_name,
            i.img_url
            GROUP_CONCAT(t.tag_name SEPARATOR ', ') AS post_tags
        FROM post p
        JOIN user u ON p.user_id = u.user_id
        JOIN post_tag pt ON pt.post_id = p.post_id
        JOIN tag t ON pt.tag_id = t.tag_id
        JOIN image i ON post.image_id = i.image_id
        WHERE t.tag_name IN (?)
        GROUP BY p.post_id
        HAVING COUNT(DISTINCT t.tag_name) = ?
        `;

        const [results] = await db.promise().query(tagQuery, [tags, tags.length]);

        if (results.length > 0) {
            const posts = results.map(post => ({
                id: post.post_id,
                title: post.post_title,
                content: post.post_content,
                name: post.user_name,
                img_url: post.img_url
            }));
            res.status(200).json({ success: true, posts });
        } else {
            res.status(200).json({ success: false, message: 'No posts found with the provided tags', posts: [] });
        }
    } catch (err) {
        console.error('Error fetching posts by tags: ', err);
        res.status(500).send('Server error');
    }
});


// Content API
router.get('/post/:post_id', async (req, res) => {
    const post_id = req.params.post_id;

    console.log('postId: ', post_id);
    try {
        const postQuery = `
            SELECT post.post_id, post.title AS post_title, post.content AS post_content, post.like_tag, post.share_tag, user.user_name, post.post_id, image.url_string
            FROM post
            JOIN user ON post.user_id = user.user_id
            join image on post.image_id = image.image_id
            WHERE post.post_id = ?
        `;

        const [postResults, fields] = await db.promise().query(postQuery, [post_id]);

        if (postResults.length === 0) {
            res.status(404).json({ success: false, message: 'Post not found', param: post_id });
            return;
        }

        const post = postResults[0];

        const tagQuery = `
            SELECT t.tag_name
            FROM post_tag pt
            JOIN tag t ON pt.tag_id = t.tag_id
            WHERE pt.post_id = ?
        `;

        const [tagResults, tagFields] = await db.promise().query(tagQuery, [post_id]);

        res.status(200).json({ success: true, post: {
            id: post.post_id,
            title: post.post_title,
            content: post.post_content,
            name: post.user_name,
            share_tag: post.share_tag,
            like_tag: post.like_tag,
            img_url: post.url_string,
            tags: tagResults.map(tag => tag.tag_name)
        }});
    } catch (err) {
        console.error('Error fetching post: ', err);
        res.status(500).send('Server error');
    }
});

export default router;