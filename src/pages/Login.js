import { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import UserContext from '../context/UserContext';
import '../styles/Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUser, notyf } = useContext(UserContext);
  const navigate = useNavigate();

  const loginUser = (e) => {
    e.preventDefault();
    setIsLoading(true);

    fetch('http://localhost:4000/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
      if (data.accessToken) {
        localStorage.setItem('token', data.accessToken);
        setUser({
          id: data.user.id,
          email: data.user.email,
          username: data.user.username,
          isAdmin: data.user.isAdmin
        });
        notyf.success('Login successful!');
        navigate('/blogs');
      } else {
        notyf.error(data.message || 'Login failed');
      }
    })
    .catch(err => {
      notyf.error('Login failed. Please try again.');
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
            Welcome Back
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Please login to your account
          </motion.p>
        </div>
        
        <Form onSubmit={loginUser} className="auth-form">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Form.Group className="form-group">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
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
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="form-input"
              />
            </Form.Group>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button 
              variant="primary" 
              type="submit" 
              disabled={isLoading}
              className="auth-btn"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="auth-footer"
          >
            <p>
              Don't have an account? <a href="/register" className="auth-link">Register</a>
            </p>
          </motion.div>
        </Form>
      </motion.div>
    </div>
  );
}