import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Clock, User } from 'lucide-react';

export default function BlogCard({ post, index = 0, isHighlighted = false }) {
  const readingTime = Math.max(1, Math.ceil((post.content?.length || 0) / 1000));

  const formattedDate = post.publishedAt || post.createdAt
    ? format(new Date(post.publishedAt || post.createdAt), 'MMM dd, yyyy')
    : '';

  const authorName = post.author?.name || 'INKWELL Author';
  const categoryName = post.category?.name || null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className={`group flex flex-col overflow-hidden transition-all duration-200 ${
        isHighlighted ? 'ink-card-active' : 'ink-card'
      }`}
    >
      <Link to={`/posts/${post.slug}`} className="block relative overflow-hidden aspect-[16/10] bg-[var(--surface)]">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#17171c] via-[#1c1c22] to-[#252530] flex items-center justify-center">
            <span className="font-mono text-primary-400/60 text-4xl font-bold">
              &lt;{post.title?.charAt(0) || 'I'}&gt;
            </span>
          </div>
        )}
        {categoryName && (
          <span className="absolute top-3 left-3 ink-tag bg-[var(--surface)]/90 backdrop-blur-md text-primary-400 border-[var(--line)] font-medium">
            {categoryName}
          </span>
        )}
      </Link>

      <div className="flex flex-col flex-1 p-5 space-y-3">
        <Link to={`/posts/${post.slug}`}>
          <h3 className="font-sans text-base sm:text-lg font-bold text-[var(--text)] group-hover:text-primary-400 transition-colors line-clamp-2 leading-snug">
            {post.title}
          </h3>
        </Link>

        {post.excerpt && (
          <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed line-clamp-2 flex-1">
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-[var(--line)] mt-auto text-xs text-[var(--muted)]">
          <div className="flex items-center gap-2">
            {post.author?.avatarUrl ? (
              <img
                src={post.author.avatarUrl}
                alt={authorName}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-[var(--surface)] border border-[var(--line)] flex items-center justify-center">
                <User className="w-3 h-3 text-primary-400" />
              </div>
            )}
            <span className="text-xs font-medium text-[var(--text)] truncate max-w-[110px]">
              {authorName}
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-[11px]">
            {formattedDate && <span>{formattedDate}</span>}
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-primary-400" />
              {readingTime} min
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
