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
                    "post_title": "「粉漿蛋餅」，漿糊黃金比例這樣調！",
                    "post_content": "來看看古早味的粉漿蛋餅怎麼做，回味一下小時候的滋味吧～承前所述，蛋餅是許多早餐店裡都會販售的品項之一。最傳統古早味的粉漿蛋餅口感較Ｑ軟，而後來為了節省烹調時間，所發展出來的餅皮蛋餅，口感較酥脆，兩者各有擁護者；不過同是蛋餅，為何口感上會有這麼鮮明的差異呢？",
                    "post_tags": ["test", "hello"],
                    "like_tag": 0,
                    "comment_tag": 0,
                    "url_string": "https://imageproxy.icook.network/resize?background=255%2C255%2C255&height=600&nocrop=false&stripmeta=true&type=auto&url=http%3A%2F%2Ftokyo-kitchen.icook.tw.s3.amazonaws.com%2Fuploads%2Frecipe%2Fcover%2F235992%2F0342aab73b728ee4.jpg&width=800"
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

    const deletePost = (post_id) => {

    }

    //const deleteClick = () => {
    //    const result = window.confirm("要刪除貼文嗎？");
    //    if (result) {
    //        //確定的話
    //    } else {
            //取消就取消
    //    }
    //}
   

   
      return ( 
        <div>
            <h2 className={displayName ? '' : 'hide'}>Hello {displayName}, this is your personal page</h2>
            <div>
                {
                    posts ? posts.map((post, index) => {
                        console.log("get",post)
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
                                            {post.post_tags.map((tag, index) => {
                                                return <span key={index} className='tag'>{tag}</span>
                                            })}
                                        </div>
                                        <div class="button">
                                            <FontAwesomeIcon icon={faHeart}onClick={likeClick}  className="like-icon" /> {likes} 
                                            <FontAwesomeIcon icon={faComment} className="comment-icon" />       
                                            <FontAwesomeIcon icon={faShare} className="comment-icon" />
                                        </div>
                                        
                                    </div>
                                    <div style={{ display: 'flex', flex: 3, marginTop: '30px', alignItems: 'center'}}>
                                        <img 
                                            src={post.url_string}
                                            alt="Image" 
                                            style={{ maxWidth: '300px', maxHeight: 'auto' ,borderRadius: '10px'}} 
                                        />
                                    </div>
                                </div>
                            </div>
                        )
                    }) : ''
                }

            </div>
        </div>
    );
}
export default User;