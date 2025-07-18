import { useState, useEffect, useContext } from 'react';
import { Card, Form, Button, Badge, Alert } from 'react-bootstrap';
import { Notyf } from 'notyf';
import UserContext from '../context/UserContext';

export default function CommentSection({ blogId, comments, fetchComments, blogAuthorId }) {
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const notyf = new Notyf();
  const { user } = useContext(UserContext);

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
      if (!res.ok) {
        throw new Error('Failed to add comment');
      }
      return res.json();
    })
    .then(data => {
      if (data._id) {
        notyf.success('Comment added!');
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
        notyf.success('Comment deleted!');
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
      if (!res.ok) {
        throw new Error('Failed to update comment');
      }
      return res.json();
    })
    .then(data => {
      notyf.success('Comment updated!');
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
    <div className="mt-5">
      <h4>Comments ({comments.length})</h4>
      
      {user.id ? (
        <Form onSubmit={handleAddComment} className="mb-4">
          <Form.Group>
            <Form.Label>Add Comment</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              style={{ whiteSpace: 'pre-wrap' }}
            />
          </Form.Group>
          <Button variant="primary" type="submit" disabled={isLoading} className="mt-2">
            {isLoading ? 'Posting...' : 'Post Comment'}
          </Button>
        </Form>
      ) : (
        <Alert variant="info" className="mb-4">
          Please <a href="/login">login</a> to comment
        </Alert>
      )}

      <div className="comments-list">
        {comments.length === 0 ? (
          <p>No comments yet. Be the first to comment!</p>
        ) : (
          comments.map(comment => (
            <Card key={comment._id} className="mb-3">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <Card.Subtitle className="mb-2 text-muted">
                      {comment.author?.username || 'Anonymous'}
                      {comment.author?._id === user.id && (
                        <Badge bg="info" className="ms-2">You</Badge>
                      )}
                    </Card.Subtitle>
                    
                    {editingCommentId === comment._id ? (
                      <Form.Group className="mb-3">
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={editCommentText}
                          onChange={(e) => setEditCommentText(e.target.value)}
                          style={{ whiteSpace: 'pre-wrap' }}
                        />
                        <div className="mt-2">
                          <Button 
                            variant="success" 
                            size="sm" 
                            onClick={() => handleUpdateComment(comment._id)}
                            className="me-2"
                            disabled={isLoading}
                          >
                            Save
                          </Button>
                          <Button 
                            variant="outline-secondary" 
                            size="sm" 
                            onClick={() => setEditingCommentId(null)}
                            disabled={isLoading}
                          >
                            Cancel
                          </Button>
                        </div>
                      </Form.Group>
                    ) : (
                      <Card.Text style={{ whiteSpace: 'pre-line' }}>
                        {comment.comment}
                      </Card.Text>
                    )}
                    
                    <Badge bg="secondary">
                      {new Date(comment.createdAt).toLocaleString()}
                    </Badge>
                  </div>
                  
                  {(user.id === comment.author?._id || user.isAdmin || user.id === blogAuthorId) && (
                    <div className="d-flex flex-column">
                      {user.id === comment.author?._id && (
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleEditComment(comment)}
                          className="mb-2"
                          disabled={editingCommentId !== null}
                        >
                          Edit
                        </Button>
                      )}
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteComment(comment._id, comment.author?._id)}
                        disabled={editingCommentId !== null}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}