import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { marked } from "marked";
import DOMPurify from "dompurify";
import "./styles.css";

const API_URL = "http://127.0.0.1:8000/api/blogs/";
const BLOGS_PER_PAGE = 5; 

function BlogList({ theme }) {
    const [blogs, setBlogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const response = await axios.get(API_URL);
            setBlogs(response.data);
        } catch (error) {
            console.error("Error fetching blogs:", error);
        }
    };

    const truncateText = (text, length) => {
        const plainText = text.replace(/<\/?[^>]+(>|$)/g, "");
        return plainText.length > length ? plainText.substring(0, length) + "..." : plainText;
    };

    
    const indexOfLastBlog = currentPage * BLOGS_PER_PAGE;
    const indexOfFirstBlog = indexOfLastBlog - BLOGS_PER_PAGE;
    const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

    return (
        <div className={`app-container ${theme}`}>
            <header className="header">
                <h1>Blog Platform</h1>
            </header>

            <div className="blog-list">
                {currentBlogs.map((blog) => (
                    <div key={blog.id} className="blog-post-box">
                        <h2>{blog.title}</h2>
                        <p className="blog-author">By {blog.author}</p>
                        <div
                            className="blog-content-preview"
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(truncateText(marked(blog.content), 150)),
                            }}
                        />
                        <Link to={`/blog/${blog.id}`}>
                            <button className="read-more-button">Read More</button>
                        </Link>
                    </div>
                ))}
            </div>

            
            <div className="pagination">
                <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-button"
                >
                    ← Previous
                </button>
                <span className="page-number">Page {currentPage} of {Math.ceil(blogs.length / BLOGS_PER_PAGE)}</span>
                <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={indexOfLastBlog >= blogs.length}
                    className="pagination-button"
                >
                    Next →
                </button>
            </div>
        </div>
    );
}

export default BlogList;
