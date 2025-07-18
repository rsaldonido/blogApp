import { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const notyf = new Notyf();

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
  .finally(() => {
    setIsLoading(false);
  });
};

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card p-4">
            <h2 className="text-center mb-4">Register</h2>
            <Form onSubmit={registerUser}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  minLength="3"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength="8"
                  placeholder = "At least 8 characters"
                />
              </Form.Group>
              <Button 
                variant="primary" 
                type="submit" 
                disabled={isLoading}
                className="w-100"
              >
                {isLoading ? 'Registering...' : 'Register'}
              </Button>
              <div className="text-center mt-3">
                <small>
                  Already have an account? <a href="/login">Login</a>
                </small>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}