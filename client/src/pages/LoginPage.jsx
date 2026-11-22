import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
      toast.success('Welcome back to INKWELL!');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoUser = () => {
    setEmail('demo@inkwell.com');
    setPassword('Demo@1234');
    setError('');
  };

  const fillAdminUser = () => {
    setEmail('admin@inkwell.com');
    setPassword('Demo@1234');
    setError('');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-[10px] bg-[var(--surface)] border border-[var(--line)] text-primary-400 font-mono text-xl font-bold mb-1">
            &lt;/&gt;
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text)] tracking-tight">
            Welcome Back
          </h1>
          <p className="text-xs text-[var(--muted)]">
            Sign in to continue writing, reading, and interacting on INKWELL
          </p>
        </div>

        {/* Card */}
        <div className="ink-card p-6 sm:p-8 space-y-5">
          {error && (
            <div className="p-3.5 rounded-[8px] bg-red-950/30 border border-red-500/30 flex items-start gap-2.5 text-xs text-red-300">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-[8px] bg-[var(--surface)] border border-[var(--line)] text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-[8px] bg-[var(--surface)] border border-[var(--line)] text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--text)]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 rounded-[8px] text-xs font-semibold ink-btn-accent justify-center"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fills */}
          <div className="pt-2 space-y-2 border-t border-[var(--line)]">
            <button
              type="button"
              onClick={fillDemoUser}
              className="w-full py-2 px-3 rounded-[6px] text-xs font-medium text-primary-400 bg-[var(--surface)] hover:border-[var(--accent)] border border-[var(--line)] transition"
            >
              ⚡ Fill Author Demo (demo@inkwell.com)
            </button>
            <button
              type="button"
              onClick={fillAdminUser}
              className="w-full py-2 px-3 rounded-[6px] text-xs font-medium text-[var(--muted)] hover:text-primary-400 bg-[var(--surface)] hover:border-[var(--accent)] border border-[var(--line)] transition"
            >
              🛡️ Fill Admin Demo (admin@inkwell.com)
            </button>
          </div>

          <div className="pt-2 text-center text-xs text-[var(--muted)]">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary-400 hover:underline">
              Create one now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
