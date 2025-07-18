// MyBlogs.js
import { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Spinner, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Notyf } from 'notyf';
import UserContext from '../context/UserContext';
import BlogCard from '../components/BlogCard';
import AddBlogModal from '../components/AddBlogModal';
import EditBlogModal from '../components/EditBlogModal';

export default function MyBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const { user } = useContext(UserContext);
  const notyf = new Notyf();

  const fetchBlogs = () => {
    setIsLoading(true);
    fetch(`https://blogapp-api-eezt.onrender.com/blogs/myblogs`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch blogs');
        }
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
          notyf.success('Blog deleted!');
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
      <Container className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Blog Posts</h2>
        <Button onClick={() => setShowAddModal(true)}>
          Add New Blog
        </Button>
      </div>

      <div className="d-flex justify-content-between mb-4">
        <Form.Control
          type="text"
          placeholder="Search blogs..."
          style={{ width: '300px' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div>
          <Button 
            variant={sortOrder === 'newest' ? 'primary' : 'outline-primary'} 
            onClick={() => setSortOrder('newest')}
            className="me-2"
          >
            Newest First
          </Button>
          <Button 
            variant={sortOrder === 'oldest' ? 'primary' : 'outline-primary'} 
            onClick={() => setSortOrder('oldest')}
          >
            Oldest First
          </Button>
        </div>
      </div>

      <Row>
        {sortedBlogs.length === 0 ? (
          <Col>
            <p>No blogs found. Create your first blog!</p>
          </Col>
        ) : (
          sortedBlogs.map(blog => (
            <Col key={blog._id} lg={4} md={6} className="mb-4">
              <BlogCard blog={blog}>
                <div className="d-flex justify-content-between mt-3">
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    onClick={() => handleEditClick(blog)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    onClick={() => deleteBlog(blog._id)}
                  >
                    Delete
                  </Button>
                </div>
              </BlogCard>
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