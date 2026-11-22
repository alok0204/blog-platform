import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PenTool,
  BookOpen,
  FileText,
  Eye,
  MessageSquare,
  Edit3,
  Trash2,
  Globe,
  Lock,
  Plus,
  TrendingUp,
  AlertCircle,
  ExternalLink,
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
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Loading your dashboard...</p>
      </div>
    );
  }

  const postsList = stats?.recentPosts || [];

  return (
    <div className="space-y-10 pb-12">
      {/* ─── Header & Primary Action ────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
        <div className="space-y-1">
          <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100">
            Author Studio
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Welcome back, <span className="font-semibold text-gray-800 dark:text-gray-200">{user?.name}</span>. Manage your stories and reach.
          </p>
        </div>

        <Link
          to="/dashboard/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-md shadow-indigo-600/20"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Story</span>
        </Link>
      </div>

      {/* ─── Metric Cards ───────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400">
            <FileText className="w-5 h-5" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">All Time</span>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 dark:text-gray-100">
              {stats?.totalPosts ?? 0}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Total Stories</p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-green-600 dark:text-green-400">
            <Globe className="w-5 h-5" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-green-500">Live</span>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 dark:text-gray-100">
              {stats?.publishedPosts ?? 0}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Published</p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-amber-500">
            <Lock className="w-5 h-5" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-500">Private</span>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 dark:text-gray-100">
              {stats?.draftPosts ?? 0}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Drafts</p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-purple-600 dark:text-purple-400">
            <MessageSquare className="w-5 h-5" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-purple-500">Interactions</span>
          </div>
          <div>
            <p className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 dark:text-gray-100">
              {stats?.totalComments ?? 0}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Comments Received</p>
          </div>
        </div>
      </div>

      {/* ─── Posts Management Table ─────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-serif font-bold text-gray-900 dark:text-gray-100">
            Your Articles
          </h2>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {postsList.length} recent articles
          </span>
        </div>

        {postsList.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-800/20 space-y-4">
            <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto" />
            <div>
              <h3 className="text-lg font-serif font-bold text-gray-800 dark:text-gray-200">
                You haven't written any stories yet
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
                Share your expertise, record technical tutorials, or reflect on engineering challenges.
              </p>
            </div>
            <Link
              to="/dashboard/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Story</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl bg-white dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/80 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700/60 text-[11px] uppercase tracking-wider text-gray-400 bg-gray-50/50 dark:bg-gray-900/40">
                    <th className="py-4 px-6 font-semibold">Story Details</th>
                    <th className="py-4 px-4 font-semibold">Status</th>
                    <th className="py-4 px-4 font-semibold">Category</th>
                    <th className="py-4 px-4 font-semibold">Comments</th>
                    <th className="py-4 px-4 font-semibold">Last Updated</th>
                    <th className="py-4 px-6 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
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
                        className="hover:bg-gray-50/60 dark:hover:bg-gray-700/30 transition-colors"
                      >
                        {/* Title */}
                        <td className="py-4 px-6 max-w-xs">
                          <div>
                            <Link
                              to={isPublished ? `/posts/${post.slug}` : `/dashboard/edit/${post.id}`}
                              className="font-serif font-bold text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition line-clamp-1"
                            >
                              {post.title}
                            </Link>
                            <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-1 mt-0.5">
                              {post.excerpt || 'No summary preview'}
                            </p>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase ${
                              isPublished
                                ? 'bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-300'
                                : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-green-500' : 'bg-amber-500'}`} />
                            {post.status}
                          </span>
                        </td>

                        {/* Category */}
                        <td className="py-4 px-4">
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                            {post.category?.name || 'General'}
                          </span>
                        </td>

                        {/* Comments count */}
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <MessageSquare className="w-3.5 h-3.5" />
                            {post._count?.comments ?? 0}
                          </span>
                        </td>

                        {/* Updated At */}
                        <td className="py-4 px-4 text-xs text-gray-400 dark:text-gray-500">
                          {updatedStr}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            {/* View live if published */}
                            {isPublished && (
                              <Link
                                to={`/posts/${post.slug}`}
                                className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                title="View public article"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Link>
                            )}

                            {/* Publish / Unpublish Toggle */}
                            <button
                              onClick={() => handleTogglePublish(post)}
                              disabled={actionLoading}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                                isPublished
                                  ? 'border-amber-200 text-amber-600 hover:bg-amber-50 dark:border-amber-900/60 dark:text-amber-400'
                                  : 'border-green-200 text-green-600 hover:bg-green-50 dark:border-green-900/60 dark:text-green-400'
                              }`}
                              title={isPublished ? 'Unpublish post (move to draft)' : 'Publish post to public'}
                            >
                              {isPublished ? 'Unpublish' : 'Publish'}
                            </button>

                            {/* Edit */}
                            <Link
                              to={`/dashboard/edit/${post.id}`}
                              className="p-2 rounded-lg text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                              title="Edit story"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Link>

                            {/* Delete */}
                            <button
                              onClick={() => handleDeletePost(post.id, post.title)}
                              disabled={actionLoading}
                              className="p-2 rounded-lg text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                              title="Delete story"
                            >
                              <Trash2 className="w-4 h-4" />
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
