import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShare } from '@fortawesome/free-solid-svg-icons';
import '../style/clickPost.css';
import Swal from 'sweetalert2';

const PostDetail = () => {
    const { post_id } = useParams();
    const [post, setPost] = useState(null);
    //const[likeCount, setLikeCount] = useState(post.like_tag);
    const[likeCount, setLikeCount] = useState(0);
    //const[shareCount, setShareCount] = useState(post.share_tag);
    const[shareCount, setShareCount] = useState(0);
    const[isLiked, setIsLiked] = useState(false);
    const[isShared, setIsShared] = useState(false);

    const[xPos, setXPos] = useState('0px');
    const[yPos, setYPos] = useState('0px');
    const[showMenu, setShowMenu] = useState(false);

    const handleLike = async(post_id) => {
        if(!isLiked) {
            setLikeCount(likeCount + 1);
            setIsLiked(true);
        }
        
    };

    const handleShare = () => {
        if(!isShared) {
            setShareCount(shareCount +1);
            setIsShared(true);
        }
    };

    const handleContextMenu = (event) => {
        event.preventDefault();
        setXPos(`${event.pageX}px`);
        setYPos(`${event.pageY}px`);
        setShowMenu(true);
    }

    const handleClick = () => {
        if(showMenu){
            setShowMenu(false);
        }

    }

    const handleMenuClick = (action) => {
        if (action == 'Delete') {
            Swal.fire('Delete Post', 'You clicked the delete post option', 'warning');
        } else if (action == 'Edit') {
            Swal.fire('Edit Post', 'You clickedthe edit post potion', 'info');
        }
        setShowMenu(false);
    };

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                console.log('post_id on post.js', post_id);
                const response = await fetch(`http://localhost:8000/api/post/${post_id}`);
                const data = await response.json();
                if(data.success) {
                    setPost(data.post);
                    setLikeCount(data.post.like_tag || 0);
                    setShareCount(data.post.share_tag || 0);
                } else {
                    console.error('文章讀取失敗', data.message);
                }
            } catch (error) {
                console.error('網絡錯誤或伺服器問題', error);
            }
        };

        fetchPostData();
    }, [post_id]);

    useEffect(() => {
        const handleDocumentClick = (event) => {
            if (showMenu) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', handleDocumentClick);
        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, [showMenu]);

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <div onContextMenu={handleContextMenu} onClick={handleClick}>
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
                 
                <div className='interaction'>
                    <button className={`like-button ${isLiked ? 'liked' : ''}`} onClick = {handleLike} disabled={isLiked}>
                        <FontAwesomeIcon icon={faHeart}  className="like-icon" />
                        <p className='like_num'>{likeCount ? likeCount : 0}</p>
                    </button>
                    <button className={`share-button ${isShared ? 'shared' : ''}`} onClick = {handleLike} disabled={isShared}>
                        <FontAwesomeIcon icon={faShare} className="comment-icon" />
                        {/* <p className='share_num'>{shareCount}</p> */}
                    </button>
                </div>         
            </div>

            <div className={`context-menu ${showMenu ? 'show' : ''}`}
                style={{
                    top: yPos,
                    left: xPos
                }}
            >
                <ul className='menu-list'>
                    <li className='menu-item' onClick={() => handleMenuClick('Edit')}>Edit Post</li>
                    <li className='menu-item' onClick={() => handleMenuClick('Delete')}>Delete Post</li>
                </ul>
            </div>
        </div>
    );
}

export default PostDetail;