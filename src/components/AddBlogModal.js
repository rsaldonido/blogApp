import { useState, useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { motion } from 'framer-motion';
import UserContext from '../context/UserContext';
import '../styles/AddBlogModal.css';


export default function AddBlogModal({ show, handleClose, fetchBlogs }) {
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { notyf } = useContext(UserContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    fetch('http://localhost:4000/blogs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => {
      if (data._id) {
        notyf.success('Blog created successfully!');
        fetchBlogs();
        handleClose();
        setFormData({ title: '', content: '' });
      } else {
        notyf.error(data.message || 'Failed to create blog');
      }
    })
    .catch(err => {
      notyf.error('Failed to create blog');
      console.error('Error:', err);
    })
    .finally(() => setIsLoading(false));
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered className="add-blog-modal">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="modal-title">Create New Blog</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-0">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="form-group">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Enter blog title"
            />
          </Form.Group>

          <Form.Group className="form-group">
            <Form.Label>Content</Form.Label>
            <Form.Control
              as="textarea"
              rows={10}
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              className="form-textarea"
              placeholder="Write your blog content here..."
            />
          </Form.Group>

          <div className="modal-footer-buttons">
            <motion.div whileHover={{ scale: 1.02 }}>
              <Button 
                variant="outline-secondary" 
                onClick={handleClose}
                className="cancel-btn"
                disabled={isLoading}
              >
                Cancel
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Button 
                variant="primary" 
                type="submit" 
                disabled={isLoading}
                className="submit-btn"
              >
                {isLoading ? 'Creating...' : 'Create Blog'}
              </Button>
            </motion.div>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}