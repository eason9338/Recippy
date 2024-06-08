import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext.js';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShare, faHeart, faComment, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
//import { faTrash } from '@fortawesome/free-solid-svg-icons'
import '../style/Post.css';
import Swal from 'sweetalert2';


const User = () => {
    const {user, setUser} = useUser();
    const [posts, setPosts] = useState([]);
    const displayName = user && user.user_name ? user.user_name : '';
    const navigate = useNavigate();
    const [likes, setLikes] = useState(0);

    const logout = () => {
        setUser(null)
        localStorage.removeItem('user');
        navigate('/')
        console.log('登出成功')
    }

    const handleIconClick = (action, post_id) => {
        if (action == 'Delete') {
            Swal.fire({
                title: '確定刪除文章嗎?', 
                text: '刪除即無法恢復!', 
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: '確定',
                cancelButtonText: '取消'
            }).then((result) => {
                if(result.isConfirmed){
                    deletePost(post_id);
                }
            });
        } else if (action == 'Edit') {
            Swal.fire('編輯內容', '現在可以編輯貼文內容了!', 'info');
        }
    };

    const likeClick = () => {
        setLikes(likes + 1);
      };
      
    
    useEffect(() => {
        const fetchPosts = async () => {
            //將測試資料改為以下的api
            const response = await fetch(`http://localhost:8000/api/homePost?userId=${user.user_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const data = await response.json();
            console.log(data);
            setPosts(data.posts);
        }
        fetchPosts();
    }, [user]);


    const deleteClick = () => {
        const result = window.confirm("要刪除貼文嗎？");
        if (result) {
            // 確定的話
        } else {
            // 取消就取消
        }
    };

    return ( 
        <div>
            <h2 className={displayName ? '' : 'hide'}>Hello {displayName}, this is your personal page</h2>
            <div>
                {
                    posts.length > 0 ? posts.map((post, index) => {
                        console.log("get", post);
                        return (
                            <div key={index} className='post'>
                                <div style={{ display: 'flex', flex:2 }}>
                                    <div className="post_inside" style={{  flex: 7,justifyContent: 'space-between' }} >
                                        <div className='post-header'>
                                        <h3 className='post-title'>{post.post_title}</h3>
                                            <div className='icon-container'>
                                                <FontAwesomeIcon icon={faEdit} className="icon" onClick={() => handleIconClick('Edit')} />
                                                <FontAwesomeIcon icon={faTrash} className="icon" onClick={() => handleIconClick('Delete', post.post_id)} />
                                            </div>
                                        </div>
                                        <p className="post-content">{post.post_content}</p>
                                        <div>
                                            {post.tags.map((tag, index) => {
                                                return <span key={index} className='tag'>{tag}</span>
                                            })}
                                        </div>
                                        <div className="button">
                                            <FontAwesomeIcon icon={faHeart} onClick={likeClick} className="like-icon" /> {likes} 
                                            <FontAwesomeIcon icon={faComment} className="comment-icon" />       
                                            <FontAwesomeIcon icon={faShare} className="comment-icon" />
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flex: 3, marginTop: '30px', alignItems: 'center'}}>
                                        <img 
                                            src={post.url_string}
                                            alt="Image" 
                                            style={{ maxWidth: '300px', maxHeight: 'auto', borderRadius: '10px'}} 
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    }) : <p>No posts available</p>
                }

            </div>
            <button onClick={logout}>Log out</button>
        </div>
    );
}
export default User;
