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
           
