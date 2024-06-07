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
    const likeClick = async (post_id) => {
        const response = await fetch('http://localhost:8000/api/post/like', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(post_id)
        })
        
        const data = await response.json();
        if(data.success) {
            setLikes(likes + 1);
            console.log("likes:",likes)
        } else {
            console.error('like update failed');
        }
    };


    const handleTagClick = (tag) => {
        setSelectedTags(prevTags => {
            if (prevTags.includes(tag)) {
                return prevTags.filter(t => t !== tag);
            } else {
                return [...prevTags, tag];
            }
        });
    };

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
                                    <FontAwesomeIcon icon={faHeart}onClick={() => likeClick(post.id)}  className="like-icon" /> {likes} 
                                    <FontAwesomeIcon icon={faComment} className="comment-icon" />       
                                    <FontAwesomeIcon icon={faShare} className="comment-icon" />
                                </div>
                            </div>
                            <div style={{ display: 'flex', flex: 3, marginTop: '30px', alignItems: 'center'}}>
                            <img 
                                src="https://imageproxy.icook.network/resize?background=255%2C255%2C255&nocrop=true&stripmeta=true&type=auto&url=http%3A%2F%2Ftokyo-kitchen.icook.tw.s3.amazonaws.com%2Fuploads%2Frecipe%2Fcover%2F457718%2F2adb25e6c32d1339.jpg&width=1080" 
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
