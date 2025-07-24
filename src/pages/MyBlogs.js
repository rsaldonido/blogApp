import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Spinner, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import UserContext from '../context/UserContext';
import BlogCard from '../components/BlogCard';
import AddBlogModal from '../components/AddBlogModal';
import EditBlogModal from '../components/EditBlogModal';
import '../styles/MyBlogs.css';

export default function MyBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const { user, notyf } = useContext(UserContext);

  const fetchBlogs = () => {
    setIsLoading(true);
    fetch(`https://blogapp-api-eezt.onrender.com/blogs/myblogs`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch blogs');
        return res.json();
      })
      .then(data => {
        setBlogs(Array.isArray(data) ? data : []);
        setIsLoading(false);
      })
      .catch(err => {
        notyf.error('Failed to fetch blogs');
        setBlogs([]); 
        setIsLoading(false);
      });
  };

  const deleteBlog = (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      fetch(`https://blogapp-api-eezt.onrender.com/blogs/${blogId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (data.message === 'Blog and comments deleted successfully') {
          notyf.success('Blog deleted successfully!');
          fetchBlogs();
        } else {
          notyf.error(data.message || 'Failed to delete blog');
        }
      });
    }
  };

  const handleEditClick = (blog) => {
    setSelectedBlog(blog);
    setShowEditModal(true);
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
      <Container className="myblogs-loading-container">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="myblogs-container">
      <motion.div 
        className="myblogs-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>My Blog Posts</h2>
        <Button 
          onClick={() => setShowAddModal(true)}
          className="add-blog-btn"
          variant="primary"
        >
          <i className="bi bi-plus-lg me-1"></i> Add New Blog
        </Button>
      </motion.div>

      <motion.div 
        className="myblogs-controls"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Form.Control
          type="text"
          placeholder="Search blogs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div className="sort-buttons">
          <Button 
            variant={sortOrder === 'newest' ? 'primary' : 'outline-primary'} 
            onClick={() => setSortOrder('newest')}
            className="sort-btn"
          >
            <i className="bi bi-sort-down me-1"></i> Newest
          </Button>
          <Button 
            variant={sortOrder === 'oldest' ? 'primary' : 'outline-primary'} 
            onClick={() => setSortOrder('oldest')}
            className="sort-btn"
          >
            <i className="bi bi-sort-up me-1"></i> Oldest
          </Button>
        </div>
      </motion.div>

      <Row className="blogs-grid g-4">
        {sortedBlogs.length === 0 ? (
          <Col className="no-blogs-message">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center p-5 bg-white rounded-3 shadow-sm"
            >
              <i className="bi bi-journal-x display-4 text-muted mb-3"></i>
              <h4>No blogs found</h4>
              <p className="text-muted">Create your first blog to get started!</p>
              <Button 
                variant="primary" 
                onClick={() => setShowAddModal(true)}
                className="mt-3"
              >
                <i className="bi bi-plus-lg me-1"></i> Add Blog
              </Button>
            </motion.div>
          </Col>
        ) : (
          sortedBlogs.map((blog, index) => (
            <Col key={blog._id} lg={4} md={6} className="blog-col">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + (index * 0.05) }}
              >
                <BlogCard blog={blog}>
                  <div className="blog-actions">
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      onClick={() => handleEditClick(blog)}
                      className="action-btn"
                    >
                      <i className="bi bi-pencil me-1"></i> Edit
                    </Button>
                    <Button 
                      variant="danger" 
                      size="sm" 
                      onClick={() => deleteBlog(blog._id)}
                      className="action-btn"
                    >
                      <i className="bi bi-trash me-1"></i> Delete
                    </Button>
                  </div>
                </BlogCard>
              </motion.div>
            </Col>
          ))
        )}
      </Row>

      <AddBlogModal 
        show={showAddModal} 
        handleClose={() => setShowAddModal(false)}
        fetchBlogs={fetchBlogs}
      />

      <EditBlogModal 
        show={showEditModal} 
        handleClose={() => setShowEditModal(false)}
        blog={selectedBlog}
        fetchBlogs={fetchBlogs}
      />
    </Container>
  );
}