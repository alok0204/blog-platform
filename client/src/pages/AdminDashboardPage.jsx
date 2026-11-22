import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Users,
  FileText,
  MessageSquare,
  Trash2,
  ExternalLink,
  CheckCircle,
  AlertTriangle,
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
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Loading Admin Studio...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* ─── Admin Banner ───────────────────────────────────── */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-indigo-950 text-white shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/20 text-purple-200">
            <Shield className="w-3.5 h-3.5" />
            <span>Administrator Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Platform Moderation & Statistics
          </h1>
          <p className="text-xs text-purple-200">
            Monitor real database records, moderate user discussions, and manage platform health.
          </p>
        </div>

        <button
          onClick={fetchAdminData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/20 transition self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* ─── Metric Cards ───────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400">
            <Users className="w-5 h-5" />
            <span className="text-[10px] uppercase font-bold text-gray-400">Database</span>
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 dark:text-gray-100">
            {stats?.totalUsers ?? 0}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Registered Users</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-green-600 dark:text-green-400">
            <Globe className="w-5 h-5" />
            <span className="text-[10px] uppercase font-bold text-green-500">Live</span>
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 dark:text-gray-100">
            {stats?.totalPublished ?? stats?.publishedPosts ?? 0}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Published Posts</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-amber-500">
            <Lock className="w-5 h-5" />
            <span className="text-[10px] uppercase font-bold text-amber-500">Drafts</span>
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 dark:text-gray-100">
            {stats?.totalDrafts ?? stats?.draftPosts ?? 0}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Pending Drafts</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/80 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-purple-600 dark:text-purple-400">
            <MessageSquare className="w-5 h-5" />
            <span className="text-[10px] uppercase font-bold text-purple-500">Engagement</span>
          </div>
          <p className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 dark:text-gray-100">
            {stats?.totalComments ?? 0}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Comments</p>
        </div>
      </div>

      {/* ─── Tabs ───────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-gray-800 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          Recent Activity
        </button>
        <button
          onClick={() => setActiveTab('posts')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'posts'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          All Posts ({posts.length})
        </button>
        <button
          onClick={() => setActiveTab('comments')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            activeTab === 'comments'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          Comment Moderation ({comments.length})
        </button>
      </div>

      {/* ─── Tab Content: Overview ──────────────────────────── */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Posts */}
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/80 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Latest Stories Created
            </h3>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {posts.slice(0, 5).map((p) => (
                <div key={p.id} className="py-3 flex items-center justify-between text-sm">
                  <div className="max-w-xs">
                    <Link
                      to={`/posts/${p.slug}`}
                      className="font-medium text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 line-clamp-1"
                    >
                      {p.title}
                    </Link>
                    <span className="text-xs text-gray-400">By {p.author?.name || 'Author'}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      p.status === 'PUBLISHED'
                        ? 'bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-300'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Comments */}
          <div className="p-6 rounded-3xl bg-white dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/80 shadow-sm space-y-4">
            <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              Recent Reader Comments
            </h3>
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {comments.slice(0, 5).map((c) => (
                <div key={c.id} className="py-3 space-y-1">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {c.author?.name || 'Reader'}
                    </span>
                    <button
                      onClick={() => handleDeleteComment(c.id)}
                      className="text-red-500 hover:text-red-700 transition"
                      title="Moderate / Delete"
                    >
                      Delete
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 italic">
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
        <div className="overflow-hidden rounded-3xl bg-white dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/80 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700 text-[11px] uppercase tracking-wider text-gray-400 bg-gray-50/50 dark:bg-gray-900/40">
                  <th className="py-3 px-6 font-semibold">Title</th>
                  <th className="py-3 px-4 font-semibold">Author</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Comments</th>
                  <th className="py-3 px-6 font-semibold text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {posts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30">
                    <td className="py-3.5 px-6 font-medium text-gray-900 dark:text-gray-100 max-w-sm">
                      <Link
                        to={`/posts/${p.slug}`}
                        className="hover:text-indigo-600 dark:hover:text-indigo-400 line-clamp-1"
                      >
                        {p.title}
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-600 dark:text-gray-300">
                      {p.author?.name || 'Author'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                          p.status === 'PUBLISHED'
                            ? 'bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-gray-500">
                      {p._count?.comments ?? 0}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <Link
                        to={`/posts/${p.slug}`}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 inline-block"
                      >
                        <ExternalLink className="w-4 h-4" />
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
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Moderate and remove any inappropriate or spam comments across all articles.</span>
          </div>

          <div className="space-y-3">
            {comments.length === 0 ? (
              <div className="p-12 text-center rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                <MessageSquare className="w-8 h-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No comments to display.</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-5 rounded-2xl bg-white dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/80 shadow-sm flex items-start justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {comment.author?.name || 'Reader'}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-400">
                        On story: <span className="text-indigo-600 dark:text-indigo-400 font-medium">{comment.post?.title || 'Story'}</span>
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {comment.content}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    disabled={actionLoading}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition flex-shrink-0"
                    title="Remove comment"
                  >
                    <Trash2 className="w-4 h-4" />
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
