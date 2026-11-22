import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Users,
  FileText,
  MessageSquare,
  Trash2,
  ExternalLink,
  Globe,
  Lock,
  RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getAdminStats, getAdminPosts, getAdminComments, deleteAdminComment } from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'posts' | 'comments'
  const [stats, setStats] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, postsRes, commentsRes] = await Promise.all([
        getAdminStats(),
        getAdminPosts({ limit: 20 }),
        getAdminComments({ limit: 20 }),
      ]);

      if (statsRes) setStats(statsRes);
      if (postsRes && postsRes.posts) setPosts(postsRes.posts);
      if (commentsRes && commentsRes.comments) setComments(commentsRes.comments);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      toast.error('Failed to load admin dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Admin Moderation: Are you sure you want to delete this comment?')) {
      return;
    }
    try {
      setActionLoading(true);
      await deleteAdminComment(commentId);
      toast.success('Comment removed by administrator');
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      fetchAdminData();
    } catch (err) {
      toast.error(err.message || 'Failed to remove comment');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading && !stats) {
    return (
      <div className="py-24 text-center">
        <LoadingSpinner size="lg" />
        <p className="text-xs text-[var(--muted)] mt-4">Loading Admin Studio...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 py-4">
      {/* ─── Admin Banner (Sleek Box Shape) ─────────────────── */}
      <div className="ink-card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 ink-tag text-primary-400 font-semibold uppercase tracking-wider text-[11px]">
            <Shield className="w-3.5 h-3.5" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text)] tracking-tight">
            Platform Moderation & Statistics
          </h1>
          <p className="text-xs text-[var(--muted)]">
            Monitor real database records, moderate user discussions, and manage platform health.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          disabled={loading}
          className="ink-btn-pill text-xs self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* ─── Metric Cards (Exact match to picture box shapes) ─ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="ink-card p-5 space-y-2">
          <div className="flex items-center justify-between text-primary-400">
            <Users className="w-5 h-5" />
            <span className="ink-tag text-[10px]">DATABASE</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[var(--text)]">
            {stats?.totalUsers ?? 0}
          </p>
          <p className="text-xs text-[var(--muted)] font-medium">Registered Users</p>
        </div>

        <div className="ink-card p-5 space-y-2">
          <div className="flex items-center justify-between text-emerald-400">
            <Globe className="w-5 h-5" />
            <span className="ink-tag text-[10px] text-emerald-400">LIVE</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[var(--text)]">
            {stats?.totalPublished ?? stats?.publishedPosts ?? 0}
          </p>
          <p className="text-xs text-[var(--muted)] font-medium">Published Posts</p>
        </div>

        <div className="ink-card p-5 space-y-2">
          <div className="flex items-center justify-between text-amber-400">
            <Lock className="w-5 h-5" />
            <span className="ink-tag text-[10px] text-amber-400">DRAFTS</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[var(--text)]">
            {stats?.totalDrafts ?? stats?.draftPosts ?? 0}
          </p>
          <p className="text-xs text-[var(--muted)] font-medium">Pending Drafts</p>
        </div>

        {/* Highlighted active card with accent violet glow */}
        <div className="ink-card-active p-5 space-y-2">
          <div className="flex items-center justify-between text-primary-400">
            <MessageSquare className="w-5 h-5" />
            <span className="ink-tag text-[10px] text-primary-400 font-semibold">ENGAGEMENT</span>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-[var(--text)]">
            {stats?.totalComments ?? 0}
          </p>
          <p className="text-xs text-[var(--muted)] font-medium">Total Comments</p>
        </div>
      </div>

      {/* ─── Tabs ───────────────────────────────────────────── */}
      <div className="flex items-center gap-6 border-b border-[var(--line)]">
        <button
          onClick={() => setActiveTab('overview')}
          className={`py-3 text-sm font-medium transition-colors relative ${
            activeTab === 'overview'
              ? 'text-[var(--text)] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[var(--accent)]'
              : 'text-[var(--muted)] hover:text-[var(--text)]'
          }`}
        >
          Recent Activity
        </button>
        <button
          onClick={() => setActiveTab('posts')}
          className={`py-3 text-sm font-medium transition-colors relative ${
            activeTab === 'posts'
              ? 'text-[var(--text)] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[var(--accent)]'
              : 'text-[var(--muted)] hover:text-[var(--text)]'
          }`}
        >
          All Posts ({posts.length})
        </button>
        <button
          onClick={() => setActiveTab('comments')}
          className={`py-3 text-sm font-medium transition-colors relative ${
            activeTab === 'comments'
              ? 'text-[var(--text)] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[var(--accent)]'
              : 'text-[var(--muted)] hover:text-[var(--text)]'
          }`}
        >
          Comment Moderation ({comments.length})
        </button>
      </div>

      {/* ─── Tab Content: Overview ──────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Posts */}
          <div className="ink-card p-6 space-y-4">
            <h3 className="font-bold text-base text-[var(--text)] flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary-400" />
              <span>Latest Stories Created</span>
            </h3>
            <div className="divide-y divide-[var(--line)]">
              {posts.slice(0, 5).map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between text-xs">
                  <div className="max-w-xs space-y-0.5">
                    <Link
                      to={`/posts/${p.slug}`}
                      className="font-medium text-[var(--text)] hover:text-primary-400 line-clamp-1"
                    >
                      {p.title}
                    </Link>
                    <span className="text-[11px] text-[var(--muted)]">By {p.author?.name || 'Author'}</span>
                  </div>
                  <span
                    className={`ink-tag text-[10px] font-semibold uppercase ${
                      p.status === 'PUBLISHED'
                        ? 'text-emerald-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Comments */}
          <div className="ink-card p-6 space-y-4">
            <h3 className="font-bold text-base text-[var(--text)] flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary-400" />
              <span>Recent Reader Comments</span>
            </h3>
            <div className="divide-y divide-[var(--line)]">
              {comments.slice(0, 5).map((c) => (
                <div key={c.id} className="py-3 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[var(--text)]">
                      {c.author?.name || 'Reader'}
                    </span>
                    <button
                      onClick={() => handleDeleteComment(c.id)}
                      className="text-red-400 hover:text-red-300 transition text-xs"
                      title="Moderate / Delete"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-xs text-[var(--muted)] line-clamp-2 italic">
                    "{c.content}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Tab Content: Posts List ────────────────────────── */}
      {activeTab === 'posts' && (
        <div className="ink-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[var(--line)] text-[11px] uppercase tracking-wider text-[var(--muted)] bg-[var(--surface)]">
                  <th className="py-3 px-5 font-semibold">Title</th>
                  <th className="py-3 px-4 font-semibold">Author</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Comments</th>
                  <th className="py-3 px-5 font-semibold text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {posts.map((p) => (
                  <tr key={p.id} className="hover:bg-[var(--surface)]/50 transition-colors">
                    <td className="py-3.5 px-5 font-medium text-[var(--text)] max-w-sm">
                      <Link
                        to={`/posts/${p.slug}`}
                        className="hover:text-primary-400 line-clamp-1"
                      >
                        {p.title}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 text-[var(--muted)]">
                      {p.author?.name || 'Author'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`ink-tag text-[10px] font-semibold uppercase ${
                          p.status === 'PUBLISHED'
                            ? 'text-emerald-400'
                            : 'text-amber-400'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[var(--muted)]">
                      {p._count?.comments ?? 0}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <Link
                        to={`/posts/${p.slug}`}
                        className="p-1.5 rounded text-[var(--muted)] hover:text-primary-400 inline-block"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── Tab Content: Comment Moderation ─────────────────── */}
      {activeTab === 'comments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[var(--muted)]">
            <span>Moderate and remove any inappropriate or spam comments across all articles.</span>
          </div>

          <div className="space-y-3">
            {comments.length === 0 ? (
              <div className="ink-card p-12 text-center">
                <MessageSquare className="w-8 h-8 text-[var(--muted)] mx-auto mb-2 opacity-50" />
                <p className="text-xs text-[var(--muted)]">No comments to display.</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="ink-card p-4 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-[var(--text)]">
                        {comment.author?.name || 'Reader'}
                      </span>
                      <span className="text-[var(--muted)]">•</span>
                      <span className="text-[var(--muted)]">
                        On story: <span className="text-primary-400 font-medium">{comment.post?.title || 'Story'}</span>
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text)] leading-relaxed">
                      {comment.content}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    disabled={actionLoading}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-[var(--surface)] rounded-[6px] border border-[var(--line)] transition flex-shrink-0"
                    title="Remove comment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
