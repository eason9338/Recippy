import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../style/clickPost.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShare } from '@fortawesome/free-solid-svg-icons'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { faComment} from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

const PostDetail = () => {
    const { post_id } = useParams();
    const [post, setPost] = useState(null);
    const [likes, setLikes] = useState(0);

    useEffect(() => {
        const fetchPostData = async () => {

            try {
                console.log('post_id on post.js', post_id);
                const response = await fetch(`http://localhost:8000/api/post/${post_id}`);
                const data = await response.json();
                if(data.success) {
                    setPost(data.post);
                } else {
                    console.error('文章讀取失敗', data.message);
                }
            } catch (error) {
                console.error('網絡錯誤或伺服器問題', error);
            }
        };
        
        fetchPostData();
    }, [post_id]);

    const handleLike = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/post/${post_id}/like`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(post_id)
            });
            const data = await response.json();
            if (data.success) {

                setPost(prevPost => ({
                    ...prevPost,
                    like_tag: data.like_tag
                }));
            } else {
                console.error('點贊fail', data.message);
            }
        } catch (error) {
            console.error('伺服器問題', error);
        }
        handleLike();
    }
    const likeClick = () => {
        setLikes(likes + 1);
      };

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className='post'>
                <div className='post-info'>
                    <div className='poster-pic'>
                        {post.name ? post.name.charAt(0).toUpperCase() : ''}
                    </div>
                    <p className='poster-name'>{post.name}</p>
                </div>
                <h1 className='post-title'>{post.title}</h1>
                <p className='post-content'>{post.content}</p>
                {post.tags && post.tags.map((tag, index) => (
                    <span className='tag' key={index}># {tag}</span>
                ))}
                <p className='post-content'>{post.like_tag}</p>
                <div class="button">
                    <FontAwesomeIcon icon={faHeart}onClick={likeClick}  className="like-icon" /> {likes} 
                    <FontAwesomeIcon icon={faComment} className="comment-icon" />       
                    <FontAwesomeIcon icon={faShare} className="comment-icon" />
                </div>
                
            </div>
        </div>
    );
}

export default PostDetail;