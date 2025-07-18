import { useContext } from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import UserContext from '../context/UserContext';

export default function Home() {
  const { user } = useContext(UserContext);

  return (
    <Container className="mt-5 text-center">
      <h1>Welcome to Vox Wall</h1>
      <p className="lead">
        Your Wall, Your Vox
      </p>
      {user.id ? (
        <Button as={Link} to="/blogs" variant="primary" size="lg">
          View Blogs
        </Button>
      ) : (
        <div>
          <Button as={Link} to="/login" variant="primary" size="lg" className="me-3">
            Login
          </Button>
          <Button as={Link} to="/register" variant="secondary" size="lg">
            Register
          </Button>
        </div>
      )}
    </Container>
  );
}