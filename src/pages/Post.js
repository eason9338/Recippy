import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../style/clickPost.css';

const PostDetail = () => {
    const { post_id } = useParams();
    const [post, setPost] = useState(null);

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
        };
        
        fetchPostData();
    }, [post_id]);

    const handleLike = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/post/${post_id}/like`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(post_id)
            });
            const data = await response.json();
            if (data.success) {
                // 更新本地的点赞数
                setPost(prevPost => ({
                    ...prevPost,
                    like_tag: data.like_tag
                }));
            } else {
                console.error('點贊fail', data.message);
            }
        } catch (error) {
            console.error('伺服器問題', error);
        }
    };

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{post.title}fff</h1>
            <p>{post.content}</p>

        </div>
    );
}

export default PostDetail;