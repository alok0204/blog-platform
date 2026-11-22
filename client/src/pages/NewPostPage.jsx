import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
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
  Quote,
  Code,
  Link as LinkIcon,
  ArrowLeft,
} from 'lucide-react';
import DOMPurify from 'dompurify';
import toast from 'react-hot-toast';
import { createPost, getCategories } from '../services/api';

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

      await createPost(postPayload);
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
    <div className="max-w-4xl mx-auto space-y-6 pb-16 py-4">
      {/* ─── Top Bar ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[var(--line)]">
        <button
          onClick={() => navigate('/dashboard')}
          className="ink-btn-pill text-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSave('DRAFT')}
            className="ink-btn-pill text-xs disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5 text-primary-400" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            disabled={submitting}
            onClick={() => handleSave('PUBLISHED')}
            className="ink-btn-accent text-xs disabled:opacity-50"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{submitting ? 'Publishing...' : 'Publish Story'}</span>
          </button>
        </div>
      </div>

      {/* ─── Metadata Inputs ────────────────────────────────── */}
      <div className="ink-card p-6 space-y-4">
        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Story Title..."
          maxLength={200}
          className="w-full text-2xl sm:text-3xl font-bold text-[var(--text)] placeholder-[var(--muted)] bg-transparent border-0 focus:outline-none p-0"
        />

        {/* Excerpt */}
        <input
          type="text"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Brief summary or subtitle (optional)..."
          maxLength={300}
          className="w-full text-xs sm:text-sm text-[var(--muted)] placeholder-[var(--muted)] bg-transparent border-0 focus:outline-none p-0"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[var(--line)]">
          {/* Category */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1">
              <Folder className="w-3.5 h-3.5 text-primary-400" />
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full py-2 px-3 rounded-[8px] bg-[var(--surface)] border border-[var(--line)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
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
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1">
              <Image className="w-3.5 h-3.5 text-primary-400" />
              Cover Image URL
            </label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full py-2 px-3 rounded-[8px] bg-[var(--surface)] border border-[var(--line)] text-xs text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          {/* Tags */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-primary-400" />
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="React, Backend, Node"
              className="w-full py-2 px-3 rounded-[8px] bg-[var(--surface)] border border-[var(--line)] text-xs text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent)]"
            />
          </div>
        </div>

        {/* Cover Image Preview */}
        {coverImage && (
          <div className="pt-2">
            <p className="text-xs text-[var(--muted)] mb-1">Image Preview:</p>
            <div className="h-36 rounded-[8px] overflow-hidden border border-[var(--line)] max-w-sm">
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
      <div className="ink-card overflow-hidden">
        {/* Tab & Toolbar Bar */}
        <div className="flex flex-wrap items-center justify-between p-3 border-b border-[var(--line)] bg-[var(--surface)] gap-2">
          {/* Tabs */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('write')}
              className={`px-3 py-1.5 rounded-[6px] text-xs font-medium flex items-center gap-1.5 transition ${
                activeTab === 'write'
                  ? 'bg-[var(--card)] text-primary-400 border border-[var(--line)] shadow-sm'
                  : 'text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Write</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-[6px] text-xs font-medium flex items-center gap-1.5 transition ${
                activeTab === 'preview'
                  ? 'bg-[var(--card)] text-primary-400 border border-[var(--line)] shadow-sm'
                  : 'text-[var(--muted)] hover:text-[var(--text)]'
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
                className="p-1.5 rounded hover:bg-[var(--card)] text-[var(--muted)] hover:text-primary-400 transition"
                title="Bold (<strong>)"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('<em>', '</em>')}
                className="p-1.5 rounded hover:bg-[var(--card)] text-[var(--muted)] hover:text-primary-400 transition"
                title="Italic (<em>)"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('<h2>', '</h2>')}
                className="p-1.5 rounded hover:bg-[var(--card)] text-[var(--muted)] hover:text-primary-400 transition"
                title="Heading (<h2>)"
              >
                <Heading className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('<blockquote>', '</blockquote>')}
                className="p-1.5 rounded hover:bg-[var(--card)] text-[var(--muted)] hover:text-primary-400 transition"
                title="Blockquote"
              >
                <Quote className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('<code>', '</code>')}
                className="p-1.5 rounded hover:bg-[var(--card)] text-[var(--muted)] hover:text-primary-400 transition"
                title="Inline Code"
              >
                <Code className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('<a href="https://example.com">', '</a>')}
                className="p-1.5 rounded hover:bg-[var(--card)] text-[var(--muted)] hover:text-primary-400 transition"
                title="Insert Link"
              >
                <LinkIcon className="w-3.5 h-3.5" />
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
            rows={16}
            className="w-full p-6 bg-transparent border-0 resize-y focus:outline-none text-[var(--text)] placeholder-[var(--muted)] font-sans text-sm leading-relaxed"
          />
        ) : (
          <div className="p-6 min-h-[380px]">
            {content.trim() ? (
              <div
                className="prose-content space-y-4"
                dangerouslySetInnerHTML={{ __html: sanitizedPreview }}
              />
            ) : (
              <p className="text-[var(--muted)] italic text-xs">
                No content written yet. Switch back to Write to compose your story.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
