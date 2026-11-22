import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PenTool,
  Save,
  Globe,
  Eye,
  Edit3,
  Image,
  Tag,
  Folder,
  Bold,
  Italic,
  Heading,
  List,
  Quote,
  Code,
  Link as LinkIcon,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import DOMPurify from 'dompurify';
import toast from 'react-hot-toast';
import { createPost, getCategories, getTags } from '../services/api';

export default function NewPostPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('write'); // 'write' | 'preview'
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function fetchMetadata() {
      try {
        const catRes = await getCategories();
        if (catRes) {
          const list = Array.isArray(catRes) ? catRes : catRes.categories || [];
          setCategories(list);
          if (list.length > 0) {
            setCategoryId(list[0].id);
          }
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    }
    fetchMetadata();
  }, []);

  // Formatting helpers to insert HTML into content
  const insertFormatting = (before, after = '') => {
    const textarea = document.getElementById('post-content-textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const replacement = `${before}${selectedText || 'Text'}${after}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + (selectedText.length || 4));
    }, 50);
  };

  const handleSave = async (statusToSet = 'DRAFT') => {
    if (!title.trim()) {
      toast.error('Please provide an article title');
      return;
    }
    if (!content.trim()) {
      toast.error('Please provide content for your story');
      return;
    }

    try {
      setSubmitting(true);

      // Process tags
      const rawTags = tagInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const postPayload = {
        title: title.trim(),
        excerpt: excerpt.trim() || undefined,
        content: content.trim(),
        coverImage: coverImage.trim() || undefined,
        categoryId: categoryId || undefined,
        status: statusToSet,
        tags: rawTags,
      };

      const res = await createPost(postPayload);
      toast.success(statusToSet === 'PUBLISHED' ? 'Article published successfully!' : 'Draft saved!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Failed to save story');
    } finally {
      setSubmitting(false);
    }
  };

  const sanitizedPreview = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [
      'p', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'strong', 'b', 'em', 'i', 'u', 's',
      'ul', 'ol', 'li', 'blockquote', 'code', 'pre',
      'a', 'img', 'hr',
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'target', 'rel', 'class'],
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* ─── Top Bar ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSave('DRAFT')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/80 transition shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4 text-gray-500" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSave('PUBLISHED')}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-md shadow-indigo-600/20 disabled:opacity-50"
          >
            <Globe className="w-4 h-4" />
            <span>{submitting ? 'Publishing...' : 'Publish Story'}</span>
          </button>
        </div>
      </div>

      {/* ─── Metadata Inputs (Image, Category, Tags) ───────── */}
      <div className="p-6 rounded-3xl bg-white dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/80 shadow-sm space-y-4">
        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Story Title..."
          maxLength={200}
          className="w-full text-2xl sm:text-4xl font-serif font-bold text-gray-950 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-600 bg-transparent border-0 focus:outline-none focus:ring-0 p-0"
        />

        {/* Excerpt */}
        <input
          type="text"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Brief summary or subtitle (optional)..."
          maxLength={300}
          className="w-full text-sm sm:text-base text-gray-600 dark:text-gray-300 placeholder-gray-400 bg-transparent border-0 focus:outline-none focus:ring-0 p-0"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700/60">
          {/* Category */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1">
              <Folder className="w-3.5 h-3.5" />
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full py-2 px-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Cover Image URL */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1">
              <Image className="w-3.5 h-3.5" />
              Cover Image URL
            </label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full py-2 px-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Tags */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="React, Frontend, Web"
              className="w-full py-2 px-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Cover Image Preview */}
        {coverImage && (
          <div className="pt-2">
            <p className="text-xs text-gray-400 mb-1">Image Preview:</p>
            <div className="h-40 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 max-w-sm">
              <img
                src={coverImage}
                alt="Cover Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ─── Editor & Preview Container ─────────────────────── */}
      <div className="rounded-3xl bg-white dark:bg-gray-800/80 border border-gray-200/80 dark:border-gray-700/80 shadow-sm overflow-hidden">
        {/* Tab & Toolbar Bar */}
        <div className="flex flex-wrap items-center justify-between p-3 border-b border-gray-100 dark:border-gray-700/60 bg-gray-50/70 dark:bg-gray-900/40 gap-2">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-white dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => setActiveTab('write')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                activeTab === 'write'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Write</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                activeTab === 'preview'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          </div>

          {/* Formatting Shortcuts */}
          {activeTab === 'write' && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => insertFormatting('<strong>', '</strong>')}
                className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-200/60 dark:hover:bg-gray-700 transition"
                title="Bold (<strong>)"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('<em>', '</em>')}
                className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-200/60 dark:hover:bg-gray-700 transition"
                title="Italic (<em>)"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('<h2>', '</h2>')}
                className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-200/60 dark:hover:bg-gray-700 transition"
                title="Heading (<h2>)"
              >
                <Heading className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('<blockquote>', '</blockquote>')}
                className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-200/60 dark:hover:bg-gray-700 transition"
                title="Blockquote"
              >
                <Quote className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('<code>', '</code>')}
                className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-200/60 dark:hover:bg-gray-700 transition"
                title="Inline Code"
              >
                <Code className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('<a href="https://example.com">', '</a>')}
                className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-200/60 dark:hover:bg-gray-700 transition"
                title="Insert Link"
              >
                <LinkIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Main Textarea or Preview */}
        {activeTab === 'write' ? (
          <textarea
            id="post-content-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tell your story... You can write in clean paragraphs or use HTML tags like <h2>, <p>, <blockquote>, <strong>, <code>."
            rows={18}
            className="w-full p-6 bg-transparent border-0 resize-y focus:outline-none focus:ring-0 text-gray-900 dark:text-gray-100 placeholder-gray-400 font-sans text-base leading-relaxed"
          />
        ) : (
          <div className="p-8 min-h-[400px]">
            {content.trim() ? (
              <div
                className="prose-content text-gray-800 dark:text-gray-200 leading-relaxed font-sans space-y-4"
                dangerouslySetInnerHTML={{ __html: sanitizedPreview }}
              />
            ) : (
              <p className="text-gray-400 italic text-sm">
                No content written yet. Switch back to Write to compose your story.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
