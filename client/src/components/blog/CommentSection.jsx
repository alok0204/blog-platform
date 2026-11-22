import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Send, Trash2, Edit3, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { getComments, createComment, updateComment, deleteComment } from '../../services/api';

export default function CommentSection({ postId }) {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Editing state
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    if (postId) {
      loadComments(1);
    }
  }, [postId]);

  const loadComments = async (targetPage = 1) => {
    try {
      setLoading(true);
      const res = await getComments(postId, { page: targetPage, limit: 10 });
      if (res) {
        if (targetPage === 1) {
          setComments(res.comments || []);
        } else {
          setComments((prev) => [...prev, ...(res.comments || [])]);
        }
        setTotalPages(res.totalPages || 1);
        setTotalCount(res.total || 0);
        setPage(targetPage);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      await createComment({
        postId,
        content: newComment.trim(),
      });
      toast.success('Comment posted successfully');
      setNewComment('');
      loadComments(1);
    } catch (err) {
      toast.error(err.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const handleUpdateComment = async (commentId) => {
    if (!editContent.trim()) return;
    try {
      setEditLoading(true);
      await updateComment(commentId, { content: editContent.trim() });
      toast.success('Comment updated');
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, content: editContent.trim(), updatedAt: new Date().toISOString() } : c))
      );
      cancelEdit();
    } catch (err) {
      toast.error(err.message || 'Failed to update comment');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      await deleteComment(commentId);
      toast.success('Comment deleted');
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      setTotalCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      toast.error(err.message || 'Failed to delete comment');
    }
  };

  return (
    <section className="ink-card p-6 sm:p-8 mt-12 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[var(--line)]">
        <h3 className="text-lg font-bold text-[var(--text)] flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-primary-400" />
          <span>Discussion ({totalCount})</span>
        </h3>
        <span className="ink-tag text-[11px]">Real-time persistence</span>
      </div>

      {/* ─── Add Comment Form ───────────────────────────────── */}
      {isAuthenticated ? (
        <form onSubmit={handleCreateComment} className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
            <span>Commenting as</span>
            <span className="font-semibold text-[var(--text)]">{user?.name}</span>
          </div>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            placeholder="Share your perspective, feedback, or technical insight..."
            className="w-full p-3.5 rounded-[8px] bg-[var(--surface)] border border-[var(--line)] text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-all resize-y"
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="ink-btn-accent text-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submitting ? 'Posting...' : 'Post Comment'}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="ink-box p-5 text-center space-y-2">
          <p className="text-xs text-[var(--muted)]">
            Join the conversation. Sign in to share your thoughts and interact with other authors.
          </p>
          <div className="pt-1 flex items-center justify-center gap-3">
            <Link to="/login" className="ink-btn-pill text-xs">
              Sign In
            </Link>
            <Link to="/register" className="ink-btn-accent text-xs">
              Register
            </Link>
          </div>
        </div>
      )}

      {/* ─── Comments List ──────────────────────────────────── */}
      <div className="space-y-4 pt-2">
        {loading && comments.length === 0 ? (
          <p className="text-xs text-[var(--muted)] text-center py-6">Loading discussion...</p>
        ) : comments.length === 0 ? (
          <p className="text-xs text-[var(--muted)] text-center py-6">
            No comments yet. Be the first to share your perspective!
          </p>
        ) : (
          comments.map((comment) => {
            const isAuthor = user && comment.authorId === user.id;
            const isAdmin = user && user.role === 'ADMIN';
            const canManage = isAuthor || isAdmin;
            const isEditing = editingId === comment.id;

            const timeAgo = comment.createdAt
              ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
              : '';

            return (
              <div
                key={comment.id}
                className="ink-box p-4 space-y-2.5 transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[var(--card)] border border-[var(--line)] text-primary-400 font-bold flex items-center justify-center text-xs">
                      {comment.author?.name ? comment.author.name[0].toUpperCase() : 'U'}
                    </div>
                    <span className="font-semibold text-[var(--text)]">
                      {comment.author?.name || 'Reader'}
                    </span>
                    {comment.author?.role === 'ADMIN' && (
                      <span className="ink-tag text-[9px] text-primary-400">ADMIN</span>
                    )}
                    <span className="text-[var(--muted)]">•</span>
                    <span className="text-[var(--muted)] text-[11px]">{timeAgo}</span>
                  </div>

                  {canManage && !isEditing && (
                    <div className="flex items-center gap-1">
                      {isAuthor && (
                        <button
                          onClick={() => startEdit(comment)}
                          className="p-1 rounded text-[var(--muted)] hover:text-primary-400 transition"
                          title="Edit comment"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="p-1 rounded text-[var(--muted)] hover:text-red-400 transition"
                        title={isAdmin && !isAuthor ? 'Admin delete comment' : 'Delete comment'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Comment Content or Inline Edit */}
                {isEditing ? (
                  <div className="space-y-2 pt-1">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={2}
                      className="w-full p-2.5 rounded-[6px] bg-[var(--card)] border border-[var(--line)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={cancelEdit}
                        className="ink-btn-pill text-xs py-1"
                      >
                        <X className="w-3 h-3" />
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdateComment(comment.id)}
                        disabled={editLoading}
                        className="ink-btn-accent text-xs py-1"
                      >
                        <Check className="w-3 h-3" />
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-[var(--text)] leading-relaxed">
                    {comment.content}
                  </p>
                )}
              </div>
            );
          })
        )}

        {/* Load More Button */}
        {page < totalPages && (
          <div className="text-center pt-2">
            <button
              onClick={() => loadComments(page + 1)}
              disabled={loading}
              className="ink-btn-pill text-xs"
            >
              Load more comments
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
