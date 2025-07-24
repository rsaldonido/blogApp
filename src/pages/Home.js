import { useContext } from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import UserContext from '../context/UserContext';
import '../styles/Home.css';

export default function Home() {
  const { user } = useContext(UserContext);

  return (
    <Container className="home-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="hero-section"
      >
        <motion.h1 
          className="hero-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Welcome to <span className="gradient-text">Blogsicle</span>
        </motion.h1>
        
        <motion.p 
          className="hero-subtitle"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Blogging Just Got Sweeter.
        </motion.p>
        
        {user.id ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button 
              as={Link} 
              to="/blogs" 
              variant="primary" 
              className="hero-btn"
              size="lg"
            >
              Explore Blogs <i className="bi bi-arrow-right ms-2"></i>
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            className="auth-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button 
              as={Link} 
              to="/login" 
              variant="primary" 
              className="auth-btn me-3"
              size="lg"
            >
              <i className="bi bi-box-arrow-in-right me-2"></i> Login
            </Button>
            <Button 
              as={Link} 
              to="/register" 
              variant="primary" 
              className="auth-btn"
              size="lg"
            >
              <i className="bi bi-person-plus me-2"></i> Register
            </Button>
          </motion.div>
        )}
      </motion.div>
    </Container>
  );
}