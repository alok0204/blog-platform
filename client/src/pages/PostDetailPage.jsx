import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Tag, Share2, Bookmark, Check, User } from 'lucide-react';
import DOMPurify from 'dompurify';
import toast from 'react-hot-toast';
import { getPostBySlug, getPosts } from '../services/api';
import CommentSection from '../components/blog/CommentSection';
import BlogCard from '../components/blog/BlogCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';

export default function PostDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchArticle() {
      try {
        setLoading(true);
        const res = await getPostBySlug(slug);
        if (res && (res.post || res.id)) {
          const article = res.post || res;
          setPost(article);

          // Fetch related posts (same category or recent)
          try {
            const relRes = await getPosts({ limit: 4 });
            if (relRes && relRes.posts) {
              setRelatedPosts(relRes.posts.filter((p) => p.slug !== slug).slice(0, 3));
            }
          } catch (e) {
            console.error('Error fetching related posts:', e);
          }
        } else {
          setPost(null);
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setPost(null);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchArticle();
      window.scrollTo(0, 0);
    }
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">Loading article...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100">Article Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          The article you are looking for may have been removed, unpublished, or the link might be broken.
        </p>
        <div className="pt-2">
          <Link
            to="/posts"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Articles</span>
          </Link>
        </div>
      </div>
    );
  }

  // Calculate reading time
  const readingTime = Math.max(1, Math.ceil((post.content?.length || 500) / 1000));
  const publishedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(undefined, {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Draft';

  // Sanitize content with DOMPurify
  const sanitizedContent = DOMPurify.sanitize(post.content || '', {
    ALLOWED_TAGS: [
      'p', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'strong', 'b', 'em', 'i', 'u', 's', 'strike',
      'ul', 'ol', 'li', 'blockquote', 'code', 'pre',
      'a', 'img', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target', 'rel', 'class'],
  });

  return (
    <article className="max-w-4xl mx-auto space-y-10 pb-16">
      {/* ─── Back Button & Actions ──────────────────────────── */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/80 transition shadow-sm"
          title="Share article"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Share2 className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Share'}</span>
        </button>
      </div>

      {/* ─── Article Header ─────────────────────────────────── */}
      <header className="space-y-6 text-center max-w-3xl mx-auto">
        {post.category && (
          <Link
            to={`/posts?category=${post.category.slug}`}
            className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60"
          >
            {post.category.name}
          </Link>
        )}

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-950 dark:text-gray-50 leading-tight">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
            {post.excerpt}
          </p>
        )}

        {/* Author & Meta Row */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400 border-t border-b border-gray-100 dark:border-gray-800/80 py-4">
          <Link
            to={`/profile/${post.author?.id || post.authorId}`}
            className="flex items-center gap-2.5 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            {post.author?.avatarUrl ? (
              <img
                src={post.author.avatarUrl}
                alt={post.author.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/20"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-semibold text-xs shadow-sm">
                {post.author?.name ? post.author.name[0].toUpperCase() : 'A'}
              </div>
            )}
            <span className="font-semibold text-gray-900 dark:text-gray-100">{post.author?.name || 'Author'}</span>
          </Link>

          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>{publishedDate}</span>
          </span>

          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>{readingTime} min read</span>
          </span>
        </div>
      </header>

      {/* ─── Cover Image ────────────────────────────────────── */}
      {post.coverImage && (
        <div className="rounded-3xl overflow-hidden shadow-xl max-h-[500px] w-full bg-gray-100 dark:bg-gray-900 border border-gray-200/60 dark:border-gray-800">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* ─── Article Body ───────────────────────────────────── */}
      <div className="max-w-3xl mx-auto">
        <div
          className="prose-content text-gray-800 dark:text-gray-200 text-base sm:text-lg leading-relaxed font-sans space-y-5"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1 mr-1">
              <Tag className="w-3.5 h-3.5" />
              Tags:
            </span>
            {post.tags.map((t) => {
              const tagObj = t.tag || t;
              return (
                <span
                  key={tagObj.id || tagObj.slug}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  #{tagObj.name}
                </span>
              );
            })}
          </div>
        )}

        {/* Author Bio Box */}
        {post.author && (
          <div className="mt-12 p-6 rounded-3xl bg-indigo-50/50 dark:bg-gray-800/50 border border-indigo-100 dark:border-gray-700/60 flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex-shrink-0 flex items-center justify-center font-bold text-xl shadow-md">
              {post.author.name ? post.author.name[0].toUpperCase() : 'A'}
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h4 className="font-serif font-bold text-gray-900 dark:text-gray-100 text-base">
                  Written by {post.author.name}
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {post.author.bio || 'Contributing writer at INKWELL. Passionate about software architecture, clean code, and engineering storytelling.'}
              </p>
              <Link
                to={`/profile/${post.author.id}`}
                className="inline-block text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline pt-1"
              >
                View full profile & articles →
              </Link>
            </div>
          </div>
        )}

        {/* ─── Comment Section ────────────────────────────────── */}
        <CommentSection postId={post.id} />
      </div>

      {/* ─── Related Articles ───────────────────────────────── */}
      {relatedPosts.length > 0 && (
        <section className="pt-16 border-t border-gray-200 dark:border-gray-800 space-y-6">
          <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100">
            More Stories You Might Like
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((rPost) => (
              <BlogCard key={rPost.id} post={rPost} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
