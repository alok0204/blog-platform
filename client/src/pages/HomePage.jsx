import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, BookOpen, PenTool, MessageSquare, TrendingUp, Compass, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { getPosts, getCategories } from '../services/api';
import BlogCard from '../components/blog/BlogCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

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
    <div className="space-y-16 md:space-y-24">
      {/* ─── Hero Section ───────────────────────────────────── */}
      <section className="relative overflow-hidden pt-8 md:pt-16 pb-12 text-center md:text-left">
        <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-30 dark:opacity-20 pointer-events-none">
          <div className="w-[500px] h-[500px] bg-gradient-to-tr from-indigo-500/30 to-violet-500/20 rounded-full blur-3xl" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="md:col-span-8 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>A Modern Editorial Publishing Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-gray-950 dark:text-gray-50 leading-[1.15] tracking-tight">
              Stories Worth <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 dark:from-indigo-400 dark:via-indigo-300 dark:to-violet-400">Sharing.</span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed font-sans">
              Welcome to INKWELL — a clean space designed for thoughtful writing, insightful perspectives, and enriching technical discourse.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
              <Link
                to="/posts"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35"
              >
                <span>Start Reading</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/80 border border-gray-200 dark:border-gray-700 transition shadow-sm"
              >
                <PenTool className="w-4 h-4 text-indigo-500" />
                <span>Write a Story</span>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="md:col-span-4 hidden md:block"
          >
            <div className="relative p-6 rounded-3xl bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/50 dark:from-gray-800/80 dark:via-gray-800/40 dark:to-indigo-950/40 border border-indigo-100/80 dark:border-gray-700/60 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-gray-900 dark:text-gray-100">Editorial Excellence</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Curated & community stories</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                "Words have the power to illuminate complex engineering concepts, spark curiosity, and connect passionate developers across the world."
              </p>
              <div className="pt-2 border-t border-gray-100 dark:border-gray-700/50 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>By Alok Kumar Vishwas</span>
                <span>Thiranex Task 4</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Featured Article ───────────────────────────────── */}
      {featuredPost && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Featured Story
            </h2>
          </div>

          <div className="group relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800/70 border border-gray-200/80 dark:border-gray-700/70 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 h-64 lg:h-96 overflow-hidden bg-gray-100 dark:bg-gray-900">
                {featuredPost.coverImage ? (
                  <img
                    src={featuredPost.coverImage}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center p-8 text-indigo-400">
                    <BookOpen className="w-16 h-16 opacity-40" />
                  </div>
                )}
              </div>

              <div className="lg:col-span-5 p-6 lg:p-8 space-y-4">
                {featuredPost.category && (
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/50">
                    {featuredPost.category.name}
                  </span>
                )}

                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight">
                  <Link to={`/posts/${featuredPost.slug}`}>{featuredPost.title}</Link>
                </h3>

                <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base line-clamp-3 leading-relaxed">
                  {featuredPost.excerpt || featuredPost.content?.slice(0, 160)}...
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700/60">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold shadow-sm">
                      {featuredPost.author?.name ? featuredPost.author.name[0].toUpperCase() : 'A'}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                        {featuredPost.author?.name || 'INKWELL Author'}
                      </p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400">
                        {featuredPost.publishedAt ? new Date(featuredPost.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/posts/${featuredPost.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:gap-2 transition-all"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── Topic Categories ───────────────────────────────── */}
      {categories.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Explore Topics
            </h2>
            <Link to="/posts" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              View all
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id || cat.slug}
                to={`/posts?category=${cat.slug}`}
                className="p-4 rounded-2xl bg-white dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-800 text-center hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition-all group"
              >
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {cat.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {cat._count?.posts ?? 0} {cat._count?.posts === 1 ? 'post' : 'posts'}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ─── Recent Articles Grid ───────────────────────────── */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100">Latest Dispatches</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Freshly published insights from our writers</p>
          </div>
          <Link
            to="/posts"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:gap-2 transition-all"
          >
            <span>Browse All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="py-16 text-center">
            <LoadingSpinner size="lg" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Curating fresh articles...</p>
          </div>
        ) : recentPosts.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-800/20">
            <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">No recent articles found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Check back soon or create your own post!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* ─── Community CTA Section ──────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-purple-950 text-white p-8 sm:p-12 shadow-2xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-white/10 text-indigo-200 border border-white/20">
            Writer Community
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white leading-tight">
            Ready to share your voice with the world?
          </h2>
          <p className="text-indigo-200 text-sm sm:text-base leading-relaxed">
            Whether you want to document your software engineering journey, write tutorials, or share thought-provoking design essays, INKWELL gives you an elegant stage.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl font-medium text-indigo-950 bg-white hover:bg-gray-100 transition shadow-lg"
            >
              Get Started for Free
            </Link>
            <Link
              to="/about"
              className="px-6 py-3 rounded-xl font-medium text-white bg-white/10 hover:bg-white/20 border border-white/20 transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
