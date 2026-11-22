import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ExternalLink, Github, Linkedin, Layers, Terminal, Server, PanelsTopLeft, GitBranch } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-6">
      {/* ─── Hero Section ───────────────────────────────────── */}
      <section className="text-center space-y-3">
        <p className="ink-eyebrow">ABOUT THE PLATFORM</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text)] tracking-tight">
          Crafted for Stories Worth Sharing.
        </h1>
        <p className="text-xs sm:text-sm text-[var(--muted)] max-w-xl mx-auto leading-relaxed">
          A full-stack editorial publishing application engineered for Thiranex Internship Task 4.
        </p>
      </section>

      {/* ─── Developer Attribution Card (Matching Portfolio) ── */}
      <section className="ink-card-active p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-[var(--line)]">
          <div className="w-10 h-10 rounded-[8px] bg-[var(--surface)] border border-[var(--line)] text-primary-400 font-bold flex items-center justify-center text-lg">
            AV
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[var(--text)]">
              Developer Attribution
            </h2>
            <p className="text-xs text-primary-400 font-medium">Thiranex Internship — Task 4</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="ink-box p-5 space-y-2">
            <p className="ink-eyebrow text-[10px]">STUDENT PROFILE</p>
            <div className="space-y-1 text-xs text-[var(--text)]">
              <p className="font-bold text-sm text-[var(--text)]">Alok Kumar Vishwas</p>
              <p className="text-[var(--muted)]">B.Tech, 2nd Year</p>
              <p className="text-[var(--muted)]">Computer Science and Engineering (CSE)</p>
              <p className="text-primary-400 text-[11px] pt-1">
                GL Bajaj Institute of Technology & Management, Greater Noida
              </p>
            </div>
          </div>

          <div className="ink-box p-5 space-y-2.5">
            <p className="ink-eyebrow text-[10px]">REPOSITORIES & CONNECT</p>
            <div className="space-y-2">
              <a
                href="https://github.com/alok0204"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-xs text-[var(--muted)] hover:text-primary-400 transition"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub: alok0204</span>
                <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
              </a>

              <a
                href="https://www.linkedin.com/in/alok-kumar-vishwas-628b663a1/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-xs text-[var(--muted)] hover:text-primary-400 transition"
              >
                <Linkedin className="w-3.5 h-3.5 text-blue-400" />
                <span>LinkedIn Profile</span>
                <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
              </a>

              <p className="text-[11px] text-[var(--muted)] pt-1">
                Email: alokvishwas786@gmail.com
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Platform Architecture (Matching Picture Cards) ─── */}
      <section className="space-y-4">
        <div>
          <p className="ink-eyebrow">SYSTEM ARCHITECTURE</p>
          <h2 className="text-xl font-bold text-[var(--text)]">A Foundation to Build On</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="ink-card p-5 space-y-3">
            <PanelsTopLeft className="w-5 h-5 text-primary-400" />
            <h3 className="font-bold text-sm text-[var(--text)]">Frontend</h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              React 18 with Vite, Tailwind CSS, Lucide React, and responsive layouts.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-2">
              <span className="ink-tag text-[10px]">React</span>
              <span className="ink-tag text-[10px]">Tailwind</span>
            </div>
          </div>

          <div className="ink-card-active p-5 space-y-3">
            <Server className="w-5 h-5 text-primary-400" />
            <h3 className="font-bold text-sm text-[var(--text)]">Backend</h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Node.js and Express RESTful API with cookie and JWT sessions.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-2">
              <span className="ink-tag text-[10px]">Node.js</span>
              <span className="ink-tag text-[10px]">Express</span>
            </div>
          </div>

          <div className="ink-card p-5 space-y-3">
            <Layers className="w-5 h-5 text-primary-400" />
            <h3 className="font-bold text-sm text-[var(--text)]">Database</h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              PostgreSQL relational schema managed via Prisma ORM.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-2">
              <span className="ink-tag text-[10px]">PostgreSQL</span>
              <span className="ink-tag text-[10px]">Prisma</span>
            </div>
          </div>

          <div className="ink-card p-5 space-y-3">
            <GitBranch className="w-5 h-5 text-primary-400" />
            <h3 className="font-bold text-sm text-[var(--text)]">Version Control</h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Git and GitHub repository with verified automated testing.
            </p>
            <div className="flex flex-wrap gap-1.5 pt-2">
              <span className="ink-tag text-[10px]">Git</span>
              <span className="ink-tag text-[10px]">GitHub</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Purpose Description ────────────────────────────── */}
      <section className="ink-card p-6 sm:p-8 space-y-4">
        <h3 className="text-lg font-bold text-[var(--text)] flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-primary-400" />
          <span>The Purpose of INKWELL</span>
        </h3>
        <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
          INKWELL is engineered as an authentic, full-featured blogging and content publishing platform combining clean editorial presentation with solid web application engineering.
        </p>
        <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
          Unlike static prototypes, INKWELL is powered by an active Express RESTful API backend, relational Prisma models, role-based authorization, Bcrypt security, interactive nested comments, and dedicated author & administrator studios.
        </p>
      </section>
    </div>
  );
}
