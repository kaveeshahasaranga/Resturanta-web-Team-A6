import { useState } from 'react';
import { contactApi } from '../../services/api.js';
import { Send, CheckCircle } from 'lucide-react';
import Navbar from '../../components/layout/Navbar.jsx';
import Footer from '../../components/layout/Footer.jsx';

export default function ContactPage() {
  const [form, setForm]   = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError]     = useState('');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await contactApi.send(form);
      setSuccess(true);
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-fuchsiusBlack">
      <Navbar />
      <main className="flex-1 pt-28 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-serif font-bold mb-3">
              Get in <span className="text-fuchsiusOrange">Touch</span>
            </h1>
            <p className="text-gray-400">We'd love to hear from you. Send us a message!</p>
          </div>

          {success ? (
            <div className="card text-center py-12">
              <CheckCircle className="w-14 h-14 text-green-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Message Sent!</h2>
              <p className="text-gray-400 mb-6">We'll get back to you as soon as possible.</p>
              <button onClick={() => setSuccess(false)} className="btn-outline">Send Another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5" htmlFor="name">Name</label>
                <input id="name" name="name" required value={form.name} onChange={handleChange}
                  placeholder="John Doe" className="input-field" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5" htmlFor="email">Email</label>
                <input id="email" name="email" type="email" required value={form.email} onChange={handleChange}
                  placeholder="john@example.com" className="input-field" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5" htmlFor="message">Message</label>
                <textarea id="message" name="message" rows={5} required value={form.message} onChange={handleChange}
                  placeholder="Your message..." className="input-field resize-none" />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                {loading ? 'Sending...' : <><Send className="w-4 h-4" /> Send Message</>}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
