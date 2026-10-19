import { useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { adminLogin } from '../api/api';
import { useAuth } from '../context/AuthContext';
import ErrorBanner from '../components/ErrorBanner';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await adminLogin(username, password);
      login(data.token, data.username);
      const redirectTo = location.state?.from || '/admin/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      // Generic message regardless of failure reason (matches REQ-26 on the backend)
      setError(err.response?.data?.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[70vh] bg-ocean-50/50 px-4 py-12 sm:px-6 lg:py-16">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] border border-ocean-100 bg-white shadow-card lg:min-h-[600px] lg:grid-cols-2">
        <div className="relative flex min-h-[260px] flex-col justify-between overflow-hidden bg-ocean-gradient p-8 text-white sm:p-10 lg:p-12">
          <div aria-hidden="true" className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/20 bg-white/10 blur-2xl" />
          <div aria-hidden="true" className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-ocean-300/30 blur-3xl" />
          <div className="relative flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/25 bg-white/15 backdrop-blur-sm">
              <img src="/compass-icon.svg" alt="" className="h-8 w-8" />
            </span>
            <span className="font-display text-lg font-semibold tracking-wide">Ceylon Compass</span>
          </div>
          <div className="relative mt-12 lg:mt-0">
            <div className="mb-5 h-1 w-14 rounded-full bg-sand-300" />
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-sand-200">Administrator access</p>
            <h1 className="max-w-sm font-display text-3xl font-bold leading-tight sm:text-4xl">Curate every journey with care.</h1>
            <p className="mt-5 max-w-sm text-sm leading-7 text-ocean-100">Keep destinations, travel details and local discoveries up to date in one place.</p>
          </div>
        </div>

        <div className="flex items-center px-6 py-12 sm:px-12 lg:px-14">
          <div className="w-full">
            <span className="section-eyebrow">Welcome back</span>
            <h2 className="font-display text-3xl font-bold text-ocean-950">Sign in to your dashboard</h2>
            <p className="mt-2 text-sm leading-6 text-ocean-600">Enter your admin credentials to manage places.</p>

            <form onSubmit={handleSubmit} className="mt-9 space-y-5">
          <div>
            <label className="label" htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              autoComplete="username"
              className="input !py-3"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <div className="relative">
              <input
              id="password"
              name="password"
              autoComplete="current-password"
              type={showPassword ? 'text' : 'password'}
              className="input !py-3 !pr-20"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
              <button type="button" onClick={() => setShowPassword((shown) => !shown)} aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-xs font-semibold text-ocean-600 hover:text-ocean-900 focus:outline-none focus:ring-2 focus:ring-ocean-400">
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {error && <ErrorBanner message={error} />}

          <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
            </form>
            <div className="mt-8 border-t border-ocean-100 pt-6 text-center">
              <Link to="/" className="text-sm font-semibold text-ocean-600 hover:text-ocean-900 focus:underline">← View Public Site</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
