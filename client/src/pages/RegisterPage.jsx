import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Password rules validation
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const isFormValid =
    name.trim().length >= 2 &&
    email.includes('@') &&
    hasMinLength &&
    hasUpper &&
    hasLower &&
    hasNumber &&
    passwordsMatch;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isFormValid) {
      if (!passwordsMatch) {
        setError('Passwords do not match.');
      } else {
        setError('Please meet all password security requirements.');
      }
      return;
    }

    try {
      setLoading(true);
      await register(name.trim(), email.trim(), password);
      toast.success('Account created successfully! Welcome to INKWELL.');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-[10px] bg-[var(--surface)] border border-[var(--line)] text-primary-400 font-mono text-xl font-bold mb-1">
            &lt;/&gt;
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text)] tracking-tight">
            Create an Account
          </h1>
          <p className="text-xs text-[var(--muted)]">
            Join INKWELL to write articles and participate in discussions
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
            {/* Display Name */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alok Vishwas"
                  required
                  minLength={2}
                  maxLength={50}
                  className="w-full pl-10 pr-4 py-2.5 rounded-[8px] bg-[var(--surface)] border border-[var(--line)] text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-all"
                />
              </div>
            </div>

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
                  placeholder="At least 8 characters"
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

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type password"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-[8px] bg-[var(--surface)] border border-[var(--line)] text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-all"
                />
              </div>
            </div>

            {/* Password Requirements Checklist */}
            <div className="p-3 rounded-[8px] bg-[var(--surface)] border border-[var(--line)] text-[11px] space-y-1">
              <span className="font-semibold text-[var(--text)] block mb-1">
                Security Requirements:
              </span>
              <div className="grid grid-cols-2 gap-1 text-[var(--muted)]">
                <span className={hasMinLength ? 'text-emerald-400 font-medium' : ''}>
                  {hasMinLength ? '✓' : '•'} 8+ characters
                </span>
                <span className={hasUpper ? 'text-emerald-400 font-medium' : ''}>
                  {hasUpper ? '✓' : '•'} Uppercase letter
                </span>
                <span className={hasLower ? 'text-emerald-400 font-medium' : ''}>
                  {hasLower ? '✓' : '•'} Lowercase letter
                </span>
                <span className={hasNumber ? 'text-emerald-400 font-medium' : ''}>
                  {hasNumber ? '✓' : '•'} Number
                </span>
              </div>
              {confirmPassword && (
                <div className={`pt-1 ${passwordsMatch ? 'text-emerald-400 font-medium' : 'text-red-400'}`}>
                  {passwordsMatch ? '✓ Passwords match' : '✕ Passwords do not match'}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full mt-2 py-2.5 px-4 rounded-[8px] text-xs font-semibold ink-btn-accent justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-[var(--muted)]">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary-400 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
