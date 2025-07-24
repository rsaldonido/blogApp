import { Table, Button, Container, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useContext } from 'react';
import UserContext from '../context/UserContext';
import AddBlogModal from './AddBlogModal';
import EditBlogModal from './EditBlogModal';
import '../styles/AdminView.css';

export default function AdminView({ blogs, fetchBlogs, searchTerm, setSearchTerm, sortOrder, setSortOrder }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const { notyf } = useContext(UserContext);

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

  return (
    <Container className="admin-view-container">
      <motion.div 
        className="admin-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>Admin Dashboard</h2>
        <Button 
          onClick={() => setShowAddModal(true)}
          className="add-blog-btn"
          variant="primary"
        >
          <i className="bi bi-plus-lg me-1"></i> Add Blog
        </Button>
      </motion.div>

      <motion.div 
        className="admin-controls"
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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Table striped bordered hover responsive className="admin-table shadow-sm">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog, index) => (
              <tr key={blog._id}>
                <td>{blog.title}</td>
                <td>{blog.author?.username}</td>
                <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                <td className="actions-cell">
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      onClick={() => handleEditClick(blog)}
                      className="action-btn me-2"
                    >
                      <i className="bi bi-pencil me-1"></i> Edit
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Button 
                      variant="danger" 
                      size="sm" 
                      onClick={() => deleteBlog(blog._id)}
                      className="action-btn me-2"
                    >
                      <i className="bi bi-trash me-1"></i> Delete
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Button 
                      as={Link} 
                      to={`/blogs/${blog._id}`} 
                      size="sm" 
                      variant="outline-secondary"
                      className="action-btn"
                    >
                      <i className="bi bi-eye me-1"></i> View
                    </Button>
                  </motion.div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </motion.div>

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