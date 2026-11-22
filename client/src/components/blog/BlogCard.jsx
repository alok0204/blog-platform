import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { Clock, User } from 'lucide-react';

export default function BlogCard({ post, index = 0 }) {
  const readingTime = Math.max(1, Math.ceil((post.content?.length || 0) / 1000));

  const formattedDate = post.createdAt
    ? format(new Date(post.createdAt), 'MMM dd, yyyy')
    : '';

  const authorName = post.author?.name || 'Unknown Author';
  const categoryName = post.category?.name || null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group bg-white dark:bg-gray-800/60 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700/50 hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/20 transition-all duration-300 hover:-translate-y-1 flex flex-col"
    >
      <Link to={`/posts/${post.slug}`} className="block relative overflow-hidden aspect-[16/10]">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-400 via-secondary-500 to-primary-700 flex items-center justify-center">
            <span className="font-serif text-white/80 text-4xl font-bold">
              {post.title?.charAt(0) || 'I'}
            </span>
          </div>
        )}
        {categoryName && (
          <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-xs font-semibold text-primary-600 dark:text-primary-400 rounded-full">
            {categoryName}
          </span>
        )}
      </Link>

      <div className="flex flex-col flex-1 p-5">
        <Link to={`/posts/${post.slug}`}>
          <h3 className="font-serif text-lg font-bold text-gray-900 dark:text-white leading-snug group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 mb-2">
            {post.title}
          </h3>
        </Link>

        {post.excerpt && (
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2 mb-4 flex-1">
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700/50 mt-auto">
          <div className="flex items-center gap-2">
            {post.author?.avatar ? (
              <img
                src={post.author.avatar}
                alt={authorName}
                className="w-7 h-7 rounded-full object-cover"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
              </div>
            )}
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-[100px]">
              {authorName}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
            {formattedDate && <span>{formattedDate}</span>}
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {readingTime} min
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
