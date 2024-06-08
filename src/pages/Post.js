import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faShare } from '@fortawesome/free-solid-svg-icons';
import '../style/clickPost.css';
import Swal from 'sweetalert2';
import { faComment} from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { useUser } from '../context/UserContext.js';

const PostDetail = () => {
    const { post_id } = useParams();
    const [post, setPost] = useState(null);
    //const[likeCount, setLikeCount] = useState(post.like_tag);
    const[likeCount, setLikeCount] = useState(0);
    //const[shareCount, setShareCount] = useState(post.share_tag);
    const[shareCount, setShareCount] = useState(0);
    const[isLiked, setIsLiked] = useState(false);
    const[isShared, setIsShared] = useState(false);
    const [hasLiked, setHasLiked] = useState(false);
    const { user } = useUser();

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
            try {
                const response = await fetch(`http://localhost:8000/api/post/like-status/${post_id}/${user.user_id}`);
                
                const data = await response.json();
                if(data.success) {
                    setLikes(data.like_tag || 0);
                    setHasLiked(data.hasLiked);
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
    // const handleLike = async () => {
    //     try {
    //         const response = await fetch(`http://localhost:8000/api/post/${post_id}/like-status`, {
    //             method: 'POST',
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify(post_id)
    //         });
    //         const data = await response.json();
    //         if (data.success) {

    //             setPost(prevPost => ({
    //                 ...prevPost,
    //                 like_tag: data.like_tag
    //             }));
    //         } else {
    //             console.error('點贊fail', data.message);
    //         }
    //     } catch (error) {
    //         console.error('伺服器問題', error);
    //     }
    //     handleLike();
    // }
    const likeClick = async() => {
        // setLikes(likes + 1);
        const response = await fetch(`http://localhost:8000/api/post/${post_id}/${user.user_id}/like`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ hasLiked: !hasLiked })
        });

        const data = await response.json();
        if (data.success) {
            setLikes(data.like_tag);
            setHasLiked(!hasLiked);
        } else {
            console.error('Like update failed');
        }
    };

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
                 
                 <p className='post-content'>{post.like_tag}</p>
                <div class="button">
                    <FontAwesomeIcon icon={faHeart}onClick={likeClick}  className="like-icon" /> {likes} 
                    <FontAwesomeIcon icon={faComment} className="comment-icon" />       
                    <FontAwesomeIcon icon={faShare} className="comment-icon" />
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