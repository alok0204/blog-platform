import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, BookOpen, X, Sparkles } from 'lucide-react';
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
    <div className="space-y-10">
      {/* ─── Header ─────────────────────────────────────────── */}
      <div className="text-center max-w-2xl mx-auto space-y-4 pt-4">
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 dark:text-gray-100">
          The Reading Room
        </h1>
        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
          Explore articles on programming, design, software engineering, and creative thinking.
        </p>
      </div>

      {/* ─── Search & Category Filters ──────────────────────── */}
      <div className="space-y-6">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto">
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search articles by title, topic, or keyword..."
              className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/80 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />
            <button
              type="submit"
              className="absolute right-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-sm"
            >
              Search
            </button>
          </div>
        </form>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => handleCategorySelect('')}
            className={`px-4 py-2 rounded-xl text-xs font-medium transition ${
              !activeCategory
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-gray-300'
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
                className={`px-4 py-2 rounded-xl text-xs font-medium transition ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
              >
                {cat.name}
              </button>
            );
          })}

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 transition"
            >
              <X className="w-3.5 h-3.5" />
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* ─── Search Summary ─────────────────────────────────── */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800 pb-3">
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
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Loading articles...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="py-16 text-center rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-800/20 max-w-md mx-auto p-8">
          <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <h3 className="text-lg font-serif font-bold text-gray-800 dark:text-gray-200">No articles found</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-6">
            We couldn't find any stories matching your current filter criteria.
          </p>
          <button
            onClick={clearFilters}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-sm"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
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
