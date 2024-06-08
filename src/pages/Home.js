import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext.js';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSearch } from '../context/SearchContext.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShare } from '@fortawesome/free-solid-svg-icons'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { faComment} from '@fortawesome/free-solid-svg-icons'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import '../style/Post.css';

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { user } = useUser();
    const { results, getPostList, handleTagSearch, handleKeywordSearch } = useSearch();
    const [selectedTags, setSelectedTags] = useState([]);
    const [likes, setLikes] = useState(0);

    useEffect(() => {
        if (user) {
            getPostList(user.user_id);
        }
    }, []);

    useEffect(() => {
        if (user) {
            getPostList(user.user_id);
        }
    }, [user]);

    useEffect(() => {
        if (selectedTags.length > 0) {
            handleTagSearch(selectedTags);
        }
    }, [selectedTags, handleTagSearch]);

    useEffect(() => {
        console.log(results); // 調試用，確保 results 有正確數據
    }, [results]);

    const handlePostClick = (post_id) => {
        console.log('post_id on home.js: ', post_id);
        navigate(`/post/${post_id}`);
    };
    // useEffect(() =>{
    //     const fetchLikeCount = async () => {

    //         try {
    //             const response = await fetch(`http://localhost:8000/api/post/like-status/${post_id}/${user.user_id}`);
                
    //             const data = await response.json();
    //             if(data.success) {
    //                 setLikes(data.like_tag || 0);
    //             } else {
    //                 console.error('文章讀取失敗', data.message);
    //             }
    //         } catch (error) {
    //             console.error('網絡錯誤或伺服器問題', error);
    //         }
    //     };
    //     fetchLikeCount();
    // }, [post_id]);

    return (
        <div>
            {Array.isArray(results) && results.length > 0 ? (
                results.map((post, index) => (
                    <div key={index} className="post" onClick={() => handlePostClick(post.id)}>

                        <div style={{ display: 'flex' }}>
                            <div className="post_inside"  style={{  flex: 7,justifyContent: 'space-between' }}>
                                <div className='poster-info'>
                                    <div className='poster-pic' style={{ backgroundColor: 'orange', color: 'white' }}>
                                        {post.name ? post.name.charAt(0).toUpperCase() : ''}
                                    </div>
                                    <p className="poster-name">{post.name}</p>
                                </div>
                                <h3 className='post-title'>{post.title}</h3>
                                <p className="post-content">{post.content}</p>
                                {post.tags && post.tags.map((tag, index) => (
                                    <span className='tag' key={index}>{tag}</span>
                                ))}
                                <div class="button">
                                    <FontAwesomeIcon icon={faHeart} className="home-love" /> {post.likeCount} 
                                    <FontAwesomeIcon icon={faComment} className="comment-icon" />       
                                    <FontAwesomeIcon icon={faShare} className="comment-icon" />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flex: 3, marginTop: '30px', alignItems: 'center'}}>
                            <img 
                                src={post.img_url} 
                                alt="Image" 
                                style={{ maxWidth: '300px', maxHeight: 'auto' ,borderRadius: '10px'}} 
                            />
                            </div>
                            <h3 className='post-title'>{post.post_title}</h3>
                            {post.post_tags && post.post_tags.map((tag, index) => (
                                <span className='tag' key={index}># {tag}</span>
                            ))}
                            <p className="post-content">{post.post_content}</p>

                        </div>
                    </div>
                ))
            ) : (
                <p>No results found</p>
            )}
        </div>
    );
};

export default Home;
