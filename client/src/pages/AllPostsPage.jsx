import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, BookOpen, X } from 'lucide-react';
import { getPosts, getCategories } from '../services/api';
import BlogCard from '../components/blog/BlogCard';
import Pagination from '../components/ui/Pagination';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function AllPostsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  // Active filters from URL
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const activeCategory = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';

  // Local state for search input
  const [searchInput, setSearchInput] = useState(searchQuery);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const catRes = await getCategories();
        if (catRes) {
          setCategories(Array.isArray(catRes) ? catRes : catRes.categories || []);
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        const params = {
          page: currentPage,
          limit: 9,
        };
        if (activeCategory) params.category = activeCategory;
        if (searchQuery) params.search = searchQuery;

        const res = await getPosts(params);
        if (res) {
          setPosts(res.posts || []);
          setTotalPages(res.totalPages || 1);
          setTotalPosts(res.total || 0);
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [currentPage, activeCategory, searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      newParams.set('search', searchInput.trim());
    } else {
      newParams.delete('search');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleCategorySelect = (slug) => {
    const newParams = new URLSearchParams(searchParams);
    if (activeCategory === slug) {
      newParams.delete('category');
    } else {
      newParams.set('category', slug);
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(activeCategory || searchQuery);

  return (
    <div className="space-y-8 py-4">
      {/* ─── Header ─────────────────────────────────────────── */}
      <div className="text-center max-w-2xl mx-auto space-y-3 pt-4">
        <p className="ink-eyebrow">READING ROOM</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text)] tracking-tight">
          All Published Dispatches
        </h1>
        <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
          Explore articles on programming, software engineering, architecture, and developer productivity.
        </p>
      </div>

      {/* ─── Search & Category Filters ──────────────────────── */}
      <div className="space-y-4 max-w-3xl mx-auto">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit}>
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-4 h-4 text-[var(--muted)]" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search articles by title, topic, or keyword..."
              className="w-full pl-11 pr-24 py-3 rounded-[10px] bg-[var(--card)] border border-[var(--line)] text-[var(--text)] placeholder-[var(--muted)] text-xs sm:text-sm focus:outline-none focus:border-[var(--accent)] transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 px-3.5 py-1.5 rounded-[6px] text-xs font-semibold ink-btn-accent"
            >
              Search
            </button>
          </div>
        </form>

        {/* Category Pills (matching the tags in the picture) ─── */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => handleCategorySelect('')}
            className={`ink-tag text-xs px-3 py-1.5 transition-all ${
              !activeCategory
                ? 'border-[var(--accent)] text-primary-400 font-semibold'
                : 'text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--text)]'
            }`}
          >
            All Topics
          </button>
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.slug;
            return (
              <button
                key={cat.id || cat.slug}
                onClick={() => handleCategorySelect(cat.slug)}
                className={`ink-tag text-xs px-3 py-1.5 transition-all ${
                  isSelected
                    ? 'border-[var(--accent)] text-primary-400 font-semibold'
                    : 'text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--text)]'
                }`}
              >
                {cat.name}
              </button>
            );
          })}

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="ink-tag text-xs px-2.5 py-1.5 text-red-400 border-red-500/30 hover:bg-red-500/10 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* ─── Search Summary ─────────────────────────────────── */}
      <div className="flex items-center justify-between text-xs text-[var(--muted)] border-b border-[var(--line)] pb-3">
        <span>
          Showing {posts.length} of {totalPosts} articles
          {activeCategory && ` in "${categories.find((c) => c.slug === activeCategory)?.name || activeCategory}"`}
          {searchQuery && ` matching "${searchQuery}"`}
        </span>
        {totalPages > 1 && (
          <span>
            Page {currentPage} of {totalPages}
          </span>
        )}
      </div>

      {/* ─── Posts Grid ─────────────────────────────────────── */}
      {loading ? (
        <div className="py-20 text-center">
          <LoadingSpinner size="lg" />
          <p className="text-xs text-[var(--muted)] mt-4">Loading articles...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="ink-card py-16 text-center max-w-md mx-auto p-8 space-y-3">
          <BookOpen className="w-10 h-10 text-[var(--muted)] mx-auto opacity-40" />
          <h3 className="text-base font-bold text-[var(--text)]">No articles found</h3>
          <p className="text-xs text-[var(--muted)] max-w-xs mx-auto">
            We couldn't find any stories matching your current filter criteria.
          </p>
          <button
            onClick={clearFilters}
            className="ink-btn-pill text-xs mt-2"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post, idx) => (
            <BlogCard key={post.id} post={post} index={idx} />
          ))}
        </div>
      )}

      {/* ─── Pagination ─────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="pt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
