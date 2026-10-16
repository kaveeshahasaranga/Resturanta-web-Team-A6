import { useEffect, useState } from 'react';
import { Loader2, Trash2, Mail, CheckCheck } from 'lucide-react';
import { contactApi } from '../../services/api.js';

const MOCK_MESSAGES = [
  {
    id: 'msg-1',
    name: 'Sithumi Rajapaksa',
    email: 'sithumi@example.com',
    message: 'I would like to make a reservation for 6 people this Saturday evening. Do you have availability for the Nightfire Degustation menu?',
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: 'msg-2',
    name: 'Ravindu Mendis',
    email: 'ravindu@example.com',
    message: 'Could you please let me know if you can accommodate a gluten-free dietary requirement for the tasting menu? We are visiting from Kandy next weekend.',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: 'msg-3',
    name: 'Chamari Wickramasinghe',
    email: 'chamari@example.com',
    message: 'Wonderful experience last week! The Wagyu Tenderloin was absolutely outstanding. We will definitely be back for the Clay Pot Degustation next time.',
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
];

export default function AdminContactPage() {
  const [messages, setMessages] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    contactApi.getAll()
      .then(res => {
        const list = Array.isArray(res) ? res : (res.data ?? res);
        setMessages(list.length > 0 ? list : MOCK_MESSAGES);
      })
      .catch(() => setMessages(MOCK_MESSAGES))
      .finally(() => setLoading(false));
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await contactApi.markRead(id);
      setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m));
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await contactApi.delete(id);
      setMessages(prev => prev.filter(m => m.id !== id));
    } catch (err) { alert(err.message); }
  };

  const unread = messages.filter(m => !m.isRead).length;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-serif font-bold">Contact Messages</h1>
        {unread > 0 && (
          <span className="badge bg-fuchsiusOrange/20 text-fuchsiusOrange border border-fuchsiusOrange/30">
            {unread} unread
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-fuchsiusOrange animate-spin" />
        </div>
      ) : messages.length === 0 ? (
        <p className="text-center text-gray-500 py-16">No messages yet.</p>
      ) : (
        <div className="space-y-3">
          {messages.map(msg => (
            <div key={msg.id}
              className={`card p-5 border transition-colors ${msg.isRead ? 'border-white/8 opacity-70' : 'border-fuchsiusOrange/30'}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-fuchsiusOrange/10 mt-0.5 shrink-0">
                    <Mail className="w-4 h-4 text-fuchsiusOrange" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-fuchsiusWhite text-sm">{msg.name}</h3>
                      {!msg.isRead && <span className="w-2 h-2 rounded-full bg-fuchsiusOrange" />}
                    </div>
                    <p className="text-gray-500 text-xs">{msg.email}</p>
                    <p className="text-gray-300 text-sm mt-2 leading-relaxed">{msg.message}</p>
                    <p className="text-gray-600 text-xs mt-2">{new Date(msg.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {!msg.isRead && (
                    <button onClick={() => handleMarkRead(msg.id)} title="Mark as read"
                      className="p-1.5 rounded-lg text-gray-500 hover:text-green-400 hover:bg-green-500/10 transition-colors">
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => handleDelete(msg.id)} title="Delete"
                    className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
