import { useCallback, useEffect, useState } from 'react';
import { CheckCheck, Loader2, Mail, Reply, Send, Trash2, X } from 'lucide-react';
import { contactApi } from '../../services/api.js';

export default function AdminContactPage() {
  const [messages, setMessages] = useState([]);
  const [replyDrafts, setReplyDrafts] = useState({});
  const [replyingId, setReplyingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState(null);
  const [error, setError] = useState('');

  const loadMessages = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await contactApi.getAll();
      setMessages(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadMessages(); }, [loadMessages]);

  const handleMarkRead = async message => {
    setError('');
    try {
      const response = await contactApi.markRead(message.id);
      setMessages(current => current.map(item => item.id === message.id ? response.data : item));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReply = async event => {
    event.preventDefault();
    const reply = (replyDrafts[replyingId] || '').trim();
    if (!reply) return;
    setError('');
    setSendingId(replyingId);
    try {
      const response = await contactApi.reply(replyingId, reply);
      setMessages(current => current.map(item => item.id === replyingId ? response.data : item));
      setReplyDrafts(current => ({ ...current, [replyingId]: '' }));
      setReplyingId(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSendingId(null);
    }
  };

  const handleDelete = async message => {
    if (!window.confirm('Delete this message?')) return;
    setError('');
    try {
      await contactApi.delete(message.id);
      setMessages(current => current.filter(item => item.id !== message.id));
      if (replyingId === message.id) setReplyingId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const unread = messages.filter(message => !message.isRead).length;

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center gap-3">
        <h1 className="text-2xl font-serif font-bold">Contact Messages</h1>
        {unread > 0 && (
          <span className="badge border border-fuchsiusOrange/30 bg-fuchsiusOrange/20 text-fuchsiusOrange">
            {unread} unread
          </span>
        )}
      </div>

      {error && <p role="alert" className="mb-4 text-sm text-red-400">{error}</p>}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-fuchsiusOrange" /></div>
      ) : messages.length === 0 ? (
        <p className="py-16 text-center text-gray-500">No messages yet.</p>
      ) : (
        <div className="space-y-3">
          {messages.map(message => (
            <article key={message.id}
              className={`card border p-5 transition-colors ${message.isRead ? 'border-white/8 opacity-80' : 'border-fuchsiusOrange/30'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="mt-0.5 shrink-0 rounded-lg bg-fuchsiusOrange/10 p-2">
                    <Mail className="h-4 w-4 text-fuchsiusOrange" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-semibold text-fuchsiusWhite">{message.name}</h2>
                      {!message.isRead && <span className="h-2 w-2 rounded-full bg-fuchsiusOrange" />}
                    </div>
                    <a href={`mailto:${message.email}`} className="text-xs text-gray-500 hover:text-fuchsiusOrange">{message.email}</a>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-gray-300">{message.message}</p>
                    <p className="mt-2 text-xs text-gray-600">{new Date(message.createdAt).toLocaleString()}</p>

                    {message.reply && (
                      <div className="mt-4 rounded border border-green-500/20 bg-green-500/5 p-3">
                        <p className="text-xs font-semibold text-green-400">Saved reply</p>
                        <p className="mt-1 whitespace-pre-wrap text-sm text-gray-300">{message.reply}</p>
                        {message.repliedAt && <p className="mt-2 text-xs text-gray-600">{new Date(message.repliedAt).toLocaleString()}</p>}
                        <a
                          href={`mailto:${encodeURIComponent(message.email)}?subject=${encodeURIComponent(`Re: Message to ${message.name}`)}&body=${encodeURIComponent(message.reply)}`}
                          className="mt-3 inline-flex items-center gap-2 text-xs font-medium text-fuchsiusOrange hover:text-orange-300"
                        >
                          <Mail className="h-3.5 w-3.5" /> Open email draft to send
                        </a>
                      </div>
                    )}

                    {replyingId === message.id ? (
                      <form onSubmit={handleReply} className="mt-4 space-y-2">
                        <label htmlFor={`reply-${message.id}`} className="block text-xs text-gray-400">
                          Reply (saved here; send it using the email draft link)
                        </label>
                        <textarea id={`reply-${message.id}`} required maxLength={10000} rows={4}
                          value={replyDrafts[message.id] || ''}
                          onChange={event => setReplyDrafts(current => ({ ...current, [message.id]: event.target.value }))}
                          className="input-field resize-y" />
                        <div className="flex gap-2">
                          <button type="submit" disabled={sendingId === message.id}
                            className="btn-primary flex items-center gap-2 disabled:opacity-50">
                            {sendingId === message.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            Save reply
                          </button>
                          <button type="button" onClick={() => setReplyingId(null)}
                            className="btn-outline flex items-center gap-2">
                            <X className="h-4 w-4" /> Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="mt-3 flex flex-wrap gap-3">
                        <button onClick={() => { setReplyingId(message.id); setError(''); }}
                          className="flex items-center gap-1 text-xs text-fuchsiusOrange hover:text-orange-300">
                          <Reply className="h-3.5 w-3.5" /> {message.reply ? 'Edit reply' : 'Reply'}
                        </button>
                        {!message.isRead && (
                          <button onClick={() => handleMarkRead(message)}
                            className="flex items-center gap-1 text-xs text-gray-400 hover:text-green-400">
                            <CheckCheck className="h-3.5 w-3.5" /> Mark as read
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <button onClick={() => handleDelete(message)} title="Delete message"
                  className="shrink-0 rounded p-1.5 text-gray-500 transition-colors hover:bg-red-500/10 hover:text-red-400">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
