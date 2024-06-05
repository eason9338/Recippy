import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext.js';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShare } from '@fortawesome/free-solid-svg-icons'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { faComment} from '@fortawesome/free-solid-svg-icons'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import '../style/Post.css';


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
    
    useEffect(() => {
        const fetchPosts = async () => {
            //將測試資料改為以下的api
            
            // const response = await fetch('http://localhost:8000/api/posts/${user.user_id}', {
            //     method: 'GET',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${user.token}`
            //     }
            // })
            // const data = await response.json();
            // console.log(data);
            // setPosts(data.posts);
            setPosts([
                {
                    "post_id": 1,
                    "post_title": "Hello, World",
                    "post_content": "This is a test post",
                    "post_tags": ["test", "hello"],
                    "like_tag": 0,
                    "comment_tag": 0
                },
                {
                    "post_id": 2,
                    "post_title": "Goodbye, World",
                    "post_content": "This is another test post",
                    "post_tags": ["test", "goodbye"],
                    "like_tag": 1,
                    "comment_tag": 1
                }
            ])
        }
        fetchPosts();
    }, [])
    const likeClick = () => {
        setLikes(likes + 1);
      };
    const lineClick = () => {
        const result = window.confirm("要刪除貼文嗎？");
    if (result) {
        //確定的話
    } else {
        //取消就取消
    }
    }
   

   
      return ( 
        <div>
            <h2 className={displayName ? '' : 'hide'}>Hello {displayName}, this is your personal page</h2>
            <div>
                {
                    posts ? posts.map((post, index) => {
                        console.log("get",post)
                        return (
                            <div key={index} className='post'>
                                 
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <h3>{post.post_title}</h3>
                                    <FontAwesomeIcon icon={faTrash}  className="line＿icon" onClick={lineClick} />
                                    
                                </div>
                                <p>{post.post_content}</p>
                                <div>
                                    {post.post_tags.map((tag, index) => {
                                        return <span key={index} className='tag'>{tag}</span>
                                    })}
                                    <div class="btn-group" role="group" aria-label="Basic outlined example">
                                    {/* 讚數 */}
                                        {/* <button  onClick={likeClick}  class="btn btn-primary"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">
                                                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
                                            </svg>likes {likes} */}
                                    {/* 留言 */}
                                        {/* </button>
                                            <button type="button" class="btn btn-primary"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-chat-square-heart" viewBox="0 0 16 16">
                                            <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a2 2 0 0 0-1.6.8L8 14.333 6.1 11.8a2 2 0 0 0-1.6-.8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                                            <path d="M8 3.993c1.664-1.711 5.825 1.283 0 5.132-5.825-3.85-1.664-6.843 0-5.132"/>
                                            </svg>comment
                                        </button> */}
                                    {/* 分享 */}
                                        {/* <button type="button" class="btn btn-primary"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send" viewBox="0 0 16 16">
                                            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"/>
                                            </svg>share
                                        </button> */}
                                        <div class="button">
                                            <FontAwesomeIcon icon={faHeart}onClick={likeClick}  className="like-icon" /> {likes} 
                                            <FontAwesomeIcon icon={faComment} className="comment-icon" />       
                                            <FontAwesomeIcon icon={faShare} className="comment-icon" />
                                        </div>
                                     </div>
                                </div>
                            </div>
                        )
                    }) : ''
                }
            </div>
            <p>This is title page</p>
            <p className={displayName ? '' : 'hide'}>Hello, {displayName}</p>
            <button onClick={logout}>Log out</button>
        </div>
    );
}
export default User;