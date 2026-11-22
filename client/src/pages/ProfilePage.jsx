import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Edit3, Check, X, Shield, User, Globe, BookOpen } from 'lucide-react';
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
      await updateProfile({
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
        <p className="text-xs text-[var(--muted)] mt-4">Loading author profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <h2 className="text-2xl font-bold text-[var(--text)]">Author Not Found</h2>
        <p className="text-[var(--muted)] text-xs">We couldn't locate this user profile.</p>
        <Link
          to="/"
          className="ink-btn-pill text-xs inline-block"
        >
          Return Home
        </Link>
      </div>
    );
  }

  const joinDate = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
    : 'Recently';

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16 py-4">
      {/* ─── Profile Header Box (10px rounded card) ─────────── */}
      <div className="ink-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-16 h-16 rounded-[10px] object-cover border border-[var(--line)]"
              />
            ) : (
              <div className="w-16 h-16 rounded-[10px] bg-[var(--surface)] border border-[var(--line)] text-primary-400 font-bold text-2xl flex items-center justify-center">
                {profile.name ? profile.name[0].toUpperCase() : 'U'}
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[var(--text)]">
                  {profile.name}
                </h1>
                {profile.role === 'ADMIN' && (
                  <span className="ink-tag text-[10px] text-primary-400 font-semibold">ADMIN</span>
                )}
              </div>
              <p className="text-xs text-[var(--muted)] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-primary-400" />
                <span>Joined {joinDate}</span>
              </p>
            </div>
          </div>

          {isOwner && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="ink-btn-pill text-xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-primary-400" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        {/* Edit Form or Bio View */}
        {isEditing ? (
          <form onSubmit={handleSaveProfile} className="space-y-4 pt-4 border-t border-[var(--line)]">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">Display Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
                className="w-full py-2 px-3 rounded-[8px] bg-[var(--surface)] border border-[var(--line)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">Bio</label>
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                rows={3}
                placeholder="Tell readers about yourself, your tech stack, and writing focus..."
                className="w-full p-3 rounded-[8px] bg-[var(--surface)] border border-[var(--line)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">Avatar Image URL</label>
              <input
                type="url"
                value={editAvatarUrl}
                onChange={(e) => setEditAvatarUrl(e.target.value)}
                placeholder="https://..."
                className="w-full py-2 px-3 rounded-[8px] bg-[var(--surface)] border border-[var(--line)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="ink-btn-pill text-xs"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                disabled={saving}
                className="ink-btn-accent text-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving...' : 'Save Profile'}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="pt-4 border-t border-[var(--line)] text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
            <p>
              {profile.bio || 'This author has not provided a biography yet.'}
            </p>
          </div>
        )}
      </div>

      {/* ─── Published Articles by Author ───────────────────── */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
          <h2 className="text-lg font-bold text-[var(--text)]">
            Articles by {profile.name}
          </h2>
          <span className="ink-tag text-xs">
            {profile.posts?.length ?? 0} published
          </span>
        </div>

        {!profile.posts || profile.posts.length === 0 ? (
          <div className="ink-card p-12 text-center space-y-2">
            <BookOpen className="w-8 h-8 text-[var(--muted)] mx-auto opacity-40" />
            <p className="text-xs text-[var(--muted)]">No published stories yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {profile.posts.map((post, idx) => (
              <BlogCard key={post.id} post={post} index={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
