const { JSDOM } = require('jsdom');
const createDOMPurify = require('dompurify');

// Create a jsdom window and bind DOMPurify to it
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

/**
 * Sanitize HTML content, allowing only safe formatting tags.
 * Strips script tags, event handlers, and all other dangerous content.
 *
 * @param {string} dirty - The raw HTML string to sanitize.
 * @returns {string} The sanitized HTML string.
 */
function sanitizeHtml(dirty) {
  if (!dirty || typeof dirty !== 'string') {
    return '';
  }

  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [
      'p', 'br',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'strong', 'em', 'b', 'i', 'u',
      'ul', 'ol', 'li',
      'a',
      'blockquote',
      'code', 'pre',
      'img',
    ],
    ALLOWED_ATTR: [
      'href',   // for <a>
      'src',    // for <img>
      'alt',    // for <img>
    ],
    ALLOW_DATA_ATTR: false,
  });
}

module.exports = { sanitizeHtml };
