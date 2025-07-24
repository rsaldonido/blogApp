import { useState, useEffect, useContext } from 'react';
import { Spinner, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import UserContext from '../context/UserContext';
import AdminView from '../components/AdminView';
import UserView from '../components/UserView';
import '../styles/Blogs.css';

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const { user } = useContext(UserContext);

  const fetchBlogs = () => {
    setIsLoading(true);
    fetch('https://blogapp-api-eezt.onrender.com/blogs')
      .then(res => res.json())
      .then(data => {
        setBlogs(data);
        setIsLoading(false);
      })
      .catch(err => {
        toast.error('Failed to fetch blogs');
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter(blog => 
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedBlogs = [...filteredBlogs].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  if (isLoading) {
    return (
      <div className="blogs-loading-container">
        <Spinner animation="border" />
      </div>
    );
  }

  return user.isAdmin ? (
    <AdminView 
      blogs={sortedBlogs} 
      fetchBlogs={fetchBlogs} 
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      sortOrder={sortOrder}
      setSortOrder={setSortOrder}
    />
  ) : (
    <UserView 
      blogs={sortedBlogs} 
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      sortOrder={sortOrder}
      setSortOrder={setSortOrder}
    />
  );
}