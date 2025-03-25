import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import CreateBlog from "./components/CreateBlog";
import EditBlog from "./components/EditBlog";
import Register from "./components/Register";
import Login from "./components/Login";
import Logout from "./components/Logout";
import BlogList from "./components/BlogList";
import BlogDetail from "./components/BlogDetail";
import ProfilePage from "./components/Profile";
import "./App.css";
import axios from "axios";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    return (
        <Router>
            <MainLayout 
                isLoggedIn={isLoggedIn} 
                setIsLoggedIn={setIsLoggedIn} 
                theme={theme} 
                toggleTheme={toggleTheme} 
            />
        </Router>
    );
}

function MainLayout({ isLoggedIn, setIsLoggedIn, theme, toggleTheme }) {
    const location = useLocation();
    const navigate = useNavigate();
    const hideNavbarRoutes = ["/login", "/register"];

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios.get("http://127.0.0.1:8000/api/user/", {
                headers: { Authorization: `Token ${token}` }
            })
            .then(() => setIsLoggedIn(true))
            .catch(() => {
                setIsLoggedIn(false);
                localStorage.removeItem("token");
            });
        }
    }, [isLoggedIn]);

    const handleLogoutClick = (e) => {
        e.preventDefault();
        const confirmLogout = window.confirm("Are you sure you want to log out?");
        if (confirmLogout) {
            navigate("/logout");
        }
    };

    return (
        <div className="app">
            {!hideNavbarRoutes.includes(location.pathname) && (
                <nav className="navbar">
                    <div className="nav-container">
                        <Link to="/BlogList" className="nav-logo">BlogSite</Link>
                        <div className="nav-links">
                            <button onClick={toggleTheme} className="theme-toggle">
                                {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
                            </button>
                            <Link to="/create">Create Blog</Link>
                            {!isLoggedIn ? (
                                <>
                                    <Link to="/login">Login</Link>
                                    <Link to="/register">Get Started</Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/profile">My Profile</Link>
                                    <Link to="/logout" onClick={handleLogoutClick}>Logout</Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>
            )}

            <div className="content">
                <Routes>
                    <Route path="/BlogList" element={<BlogList />} />
                    <Route path="/blog/:id" element={<BlogDetail />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                    <Route path="/create" element={<CreateBlog />} />
                    <Route path="/edit/:id" element={<EditBlog />} />
                    <Route path="/logout" element={<Logout setIsLoggedIn={setIsLoggedIn} />} />
                </Routes>
            </div>

            {!hideNavbarRoutes.includes(location.pathname) && (
                <footer className="footer">
                    <p>© 2025 BlogSite. All rights reserved.</p>
                </footer>
            )}
        </div>
    );
}

export default App;
