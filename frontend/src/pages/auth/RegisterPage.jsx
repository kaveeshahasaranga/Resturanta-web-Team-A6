import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { UtensilsCrossed } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]   = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    setError('');
    try {
      await register(form.name, form.email, form.password);
      navigate('/menu', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-fuchsiusBlack flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <UtensilsCrossed className="w-8 h-8 text-fuchsiusOrange" />
            <span className="text-2xl font-serif font-bold tracking-widest">FUCHSIUS</span>
          </Link>
          <h1 className="text-xl font-semibold mt-4">Create an account</h1>
          <p className="text-gray-500 text-sm mt-1">Join FUCHSIUS today</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          {[
            { id: 'name',     label: 'Full Name',  type: 'text',     placeholder: 'John Doe',           autocomplete: 'name' },
            { id: 'email',    label: 'Email',      type: 'email',    placeholder: 'john@example.com',   autocomplete: 'email' },
            { id: 'password', label: 'Password',   type: 'password', placeholder: 'At least 6 chars',  autocomplete: 'new-password' },
          ].map(({ id, label, type, placeholder, autocomplete }) => (
            <div key={id}>
              <label className="block text-sm text-gray-400 mb-1.5" htmlFor={id}>{label}</label>
              <input id={id} name={id} type={type} required autoComplete={autocomplete}
                value={form[id]} onChange={handleChange} className="input-field" placeholder={placeholder} />
            </div>
          ))}

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-fuchsiusOrange hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
