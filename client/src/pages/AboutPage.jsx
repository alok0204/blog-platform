import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Code, Database, Shield, Heart, ExternalLink, Github, Linkedin, Award, Cpu, Layers } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-16 py-6">
      {/* ─── Hero Section ───────────────────────────────────── */}
      <section className="text-center space-y-4">
        <span className="inline-block px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
          Project Overview
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-950 dark:text-gray-50">
          About INKWELL
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          "Stories Worth Sharing" — A full-stack publishing platform engineered for elegant writing, rich discussions, and deep reading.
        </p>
      </section>

      {/* ─── Mission & Purpose ──────────────────────────────── */}
      <section className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-gray-800/70 border border-gray-200/80 dark:border-gray-700/80 shadow-md space-y-6">
        <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2.5">
          <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          The Purpose of INKWELL
        </h2>
        <div className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed space-y-4 font-sans">
          <p>
            INKWELL was engineered as an authentic, full-featured demonstration blogging and content publishing platform. It combines the editorial elegance of literary magazines with modern web application engineering.
          </p>
          <p>
            Unlike static site generators or superficial demo applications, INKWELL is powered by a robust RESTful API backend, relational database architecture with Prisma ORM, role-based access control, cryptographic password hashing, interactive commenting system, and an authoring suite.
          </p>
        </div>
      </section>

      {/* ─── Developer Attribution ──────────────────────────── */}
      <section className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/50 dark:from-gray-800/80 dark:via-gray-800/60 dark:to-indigo-950/40 border border-indigo-100 dark:border-gray-700/80 shadow-lg space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
            AV
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100">
              Developer Attribution
            </h2>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Thiranex Internship — Task 4</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-3 bg-white/80 dark:bg-gray-800/80 p-5 rounded-2xl border border-gray-100 dark:border-gray-700">
            <h3 className="text-xs uppercase font-semibold tracking-wider text-gray-400">Student Profile</h3>
            <div className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
              <p className="font-semibold text-gray-900 dark:text-gray-100 text-base">Alok Kumar Vishwas</p>
              <p>B.Tech, 2nd Year</p>
              <p>Computer Science and Engineering (CSE)</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">
                GL Bajaj Institute of Technology & Management, Greater Noida
              </p>
            </div>
          </div>

          <div className="space-y-3 bg-white/80 dark:bg-gray-800/80 p-5 rounded-2xl border border-gray-100 dark:border-gray-700">
            <h3 className="text-xs uppercase font-semibold tracking-wider text-gray-400">Connect & Repositories</h3>
            <div className="space-y-2.5">
              <a
                href="https://github.com/alok0204"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                <Github className="w-4 h-4 text-gray-500" />
                <span>GitHub: alok0204</span>
                <ExternalLink className="w-3.5 h-3.5 ml-auto text-gray-400" />
              </a>

              <a
                href="https://www.linkedin.com/in/alok-kumar-vishwas-628b663a1/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                <Linkedin className="w-4 h-4 text-blue-600" />
                <span>LinkedIn Profile</span>
                <ExternalLink className="w-3.5 h-3.5 ml-auto text-gray-400" />
              </a>

              <p className="text-xs text-gray-500 dark:text-gray-400 pt-1">
                Email: alokvishwas786@gmail.com
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Technology Stack ───────────────────────────────── */}
      <section className="space-y-6">
        <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2.5">
          <Layers className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          Technology Stack
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/80 space-y-2">
            <Code className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Frontend</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              React 18, Vite, Tailwind CSS, React Router, Lucide Icons, Framer Motion
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/80 space-y-2">
            <Cpu className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Backend</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Node.js, Express.js, REST APIs, Rate Limiting, Helmet Security Headers
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/80 space-y-2">
            <Database className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Database & ORM</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              PostgreSQL, Prisma ORM, Safe Migrations, Indexing & Relations
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/80 space-y-2">
            <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Auth & Security</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              JWT Sessions, Bcrypt Hashing, DOMPurify Sanitization, RBAC (User/Admin)
            </p>
          </div>
        </div>
      </section>

      {/* ─── Key Features ───────────────────────────────────── */}
      <section className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-gray-800/70 border border-gray-200/80 dark:border-gray-700/80 shadow-md space-y-6">
        <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-gray-100">
          Implemented Feature Specifications
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-start gap-2.5">
            <span className="text-green-500 font-bold">✓</span>
            <span>User Registration, Login, Logout with JWT auth cookies</span>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="text-green-500 font-bold">✓</span>
            <span>Role-Based Authorization (Regular User & Administrator)</span>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="text-green-500 font-bold">✓</span>
            <span>Full Post CRUD: Create, Read, Update, Delete, Draft/Publish</span>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="text-green-500 font-bold">✓</span>
            <span>Interactive Comment Section with ownership & admin moderation</span>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="text-green-500 font-bold">✓</span>
            <span>Author Dashboard with real statistics & post management</span>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="text-green-500 font-bold">✓</span>
            <span>Admin Dashboard with moderation metrics & comment deletion</span>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="text-green-500 font-bold">✓</span>
            <span>Safe HTML content sanitization with DOMPurify</span>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="text-green-500 font-bold">✓</span>
            <span>Dark & Light mode with persistent user theme preference</span>
          </div>
        </div>
      </section>
    </div>
  );
}
