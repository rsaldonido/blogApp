import { useContext } from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import UserContext from '../context/UserContext';
import { motion } from 'framer-motion';
import '../styles/AppNavbar.css';

export default function AppNavbar() {
  const { user } = useContext(UserContext);

  return (
    <Navbar expand="lg" sticky="top" className="navbar-custom shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand">
          <motion.span 
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            className="d-flex align-items-center"
          >
            <i className="bi bi-pen me-2"></i>
            <span className="text-dark">Blogsicle</span>
          </motion.span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="navbar-toggler" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Nav.Link as={Link} to="/" className="nav-link">
                <i className="bi bi-house-door me-1"></i> Home
              </Nav.Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Nav.Link as={Link} to="/blogs" className="nav-link">
                <i className="bi bi-journal-text me-1"></i> Blogs
              </Nav.Link>
            </motion.div>
            {user.id && (
              <motion.div whileHover={{ scale: 1.05 }}>
                <Nav.Link as={Link} to="/my-blogs" className="nav-link">
                  <i className="bi bi-collection me-1"></i> My Blogs
                </Nav.Link>
              </motion.div>
            )}
          </Nav>
          <Nav>
            {user.id ? (
              <NavDropdown 
                title={
                  <motion.span 
                    className="d-inline-flex align-items-center user-dropdown"
                    whileHover={{ scale: 1.05 }}
                  >
                    <i className="bi bi-person-circle me-1"></i>
                    {user.username}
                  </motion.span>
                } 
                id="basic-nav-dropdown"
                className="dropdown-custom"
                align="end"
              >
                {user.isAdmin && (
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <NavDropdown.Item as={Link} to="/admin" className="dropdown-item">
                      <i className="bi bi-speedometer2 me-2"></i>Admin Dashboard
                    </NavDropdown.Item>
                  </motion.div>
                )}
                <motion.div whileHover={{ scale: 1.02 }}>
                  <NavDropdown.Item as={Link} to="/logout" className="dropdown-item">
                    <i className="bi bi-box-arrow-right me-2"></i>Logout
                  </NavDropdown.Item>
                </motion.div>
              </NavDropdown>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Nav.Link as={Link} to="/login" className="nav-link">
                    <i className="bi bi-box-arrow-in-right me-1"></i> Login
                  </Nav.Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Nav.Link as={Link} to="/register" className="nav-link register-link">
                    <i className="bi bi-person-plus me-1"></i> Register
                  </Nav.Link>
                </motion.div>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}