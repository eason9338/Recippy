import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext.js';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSearch } from '../context/SearchContext.js';
import '../style/Post.css';

const Home = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const { user } = useUser();
    const { results, getPostList, handleTagSearch, handleKeywordSearch } = useSearch();
    const [selectedTags, setSelectedTags] = useState([]);

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
            {Array.isArray(results) && results.length > 0 ? (
                results.map((post, index) => (
                    <div key={index} className="post" onClick={() => handlePostClick(post.id)}>
                        <div className="post_inside">
                            <div className='poster-info'>
                                <div className='poster-pic'>
                                    {post.name ? post.name.charAt(0).toUpperCase() : ''}
                                </div>
                                <p className="poster-name">{post.name}</p>
                            </div>
                            <h3 className='post-title'>{post.title}</h3>
                            {post.tags && post.tags.map((tag, index) => (
                                <span className='tag' key={index}># {tag}</span>
                            ))}
                            <p className="post-content">{post.content}</p>
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