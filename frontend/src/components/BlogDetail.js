import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { marked } from "marked";
import axios from "axios";
import "./blogdetail.css";

const API_URL = "http://127.0.0.1:8000/api/blogs/";

function BlogDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [fontSize, setFontSize] = useState("16px");
    const [backgroundStyle, setBackgroundStyle] = useState("default");

    useEffect(() => {
        const fetchBlogDetail = async () => {
            try {
                const response = await axios.get(`${API_URL}${id}/`);
                setBlog(response.data);
            } catch (error) {
                console.error("Error fetching blog:", error);
            }
        };

        fetchBlogDetail();
        checkAuth();
    }, [id]);

    const checkAuth = async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const res = await axios.get("http://127.0.0.1:8000/api/user/", {
                    headers: { Authorization: `Token ${token}` }
                });
                setLoggedIn(true);
                setCurrentUser(res.data.username);
            } catch {
                setLoggedIn(false);
            }
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this blog?")) return;
        try {
            await axios.delete(`${API_URL}${id}/`, {
                headers: { Authorization: `Token ${localStorage.getItem("token")}` }
            });
            navigate("/BlogList");
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const handleEdit = () => {
        if (!window.confirm("Are you sure you want to edit this blog post?")) return;
        navigate(`/edit/${blog.id}`);
    };

    if (!blog) return <div className="loading-message">Loading...</div>;

    return (
        <div className={`blog-detail-container ${backgroundStyle}`}>
            <h1 className="blog-title">{blog.title}</h1>
            <h3 className="blog-meta"><strong>By Author:</strong> {blog.author}</h3>

            <div className="customization-options">
                <h4>Font Size:</h4>
                <select onChange={(e) => setFontSize(e.target.value)}>
                    <option value="14px">Small</option>
                    <option value="16px" selected>Medium</option>
                    <option value="18px">Large</option>
                    <option value="20px">Extra Large</option>
                </select>

                <h4>Background Style:</h4>
                <select onChange={(e) => setBackgroundStyle(e.target.value)}>
                    <option value="default">Light</option>
                    <option value="dark">Dark</option>
                    <option value="sepia">Sepia</option>
                </select>
            </div>

            <div 
                className="blog-content" 
                style={{ fontSize }} 
                dangerouslySetInnerHTML={{ __html: marked(blog.content) }} 
            />

            {loggedIn && blog.author === currentUser && (
                <div className="button-group">
                    <button onClick={handleEdit} className="edit-button">Edit</button>
                    <button onClick={handleDelete} className="delete-button">Delete</button>
                </div>
            )}
        </div>
    );
}

export default BlogDetail;
