import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { UtensilsCrossed, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate   = useNavigate();
  const [form, setForm]   = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [showPw, setShowPw]   = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'ADMIN' ? '/admin' : '/menu', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-fuchsiusBlack flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <UtensilsCrossed className="w-8 h-8 text-fuchsiusOrange" />
            <span className="text-2xl font-serif font-bold tracking-widest">FUCHSIUS</span>
          </Link>
          <h1 className="text-xl font-semibold mt-4">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1.5" htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required autoComplete="email"
              value={form.email} onChange={handleChange} className="input-field" placeholder="admin@fuchsius.com" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1.5" htmlFor="password">Password</label>
            <div className="relative">
              <input id="password" name="password" type={showPw ? 'text' : 'password'} required
                autoComplete="current-password" value={form.password} onChange={handleChange}
                className="input-field pr-10" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPw(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Don't have an account?{' '}
          <Link to="/register" className="text-fuchsiusOrange hover:underline">Create one</Link>
        </p>
      </div>
    </div>
  );
}
