import { Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import '../styles/Loading.css';

export default function Loading() {
  return (
    <div className="loading-container">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Spinner animation="border" role="status" className="loading-spinner">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </motion.div>
    </div>
  );
}