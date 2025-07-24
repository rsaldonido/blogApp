import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../styles/BlogCard.css';

export default function BlogCard({ blog, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, type: 'spring' }}
      whileHover={{ y: -5 }}
      className="blog-card-wrapper"
    >
      <Card className="blog-card h-100 shadow-sm border-0 overflow-hidden">
        <Card.Body className="card-body-content d-flex flex-column">
          <Card.Title className="blog-title text-truncate">{blog.title}</Card.Title>
          
          <div className="blog-meta d-flex align-items-center mb-3">
            <Badge bg="light" text="dark" className="author-badge me-2">
              <i className="bi bi-person-fill me-1"></i>
              {blog.author?.username || 'Unknown'}
            </Badge>
            <Badge bg="light" text="dark" className="date-badge">
              <i className="bi bi-calendar me-1"></i>
              {new Date(blog.createdAt).toLocaleDateString()}
            </Badge>
          </div>

          <div className="blog-content-preview flex-grow-1 mb-3">
            {blog.content.length > 150 ? `${blog.content.substring(0, 150)}...` : blog.content}
          </div>

          <div className="card-actions mt-auto">
            <Button 
              as={Link} 
              to={`/blogs/${blog._id}`} 
              variant="primary" 
              className="read-more-btn w-100 d-flex align-items-center justify-content-center"
            >
              Read More <i className="bi bi-arrow-right ms-2"></i>
            </Button>
            {children}
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
}