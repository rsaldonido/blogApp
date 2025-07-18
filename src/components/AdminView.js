// AdminView.js
import { Table, Button, Container, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Notyf } from 'notyf';
import { useState } from 'react';
import AddBlogModal from './AddBlogModal';
import EditBlogModal from './EditBlogModal';

export default function AdminView({ blogs, fetchBlogs, searchTerm, setSearchTerm, sortOrder, setSortOrder }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const notyf = new Notyf();

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

  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Admin Dashboard</h2>
        <Button onClick={() => setShowAddModal(true)}>
          Add Blog
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

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map(blog => (
            <tr key={blog._id}>
              <td>{blog.title}</td>
              <td>{blog.author?.username}</td>
              <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
              <td>
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  onClick={() => handleEditClick(blog)}
                  className="me-2"
                >
                  Edit
                </Button>
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={() => deleteBlog(blog._id)}
                  className="me-2"
                >
                  Delete
                </Button>
                <Button as={Link} to={`/blogs/${blog._id}`} size="sm" variant="outline-secondary">
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

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