import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  MessageSquare,
  Edit3,
  Trash2,
  Globe,
  Lock,
  Plus,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getDashboardStats, deletePost, togglePublish } from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await getDashboardStats();
      if (res) {
        setStats(res);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (post) => {
    try {
      setActionLoading(true);
      const isCurrentlyDraft = post.status === 'DRAFT';
      await togglePublish(post.id);
      toast.success(isCurrentlyDraft ? 'Post published to the public!' : 'Post converted to draft');
      fetchDashboardData();
    } catch (err) {
      toast.error(err.message || 'Failed to update post status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeletePost = async (postId, postTitle) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${postTitle}"?`)) {
      return;
    }
    try {
      setActionLoading(true);
      await deletePost(postId);
      toast.success('Post deleted successfully');
      fetchDashboardData();
    } catch (err) {
      toast.error(err.message || 'Failed to delete post');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && !stats) {
    return (
      <div className="py-24 text-center">
        <LoadingSpinner size="lg" />
        <p className="text-xs text-[var(--muted)] mt-4">Loading your dashboard...</p>
      </div>
    );
  }

  const postsList = stats?.recentPosts || [];

  return (
    <div className="space-y-8 pb-12 py-4">
      {/* ─── Header & Primary Action ────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--line)]">
        <div className="space-y-1">
          <p className="ink-eyebrow">CREATOR HUB</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text)] tracking-tight">
            Author Studio
          </h1>
          <p className="text-xs text-[var(--muted)]">
            Welcome back, <span className="font-semibold text-[var(--text)]">{user?.name}</span>. Manage your published stories and drafts.
          </p>
        </div>

        <Link
          to="/dashboard/new"
          className="ink-btn-accent text-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Write New Story</span>
        </Link>
      </div>

      {/* ─── Metric Cards (Exact match to picture box shapes) ─ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="ink-card p-5 space-y-2">
          <div className="flex items-center justify-between text-primary-400">
            <FileText className="w-5 h-5" />
            <span className="ink-tag text-[10px]">ALL TIME</span>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-[var(--text)]">
              {stats?.totalPosts ?? 0}
            </p>
            <p className="text-xs text-[var(--muted)] font-medium">Total Stories</p>
          </div>
        </div>

        <div className="ink-card p-5 space-y-2">
          <div className="flex items-center justify-between text-emerald-400">
            <Globe className="w-5 h-5" />
            <span className="ink-tag text-[10px] text-emerald-400">LIVE</span>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-[var(--text)]">
              {stats?.publishedPosts ?? 0}
            </p>
            <p className="text-xs text-[var(--muted)] font-medium">Published</p>
          </div>
        </div>

        <div className="ink-card p-5 space-y-2">
          <div className="flex items-center justify-between text-amber-400">
            <Lock className="w-5 h-5" />
            <span className="ink-tag text-[10px] text-amber-400">PRIVATE</span>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-[var(--text)]">
              {stats?.draftPosts ?? 0}
            </p>
            <p className="text-xs text-[var(--muted)] font-medium">Drafts</p>
          </div>
        </div>

        {/* Highlighted active card */}
        <div className="ink-card-active p-5 space-y-2">
          <div className="flex items-center justify-between text-primary-400">
            <MessageSquare className="w-5 h-5" />
            <span className="ink-tag text-[10px] text-primary-400 font-semibold">FEEDBACK</span>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-bold text-[var(--text)]">
              {stats?.totalComments ?? 0}
            </p>
            <p className="text-xs text-[var(--muted)] font-medium">Comments Received</p>
          </div>
        </div>
      </div>

      {/* ─── Posts Management Table ─────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[var(--text)]">
            Your Articles
          </h2>
          <span className="ink-tag text-xs">
            {postsList.length} recent articles
          </span>
        </div>

        {postsList.length === 0 ? (
          <div className="ink-card p-12 text-center space-y-4">
            <BookOpen className="w-10 h-10 text-[var(--muted)] mx-auto opacity-40" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[var(--text)]">
                You haven't written any stories yet
              </h3>
              <p className="text-xs text-[var(--muted)] max-w-sm mx-auto">
                Share your expertise, record technical tutorials, or reflect on engineering challenges.
              </p>
            </div>
            <Link
              to="/dashboard/new"
              className="ink-btn-accent text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Your First Story</span>
            </Link>
          </div>
        ) : (
          <div className="ink-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[var(--line)] text-[11px] uppercase tracking-wider text-[var(--muted)] bg-[var(--surface)]">
                    <th className="py-3 px-5 font-semibold">Story Details</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold">Category</th>
                    <th className="py-3 px-4 font-semibold">Comments</th>
                    <th className="py-3 px-4 font-semibold">Last Updated</th>
                    <th className="py-3 px-5 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line)]">
                  {postsList.map((post) => {
                    const isPublished = post.status === 'PUBLISHED';
                    const updatedStr = new Date(post.updatedAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });

                    return (
                      <tr
                        key={post.id}
                        className="hover:bg-[var(--surface)]/50 transition-colors"
                      >
                        {/* Title */}
                        <td className="py-3.5 px-5 max-w-xs">
                          <div>
                            <Link
                              to={isPublished ? `/posts/${post.slug}` : `/dashboard/edit/${post.id}`}
                              className="font-bold text-[var(--text)] hover:text-primary-400 transition line-clamp-1"
                            >
                              {post.title}
                            </Link>
                            <p className="text-[11px] text-[var(--muted)] line-clamp-1 mt-0.5">
                              {post.excerpt || 'No summary preview'}
                            </p>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`ink-tag text-[10px] font-semibold uppercase ${
                              isPublished
                                ? 'text-emerald-400'
                                : 'text-amber-400'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                            {post.status}
                          </span>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4">
                          <span className="text-xs text-[var(--muted)]">
                            {post.category?.name || 'General'}
                          </span>
                        </td>

                        {/* Comments count */}
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 text-xs text-[var(--muted)]">
                            <MessageSquare className="w-3.5 h-3.5 text-primary-400" />
                            {post._count?.comments ?? 0}
                          </span>
                        </td>

                        {/* Updated At */}
                        <td className="py-3.5 px-4 text-xs text-[var(--muted)]">
                          {updatedStr}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-5 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            {/* View live if published */}
                            {isPublished && (
                              <Link
                                to={`/posts/${post.slug}`}
                                className="p-1.5 rounded text-[var(--muted)] hover:text-primary-400 hover:bg-[var(--surface)] transition"
                                title="View public article"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </Link>
                            )}

                            {/* Publish / Unpublish Toggle */}
                            <button
                              onClick={() => handleTogglePublish(post)}
                              disabled={actionLoading}
                              className={`px-2.5 py-1 rounded-[6px] text-[11px] font-medium border border-[var(--line)] transition ${
                                isPublished
                                  ? 'text-amber-400 hover:border-amber-400'
                                  : 'text-emerald-400 hover:border-emerald-400'
                              }`}
                              title={isPublished ? 'Unpublish post (move to draft)' : 'Publish post to public'}
                            >
                              {isPublished ? 'Unpublish' : 'Publish'}
                            </button>

                            {/* Edit */}
                            <Link
                              to={`/dashboard/edit/${post.id}`}
                              className="p-1.5 rounded text-[var(--muted)] hover:text-primary-400 hover:bg-[var(--surface)] transition"
                              title="Edit story"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </Link>

                            {/* Delete */}
                            <button
                              onClick={() => handleDeletePost(post.id, post.title)}
                              disabled={actionLoading}
                              className="p-1.5 rounded text-[var(--muted)] hover:text-red-400 hover:bg-[var(--surface)] transition"
                              title="Delete story"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
