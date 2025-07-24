import { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import UserContext from '../context/UserContext';
import '../styles/Register.css';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUser, notyf } = useContext(UserContext);
  const navigate = useNavigate();

  const registerUser = (e) => {
    e.preventDefault();
    setIsLoading(true);

    fetch('https://blogapp-api-eezt.onrender.com/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    })
    .then(res => {
      if (res.ok) {
        return res.json().then(data => {
          notyf.success('Registration successful! Please login.');
          navigate('/login');
        });
      }
      return res.json().then(errorData => {
        notyf.error(errorData.message || 'Registration failed');
      });
    })
    .catch(error => {
      console.error('Network error:', error);
      notyf.error('Network error - please try again');
    })
    .finally(() => setIsLoading(false));
  };

  return (
    <div className="auth-container">
      <motion.div 
        className="auth-card shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="auth-header">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Create Account
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Join our community
          </motion.p>
        </div>
        
        <Form onSubmit={registerUser} className="auth-form">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Form.Group className="form-group">
              <Form.Label>Username</Form.Label>
              <Form.Control 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength="3"
                placeholder="Choose a username"
                className="form-input"
              />
            </Form.Group>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Form.Group className="form-group">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="form-input"
              />
            </Form.Group>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Form.Group className="form-group">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="8"
                placeholder="At least 8 characters"
                className="form-input"
              />
            </Form.Group>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button 
              variant="primary" 
              type="submit" 
              disabled={isLoading}
              className="auth-btn"
            >
              {isLoading ? 'Registering...' : 'Register'}
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="auth-footer"
          >
            <p>
              Already have an account? <a href="/login" className="auth-link">Login</a>
            </p>
          </motion.div>
        </Form>
      </motion.div>
    </div>
  );
}