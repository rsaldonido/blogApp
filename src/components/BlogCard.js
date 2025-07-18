import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function BlogCard({ blog, children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ height: '100%' }} 
    >
      <Card className="mb-3" style={{ 
        height: '400px',
        width: '100%',
        overflow: 'hidden'
      }}>
        <Card.Body className="d-flex flex-column h-100">
          <Card.Title className="text-truncate">{blog.title}</Card.Title>
          <div className="mb-2">
            <Badge bg="secondary" className="me-1">By {blog.author?.username || 'Unknown'}</Badge>
            <Badge bg="info">{new Date(blog.createdAt).toLocaleDateString()}</Badge>
          </div>
          <div 
            className="text-muted mb-3 flex-grow-1" 
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: '3', // Show max 3 lines
              WebkitBoxOrient: 'vertical'
            }}
          >
            {blog.content}
          </div>
          <div className="mt-auto">
            <Button 
              as={Link} 
              to={`/blogs/${blog._id}`} 
              variant="primary" 
              className="w-100 mb-2"
            >
              Read More
            </Button>
            {children}
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
}