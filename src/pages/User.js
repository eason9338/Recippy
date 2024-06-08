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
                    "post_title": "「粉漿蛋餅」，漿糊黃金比例這樣調！",
                    "post_content": "來看看古早味的粉漿蛋餅怎麼做，回味一下小時候的滋味吧～承前所述，蛋餅是許多早餐店裡都會販售的品項之一。最傳統古早味的粉漿蛋餅口感較Ｑ軟，而後來為了節省烹調時間，所發展出來的餅皮蛋餅，口感較酥脆，兩者各有擁護者；不過同是蛋餅，為何口感上會有這麼鮮明的差異呢？",
                    "post_tags": ["#chinese"],
                    "like_tag": 0,
                    "comment_tag": 0,
                    "url_string": "https://imageproxy.icook.network/resize?background=255%2C255%2C255&height=600&nocrop=false&stripmeta=true&type=auto&url=http%3A%2F%2Ftokyo-kitchen.icook.tw.s3.amazonaws.com%2Fuploads%2Frecipe%2Fcover%2F235992%2F0342aab73b728ee4.jpg&width=800"
                },
                {
                    "post_id": 2,
                    "post_title": "用平底鍋做外酥脆內鬆軟的烤飯！醬油與麻油的香氣令人食慾大開",
                    "post_content": "香噴噴的白飯除了直接享用，其實還有許多變化吃法，今天就要來分享由日本網友脱サラ料理家ふらお示範提供的烤飯作法，而且用平底鍋就可以完成。烤飯外酥脆內鬆軟，還帶有醬油和麻油的香氣，令人食慾大開！不想只吃簡單的白飯時，請試試這一道美味的烤飯。",
                    "post_tags": ["#rice"],
                    "like_tag": 1,
                    "comment_tag": 1,
                    "url_string":"https://imageproxy.icook.network/resize?height=787.5&width=1400&nocrop=false&url=https%3A%2F%2Fuploads-blog.icook.network%2F2024%2F06%2Fc4a32a94-00-800x450.jpeg&type=auto"
                },
                {
                    "post_id": 3,
                    "post_title": "玉米怎麼煮會更香甜美味且粒粒飽滿？日本農家分享簡單方法",
                    "post_content": "玉米要怎麼煮，吃起來才會更香甜美味呢？曾經在超市蔬果區工作許久的日本網友ぱるとよ表示，有許多客人都曾經詢問過類似的問題，因此她也直接公開分享了玉米農家推薦給她的玉米煮法，結果煮好的玉米味道真的特別好吃！有興趣的話請一起做做看。",
                    "post_tags": ["#corn"],
                    "like_tag": 1,
                    "comment_tag": 1,
                    "url_string":"https://imageproxy.icook.network/resize?height=1050&width=1400&nocrop=false&url=https%3A%2F%2Fuploads-blog.icook.network%2F2024%2F05%2F30ce7b89-0000-800x600.jpeg&type=auto"
                },
                {
                    "post_id": 4,
                    "post_title": "鹹甜美味的「雞肉豆腐味噌燒」食譜！用雞胸肉來做也可以喔",
                    "post_content": "今天要介紹的食譜是鹹甜美味的「雞肉豆腐味噌燒」，由日本網友しにゃごはん示範分享，這是一道用雞肉和油豆腐所製作的下飯美食，可攝取到豐富的優良蛋白質，又能滿足口腹之慾。作者補充說明，如果喜歡吃辣的話，加一點辣油也很美味喔！",
                    "post_tags": ["#chicken"],
                    "like_tag": 1,
                    "comment_tag": 1,
                    "url_string":"https://imageproxy.icook.network/resize?height=1050&width=1400&nocrop=false&url=https%3A%2F%2Fuploads-blog.icook.network%2F2024%2F05%2F64b76800-00-800x600.jpeg&type=auto"
                
                }
            ])
        }
        fetchPosts();
    }, [])
    const likeClick = () => {
        setLikes(likes + 1);
      };
    const deleteClick = () => {
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
                                <div style={{ display: 'flex' }}>
                                    <div className="post_inside" style={{  flex: 7,justifyContent: 'space-between' }} >
                                        <h3 className='post-title'>{post.post_title}</h3>
                                        <FontAwesomeIcon icon={faTrash}  className="line＿icon" onClick={deleteClick} style={{ position: 'absolute', right: 35, top: 25 }}  />
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
            {/* <p>This is title page</p>
            <p className={displayName ? '' : 'hide'}>Hello, {displayName}</p> */}
            <button onClick={logout}>Log out</button>
        </div>
    );
}
export default User;