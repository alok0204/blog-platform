# 🖋️ INKWELL — Stories Worth Sharing

> **Thiranex Internship — Task 4: Blog Platform with Comments**  
> Developed by **Alok Kumar Vishwas** (Computer Science and Engineering, GL Bajaj Institute of Technology & Management, Greater Noida)

[![GitHub Repository](https://img.shields.io/badge/GitHub-alok0204%2Fblog--platform-181717?style=for-the-badge&logo=github)](https://github.com/alok0204/blog-platform)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Alok_Kumar_Vishwas-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/alok-kumar-vishwas-628b663a1/)
[![Status](https://img.shields.io/badge/Status-Complete-success?style=for-the-badge)]()
[![Stack](https://img.shields.io/badge/Stack-React_•_Node_•_Express_•_Prisma_•_PostgreSQL-6366F1?style=for-the-badge)]()

---

## 📌 Executive Summary

**INKWELL** is a full-stack, production-grade publishing and editorial platform engineered as the official capstone for **Thiranex Internship Task 4 (Blog Platform with Comments)**. 

Unlike simple static blogs or template tutorials, INKWELL is built from the ground up as a multi-author content management platform featuring:
- Relational schema modeling with **Prisma ORM** and **PostgreSQL**
- Secure **JSON Web Token (JWT)** session management with cryptographic **Bcrypt** password hashing
- Full **CRUD** lifecycle for stories, draft/publish workflow, and slug auto-generation
- Interactive **commenting engine** with granular ownership validation and moderation
- Dedicated **Author Studio** and protected **Administrator Dashboard**
- Defenses against XSS and injection via **DOMPurify** sanitization and **Helmet** security headers
- Responsive editorial UI with serif typography, seamless light/dark mode, and subtle **Framer Motion** animations.

---

## 🚀 Key Features

### 1. 🔐 Authentication & Role-Based Authorization
- **User Registration & Login**: Strong password requirements (minimum 8 characters, uppercase, lowercase, numbers).
- **Session Persistence**: HTTP-only authentication cookies + JWT bearer headers.
- **Two-Tier RBAC**:
  - `USER`: Write articles, save drafts, edit/delete own posts, comment on articles, edit profile.
  - `ADMIN`: Full platform moderation, delete inappropriate comments, manage public posts, view global metrics.
- **Zero Default Passwords**: Dynamic admin setup endpoint protected by server-side `ADMIN_SETUP_KEY`.

### 2. 📝 Editorial Studio & Post Management
- **Rich Article Creation**: Support for formatted headings, lists, blockquotes, code spans, links, and cover images.
- **Draft & Publish Engine**: Toggle between private drafts and public published posts.
- **Slug Uniqueness**: Automated URL slug generation with collision handling.
- **Live Preview**: Real-time side-by-side authoring preview with sanitized output.
- **Categorization & Tagging**: Filterable topics (Technology, Web Development, Programming, Design, Career, Tutorial) and multi-tag associations.

### 3. 💬 Discussion System
- **Contextual Discussions**: Comments tied to specific published articles.
- **Ownership Verification**: Authors can edit or delete their own feedback.
- **Administrative Moderation**: Admins can immediately delete spam or inappropriate comments across the entire site.
- **Persistent Storage**: All interactions persist in PostgreSQL across server restarts.

### 4. 📊 Author & Admin Dashboards
- **Author Studio (`/dashboard`)**:
  - Live statistics: Total Posts, Published, Drafts, and Total Comments Received.
  - Interactive story management table with one-click publish/unpublish and editing.
- **Admin Center (`/admin`)**:
  - High-level platform statistics: Registered users, published stories, drafts, total discussions.
  - Global comment moderation center with instant deletion.

### 5. 🎨 Editorial Design System
- **Warm White (`#FAFAF8`) & Charcoal (`#1A1A2E`)** themes with deep indigo accents (`#4F46E5`).
- **Playfair Display & Georgia** serif typography for article headlines; clean **Inter** for UI controls.
- **Persistent Theme Preference**: Synchronized across browser tabs and localStorage.
- **Mobile-First Usability**: Fully responsive across mobile phones, tablets, and desktop displays.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v6, Lucide Icons, Framer Motion, React Hot Toast, Date-fns, DOMPurify |
| **Backend** | Node.js, Express.js, RESTful Architecture, CORS, Cookie-Parser, Express-Rate-Limit, Helmet |
| **Database & ORM** | PostgreSQL, Prisma ORM (v6), Migrations & Schema Relations |
| **Security** | Bcrypt.js (12 rounds), JSON Web Tokens (JWT), DOMPurify XSS Sanitization, Rate Limiting |
| **DevOps & VCS** | Git, GitHub (`alok0204/blog-platform`), Vercel, Render, Neon PostgreSQL |

---

## 📁 Monorepo Project Architecture

```
blog-platform/
├── client/                     # Frontend Application (React + Vite + Tailwind)
│   ├── public/                 # Static assets & favicon.svg
│   ├── src/
│   │   ├── components/         # Reusable UI & domain components
│   │   │   ├── blog/           # BlogCard, CommentSection
│   │   │   ├── layout/         # Navbar, Footer
│   │   │   └── ui/             # LoadingSpinner, Pagination, ProtectedRoute, SearchBar
│   │   ├── context/            # AuthContext, ThemeContext
│   │   ├── layouts/            # MainLayout
│   │   ├── pages/              # HomePage, AllPostsPage, PostDetailPage, DashboardPage,
│   │   │                       # NewPostPage, EditPostPage, LoginPage, RegisterPage,
│   │   │                       # ProfilePage, AdminDashboardPage, AboutPage, NotFoundPage
│   │   ├── services/           # api.js (Fetch client with credentials)
│   │   ├── styles/             # index.css (Tailwind & custom prose styling)
│   │   ├── App.jsx             # Main routing & application configuration
│   │   └── main.jsx            # React root mount
│   ├── index.html              # HTML entry point with Google Fonts
│   ├── tailwind.config.js      # Custom theme colors and typography
│   ├── vite.config.js          # Vite configuration with /api proxy
│   └── package.json
│
├── server/                     # Backend Application (Node.js + Express + Prisma)
│   ├── prisma/
│   │   ├── schema.prisma       # Relational models: User, Post, Category, Tag, PostTag, Comment
│   │   └── seed.js             # Comprehensive development & demo seed script
│   ├── src/
│   │   ├── middleware/         # auth.js (authenticate, requireAuth, requireAdmin), errorHandler.js
│   │   ├── routes/             # auth.js, posts.js, comments.js, categories.js, users.js, dashboard.js, admin.js, tags.js
│   │   ├── utils/              # sanitize.js (DOMPurify HTML sanitizer)
│   │   └── index.js            # Express server initialization & middleware stack
│   ├── .env.example            # Backend environment template
│   └── package.json
│
├── .gitignore                  # Git ignore rules for node_modules, build artifacts & secrets
├── .env.example                # Root environment template
└── README.md                   # Comprehensive project documentation
```

---

## 🗄️ Database Architecture (Prisma Schema)

```mermaid
erDiagram
    User ||--o{ Post : creates
    User ||--o{ Comment : writes
    Category ||--o{ Post : classifies
    Post ||--o{ PostTag : has
    Tag ||--o{ PostTag : tags
    Post ||--o{ Comment : contains

    User {
        String id PK
        String name
        String email UK
        String passwordHash
        Role role "USER | ADMIN"
        String bio
        String avatarUrl
        DateTime createdAt
        DateTime updatedAt
    }

    Post {
        String id PK
        String title
        String slug UK
        String excerpt
        String content
        String coverImage
        PostStatus status "DRAFT | PUBLISHED"
        String authorId FK
        String categoryId FK
        DateTime publishedAt
        DateTime createdAt
        DateTime updatedAt
    }

    Category {
        String id PK
        String name UK
        String slug UK
    }

    Comment {
        String id PK
        String content
        String authorId FK
        String postId FK
        DateTime createdAt
        DateTime updatedAt
    }

    Tag {
        String id PK
        String name UK
        String slug UK
    }

    PostTag {
        String postId PK,FK
        String tagId PK,FK
    }
```

---

## 🔌 RESTful API Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Login and receive secure session cookie | No |
| `POST` | `/api/auth/logout` | Clear session cookie | Yes |
| `GET` | `/api/auth/me` | Fetch currently authenticated user | Optional |
| `POST` | `/api/auth/admin-setup` | Promote user to ADMIN using secret setup key | No (Secret required) |

### 📖 Articles & Stories (`/api/posts`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/posts` | Public list of published posts (supports `page`, `search`, `category`, `tag`) | No |
| `GET` | `/api/posts/my` | List all posts by current user (including drafts) | Yes |
| `GET` | `/api/posts/:slug` | View single article by URL slug | Public / Author for draft |
| `POST` | `/api/posts` | Create a new blog post | Yes |
| `PUT` | `/api/posts/:id` | Update an existing post (Ownership verified) | Yes |
| `DELETE` | `/api/posts/:id` | Delete an article (Author or Admin) | Yes |
| `PATCH` | `/api/posts/:id/publish` | Toggle post status between DRAFT and PUBLISHED | Yes |

### 💬 Comments & Discussions (`/api/comments`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/comments/posts/:postId/comments` | Get paginated comments for an article | No |
| `POST` | `/api/comments` | Post a comment on a published story | Yes |
| `PUT` | `/api/comments/:id` | Edit own comment | Yes (Author only) |
| `DELETE` | `/api/comments/:id` | Delete comment | Yes (Author or Admin) |

### 📊 Dashboards & Moderation
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/dashboard/stats` | Retrieve stats and recent stories for current author | Yes |
| `GET` | `/api/admin/stats` | Global platform metrics | Admin |
| `GET` | `/api/admin/posts` | All posts from all users | Admin |
| `GET` | `/api/admin/comments` | All comments across all posts | Admin |
| `DELETE` | `/api/admin/comments/:id` | Administrative comment removal | Admin |

---

## 💻 Local Installation & Setup

### Prerequisites
- **Node.js** (v18.x or v20.x+)
- **Git**
- **PostgreSQL** (local instance, or free cloud database from [Neon](https://neon.tech) / [Supabase](https://supabase.com))

### 1. Clone the Repository
```bash
git clone https://github.com/alok0204/blog-platform.git
cd blog-platform
```

### 2. Configure Environment Variables
Create `.env` inside `server/`:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
DATABASE_URL="postgresql://user:password@localhost:5432/inkwell?schema=public"
JWT_SECRET="inkwell_super_secret_jwt_key_2026_thiranex_task4"
JWT_EXPIRES_IN=7d
ADMIN_SETUP_KEY="inkwell_admin_secret_key_2026"
```

### 3. Install Dependencies
```bash
# Install backend dependencies
cd server
npm install

# Generate Prisma Client & Run Migrations
npx prisma generate
npx prisma db push

# Seed initial database with demonstration stories & users
npm run db:seed

# Install frontend dependencies
cd ../client
npm install
```

### 4. Run the Development Environment
Open two terminal windows:

**Terminal 1 (Backend API):**
```bash
cd server
npm run dev
# Server running on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
# Client running on http://localhost:5173
```

Visit **`http://localhost:5173`** in your browser.

---

## 🧪 Pre-Configured Demo Credentials

Use these seeded accounts to test features immediately:

| Role | Name | Email | Password |
|---|---|---|---|
| **Author** | Alok Vishwas | `demo@inkwell.com` | `Demo@1234` |
| **Author** | Sarah Chen | `sarah@inkwell.com` | `Demo@1234` |

*(You can also register any new account freely on the registration page).*

---

## 🚢 Deployment Guide

### Frontend Deployment (Vercel)
1. Push code to GitHub.
2. Import repository in [Vercel](https://vercel.com).
3. Set **Root Directory** to `client`.
4. Configure Build Command: `npm run build` and Output Directory: `dist`.
5. Add Environment Variable:
   - `VITE_API_URL`: `https://your-backend-api.onrender.com`

### Backend Deployment (Render)
1. In [Render](https://render.com), create a new **Web Service** connected to your repository.
2. Set **Root Directory** to `server`.
3. Set **Build Command**: `npm install && npx prisma generate`
4. Set **Start Command**: `npm start`
5. Configure Environment Variables:
   - `DATABASE_URL`: Connection string from Neon PostgreSQL.
   - `JWT_SECRET`: Random 64-character secret.
   - `CLIENT_URL`: Your Vercel frontend URL.
   - `NODE_ENV`: `production`

---

## 👨‍💻 Developer & Attribution

* **Developer**: Alok Kumar Vishwas
* **Academic**: B.Tech (2nd Year), Computer Science and Engineering (CSE)
* **Institution**: GL Bajaj Institute of Technology & Management, Greater Noida
* **Email**: [alokvishwas786@gmail.com](mailto:alokvishwas786@gmail.com)
* **GitHub**: [@alok0204](https://github.com/alok0204)
* **LinkedIn**: [alok-kumar-vishwas](https://www.linkedin.com/in/alok-kumar-vishwas-628b663a1/)
* **Internship**: Thiranex Web Development Internship — Task 4 (Blog Platform with Comments)

---

*Crafted with precision, thoughtful typography, and passion for elegant software engineering.*
