import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { AnimatePresence } from 'framer-motion';
import AppNavbar from './components/AppNavbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Blogs from './pages/Blogs';
import BlogDetails from './pages/BlogDetails';
import MyBlogs from './pages/MyBlogs';
import Logout from './pages/Logout';
import UserContext from './context/UserContext';
import Loading from './components/Loading';
import Footer from './components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/global.css';

const notyf = new Notyf({
  duration: 3000,
  position: { x: 'right', y: 'top' },
  types: [
    {
      type: 'success',
      background: '#6C63FF',
      icon: {
        className: 'bi bi-check-circle',
        tagName: 'i',
        color: 'white'
      }
    },
    {
      type: 'error',
      background: '#FF6584',
      icon: {
        className: 'bi bi-exclamation-circle',
        tagName: 'i',
        color: 'white'
      }
    }
  ]
});

function App() {
  const [user, setUser] = useState({ id: null, isAdmin: false });
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser({ id: null, isAdmin: false });
    notyf.success('Logged out successfully');
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('https://blogapp-api-eezt.onrender.com/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data._id) {
          setUser({
            id: data._id,
            email: data.email,
            username: data.username,
            isAdmin: data.isAdmin
          });
        } else {
          logout();
        }
      })
      .catch(() => logout())
      .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [logout]);

  if (isLoading) return <Loading />;

  return (
    <UserContext.Provider value={{ user, setUser, logout, notyf }}>
      <Router>
        <div className="app-background">
          <AppNavbar />
          <main className="flex-grow-1">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={user.id ? <Navigate to="/blogs" /> : <Login />} />
                <Route path="/register" element={user.id ? <Navigate to="/blogs" /> : <Register />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/blogs/:id" element={<BlogDetails />} />
                <Route path="/my-blogs" element={user.id ? <MyBlogs /> : <Navigate to="/login" />} />
                <Route path="/logout" element={<Logout />} />
              </Routes>
            </AnimatePresence>
          </main>
          <Footer />
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;