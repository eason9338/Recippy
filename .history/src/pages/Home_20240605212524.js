import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext.js';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSearch } from '../context/SearchContext.js'; // 引入 useSearch
import '../style/Post.css';

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { user } = useUser();
    const { results, getPostList, handleTagSearch, handelKeywordSearch } = useSearch(); // 使用 useSearch
    const [selectedTags, setSelectedTags] = useState([]);

    useEffect(() => {
        if (user) {
            getPostList(user.user_id); // 獲取推薦貼文
        }
    }, [user, location]);

    useEffect(() => {
        if (selectedTags.length > 0) {
            handleTagSearch(selectedTags);
        }
    }, [selectedTags, handleTagSearch]);

    const handlePostClick = (post_id) => {
        navigate(`/post/${post_id}`);
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
            {results && results.map(post => (
                <div key={post.id} className="post" onClick={() => handlePostClick(post.id)}>
                    <div className="post_inside">
                        <div className='poster-info'>
                            <div className='poster-pic' style={{ backgroundColor: 'orange', color: 'white' }}>
                                {post.name ? post.name.charAt(0).toUpperCase() : ''}
                            </div>
                            <p className="poster-name">{post.name}</p>
                        </div>
                        <h3 className='post-title'>{post.title}</h3>
                        {post.tags.map((tag, index) => (
                            <span className='tag' key={index}>{tag}</span>
                        ))}
                        <p className="post-content">{post.content}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Home;
