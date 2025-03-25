import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { marked } from "marked";
import DOMPurify from "dompurify";
import "./createblog.css"; 

const API_URL = "http://127.0.0.1:8000/api/blogs/";
const USER_API = "http://127.0.0.1:8000/api/user/";

function EditBlog() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [author, setAuthor] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios.get(`${API_URL}${id}/`);
                setTitle(response.data.title);
                setContent(response.data.content);
                setAuthor(response.data.author);
            } catch (error) {
                setMessage("Error fetching blog details.");
            }
        };

        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const userRes = await axios.get(USER_API, {
                        headers: { Authorization: `Token ${token}` }
                    });
                    setCurrentUser(userRes.data.username);
                } catch (error) {
                    setMessage("Error fetching user details.");
                }
            }
        };

        Promise.all([fetchBlog(), fetchUser()]).then(() => setLoading(false));
    }, [id]);

    const handleEditBlog = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (!token || currentUser !== author) {
            setMessage("You are not authorized to edit this post!");
            return;
        }

        try {
            await axios.put(
                `${API_URL}${id}/`,
                { title, content },
                {
                    headers: {
                        "Authorization": `Token ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            setMessage("Blog updated successfully!");
            setTimeout(() => {
                navigate(`/blog/${id}`);
            }, 1000);
        } catch (error) {
            setMessage("Error: " + (error.response?.data.error || "Something went wrong."));
        }
    };

    if (loading) {
        return <p className="loading-message">Loading...</p>;
    }

    return (
        <div className="create-blog-container">
            <h2>Edit Blog</h2>
            <hr></hr> <br></br>
            <div className="editor-preview-container">
                {currentUser === author ? (
                    <form className="editor" onSubmit={handleEditBlog}>
                        <div className="form-group">
                            <input 
                                type="text" 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Blog Title"
                                required
                            />
                        </div>
                        <h4>Type in Marked.js Format</h4>
                        <div className="form-group">
                            <textarea 
                                value={content} 
                                onChange={(e) => {
                                    setContent(e.target.value);
                                    e.target.style.height = "auto";
                                    e.target.style.height = e.target.scrollHeight + "px";
                                }} 
                                placeholder="Write your blog (in Marked.js Format)..."
                                required
                            />
                        </div>
                        <button type="submit">Save Changes</button>
                    </form>
                ) : (
                    <p className="error-message">You are not the author of this blog.</p>
                )}
                
                <div className="preview">
                    <h3>Live Preview</h3>
                    <div 
                        className="preview-content" 
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked(content)) }} 
                    />
                </div>
            </div>
            {message && <p className="message">{message}</p>}
        </div>
    );
}

export default EditBlog;