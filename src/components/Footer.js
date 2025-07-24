import { useContext } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import UserContext from '../context/UserContext';
import { motion } from 'framer-motion';
import '../styles/Footer.css';

export default function Footer() {
  const { user } = useContext(UserContext);

  return (
    <footer className="footer mt-auto py-4 bg-white shadow-sm">
      <Container>
        <Row className="g-4">
          <Col md={4} className="text-center text-md-start">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h5 className="d-flex align-items-center justify-content-center justify-content-md-start">
                <i className="bi bi-pen me-2"></i>
                <span className="gradient-text">Blogsicle</span>
              </h5>
              <p className="text-muted">Share your thoughts with the world</p>
            </motion.div>
          </Col>
          
          <Col md={4} className="text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h5>Quick Links</h5>
              <ul className="list-unstyled">
                <li><a href="/" className="text-dark"><i className="bi bi-house me-1"></i> Home</a></li>
                <li><a href="/blogs" className="text-dark"><i className="bi bi-journal-text me-1"></i> Blogs</a></li>
                {user.id && <li><a href="/my-blogs" className="text-dark"><i className="bi bi-collection me-1"></i> My Blogs</a></li>}
              </ul>
            </motion.div>
          </Col>
          
          <Col md={4} className="text-center text-md-end">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h5>Connect With Us</h5>
              <div className="social-links mt-3">
                <motion.a 
                  href="#" 
                  className="text-dark me-3"
                  whileHover={{ y: -3, color: '#1DA1F2' }}
                >
                  <i className="bi bi-twitter"></i>
                </motion.a>
                <motion.a 
                  href="#" 
                  className="text-dark me-3"
                  whileHover={{ y: -3, color: '#4267B2' }}
                >
                  <i className="bi bi-facebook"></i>
                </motion.a>
                <motion.a 
                  href="#" 
                  className="text-dark me-3"
                  whileHover={{ y: -3, color: '#E1306C' }}
                >
                  <i className="bi bi-instagram"></i>
                </motion.a>
                <motion.a 
                  href="#" 
                  className="text-dark"
                  whileHover={{ y: -3, color: '#333' }}
                >
                  <i className="bi bi-github"></i>
                </motion.a>
              </div>
            </motion.div>
          </Col>
        </Row>
        
        <Row>
          <Col className="text-center mt-4">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <small className="text-muted">&copy; {new Date().getFullYear()} Blogsicle. All rights reserved.</small>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}