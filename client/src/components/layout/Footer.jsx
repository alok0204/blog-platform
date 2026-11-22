import { Link } from 'react-router-dom';
import { Github, Linkedin, Heart, ExternalLink, Code } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--bg)] border-t border-[var(--line)] transition-colors mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-1.5 group">
              <span className="font-mono text-primary-400 font-bold text-lg">&lt;/&gt;</span>
              <span className="font-sans text-xl font-bold text-[var(--text)] tracking-tight">
                INKWELL
              </span>
            </Link>
            <p className="text-sm text-[var(--muted)] leading-relaxed max-w-sm">
              "Stories Worth Sharing" — A full-stack publishing platform engineered for elegant writing, rich discussions, and deep reading.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://github.com/alok0204"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-[var(--muted)] hover:text-primary-400 transition-colors rounded-[6px] border border-[var(--line)] hover:border-[var(--accent)] bg-[var(--surface)]"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/alok-kumar-vishwas-628b663a1/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-[var(--muted)] hover:text-primary-400 transition-colors rounded-[6px] border border-[var(--line)] hover:border-[var(--accent)] bg-[var(--surface)]"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="ink-eyebrow mb-4">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/"
                  className="text-sm text-[var(--muted)] hover:text-primary-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/posts"
                  className="text-sm text-[var(--muted)] hover:text-primary-400 transition-colors"
                >
                  All Articles
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-sm text-[var(--muted)] hover:text-primary-400 transition-colors"
                >
                  About Platform
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-sm text-[var(--muted)] hover:text-primary-400 transition-colors"
                >
                  Author Studio
                </Link>
              </li>
            </ul>
          </div>

          {/* Developer Credit */}
          <div>
            <h3 className="ink-eyebrow mb-4">
              Developer Attribution
            </h3>
            <div className="ink-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[var(--text)]">Alok Kumar Vishwas</span>
                <span className="ink-tag text-[10px]">B.Tech CSE</span>
              </div>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                GL Bajaj Institute of Technology & Management, Greater Noida
              </p>
              <div className="pt-2 border-t border-[var(--line)] flex items-center justify-between text-xs text-[var(--muted)]">
                <span>Thiranex Task 4</span>
                <a
                  href="https://github.com/alok0204/blog-platform"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary-400 hover:underline flex items-center gap-1"
                >
                  <span>Repository</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-[var(--line)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--muted)]">
          <p>
            &copy; {currentYear} INKWELL. Built for Thiranex Internship Task 4.
          </p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-primary-400" />
              <span>React 18 · Vite · Tailwind · Node · Prisma</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
