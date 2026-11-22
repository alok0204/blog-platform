import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Compass } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 text-indigo-600 dark:text-indigo-400 mx-auto flex items-center justify-center shadow-lg">
          <Compass className="w-10 h-10 animate-pulse" />
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl font-serif font-bold text-gray-900 dark:text-gray-100">
            404
          </h1>
          <h2 className="text-xl font-serif font-semibold text-gray-800 dark:text-gray-200">
            Story Not Found
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            The page or article you are searching for might have been moved, renamed, or unpublished.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            to="/posts"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <BookOpen className="w-4 h-4" />
            <span>Browse All Articles</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
