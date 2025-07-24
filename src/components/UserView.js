import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import BlogCard from './BlogCard';
import '../styles/UserView.css';

export default function UserView({ blogs, searchTerm, setSearchTerm, sortOrder, setSortOrder }) {
  return (
    <Container className="user-view-container">
      <motion.div 
        className="user-view-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>Explore Blog Posts</h2>
        <p className="text-muted">Discover stories, ideas, and perspectives from our community</p>
      </motion.div>

      <motion.div 
        className="user-view-controls"
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
        {blogs.length === 0 ? (
          <Col className="no-blogs-message">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center p-5 bg-white rounded-3 shadow-sm"
            >
              <i className="bi bi-journal-x display-4 text-muted mb-3"></i>
              <h4>No blogs found</h4>
              <p className="text-muted">Try adjusting your search or filters</p>
            </motion.div>
          </Col>
        ) : (
          blogs.map((blog, index) => (
            <Col key={blog._id} lg={4} md={6} className="blog-col">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + (index * 0.05) }}
              >
                <BlogCard blog={blog} />
              </motion.div>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
}