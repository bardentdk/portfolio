import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Mail, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import { useSubmitContact } from '../../hooks/useContacts';
import { useSettings } from '../../hooks/useSettings';

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.8, delay, ease: [0.19, 1, 0.22, 1] },
});

const INITIAL_FORM = { name: '', email: '', subject: '', message: '' };

const Contact = () => {
  const { data: socialData } = useSettings('social');
  const social = socialData?.value || {};

  const [form,    setForm]    = useState(INITIAL_FORM);
  const [status,  setStatus]  = useState(null); // null | 'success' | 'error'
  const { mutateAsync, isPending } = useSubmitContact();

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    try {
      await mutateAsync(form);
      setStatus('success');
      setForm(INITIAL_FORM);
    } catch {
      setStatus('error');
    }
  };

  const infos = [
    { icon: MapPin, label: 'Localisation',  value: 'Saint-Denis, La Réunion' },
    { icon: Mail,   label: 'Email',         value: social.email || 'contact@velt.re', href: `mailto:${social.email || 'contact@velt.re'}` },
    { icon: Phone,  label: 'Téléphone',     value: '+262 693 057 066', href: 'tel:+262693057066' },
  ];

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      {/* Orb */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[600px] h-[300px] pointer-events-none opacity-40"
        style={{ background: 'radial-gradient(ellipse,rgba(0,229,160,0.07) 0%,transparent 70%)' }} />

      <div className="container-custom">
        {/* Header */}
        <motion.div {...fadeIn(0)} className="text-center mb-16">
          <div className="section-label justify-center">Contact</div>
          <h2 className="font-display font-black text-[clamp(2rem,4vw,3.5rem)] text-[#EEF5F1] leading-tight tracking-tight">
            Travaillons <span className="text-gradient">ensemble</span>
          </h2>
          <p className="mt-4 text-[#6B9980] max-w-md mx-auto text-sm leading-relaxed font-light">
            Un projet en tête ? Une question ? Je réponds généralement dans les 24h.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[350px_1fr] gap-12 max-w-5xl mx-auto">

          {/* ─ Infos ─ */}
          <motion.div {...fadeIn(0.1)} className="flex flex-col gap-5">
            {infos.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="glass rounded-2xl p-5 flex items-center gap-4 hover:border-[rgba(0,229,160,0.2)] transition-all group">
                <div className="w-10 h-10 rounded-xl bg-[rgba(0,229,160,0.1)] flex items-center justify-center flex-shrink-0 group-hover:bg-[rgba(0,229,160,0.15)] transition-colors">
                  <Icon size={16} className="text-[#00E5A0]" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#6B9980] mb-0.5">{label}</div>
                  {href
                    ? <a href={href} className="text-sm font-medium text-[#EEF5F1] hover:text-[#00E5A0] transition-colors">{value}</a>
                    : <span className="text-sm font-medium text-[#EEF5F1]">{value}</span>
                  }
                </div>
              </div>
            ))}

            {/* Dispo card */}
            <div className="glass rounded-2xl p-5 border-[rgba(0,229,160,0.15)]">
              <div className="flex items-center gap-2 mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5A0] opacity-70" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E5A0]" />
                </span>
                <span className="text-xs font-bold text-[#00E5A0] uppercase tracking-widest">Disponible</span>
              </div>
              <p className="text-xs text-[#6B9980] leading-relaxed">
                Ouvert aux missions freelance, CDI et collaborations sur La Réunion et à distance.
              </p>
            </div>
          </motion.div>

          {/* ─ Formulaire ─ */}
          <motion.div {...fadeIn(0.18)} className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-7 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-[#6B9980] uppercase tracking-widest mb-2">Nom *</label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Votre nom"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#6B9980] uppercase tracking-widest mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="votre@email.com"
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6B9980] uppercase tracking-widest mb-2">Sujet</label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="De quoi souhaitez-vous parler ?"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6B9980] uppercase tracking-widest mb-2">Message *</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Décrivez votre projet ou votre demande..."
                  className="input-field resize-none"
                />
              </div>

              {/* Status messages */}
              {status === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2.5 p-4 rounded-xl bg-[rgba(0,229,160,0.08)] border border-[rgba(0,229,160,0.2)] text-[#00E5A0] text-sm"
                >
                  <CheckCircle size={16} />
                  Message envoyé ! Je vous recontacte très vite.
                </motion.div>
              )}
              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2.5 p-4 rounded-xl bg-[rgba(255,80,50,0.08)] border border-[rgba(255,80,50,0.2)] text-red-400 text-sm"
                >
                  <AlertCircle size={16} />
                  Une erreur est survenue. Essayez par email directement.
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Envoi en cours…
                  </span>
                ) : (
                  <><Send size={15} /> Envoyer le message</>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;