import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLogin = () => {
  const { signIn }       = useAuth();
  const navigate         = useNavigate();
  const [form, setForm]  = useState({ email: '', password: '' });
  const [show, setShow]  = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await signIn(form.email, form.password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Email ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,229,160,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,160,0.03) 1px,transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      {/* Orb */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle,rgba(0,229,160,0.08) 0%,transparent 65%)' }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
        className="relative z-10 w-full max-w-sm mx-4"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00E5A0] to-[#007A54] flex items-center justify-center shadow-[0_0_30px_rgba(0,229,160,0.3)]">
            <span className="font-display font-black text-[#050E0A] text-base">DT</span>
          </div>
        </div>

        <div className="glass rounded-2xl p-8">
          <h1 className="font-display font-bold text-xl text-[#EEF5F1] text-center mb-1">
            Administration
          </h1>
          <p className="text-xs text-[#6B9980] text-center mb-7">Accès réservé au propriétaire du site</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#6B9980] uppercase tracking-widest mb-2">Email</label>
              <input
                type="email" name="email"
                value={form.email} onChange={handleChange}
                required placeholder="admin@velt.re"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#6B9980] uppercase tracking-widest mb-2">Mot de passe</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'} name="password"
                  value={form.password} onChange={handleChange}
                  required placeholder="••••••••"
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShow(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B9980] hover:text-[#EEF5F1] transition-colors"
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-xl bg-[rgba(255,80,50,0.08)] border border-[rgba(255,80,50,0.2)] text-red-400 text-xs"
              >
                <AlertCircle size={13} /> {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center mt-2 disabled:opacity-60"
            >
              {loading
                ? <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                : <><LogIn size={15} /> Se connecter</>
              }
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;