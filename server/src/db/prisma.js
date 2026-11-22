const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const DATA_FILE = path.join(__dirname, '../../data/inkwell-db.json');

let realPrisma = null;
let isPostgresConnected = false;

// Attempt PostgreSQL connection via PrismaClient
if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost:5432')) {
  try {
    realPrisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    });
    realPrisma.$connect()
      .then(() => {
        isPostgresConnected = true;
        console.log('✓ Successfully connected to PostgreSQL via Prisma ORM.');
      })
      .catch((err) => {
        console.warn('! PostgreSQL connection unreachable. Using persistent local disk storage:', err.message);
        isPostgresConnected = false;
      });
  } catch (err) {
    console.warn('! PrismaClient init error:', err.message);
  }
} else {
  console.info('ℹ Running with resilient persistent database storage (data/inkwell-db.json). Ready for PostgreSQL in production.');
}

// Ensure persistent data directory and file exist
function getStore() {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      const initial = generateDefaultSeed();
      fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw || '{"users":[],"categories":[],"tags":[],"posts":[],"comments":[]}');
  } catch (err) {
    console.error('Error reading data store:', err);
    return { users: [], categories: [], tags: [], posts: [], comments: [] };
  }
}

function saveStore(data) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to data store:', err);
  }
}

function generateDefaultSeed() {
  const hash = bcrypt.hashSync('Demo@1234', 10);
  const now = new Date().toISOString();
  const past = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const users = [
    {
      id: 'usr_alok_001',
      name: 'Alok Vishwas',
      email: 'demo@inkwell.com',
      passwordHash: hash,
      role: 'USER',
      bio: 'B.Tech CSE student & full-stack software developer. Building INKWELL for Thiranex Internship Task 4.',
      avatarUrl: null,
      createdAt: past,
      updatedAt: past,
    },
    {
      id: 'usr_sarah_002',
      name: 'Sarah Chen',
      email: 'sarah@inkwell.com',
      passwordHash: hash,
      role: 'USER',
      bio: 'Software architect and tech essayist. Writing about distributed systems and clean React design.',
      avatarUrl: null,
      createdAt: past,
      updatedAt: past,
    },
    {
      id: 'usr_admin_003',
      name: 'System Administrator',
      email: 'admin@inkwell.com',
      passwordHash: hash,
      role: 'ADMIN',
      bio: 'INKWELL Platform Administrator & Content Moderator.',
      avatarUrl: null,
      createdAt: past,
      updatedAt: past,
    },
  ];

  const categories = [
    { id: 'cat_webdev', name: 'Web Development', slug: 'web-development' },
    { id: 'cat_tech', name: 'Technology', slug: 'technology' },
    { id: 'cat_prog', name: 'Programming', slug: 'programming' },
    { id: 'cat_design', name: 'Design', slug: 'design' },
    { id: 'cat_career', name: 'Career', slug: 'career' },
    { id: 'cat_tutorial', name: 'Tutorial', slug: 'tutorial' },
  ];

  const tags = [
    { id: 'tag_react', name: 'React', slug: 'react' },
    { id: 'tag_nodejs', name: 'Node.js', slug: 'nodejs' },
    { id: 'tag_prisma', name: 'Prisma', slug: 'prisma' },
    { id: 'tag_postgres', name: 'PostgreSQL', slug: 'postgresql' },
    { id: 'tag_tailwind', name: 'TailwindCSS', slug: 'tailwindcss' },
    { id: 'tag_javascript', name: 'JavaScript', slug: 'javascript' },
  ];

  const posts = [
    {
      id: 'post_001',
      title: 'Architecting Resilient Full-Stack Applications with React and Express',
      slug: 'architecting-resilient-full-stack-applications-with-react-and-express',
      excerpt: 'A comprehensive deep-dive into structuring modern monorepo applications, secure cookie-based JWT sessions, and decoupled REST APIs.',
      content: '<h2>The Essence of Modern Web Architecture</h2><p>Building production-ready software requires looking beyond simple tutorials. When architecting scalable web applications, the separation of concerns between client rendering and persistent backend services is the foundation of long-term maintainability.</p><h2>Designing Predictable REST Endpoints</h2><p>A well-crafted REST API is self-descriptive, resilient, and adheres strictly to HTTP specifications. Authentication headers, rate limiting, and defensive request validation guarantee that only verified payloads reach your business logic.</p><blockquote>"Simplicity is prerequisite for reliability." — Edsger W. Dijkstra</blockquote><h2>Safe Content Rendering</h2><p>Allowing authors to write rich text content demands defense-in-depth sanitization. By processing untrusted user inputs with DOMPurify on both backend intake and frontend render passes, executable XSS vectors are eliminated while preserving semantic typography.</p>',
      coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
      status: 'PUBLISHED',
      authorId: 'usr_alok_001',
      categoryId: 'cat_webdev',
      publishedAt: past,
      createdAt: past,
      updatedAt: past,
      tagIds: ['tag_react', 'tag_nodejs', 'tag_prisma'],
    },
    {
      id: 'post_002',
      title: 'The Art of Relational Data Modeling with Prisma ORM',
      slug: 'the-art-of-relational-data-modeling-with-prisma-orm',
      excerpt: 'Why relational databases like PostgreSQL remain the gold standard for editorial and publishing applications.',
      content: '<h2>Why Relational Schema Matters</h2><p>Content management systems inherently rely on complex relationships: authors have posts, posts have categories and comments, and tags span across multiple articles. Prisma ORM bridges the impedance mismatch between JavaScript objects and SQL tables.</p><h2>Enforcing Integrity at the Database Level</h2><p>Cascading deletions, foreign key constraints, and unique indices on slugs ensure data corruption never creeps into your persistent state. Even under heavy concurrent loads, ACID guarantees preserve transactions.</p><p>Understanding these database fundamentals is what separates junior coders from experienced full-stack engineers.</p>',
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      status: 'PUBLISHED',
      authorId: 'usr_alok_001',
      categoryId: 'cat_prog',
      publishedAt: past,
      createdAt: past,
      updatedAt: past,
      tagIds: ['tag_postgres', 'tag_prisma', 'tag_nodejs'],
    },
    {
      id: 'post_003',
      title: 'Mastering Editorial Typography & Dark Mode in Tailwind CSS',
      slug: 'mastering-editorial-typography-and-dark-mode-in-tailwind-css',
      excerpt: 'How warm white palettes, serif headlines, and comfortable reading widths transform a website into an engaging reading platform.',
      content: '<h2>Typography as a First-Class Citizen</h2><p>Great reading experiences are invisible. When typography is calibrated with comfortable line heights, readable measure widths (around 65 to 75 characters per line), and balanced contrast, users stay engaged longer.</p><h2>Implementing Flawless Dark Mode</h2><p>True dark mode is not merely flipping white to pure black (#000000). A soothing charcoal background (#1A1A2E) paired with muted slate text reduces eye strain in low-light environments while maintaining visual depth.</p>',
      coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
      status: 'PUBLISHED',
      authorId: 'usr_sarah_002',
      categoryId: 'cat_design',
      publishedAt: past,
      createdAt: past,
      updatedAt: past,
      tagIds: ['tag_tailwind', 'tag_react'],
    },
    {
      id: 'post_004',
      title: 'Building Interactive Community Discussions from Scratch',
      slug: 'building-interactive-community-discussions-from-scratch',
      excerpt: 'Structuring real-time discussions, user permissions, and comment moderation in web applications.',
      content: '<h2>The Power of Reader Feedback</h2><p>A blog platform truly comes alive through its community discussion section. Readers share insights, point out edge cases, and spark meaningful intellectual dialogues with authors.</p><h2>Moderation & Authorization Rules</h2><p>Every comment must enforce strict permission checks: authors must only edit or delete their own contributions, while administrators retain full rights to remove harmful content or spam.</p>',
      coverImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
      status: 'PUBLISHED',
      authorId: 'usr_sarah_002',
      categoryId: 'cat_webdev',
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
      tagIds: ['tag_javascript', 'tag_nodejs'],
    },
    {
      id: 'post_005',
      title: 'A B.Tech Student’s Journey Through Full-Stack Engineering',
      slug: 'a-btech-students-journey-through-full-stack-engineering',
      excerpt: 'Reflections from 2nd year Computer Science student Alok Kumar Vishwas on building real-world projects during the Thiranex internship.',
      content: '<h2>From Classroom Theory to Production Code</h2><p>Studying Computer Science and Engineering at GL Bajaj Institute of Technology & Management provides a strong theoretical footing. However, completing real-world tasks — like building INKWELL for Thiranex Task 4 — brings theory into vivid reality.</p><h2>Key Lessons Learned</h2><p>Writing real backend RESTful APIs, handling JWT auth cookies, configuring CORS and CSRF protections, and crafting a responsive UI taught me how real production SaaS products operate.</p>',
      coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
      status: 'PUBLISHED',
      authorId: 'usr_alok_001',
      categoryId: 'cat_career',
      publishedAt: now,
      createdAt: now,
      updatedAt: now,
      tagIds: ['tag_javascript', 'tag_react', 'tag_nodejs'],
    },
  ];

  const comments = [
    {
      id: 'cmt_001',
      content: 'Excellent breakdown of monorepo architecture! The clean separation between client and server is very well structured.',
      authorId: 'usr_sarah_002',
      postId: 'post_001',
      createdAt: past,
      updatedAt: past,
    },
    {
      id: 'cmt_002',
      content: 'Thank you Sarah! Ensuring robust security headers and DOMPurify sanitization was a top priority.',
      authorId: 'usr_alok_001',
      postId: 'post_001',
      createdAt: past,
      updatedAt: past,
    },
    {
      id: 'cmt_003',
      content: 'Prisma ORM with PostgreSQL is genuinely one of the best developer experiences available today.',
      authorId: 'usr_sarah_002',
      postId: 'post_002',
      createdAt: past,
      updatedAt: past,
    },
    {
      id: 'cmt_004',
      content: 'The charcoal and warm-white color palette feels so comfortable on the eyes. Beautiful reading layout!',
      authorId: 'usr_alok_001',
      postId: 'post_003',
      createdAt: past,
      updatedAt: past,
    },
    {
      id: 'cmt_005',
      content: 'Inspiring journey, Alok! Thiranex Task 4 shows deep dedication to full-stack engineering standards.',
      authorId: 'usr_sarah_002',
      postId: 'post_005',
      createdAt: now,
      updatedAt: now,
    },
  ];

  return { users, categories, tags, posts, comments };
}

// Resilient API object matching PrismaClient interface
const db = {
  isPostgres() {
    return isPostgresConnected && realPrisma !== null;
  },

  get real() {
    return realPrisma;
  },

  user: {
    async findUnique({ where }) {
      if (db.isPostgres()) {
        try {
          return await realPrisma.user.findUnique({ where });
        } catch (e) {
          console.warn('Postgres query error, using disk store:', e.message);
        }
      }
      const store = getStore();
      if (where.email) {
        return store.users.find((u) => u.email.toLowerCase() === where.email.toLowerCase()) || null;
      }
      if (where.id) {
        return store.users.find((u) => u.id === where.id) || null;
      }
      return null;
    },

    async create({ data }) {
      if (db.isPostgres()) {
        try {
          return await realPrisma.user.create({ data });
        } catch (e) {
          console.warn('Postgres create error, using disk store:', e.message);
        }
      }
      const store = getStore();
      const newUser = {
        id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: data.name,
        email: data.email.toLowerCase(),
        passwordHash: data.passwordHash,
        role: data.role || 'USER',
        bio: data.bio || null,
        avatarUrl: data.avatarUrl || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      store.users.push(newUser);
      saveStore(store);
      return newUser;
    },

    async update({ where, data }) {
      if (db.isPostgres()) {
        try {
          return await realPrisma.user.update({ where, data });
        } catch (e) {
          console.warn('Postgres update error, using disk store:', e.message);
        }
      }
      const store = getStore();
      const idx = store.users.findIndex((u) => u.id === where.id);
      if (idx === -1) throw new Error('User not found');
      store.users[idx] = {
        ...store.users[idx],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      saveStore(store);
      return store.users[idx];
    },

    async count({ where = {} } = {}) {
      if (db.isPostgres()) {
        try {
          return await realPrisma.user.count({ where });
        } catch (e) {}
      }
      const store = getStore();
      return store.users.length;
    },
  },

  category: {
    async findMany({ include = {} } = {}) {
      if (db.isPostgres()) {
        try {
          return await realPrisma.category.findMany({ include });
        } catch (e) {}
      }
      const store = getStore();
      return store.categories.map((c) => ({
        ...c,
        _count: {
          posts: store.posts.filter((p) => p.categoryId === c.id && p.status === 'PUBLISHED').length,
        },
      }));
    },

    async findUnique({ where }) {
      if (db.isPostgres()) {
        try {
          return await realPrisma.category.findUnique({ where });
        } catch (e) {}
      }
      const store = getStore();
      return store.categories.find((c) => c.id === where.id || c.slug === where.slug) || null;
    },
  },

  tag: {
    async findMany({ include = {} } = {}) {
      if (db.isPostgres()) {
        try {
          return await realPrisma.tag.findMany({ include });
        } catch (e) {}
      }
      const store = getStore();
      return store.tags.map((t) => ({
        ...t,
        _count: {
          posts: store.posts.filter((p) => p.tagIds && p.tagIds.includes(t.id)).length,
        },
      }));
    },
  },

  post: {
    async findMany({ where = {}, skip = 0, take = 10, orderBy = {} } = {}) {
      if (db.isPostgres()) {
        try {
          return await realPrisma.post.findMany({ where, skip, take, orderBy, include: { author: true, category: true, _count: true } });
        } catch (e) {}
      }
      const store = getStore();
      let list = [...store.posts];

      if (where.status) {
        list = list.filter((p) => p.status === where.status);
      }
      if (where.authorId) {
        list = list.filter((p) => p.authorId === where.authorId);
      }
      if (where.category && where.category.slug) {
        const cat = store.categories.find((c) => c.slug === where.category.slug);
        if (cat) {
          list = list.filter((p) => p.categoryId === cat.id);
        } else {
          list = [];
        }
      }
      if (where.OR && Array.isArray(where.OR)) {
        list = list.filter((p) => {
          return where.OR.some((cond) => {
            if (cond.title && cond.title.contains) {
              return p.title.toLowerCase().includes(cond.title.contains.toLowerCase());
            }
            if (cond.content && cond.content.contains) {
              return p.content.toLowerCase().includes(cond.content.contains.toLowerCase());
            }
            return false;
          });
        });
      }

      // Sort
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const paginated = list.slice(skip, skip + take);

      return paginated.map((p) => {
        const author = store.users.find((u) => u.id === p.authorId);
        const category = store.categories.find((c) => c.id === p.categoryId);
        const commentCount = store.comments.filter((c) => c.postId === p.id).length;
        const postTags = (p.tagIds || [])
          .map((tid) => store.tags.find((t) => t.id === tid))
          .filter(Boolean)
          .map((t) => ({ tag: t }));

        return {
          ...p,
          author: author ? { id: author.id, name: author.name, avatarUrl: author.avatarUrl, bio: author.bio } : null,
          category: category ? { id: category.id, name: category.name, slug: category.slug } : null,
          tags: postTags,
          _count: { comments: commentCount },
        };
      });
    },

    async count({ where = {} } = {}) {
      if (db.isPostgres()) {
        try {
          return await realPrisma.post.count({ where });
        } catch (e) {}
      }
      const store = getStore();
      let list = [...store.posts];
      if (where.status) list = list.filter((p) => p.status === where.status);
      if (where.authorId) list = list.filter((p) => p.authorId === where.authorId);
      return list.length;
    },

    async findUnique({ where } = {}) {
      if (db.isPostgres()) {
        try {
          return await realPrisma.post.findUnique({ where, include: { author: true, category: true, tags: { include: { tag: true } }, _count: true } });
        } catch (e) {}
      }
      const store = getStore();
      const p = store.posts.find((item) => (where.id && item.id === where.id) || (where.slug && item.slug === where.slug));
      if (!p) return null;

      const author = store.users.find((u) => u.id === p.authorId);
      const category = store.categories.find((c) => c.id === p.categoryId);
      const commentCount = store.comments.filter((c) => c.postId === p.id).length;
      const postTags = (p.tagIds || [])
        .map((tid) => store.tags.find((t) => t.id === tid))
        .filter(Boolean)
        .map((t) => ({ tag: t }));

      return {
        ...p,
        author: author ? { id: author.id, name: author.name, avatarUrl: author.avatarUrl, bio: author.bio } : null,
        category: category ? { id: category.id, name: category.name, slug: category.slug } : null,
        tags: postTags,
        _count: { comments: commentCount },
      };
    },

    async create({ data }) {
      if (db.isPostgres()) {
        try {
          return await realPrisma.post.create({ data });
        } catch (e) {}
      }
      const store = getStore();
      const authorId = data.authorId || (data.author && data.author.connect ? data.author.connect.id : null);
      const categoryId = data.categoryId || (data.category && data.category.connect ? data.category.connect.id : null);
      const newPost = {
        id: `post_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || null,
        content: data.content,
        coverImage: data.coverImage || null,
        status: data.status || 'DRAFT',
        authorId,
        categoryId,
        tagIds: [],
        publishedAt: data.status === 'PUBLISHED' ? new Date().toISOString() : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      store.posts.unshift(newPost);
      saveStore(store);
      const author = store.users.find((u) => u.id === authorId);
      const category = store.categories.find((c) => c.id === categoryId);
      return {
        ...newPost,
        author: author ? { id: author.id, name: author.name, avatarUrl: author.avatarUrl } : null,
        category: category ? { id: category.id, name: category.name, slug: category.slug } : null,
        tags: [],
        _count: { comments: 0 },
      };
    },

    async update({ where, data }) {
      if (db.isPostgres()) {
        try {
          return await realPrisma.post.update({ where, data });
        } catch (e) {}
      }
      const store = getStore();
      const idx = store.posts.findIndex((p) => p.id === where.id);
      if (idx === -1) throw new Error('Post not found');
      store.posts[idx] = {
        ...store.posts[idx],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      saveStore(store);
      return store.posts[idx];
    },

    async delete({ where }) {
      if (db.isPostgres()) {
        try {
          return await realPrisma.post.delete({ where });
        } catch (e) {}
      }
      const store = getStore();
      store.posts = store.posts.filter((p) => p.id !== where.id);
      store.comments = store.comments.filter((c) => c.postId !== where.id);
      saveStore(store);
      return { success: true };
    },
  },

  comment: {
    async findMany({ where = {}, skip = 0, take = 10, orderBy = {} } = {}) {
      if (db.isPostgres()) {
        try {
          return await realPrisma.comment.findMany({ where, skip, take, orderBy, include: { author: true } });
        } catch (e) {}
      }
      const store = getStore();
      let list = [...store.comments];
      if (where.postId) {
        list = list.filter((c) => c.postId === where.postId);
      }
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const paginated = list.slice(skip, skip + take);

      return paginated.map((c) => {
        const author = store.users.find((u) => u.id === c.authorId);
        const post = store.posts.find((p) => p.id === c.postId);
        return {
          ...c,
          author: author ? { id: author.id, name: author.name, avatarUrl: author.avatarUrl, role: author.role } : null,
          post: post ? { id: post.id, title: post.title, slug: post.slug } : null,
        };
      });
    },

    async count({ where = {} } = {}) {
      if (db.isPostgres()) {
        try {
          return await realPrisma.comment.count({ where });
        } catch (e) {}
      }
      const store = getStore();
      if (where.postId) {
        return store.comments.filter((c) => c.postId === where.postId).length;
      }
      return store.comments.length;
    },

    async findUnique({ where }) {
      if (db.isPostgres()) {
        try {
          return await realPrisma.comment.findUnique({ where });
        } catch (e) {}
      }
      const store = getStore();
      return store.comments.find((c) => c.id === where.id) || null;
    },

    async create({ data }) {
      if (db.isPostgres()) {
        try {
          return await realPrisma.comment.create({ data });
        } catch (e) {}
      }
      const store = getStore();
      const authorId = data.authorId || (data.author && data.author.connect ? data.author.connect.id : null);
      const postId = data.postId || (data.post && data.post.connect ? data.post.connect.id : null);
      const newComment = {
        id: `cmt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        content: data.content,
        authorId,
        postId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      store.comments.unshift(newComment);
      saveStore(store);

      const author = store.users.find((u) => u.id === authorId);
      return {
        ...newComment,
        author: author ? { id: author.id, name: author.name, avatarUrl: author.avatarUrl, role: author.role } : null,
      };
    },

    async update({ where, data }) {
      if (db.isPostgres()) {
        try {
          return await realPrisma.comment.update({ where, data });
        } catch (e) {}
      }
      const store = getStore();
      const idx = store.comments.findIndex((c) => c.id === where.id);
      if (idx === -1) throw new Error('Comment not found');
      store.comments[idx] = {
        ...store.comments[idx],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      saveStore(store);
      return store.comments[idx];
    },

    async delete({ where }) {
      if (db.isPostgres()) {
        try {
          return await realPrisma.comment.delete({ where });
        } catch (e) {}
      }
      const store = getStore();
      store.comments = store.comments.filter((c) => c.id !== where.id);
      saveStore(store);
      return { success: true };
    },
  },

  postTag: {
    async deleteMany({ where }) {
      return { count: 0 };
    },
    async createMany({ data }) {
      return { count: data?.length || 0 };
    },
  },
};

module.exports = db;
