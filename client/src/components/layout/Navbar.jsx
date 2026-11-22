import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PenTool,
  Search,
  Sun,
  Moon,
  Menu,
  X,
  LayoutDashboard,
  User,
  LogOut,
  ChevronDown,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 relative py-1 ${
      isActive
        ? 'text-[var(--text)] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[var(--accent)]'
        : 'text-[var(--muted)] hover:text-[var(--text)]'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-[var(--header)] backdrop-blur-md border-b border-[var(--line)]">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 group">
            <span className="font-mono text-primary-400 font-bold text-lg">&lt;/&gt;</span>
            <span className="font-sans text-xl font-bold text-[var(--text)] tracking-tight">
              INKWELL
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>
            <NavLink to="/posts" className={navLinkClass}>
              Posts
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/posts"
              className="p-2 text-[var(--muted)] hover:text-[var(--text)] transition-colors rounded-lg hover:bg-[var(--surface)]"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </Link>

            <button
              onClick={toggleTheme}
              className="p-2 text-[var(--muted)] hover:text-[var(--text)] transition-colors rounded-lg hover:bg-[var(--surface)]"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard/new"
                  className="ink-btn-pill"
                >
                  <PenTool className="w-3.5 h-3.5 text-primary-400" />
                  <span>Write</span>
                </Link>

                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 pl-2.5 pr-2 py-1 rounded-full border border-[var(--line)] bg-[var(--surface)] hover:border-[var(--accent)] transition-colors"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center">
                        <span className="text-xs font-semibold text-white">
                          {user.name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                    )}
                    <span className="text-xs font-medium text-[var(--text)] max-w-[100px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-[var(--muted)]" />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-52 bg-[var(--card)] border border-[var(--line)] rounded-[10px] shadow-2xl py-2 z-50"
                      >
                        <div className="px-4 py-2 border-b border-[var(--line)] mb-1">
                          <p className="text-xs font-semibold text-[var(--text)] truncate">{user.name}</p>
                          <p className="text-[11px] text-[var(--muted)] truncate">{user.email}</p>
                        </div>
                        <Link
                          to={`/profile/${user.id}`}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-xs text-[var(--text)] hover:bg-[var(--surface)] hover:text-primary-400 transition-colors"
                        >
                          <User className="w-3.5 h-3.5" />
                          Profile
                        </Link>
                        <Link
                          to="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-xs text-[var(--text)] hover:bg-[var(--surface)] hover:text-primary-400 transition-colors"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5" />
                          Author Studio
                        </Link>
                        {user.role === 'ADMIN' && (
                          <Link
                            to="/admin"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-xs text-primary-400 hover:bg-[var(--surface)] transition-colors font-medium"
                          >
                            <Shield className="w-3.5 h-3.5" />
                            Admin Center
                          </Link>
                        )}
                        <div className="border-t border-[var(--line)] my-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-2 text-xs text-red-400 hover:bg-[var(--surface)] transition-colors"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="ink-btn-pill"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="ink-btn-accent text-xs"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 text-[var(--muted)] hover:text-[var(--text)] rounded-lg"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-[var(--muted)] hover:text-[var(--text)] rounded-lg"
              aria-label="Open menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-[var(--line)] bg-[var(--card)] px-4 py-4 space-y-3"
          >
            <NavLink
              to="/"
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium py-1.5 text-[var(--text)]"
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/posts"
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium py-1.5 text-[var(--text)]"
            >
              Posts
            </NavLink>
            <NavLink
              to="/about"
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium py-1.5 text-[var(--text)]"
            >
              About
            </NavLink>

            {isAuthenticated && user ? (
              <div className="pt-3 border-t border-[var(--line)] space-y-2">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm py-1.5 text-[var(--text)]"
                >
                  Author Studio
                </Link>
                <Link
                  to="/dashboard/new"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm py-1.5 text-primary-400 font-medium"
                >
                  + Write New Story
                </Link>
                {user.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="block text-sm py-1.5 text-primary-400 font-medium"
                  >
                    Admin Control Center
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block text-sm text-red-400 py-1.5 text-left w-full"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-[var(--line)] flex gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="ink-btn-pill flex-1 justify-center"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="ink-btn-accent flex-1 justify-center text-xs"
                >
                  Get Started
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
