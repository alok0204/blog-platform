import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  PenTool,
  TrendingUp,
  Compass,
  Layers,
  Terminal,
  PanelsTopLeft,
  Server,
  GitBranch,
  Clock,
  User,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getPosts, getCategories } from '../services/api';
import BlogCard from '../components/blog/BlogCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const categoryIcons = {
  'technology': Server,
  'web-development': PanelsTopLeft,
  'programming': Terminal,
  'developer-tools': GitBranch,
  'design': PanelsTopLeft,
  'career': Sparkles,
};

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [postsRes, catRes] = await Promise.all([
          getPosts({ limit: 7 }),
          getCategories(),
        ]);
        if (postsRes && postsRes.posts) {
          setPosts(postsRes.posts);
        }
        if (catRes) {
          setCategories(Array.isArray(catRes) ? catRes : catRes.categories || []);
        }
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const featuredPost = posts[0];
  const recentPosts = posts.slice(1, 7);

  return (
    <div className="space-y-16 md:space-y-20 py-4">
      {/* ─── Hero Section ───────────────────────────────────── */}
      <section className="pt-6 md:pt-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-8 border-b border-[var(--line)]">
          <div className="space-y-3 max-w-2xl">
            <p className="ink-eyebrow">MY PUBLISHING PLATFORM</p>
            <h1 className="text-3xl sm:text-5xl font-sans font-bold text-[var(--text)] tracking-tight">
              A foundation to build on.
            </h1>
            <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
              INKWELL — Stories Worth Sharing. Built with full-stack craftsmanship for Thiranex Task 4.
            </p>
          </div>
          <div className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed md:text-right max-w-xs space-y-1">
            <p>Practicing the fundamentals.</p>
            <p>Adding something new along the way.</p>
            <div className="flex md:justify-end gap-3 pt-3">
              <Link to="/posts" className="ink-btn-pill">
                <span>Explore Posts</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link to="/dashboard/new" className="ink-btn-accent text-xs">
                <PenTool className="w-3.5 h-3.5" />
                <span>Write Story</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ─── 4 Featured Topic Cards (exact match to picture) ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="ink-card p-6 flex flex-col justify-between">
            <div>
              <Terminal className="w-6 h-6 text-primary-400 mb-6" />
              <h3 className="text-base font-bold text-[var(--text)] mb-2">Programming</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed min-h-[40px]">
                The foundations of problem solving, data structures, and algorithms.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-5">
              <span className="ink-tag">C</span>
              <span className="ink-tag">C++</span>
              <span className="ink-tag">Python</span>
            </div>
          </div>

          <div className="ink-card p-6 flex flex-col justify-between">
            <div>
              <PanelsTopLeft className="w-6 h-6 text-primary-400 mb-6" />
              <h3 className="text-base font-bold text-[var(--text)] mb-2">Frontend</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed min-h-[40px]">
                Structure, style, and responsive component architecture.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-5">
              <span className="ink-tag">HTML</span>
              <span className="ink-tag">CSS</span>
              <span className="ink-tag">React</span>
              <span className="ink-tag">Tailwind</span>
            </div>
          </div>

          {/* Highlighted active card (matches the glowing violet "Backend" card in screenshot) */}
          <div className="ink-card-active p-6 flex flex-col justify-between relative">
            <div>
              <Server className="w-6 h-6 text-primary-400 mb-6" />
              <h3 className="text-base font-bold text-[var(--text)] mb-2">Backend</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed min-h-[40px]">
                Exploring server-side development, RESTful APIs, and database modeling.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-5">
              <span className="ink-tag">Node.js</span>
              <span className="ink-tag">Express</span>
              <span className="ink-tag">Prisma</span>
            </div>
          </div>

          <div className="ink-card p-6 flex flex-col justify-between">
            <div>
              <GitBranch className="w-6 h-6 text-primary-400 mb-6" />
              <h3 className="text-base font-bold text-[var(--text)] mb-2">Developer tools</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed min-h-[40px]">
                Keeping projects organized, versioned, and verified as they grow.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 pt-5">
              <span className="ink-tag">Git</span>
              <span className="ink-tag">GitHub</span>
              <span className="ink-tag">PostgreSQL</span>
            </div>
          </div>
        </div>

        {/* ─── Stack Strip (matching portfolio screenshot) ───── */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-8 pt-8 mt-8 border-t border-[var(--line)] text-xs text-[var(--muted)]">
          <span className="flex items-center gap-2 font-medium text-[var(--text)]">
            <Layers className="w-4 h-4 text-primary-400" />
            <span>Built into this platform</span>
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <span className="ink-tag">React 18</span>
            <span className="ink-tag">Vite</span>
            <span className="ink-tag">Tailwind CSS</span>
            <span className="ink-tag">Express</span>
            <span className="ink-tag">PostgreSQL</span>
            <span className="ink-tag">Prisma ORM</span>
          </div>
        </div>
      </section>

      {/* ─── Featured Article ───────────────────────────────── */}
      {featuredPost && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="ink-eyebrow">SPOTLIGHT DISPATCH</p>
            </div>
          </div>

          <div className="ink-card overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
              <div className="lg:col-span-7 h-64 lg:h-80 overflow-hidden bg-[var(--surface)]">
                {featuredPost.coverImage ? (
                  <img
                    src={featuredPost.coverImage}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#17171c] via-[#1c1c22] to-[#252530] flex items-center justify-center p-8">
                    <span className="font-mono text-primary-400/40 text-6xl font-bold">&lt;/&gt;</span>
                  </div>
                )}
              </div>

              <div className="lg:col-span-5 p-6 lg:p-8 space-y-4">
                {featuredPost.category && (
                  <span className="ink-tag text-primary-400 font-semibold">
                    {featuredPost.category.name}
                  </span>
                )}

                <h3 className="text-xl sm:text-2xl font-bold text-[var(--text)] hover:text-primary-400 transition-colors leading-snug">
                  <Link to={`/posts/${featuredPost.slug}`}>{featuredPost.title}</Link>
                </h3>

                <p className="text-xs sm:text-sm text-[var(--muted)] line-clamp-3 leading-relaxed">
                  {featuredPost.excerpt || featuredPost.content?.slice(0, 160)}...
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-[var(--line)] text-xs text-[var(--muted)]">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[var(--surface)] border border-[var(--line)] flex items-center justify-center text-primary-400 text-xs font-bold">
                      {featuredPost.author?.name ? featuredPost.author.name[0].toUpperCase() : 'A'}
                    </div>
                    <span className="font-medium text-[var(--text)] truncate max-w-[120px]">
                      {featuredPost.author?.name || 'INKWELL Author'}
                    </span>
                  </div>

                  <Link
                    to={`/posts/${featuredPost.slug}`}
                    className="text-primary-400 hover:text-primary-300 font-medium inline-flex items-center gap-1 text-xs"
                  >
                    <span>Read Story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── Latest Dispatches Grid ─────────────────────────── */}
      <section className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]">
          <div>
            <p className="ink-eyebrow">RECENT STORIES</p>
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text)]">Latest Dispatches</h2>
          </div>
          <Link
            to="/posts"
            className="ink-btn-pill text-xs"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <LoadingSpinner size="lg" />
            <p className="text-xs text-[var(--muted)] mt-4">Loading articles...</p>
          </div>
        ) : recentPosts.length === 0 ? (
          <div className="ink-box p-12 text-center">
            <p className="text-sm text-[var(--muted)]">No recent articles found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentPosts.map((post, idx) => (
              <BlogCard key={post.id} post={post} index={idx} isHighlighted={idx === 1} />
            ))}
          </div>
        )}
      </section>

      {/* ─── Author Callout Box ─────────────────────────────── */}
      <section className="ink-card p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <p className="ink-eyebrow">THIRANEX INTERNSHIP TASK 4</p>
          <h2 className="text-2xl font-bold text-[var(--text)]">Ready to share your insights?</h2>
          <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
            Register an author account, draft technical guides, share your engineering perspectives, and join the discussion.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link to="/register" className="ink-btn-accent text-xs">
            Create Author Account
          </Link>
          <Link to="/about" className="ink-btn-pill text-xs">
            Developer Info
          </Link>
        </div>
      </section>
    </div>
  );
}
