import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { marked } from "marked";
import DOMPurify from "dompurify";
import "./createblog.css";

const API_URL = "http://127.0.0.1:8000/api/blogs/";

function CreateBlog() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [message, setMessage] = useState("");

    const handleCreateBlog = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (!token) {
            setMessage("Please log in first!");
            return;
        }

        try {
            const response = await axios.post(API_URL, { title, content }, {
                headers: { Authorization: `Token ${token}` }
            });
            setMessage("Blog created successfully!");

            setTimeout(() => {
                navigate(`/blog/${response.data.id}`);
            }, 1000);
        } catch (error) {
            setMessage("Error: " + (error.response?.data?.error || "Something went wrong."));
        }
    };

    return (
        <div className="create-blog-container">

          <h2>Create a New Blog</h2>
            <hr></hr> <br></br>
          <div className="editor-preview-container">
            {/* Editor Section */}
            <form onSubmit={handleCreateBlog} className="editor">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Blog Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <span style={{ color: "red", fontSize: "18px", fontWeight: "bold" }}>
                  Note: Type in Marked.js Format
                </span>
              <div className="form-group">
                <textarea
                value={content}
                onChange={(e) => {
                setContent(e.target.value);
                e.target.style.height = "auto"; // Reset height
                e.target.style.height = e.target.scrollHeight + "px"; // Set height dynamically
                }}
                placeholder="Write your blog (in Marked.js Format)..."
            />
              </div>
    
              <button type="submit">Publish Blog</button>
            </form>
    
            {/* Preview Section */}
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

export default CreateBlog;