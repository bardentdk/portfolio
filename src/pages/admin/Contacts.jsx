import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Mail, Phone, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useSubmitContact } from '../../hooks/useContacts';
import { useSettings }      from '../../hooks/useSettings';
import { useEmailConfig }   from '../../hooks/useEmailConfig';
import { sendOwnerNotification, sendConfirmation } from '../../lib/emailjs';

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.8, delay, ease: [0.19, 1, 0.22, 1] },
});

const INITIAL_FORM = { name: '', email: '', subject: '', message: '' };

// Statuts possibles de l'envoi
const STATUS = { IDLE: 'idle', SENDING: 'sending', SUCCESS: 'success', ERROR: 'error' };

const Contact = () => {
  const { data: socialData } = useSettings('social');
  const { data: emailConfig } = useEmailConfig();
  const social = socialData?.value || {};

  const [form,   setForm]   = useState(INITIAL_FORM);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [errMsg, setErrMsg] = useState('');

  const { mutateAsync: saveToSupabase } = useSubmitContact();

  const handleChange = (e) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(STATUS.SENDING);
    setErrMsg('');

    try {
      // ── 1. Sauvegarde dans Supabase (toujours, même si EmailJS échoue)
      await saveToSupabase(form);

      // ── 2. Email notif au propriétaire via EmailJS
      await sendOwnerNotification(form, emailConfig || {});

      // ── 3. Email de confirmation au visiteur
      await sendConfirmation(form);

      setStatus(STATUS.SUCCESS);
      setForm(INITIAL_FORM);
    } catch (err) {
      console.error('[Contact] Erreur envoi :', err);

      // Si c'est uniquement EmailJS qui plante (le message est quand même en DB)
      if (err?.text || err?.status) {
        setErrMsg(
          'Votre message a bien été enregistré, mais l\'envoi de l\'email a échoué. Contactez-moi directement par email.'
        );
      } else {
        setErrMsg('Une erreur est survenue. Réessayez ou contactez-moi directement.');
      }
      setStatus(STATUS.ERROR);
    }
  };

  const infos = [
    {
      icon: MapPin,
      label: 'Localisation',
      value: 'Saint-Denis, La Réunion',
      href: null,
    },
    {
      icon: Mail,
      label: 'Email',
      value: social.email || 'contact@velt.re',
      href: `mailto:${social.email || 'contact@velt.re'}`,
    },
    {
      icon: Phone,
      label: 'Téléphone',
      value: '+262 693 057 066',
      href: 'tel:+262693057066',
    },
  ];

  const isLoading = status === STATUS.SENDING;

  return (
    <section id="contact" className="section-padding" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Orb déco */}
      <div style={{
        position: 'absolute', left: '50%', top: 0,
        transform: 'translateX(-50%)',
        width: '600px', height: '300px',
        pointerEvents: 'none', opacity: 0.4,
        background: 'radial-gradient(ellipse,rgba(0,229,160,0.07) 0%,transparent 70%)',
      }} />

      <div className="container-custom">
        {/* ─ Header ─ */}
        <motion.div {...fadeIn(0)} style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div className="section-label" style={{ justifyContent: 'center' }}>Contact</div>
          <h2 style={{
            fontFamily: 'Poppins, sans-serif', fontWeight: 900,
            fontSize: 'clamp(2rem,4vw,3.5rem)',
            color: '#EEF5F1', lineHeight: 1.1, letterSpacing: '-0.02em',
          }}>
            Travaillons <span className="text-gradient">ensemble</span>
          </h2>
          <p style={{ marginTop: '1rem', color: '#6B9980', maxWidth: '28rem', margin: '1rem auto 0', fontSize: '0.9rem', lineHeight: 1.7, fontWeight: 300 }}>
            Un projet en tête ? Une question ? Je réponds généralement dans les 24h.
          </p>
        </motion.div>

        <div className="contact-grid">
          {/* ─ Infos ─ */}
          <motion.div {...fadeIn(0.1)} className="info-cards-col">
            {infos.map(({ icon: Icon, label, value, href }) => (
              <div
                key={label}
                className="glass"
                style={{
                  borderRadius: '1rem', padding: '1.25rem',
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  transition: 'border-color 0.3s',
                }}
              >
                <div style={{
                  width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem',
                  background: 'rgba(0,229,160,0.1)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Icon size={16} color="#00E5A0" />
                </div>
                <div>
                  <div style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6B9980', marginBottom: '0.125rem' }}>
                    {label}
                  </div>
                  {href
                    ? <a href={href} style={{ fontSize: '0.875rem', fontWeight: 500, color: '#EEF5F1', textDecoration: 'none', transition: 'color 0.2s' }}
                        onMouseEnter={e => e.target.style.color = '#00E5A0'}
                        onMouseLeave={e => e.target.style.color = '#EEF5F1'}
                      >{value}</a>
                    : <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#EEF5F1' }}>{value}</span>
                  }
                </div>
              </div>
            ))}

            {/* Carte dispo */}
            <div className="glass" style={{ borderRadius: '1rem', padding: '1.25rem', border: '1px solid rgba(0,229,160,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ position: 'relative', display: 'flex', width: '0.5rem', height: '0.5rem' }}>
                  <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#00E5A0', opacity: 0.7, animation: 'ping 1s cubic-bezier(0,0,0.2,1) infinite' }} />
                  <span style={{ position: 'relative', display: 'flex', width: '0.5rem', height: '0.5rem', borderRadius: '50%', background: '#00E5A0' }} />
                </span>
                <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#00E5A0', textTransform: 'uppercase', letterSpacing: '0.14em' }}>Disponible</span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#6B9980', lineHeight: 1.6 }}>
                Ouvert aux missions freelance, CDI et collaborations sur La Réunion et à distance.
              </p>
            </div>
          </motion.div>

          {/* ─ Formulaire ─ */}
          <motion.div {...fadeIn(0.18)}>
            <form
              onSubmit={handleSubmit}
              className="glass"
              style={{ borderRadius: '1.5rem', padding: '1.75rem' }}
            >
              {/* Nom + Email */}
              <div className="form-2col" style={{ marginBottom: '1.25rem' }}>
                <div>
                  <label style={labelStyle}>Nom *</label>
                  <input
                    type="text" name="name"
                    value={form.name} onChange={handleChange}
                    required placeholder="Votre nom"
                    className="input-field"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input
                    type="email" name="email"
                    value={form.email} onChange={handleChange}
                    required placeholder="votre@email.com"
                    className="input-field"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Sujet */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={labelStyle}>Sujet</label>
                <input
                  type="text" name="subject"
                  value={form.subject} onChange={handleChange}
                  placeholder="De quoi souhaitez-vous parler ?"
                  className="input-field"
                  disabled={isLoading}
                />
              </div>

              {/* Message */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={labelStyle}>Message *</label>
                <textarea
                  name="message"
                  value={form.message} onChange={handleChange}
                  required rows={5}
                  placeholder="Décrivez votre projet ou votre demande..."
                  className="input-field"
                  style={{ resize: 'none' }}
                  disabled={isLoading}
                />
              </div>

              {/* ─ Status messages ─ */}
              {status === STATUS.SUCCESS && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                    padding: '1rem', borderRadius: '0.875rem', marginBottom: '1.25rem',
                    background: 'rgba(0,229,160,0.07)',
                    border: '1px solid rgba(0,229,160,0.2)',
                    color: '#00E5A0', fontSize: '0.875rem',
                  }}
                >
                  <CheckCircle size={18} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Message envoyé avec succès !</div>
                    <div style={{ fontSize: '0.8125rem', opacity: 0.8 }}>
                      Vous recevrez une confirmation par email. Je vous recontacte sous 24h.
                    </div>
                  </div>
                </motion.div>
              )}

              {status === STATUS.ERROR && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                    padding: '1rem', borderRadius: '0.875rem', marginBottom: '1.25rem',
                    background: 'rgba(255,80,50,0.07)',
                    border: '1px solid rgba(255,80,50,0.2)',
                    color: '#ff7055', fontSize: '0.875rem',
                  }}
                >
                  <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                  <div>{errMsg || 'Une erreur est survenue. Réessayez.'}</div>
                </motion.div>
              )}

              {/* Bouton envoi */}
              <button
                type="submit"
                disabled={isLoading || status === STATUS.SUCCESS}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', opacity: (isLoading || status === STATUS.SUCCESS) ? 0.65 : 1 }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
                    Envoi en cours…
                  </>
                ) : status === STATUS.SUCCESS ? (
                  <><CheckCircle size={15} /> Message envoyé !</>
                ) : (
                  <><Send size={15} /> Envoyer le message</>
                )}
              </button>

              <p style={{ marginTop: '0.875rem', fontSize: '0.6875rem', color: '#2E4A3A', textAlign: 'center', lineHeight: 1.5 }}>
                Vos données ne sont jamais partagées avec des tiers.
              </p>
            </form>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes ping { 75%,100% { transform: scale(2); opacity: 0; } }
        @keyframes spin  { to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
};

const labelStyle = {
  display: 'block',
  fontSize: '0.6875rem', fontWeight: 700,
  textTransform: 'uppercase', letterSpacing: '0.12em',
  color: '#6B9980', marginBottom: '0.5rem',
};

export default Contact;