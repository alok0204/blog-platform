import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, BookOpen, Edit3, Check, X, Shield, User, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateProfile } from '../services/api';
import BlogCard from '../components/blog/BlogCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function ProfilePage() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        const res = await getUserProfile(id);
        if (res) {
          const profileData = res.user || res;
          setProfile(profileData);
          setEditName(profileData.name || '');
          setEditBio(profileData.bio || '');
          setEditAvatarUrl(profileData.avatarUrl || '');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        toast.error('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchProfile();
    }
  }, [id]);

  const isOwner = currentUser?.id === id;

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    try {
      setSaving(true);
      const updated = await updateProfile({
        name: editName.trim(),
        bio: editBio.trim() || undefined,
        avatarUrl: editAvatarUrl.trim() || undefined,
      });

      toast.success('Profile updated successfully!');
      setProfile((prev) => ({
        ...prev,
        name: editName.trim(),
        bio: editBio.trim(),
        avatarUrl: editAvatarUrl.trim(),
      }));
      setIsEditing(false);
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Loading author profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100">Author Not Found</h2>
        <p className="text-gray-500 text-sm">We couldn't locate this user profile.</p>
        <Link
          to="/"
          className="inline-block px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition"
        >
          Return Home
        </Link>
      </div>
    );
  }

  const joinDate = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString(undefined, {
        month: 'long',
        year: 'numeric',
      })
    : '2026';

  const authorPosts = profile.posts || [];

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-16">
      {/* ─── Profile Header Card ────────────────────────────── */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/80 shadow-md">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Avatar */}
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-24 h-24 rounded-3xl object-cover ring-4 ring-indigo-500/20 shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-600 text-white flex items-center justify-center font-serif font-bold text-3xl shadow-lg ring-4 ring-indigo-500/20">
              {profile.name ? profile.name[0].toUpperCase() : 'U'}
            </div>
          )}

          {/* Info */}
          <div className="flex-1 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 dark:text-gray-100">
                    {profile.name}
                  </h1>
                  {profile.role === 'ADMIN' && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                      Admin
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Member since {joinDate}
                  </span>
                  <span>•</span>
                  <span>{authorPosts.length} Published {authorPosts.length === 1 ? 'Story' : 'Stories'}</span>
                </div>
              </div>

              {isOwner && !isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition shadow-sm"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>

            {/* Bio or Edit Form */}
            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                    Bio
                  </label>
                  <textarea
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    rows={3}
                    placeholder="Tell your readers about yourself..."
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                    Avatar Image URL
                  </label>
                  <input
                    type="url"
                    value={editAvatarUrl}
                    onChange={(e) => setEditAvatarUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition flex items-center gap-1.5 shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{saving ? 'Saving...' : 'Save Profile'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                {profile.bio || 'This author has not written a biography yet.'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ─── Author's Published Stories ─────────────────────── */}
      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100">
          Published Articles
        </h2>

        {authorPosts.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-800/20">
            <BookOpen className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
            <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200">
              No public articles yet
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Articles will appear here once the author publishes them.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {authorPosts.map((p) => (
              <BlogCard key={p.id} post={{ ...p, author: profile }} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
