import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, Tag, Share2, Check, User } from 'lucide-react';
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
        <p className="text-xs text-[var(--muted)] mt-4">Loading article...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="py-20 text-center max-w-md mx-auto space-y-4">
        <h2 className="text-2xl font-bold text-[var(--text)]">Article Not Found</h2>
        <p className="text-[var(--muted)] text-xs">
          The article you are looking for may have been removed, unpublished, or the link might be broken.
        </p>
        <div className="pt-2">
          <Link
            to="/posts"
            className="ink-btn-pill text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
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
    <article className="max-w-4xl mx-auto space-y-8 pb-16 py-4">
      {/* ─── Back Button & Actions ──────────────────────────── */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="ink-btn-pill text-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <button
          onClick={handleShare}
          className="ink-btn-pill text-xs"
          title="Share article"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-primary-400" />}
          <span>{copied ? 'Copied' : 'Share'}</span>
        </button>
      </div>

      {/* ─── Article Header ─────────────────────────────────── */}
      <header className="space-y-4 text-center max-w-3xl mx-auto">
        {post.category && (
          <Link
            to={`/posts?category=${post.category.slug}`}
            className="ink-tag text-xs text-primary-400 font-semibold"
          >
            {post.category.name}
          </Link>
        )}

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--text)] tracking-tight leading-tight">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
            {post.excerpt}
          </p>
        )}

        {/* Author & Meta Row */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-3 text-xs text-[var(--muted)] border-t border-b border-[var(--line)] py-3">
          <Link
            to={`/profile/${post.author?.id || post.authorId}`}
            className="flex items-center gap-2 hover:text-primary-400 transition"
          >
            {post.author?.avatarUrl ? (
              <img
                src={post.author.avatarUrl}
                alt={post.author.name}
                className="w-7 h-7 rounded-full object-cover border border-[var(--line)]"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-[var(--surface)] border border-[var(--line)] text-primary-400 flex items-center justify-center font-bold text-xs">
                {post.author?.name ? post.author.name[0].toUpperCase() : 'A'}
              </div>
            )}
            <span className="font-semibold text-[var(--text)]">{post.author?.name || 'Author'}</span>
          </Link>

          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-primary-400" />
            <span>{publishedDate}</span>
          </span>

          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-primary-400" />
            <span>{readingTime} min read</span>
          </span>
        </div>
      </header>

      {/* ─── Cover Image ────────────────────────────────────── */}
      {post.coverImage && (
        <div className="rounded-[10px] overflow-hidden max-h-[480px] w-full bg-[var(--surface)] border border-[var(--line)]">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* ─── Article Body ───────────────────────────────────── */}
      <div className="max-w-3xl mx-auto space-y-8">
        <div
          className="prose-content"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="pt-6 border-t border-[var(--line)] flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider flex items-center gap-1 mr-1">
              <Tag className="w-3.5 h-3.5 text-primary-400" />
              Tags:
            </span>
            {post.tags.map((t) => {
              const tagObj = t.tag || t;
              return (
                <span
                  key={tagObj.id || tagObj.slug}
                  className="ink-tag text-xs"
                >
                  #{tagObj.name}
                </span>
              );
            })}
          </div>
        )}

        {/* Author Bio Box */}
        {post.author && (
          <div className="ink-card p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-[8px] bg-[var(--surface)] border border-[var(--line)] text-primary-400 flex-shrink-0 flex items-center justify-center font-bold text-lg">
              {post.author.name ? post.author.name[0].toUpperCase() : 'A'}
            </div>
            <div className="space-y-1 flex-1">
              <h4 className="font-bold text-[var(--text)] text-sm">
                Written by {post.author.name}
              </h4>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                {post.author.bio || 'Contributing author at INKWELL. Passionate about software architecture, clean code, and engineering storytelling.'}
              </p>
              <Link
                to={`/profile/${post.author.id}`}
                className="inline-block text-xs font-semibold text-primary-400 hover:underline pt-1"
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
        <section className="pt-12 border-t border-[var(--line)] space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[var(--text)]">
              More Stories You Might Like
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {relatedPosts.map((rPost, idx) => (
              <BlogCard key={rPost.id} post={rPost} index={idx} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
