import { useState, useContext } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { Notyf } from 'notyf';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const notyf = new Notyf();


  const loginUser = (e) => {
      e.preventDefault();
      setIsLoading(true);

      fetch('https://blogapp-api-eezt.onrender.com/users/login', {
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
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card p-4">
            <h2 className="text-center mb-4">Login</h2>
            <Form onSubmit={loginUser}>
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
                />
              </Form.Group>
              <Button 
                variant="primary" 
                type="submit" 
                disabled={isLoading}
                className="w-100"
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
              <div className="text-center mt-3">
                <small>
                  Don't have an account? <a href="/register">Register</a>
                </small>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}