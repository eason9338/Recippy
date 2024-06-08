import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext.js';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShare, faHeart, faComment, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import '../style/Post.css';
import Swal from 'sweetalert2';


const User = () => {
    const { user, setUser } = useUser();
    const [posts, setPosts] = useState([]);
    const displayName = user && user.user_name ? user.user_name : '';
    const navigate = useNavigate();
    const [likes, setLikes] = useState(0);
    const [editContent, setEditContent] = useState({ title: '', content: '', tags: [] });
    const [editPostId, setEditPostId] = useState(null);

    const logout = () => {
        setUser(null)
        localStorage.removeItem('user');
        navigate('/')
        console.log('登出成功')
    }

    const handleIconClick = (action, post_id) => {
        if (action === 'Delete') {
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
        } else if (action === 'Edit') {
            setEditPostId(post_id.id);
            setEditContent({ title: post_id.title, content: post_id.content, tags: post_id.tags });
            Swal.fire('編輯內容', '現在可以編輯貼文內容了!', 'info');
        }
    };

    const deletePost = async (post_id) => {
        try {
            const response = await fetch(`http://localhost:8000/api/delete_Post/${post_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });

            const data = await response.json();
            if (data.success) {
                Swal.fire('刪除成功', '文章已被刪除', 'success');
                setPosts(posts.filter(post => post.id !== post_id)); // 更新狀態以刪除已刪除的貼文
            } else {
                Swal.fire('刪除失敗', '無法刪除文章', 'error');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            Swal.fire('刪除失敗', '伺服器錯誤', 'error');
        }
    };

    const updatePost = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/updatePost/${editPostId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    title: editContent.title,
                    content: editContent.content,
                    tags: editContent.tags
                })
            });

            const data = await response.json();
            if (data.success) {
                Swal.fire('更新成功', '文章已更新', 'success');
                setPosts(posts.map(post => post.id === editPostId ? { ...post, ...editContent } : post)); // 更新狀態
                setEditPostId(null); // 清除編輯狀態
            } else {
                Swal.fire('更新失敗', '無法更新文章', 'error');
            }
        } catch (error) {
            console.error('Error updating post:', error);
            Swal.fire('更新失敗', '伺服器錯誤', 'error');
        }
    };

    useEffect(() => {
        const fetchPosts = async () => {
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


    return (
        <div>
            <h2 className={displayName ? '' : 'hide'}>Hello {displayName}, this is your personal page</h2>
            <div>
                <h3>Personal Info</h3>
                <div className='name-info'>
                    <p>Name: {user.user_name}</p>
                    <button className='modify-info-button'>修改</button>
                </div>
                <div className='email-info'>
                    <p>Email: {user.user_email}</p>
                    <button className='modify-info-button'>修改</button>
                </div>
                <hr class="solid"></hr>
            </div>
            <div>
                {
                    posts.length > 0 ? posts.map((post, index) => {
                        const isEditing = editPostId === post.id;
                        return (
                            <div key={index} className='post'>
                                <div style={{ display: 'flex', flex: 2 }}>
                                    <div className="post_inside" style={{ flex: 7, justifyContent: 'space-between' }} >
                                        <div className='post-header'>
                                            {isEditing ? (
                                                <input
                                                    type="text" 
                                                    value={editContent.title} 
                                                    onChange={(e) => setEditContent({ ...editContent, title: e.target.value })} 
                                                    className='edit-input'
                                                />
                                            ) : (
                                                <h3 className='post-title'>{post.title}</h3>
                                            )}
                                            <div className='icon-container'>
                                                <FontAwesomeIcon icon={faEdit} className="icon" onClick={() => handleIconClick('Edit', post)} />
                                                <FontAwesomeIcon icon={faTrash} className="icon" onClick={() => handleIconClick('Delete', post.id)} />
                                            </div>
                                        </div>
                                        {isEditing ? (
                                            <textarea 
                                                value={editContent.content} 
                                                onChange={(e) => setEditContent({ ...editContent, content: e.target.value })} 
                                                className='edit-textarea'
                                            />
                                        ) : (
                                            <p className="post-content">{post.content}</p>
                                        )}
                                        <div>
                                            {post.tags.map((tag, index) => {
                                                return <span key={index} className='tag'>{tag}</span>
                                            })}
                                        </div>
                                        <div className="button">
                                            <FontAwesomeIcon icon={faHeart}  className="like-icon" /> {likes}
                                            <FontAwesomeIcon icon={faComment} className="comment-icon" />
                                            <FontAwesomeIcon icon={faShare} className="comment-icon" />
                                        </div>
                                        {isEditing && (
                                            <div>
                                                <button className='edit-buttons' onClick={updatePost}>保存</button>
                                                <button className='edit-buttons' onClick={() => setEditPostId(null)}>取消</button>
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', flex: 3, marginTop: '30px', alignItems: 'center' }}>
                                        <img
                                            src={post.img_url}
                                            alt="Image"
                                            style={{ maxWidth: '300px', maxHeight: 'auto', borderRadius: '10px' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    }) : <p>No posts available</p>
                }
            </div>
        </div>
    );
}
export default User;
