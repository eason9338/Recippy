import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShare } from '@fortawesome/free-solid-svg-icons';
import '../style/clickPost.css';

const PostDetail = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const[likeCount, setLikeCount] = useState(post.like_tag);
    const[shareCount, setShareCount] = useState(post.share_tag);
    const[isLiked, setIsLiked] = useState(false);
    const[isShared, setIsShared] = useState(false);

    const handleLike = () => {
        setLikeCount(likeCount + 1);
        setIsLiked(true);
    };

    const handleShare = () => {
        setShareCount(shareCount +1);
        setIsShared(true);
    };


    useEffect(() => {
        const fetchPostData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/post/${postId}`);
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
    }, [postId]);

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
            </div>

            <div className='interaction'>
                <button className={`like-button ${isLiked ? 'liked' : ''}`} onClick = {handleLike}>
                    <FontAwesomeIcon icon={faHeart}/><p className='like_num'> {likeCount}</p>
                    <p className='like_num'>{likeCount}</p>
                </button>
                <button className={`share-button ${isShared ? 'shared' : ''}`} onClick={handleShare}>
                    <FontAwesomeIcon icon={faShare} />
                    <p className='share_num'>{shareCount}</p>
                </button>
            </div>
        </div>
    );
}

export default PostDetail;