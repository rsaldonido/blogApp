import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import UserContext from '../context/UserContext';
import CommentSection from '../components/CommentSection';
import '../styles/BlogDetails.css';

export default function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);

  const fetchBlogAndComments = () => {
    setIsLoading(true);
    setError(null);

    fetch(`https://blogapp-api-eezt.onrender.com/blogs/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data._id) {
          setBlog(data);
          fetchComments();
        } else {
          setError('Blog not found');
          setIsLoading(false);
        }
      })
      .catch(err => {
        setError('Failed to fetch blog');
        setIsLoading(false);
      });
  };

  const fetchComments = () => {
    fetch(`https://blogapp-api-eezt.onrender.com/blogs/${id}/comments`)
      .then(res => res.json())
      .then(data => {
        setComments(data);
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchBlogAndComments();
  }, [id]);

  if (isLoading) {
    return (
      <Container className="loading-container">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="error-container">
        <Alert variant="danger" className="error-alert shadow-sm">
          <Alert.Heading>{error}</Alert.Heading>
          <div className="mt-3">
            <Button 
              variant="outline-primary" 
              onClick={() => navigate(-1)}
              className="back-btn"
            >
              <i className="bi bi-arrow-left me-2"></i> Go Back
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="blog-details-container">
      {blog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="navigation-buttons mb-4">
            <Button 
              variant="outline-secondary" 
              onClick={() => navigate('/blogs')} 
              className="back-btn"
            >
              <i className="bi bi-arrow-left me-2"></i> Back to Blogs
            </Button>
            {user.id === blog.author?._id && (
              <Button 
                variant="outline-primary" 
                onClick={() => navigate('/my-blogs')}
                className="my-blogs-btn"
              >
                <i className="bi bi-collection me-2"></i> My Blogs
              </Button>
            )}
          </div>

          <Card className="blog-content-card shadow-sm mb-5">
            <Card.Body>
              <Card.Title className="blog-title mb-3">{blog.title}</Card.Title>
              
              <div className="d-flex align-items-center mb-4">
                <Badge bg="light" text="dark" className="me-3">
                  <i className="bi bi-person-fill me-1"></i>
                  {blog.author?.username || 'Unknown'}
                </Badge>
                <Badge bg="light" text="dark" className="me-3">
                  <i className="bi bi-calendar me-1"></i>
                  {new Date(blog.createdAt).toLocaleDateString()}
                </Badge>
                {blog.updatedAt && (
                  <Badge bg="light" text="dark">
                    <i className="bi bi-arrow-repeat me-1"></i>
                    Updated: {new Date(blog.updatedAt).toLocaleDateString()}
                  </Badge>
                )}
              </div>
              
              <Card.Text className="blog-text">
                {blog.content}
              </Card.Text>
            </Card.Body>
          </Card>

          <CommentSection 
            blogId={id} 
            comments={comments} 
            fetchComments={fetchComments}
            blogAuthorId={blog.author?._id}
          />
        </motion.div>
      )}
    </Container>
  );
}