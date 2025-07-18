// BlogDetails.js
import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { Notyf } from 'notyf';
import UserContext from '../context/UserContext';
import CommentSection from '../components/CommentSection';

export default function BlogDetails() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(UserContext);
  const notyf = new Notyf();

  const fetchBlogAndComments = () => {
    setIsLoading(true);
    setError(null);

    fetch(`http://localhost:4000/blogs/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data._id) {
          setBlog(data);
          fetchComments();
        } else {
          setError('Blog not found');
          setIsLoading(false);
        }
      });
  };

  const fetchComments = () => {
    fetch(`http://localhost:4000/blogs/${id}/comments`)
      .then(res => res.json())
      .then(data => {
        setComments(data);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchBlogAndComments();
  }, [id]);

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          {error}
          <br />
          <Button variant="outline-primary" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      {blog && (
        <>
          <div className="d-flex mb-4">
            <Button variant="outline-secondary" href="/blogs" className="me-2">
              Back to Blogs
            </Button>
            {user.id === blog.author?._id && (
              <Button variant="outline-primary" href={`/my-blogs`} className="me-2">
                My Blogs
              </Button>
            )}
          </div>

          <Card className="mb-4">
            <Card.Body>
              <Card.Title className="display-5">{blog.title}</Card.Title>
              <Card.Subtitle className="mb-3 text-muted">
                By {blog.author?.username || 'Unknown'} on {new Date(blog.createdAt).toLocaleDateString()}
              </Card.Subtitle>
              {blog.updatedAt && (
                <Badge bg="info" className="mb-3">
                  Updated: {new Date(blog.updatedAt).toLocaleDateString()}
                </Badge>
              )}
              <Card.Text className="lead" style={{ whiteSpace: 'pre-line' }}>
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
        </>
      )}
    </Container>
  );
}