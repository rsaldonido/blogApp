// Blogs.js
import { useState, useEffect, useContext } from 'react';
import { Spinner, Form, Button } from 'react-bootstrap';
import { Notyf } from 'notyf';
import UserContext from '../context/UserContext';
import AdminView from '../components/AdminView';
import UserView from '../components/UserView';

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const { user } = useContext(UserContext);
  const notyf = new Notyf();

  const fetchBlogs = () => {
    setIsLoading(true);
    fetch('http://localhost:4000/blogs')
      .then(res => res.json())
      .then(data => {
        setBlogs(data);
        setIsLoading(false);
      })
      .catch(err => {
        notyf.error('Failed to fetch blogs');
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
      <div className="d-flex justify-content-center mt-5">
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