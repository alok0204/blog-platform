import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Send, Trash2, Edit3, X, Check, AlertCircle } from 'lucide-react';
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
      const created = await createComment({
        postId,
        content: newComment.trim(),
      });
      toast.success('Comment posted successfully');
      setNewComment('');
      // Reload comments to show the new one
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
    <section className="mt-12 pt-10 border-t border-gray-200 dark:border-gray-800" id="comments">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          Discussion ({totalCount})
        </h3>
      </div>

      {/* Comment Input Box */}
      {isAuthenticated ? (
        <form onSubmit={handleCreateComment} className="mb-10">
          <div className="bg-white dark:bg-gray-800/80 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-700/80 transition-all focus-within:border-indigo-500 dark:focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-semibold text-xs shadow-sm">
                {user?.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Commenting as <span className="font-semibold text-gray-900 dark:text-gray-100">{user?.name}</span>
              </span>
            </div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="What are your thoughts on this story? Be respectful and constructive..."
              rows={3}
              maxLength={2000}
              className="w-full bg-transparent border-0 resize-none focus:ring-0 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm md:text-base leading-relaxed"
            />
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700/60 mt-2">
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {2000 - newComment.length} characters remaining
              </span>
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm hover:shadow"
              >
                {submitting ? (
                  <span>Posting...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Post Comment</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-10 p-6 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-center">
          <MessageSquare className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-2 opacity-80" />
          <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">Join the conversation</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
            Sign in to share your perspectives, ask questions, and interact with the author.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              to="/login"
              className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-sm"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-xl transition"
            >
              Create Account
            </Link>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {loading && page === 1 ? (
          <div className="py-12 text-center text-gray-400 dark:text-gray-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent" />
            <p className="mt-3 text-sm">Loading discussion...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="py-12 text-center rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
            <MessageSquare className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <h5 className="text-base font-medium text-gray-800 dark:text-gray-200">No comments yet</h5>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => {
            const isAuthor = user?.id === comment.authorId;
            const isAdmin = user?.role === 'ADMIN';
            const canManage = isAuthor || isAdmin;
            const isEditing = editingId === comment.id;

            let formattedDate = 'Recently';
            try {
              formattedDate = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });
            } catch (e) {
              formattedDate = 'Recently';
            }

            return (
              <div
                key={comment.id}
                className="p-5 rounded-2xl bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800/80 shadow-sm transition hover:border-gray-200 dark:hover:border-gray-700"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {comment.author?.avatarUrl ? (
                      <img
                        src={comment.author.avatarUrl}
                        alt={comment.author.name}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/20"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-semibold text-xs shadow-sm">
                        {comment.author?.name ? comment.author.name[0].toUpperCase() : 'U'}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                          {comment.author?.name || 'Anonymous Reader'}
                        </span>
                        {comment.author?.role === 'ADMIN' && (
                          <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 rounded">
                            Admin
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 dark:text-gray-500">{formattedDate}</span>
                    </div>
                  </div>

                  {canManage && !isEditing && (
                    <div className="flex items-center gap-1">
                      {isAuthor && (
                        <button
                          onClick={() => startEdit(comment)}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition"
                          title="Edit comment"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition"
                        title={isAdmin && !isAuthor ? 'Admin Moderation: Delete comment' : 'Delete comment'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="mt-3 pt-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={3}
                      maxLength={2000}
                      className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <div className="flex items-center justify-end gap-2 mt-2">
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1"
                      >
                        <X className="w-3.5 h-3.5" />
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateComment(comment.id)}
                        disabled={editLoading || !editContent.trim()}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-1 shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line pl-12">
                    {comment.content}
                  </p>
                )}
              </div>
            );
          })
        )}

        {/* Load More Button */}
        {page < totalPages && (
          <div className="text-center pt-4">
            <button
              onClick={() => loadComments(page + 1)}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800/60 transition"
            >
              {loading ? 'Loading...' : 'Load more comments'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
