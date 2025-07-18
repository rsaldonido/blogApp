// UserView.js
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import BlogCard from './BlogCard';

export default function UserView({ blogs, searchTerm, setSearchTerm, sortOrder, setSortOrder }) {
  return (
    <Container className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Blog Posts</h2>
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
        {blogs.length === 0 ? (
          <Col>
            <p>No blogs found.</p>
          </Col>
        ) : (
          blogs.map(blog => (
            <Col key={blog._id} lg={4} md={6} className="mb-4">
              <BlogCard blog={blog} />
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
}