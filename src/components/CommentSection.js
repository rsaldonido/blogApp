import { useState, useEffect, useContext } from 'react';
import { Card, Form, Button, Badge, Alert } from 'react-bootstrap';
import { motion } from 'framer-motion';
import UserContext from '../context/UserContext';
import '../styles/CommentSection.css';

export default function CommentSection({ blogId, comments, fetchComments, blogAuthorId }) {
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const { user, notyf } = useContext(UserContext);

  const handleAddComment = (e) => {
    e.preventDefault();
    const trimmedComment = newComment.trim();
    if (!trimmedComment) return;

    setIsLoading(true);

    fetch(`http://localhost:4000/blogs/comments/${blogId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ comment: trimmedComment })
    })
    .then(res => {
      if (!res.ok) throw new Error('Failed to add comment');
      return res.json();
    })
    .then(data => {
      if (data._id) {
        notyf.success('Comment added successfully!');
        setNewComment('');
        fetchComments();
      } else {
        notyf.error(data.message || 'Failed to add comment');
      }
    })
    .catch(err => {
      notyf.error('Error adding comment');
      console.error('Comment error:', err);
    })
    .finally(() => setIsLoading(false));
  };

  const handleDeleteComment = (commentId, commentAuthorId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    if (!(user.isAdmin || user.id === commentAuthorId || user.id === blogAuthorId)) {
      notyf.error('You are not authorized to delete this comment');
      return;
    }

    fetch(`http://localhost:4000/blogs/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.message === 'Comment deleted successfully') {
        notyf.success('Comment deleted successfully!');
        fetchComments();
      } else {
        notyf.error(data.message || 'Failed to delete comment');
      }
    });
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment._id);
    setEditCommentText(comment.comment);
  };

  const handleUpdateComment = (commentId) => {
    const trimmedComment = editCommentText.trim();
    if (!trimmedComment) return;

    setIsLoading(true);

    fetch(`http://localhost:4000/blogs/comments/${commentId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ comment: trimmedComment })
    })
    .then(res => {
      if (!res.ok) throw new Error('Failed to update comment');
      return res.json();
    })
    .then(data => {
      notyf.success('Comment updated successfully!');
      setEditingCommentId(null);
      fetchComments();
    })
    .catch(err => {
      notyf.error(err.message || 'Failed to update comment');
      console.error('Update error:', err);
    })
    .finally(() => setIsLoading(false));
  };

  return (
    <div className="comment-section">
      <motion.h4 
        className="comment-section-title"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Comments ({comments.length})
      </motion.h4>
      
      {user.id ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Form onSubmit={handleAddComment} className="comment-form shadow-sm">
            <Form.Group>
              <Form.Label className="comment-form-label">Add Your Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="comment-textarea"
              />
            </Form.Group>
            <Button 
              variant="primary" 
              type="submit" 
              disabled={isLoading} 
              className="submit-comment-btn mt-3"
            >
              {isLoading ? 'Posting...' : 'Post Comment'}
            </Button>
          </Form>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Alert variant="info" className="login-alert shadow-sm">
            Please <a href="/login" className="login-link">login</a> to leave a comment
          </Alert>
        </motion.div>
      )}

      <div className="comments-list mt-4">
        {comments.length === 0 ? (
          <motion.p 
            className="no-comments"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            No comments yet. Be the first to comment!
          </motion.p>
        ) : (
          comments.map((comment, index) => (
            <motion.div
              key={comment._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + (index * 0.05) }}
            >
              <Card className="comment-card shadow-sm mb-3">
                <Card.Body>
                  <div className="comment-header">
                    <div className="comment-author">
                      <Card.Subtitle className="comment-author-name d-flex align-items-center">
                        {comment.author?.username || 'Anonymous'}
                        {comment.author?._id === user.id && (
                          <Badge bg="primary" className="you-badge ms-2">
                            You
                          </Badge>
                        )}
                      </Card.Subtitle>
                      <Badge bg="light" text="dark" className="comment-date">
                        <i className="bi bi-clock me-1"></i>
                        {new Date(comment.createdAt).toLocaleString()}
                      </Badge>
                    </div>
                    
                    {(user.id === comment.author?._id || user.isAdmin || user.id === blogAuthorId) && (
                      <div className="comment-actions">
                        {user.id === comment.author?._id && (
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleEditComment(comment)}
                            className="edit-comment-btn me-2"
                            disabled={editingCommentId !== null}
                          >
                            <i className="bi bi-pencil me-1"></i> Edit
                          </Button>
                        )}
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteComment(comment._id, comment.author?._id)}
                          className="delete-comment-btn"
                          disabled={editingCommentId !== null}
                        >
                          <i className="bi bi-trash me-1"></i> Delete
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {editingCommentId === comment._id ? (
                    <Form.Group className="editing-comment mt-3">
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={editCommentText}
                        onChange={(e) => setEditCommentText(e.target.value)}
                        className="edit-comment-textarea mb-2"
                      />
                      <div className="edit-comment-buttons">
                        <Button 
                          variant="success" 
                          size="sm" 
                          onClick={() => handleUpdateComment(comment._id)}
                          disabled={isLoading}
                          className="me-2"
                        >
                          <i className="bi bi-check me-1"></i> Save
                        </Button>
                        <Button 
                          variant="outline-secondary" 
                          size="sm" 
                          onClick={() => setEditingCommentId(null)}
                          disabled={isLoading}
                        >
                          <i className="bi bi-x me-1"></i> Cancel
                        </Button>
                      </div>
                    </Form.Group>
                  ) : (
                    <Card.Text className="comment-text mt-3">
                      {comment.comment}
                    </Card.Text>
                  )}
                </Card.Body>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}