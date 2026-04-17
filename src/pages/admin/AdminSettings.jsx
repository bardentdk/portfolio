import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Globe, User, Share2, Search, Mail, Plus, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSettings, useUpdateSetting } from '../../hooks/useSettings';
import { supabase } from '../../lib/supabase';
import { useEmailConfig, useSaveEmailConfig } from '../../hooks/useEmailConfig';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

/* ── Helpers ── */
const Field = ({ label, children, hint }) => (
  <div>
    <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6B9980', marginBottom: '0.5rem' }}>
      {label}
    </label>
    {children}
    {hint && <p style={{ fontSize: '0.6875rem', color: '#6B9980', marginTop: '0.375rem' }}>{hint}</p>}
  </div>
);

const Section = ({ icon: Icon, title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
    className="glass"
    style={{ borderRadius: '1rem', overflow: 'hidden' }}
  >
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      padding: '1rem 1.5rem',
      borderBottom: '1px solid rgba(0,229,160,0.06)',
    }}>
      <div style={{ width: '2rem', height: '2rem', borderRadius: '0.625rem', background: 'rgba(0,229,160,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={15} color="#00E5A0" />
      </div>
      <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '0.9375rem', color: '#EEF5F1' }}>{title}</h2>
    </div>
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {children}
    </div>
  </motion.div>
);

/* ════════════════════════════════════════
   Section Email (principale)
════════════════════════════════════════ */
const EmailConfigSection = () => {
  const { data: cfg, isLoading } = useEmailConfig();
  const save = useSaveEmailConfig();

  const [to,       setTo]       = useState('');
  const [cc,       setCc]       = useState([]);
  const [bcc,      setBcc]      = useState([]);
  const [newCc,    setNewCc]    = useState('');
  const [newBcc,   setNewBcc]   = useState('');
  const [ccError,  setCcError]  = useState('');
  const [bccError, setBccError] = useState('');

  useEffect(() => {
    if (cfg) {
      setTo(cfg.to  || '');
      setCc(cfg.cc  || []);
      setBcc(cfg.bcc || []);
    }
  }, [cfg]);

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  /* CC */
  const addCc = () => {
    const v = newCc.trim();
    if (!isValidEmail(v))  { setCcError('Email invalide'); return; }
    if (cc.includes(v))    { setCcError('Email déjà ajouté'); return; }
    if (v === to)          { setCcError('Identique à l\'email principal'); return; }
    setCc(prev => [...prev, v]);
    setNewCc('');
    setCcError('');
  };

  const removeCc  = (email) => setCc(prev => prev.filter(e => e !== email));

  /* BCC */
  const addBcc = () => {
    const v = newBcc.trim();
    if (!isValidEmail(v))  { setBccError('Email invalide'); return; }
    if (bcc.includes(v))   { setBccError('Email déjà ajouté'); return; }
    setBcc(prev => [...prev, v]);
    setNewBcc('');
    setBccError('');
  };

  const removeBcc = (email) => setBcc(prev => prev.filter(e => e !== email));

  const handleSave = async () => {
    if (!isValidEmail(to)) { toast.error('Email principal invalide'); return; }
    try {
      await save.mutateAsync({ to: to.trim(), cc, bcc });
      toast.success('Configuration email sauvegardée !');
    } catch { toast.error('Erreur lors de la sauvegarde.'); }
  };

  if (isLoading) return <div className="shimmer" style={{ height: '12rem', borderRadius: '1rem' }} />;

  return (
    <Section icon={Mail} title="Configuration des emails de contact">

      {/* Info EmailJS */}
      <div style={{
        display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
        padding: '0.875rem', borderRadius: '0.75rem',
        background: 'rgba(0,229,160,0.06)',
        border: '1px solid rgba(0,229,160,0.15)',
      }}>
        <AlertCircle size={15} color="#00E5A0" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
        <p style={{ fontSize: '0.8rem', color: '#6B9980', lineHeight: 1.6 }}>
          Les emails sont envoyés via <strong style={{ color: '#00E5A0' }}>EmailJS</strong>. 
          Assurez-vous que les variables <code style={{ background: 'rgba(0,229,160,0.1)', padding: '0 4px', borderRadius: 4 }}>VITE_EMAILJS_*</code> sont configurées dans votre <code>.env</code>.
        </p>
      </div>

      {/* Email principal */}
      <Field label="Email principal (To)" hint="Email qui reçoit toutes les demandes de contact">
        <input
          type="email"
          value={to}
          onChange={e => setTo(e.target.value)}
          placeholder="contact@velt.re"
          className="input-field"
        />
      </Field>

      {/* CC */}
      <div>
        <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6B9980', marginBottom: '0.5rem' }}>
          Copie (CC)
        </label>

        {/* Liste CC existants */}
        <AnimatePresence>
          {cc.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', marginBottom: '0.75rem' }}>
              {cc.map(email => (
                <motion.div
                  key={email}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.625rem 0.875rem',
                    borderRadius: '0.625rem',
                    background: 'rgba(0,229,160,0.06)',
                    border: '1px solid rgba(0,229,160,0.12)',
                  }}
                >
                  <span style={{ fontSize: '0.875rem', color: '#C8DDD4', fontFamily: 'JetBrains Mono, monospace' }}>{email}</span>
                  <button
                    onClick={() => removeCc(email)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', color: '#6B9980', display: 'flex', alignItems: 'center', borderRadius: '0.375rem', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#ff5032'}
                    onMouseLeave={e => e.currentTarget.style.color = '#6B9980'}
                  >
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Input ajouter CC */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <div style={{ flex: 1 }}>
            <input
              type="email"
              value={newCc}
              onChange={e => { setNewCc(e.target.value); setCcError(''); }}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCc())}
              placeholder="ajouter@email.com"
              className="input-field"
            />
            {ccError && <p style={{ fontSize: '0.75rem', color: '#ff7055', marginTop: '0.375rem' }}>{ccError}</p>}
          </div>
          <button onClick={addCc} className="btn-outline" style={{ padding: '0.75rem 1rem', flexShrink: 0 }}>
            <Plus size={15} />
          </button>
        </div>
      </div>

      {/* BCC */}
      <div>
        <label style={{ display: 'block', fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6B9980', marginBottom: '0.5rem' }}>
          Copie cachée (BCC/CCI)
        </label>

        <AnimatePresence>
          {bcc.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', marginBottom: '0.75rem' }}>
              {bcc.map(email => (
                <motion.div
                  key={email}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.625rem 0.875rem',
                    borderRadius: '0.625rem',
                    background: 'rgba(0,229,160,0.04)',
                    border: '1px solid rgba(0,229,160,0.08)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.625rem', fontWeight: 700, color: '#2E4A3A', background: 'rgba(0,229,160,0.1)', padding: '0.125rem 0.5rem', borderRadius: '100px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>CCI</span>
                    <span style={{ fontSize: '0.875rem', color: '#C8DDD4', fontFamily: 'JetBrains Mono, monospace' }}>{email}</span>
                  </div>
                  <button
                    onClick={() => removeBcc(email)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', color: '#6B9980', display: 'flex', alignItems: 'center', borderRadius: '0.375rem', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#ff5032'}
                    onMouseLeave={e => e.currentTarget.style.color = '#6B9980'}
                  >
                    <Trash2 size={14} />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <div style={{ flex: 1 }}>
            <input
              type="email"
              value={newBcc}
              onChange={e => { setNewBcc(e.target.value); setBccError(''); }}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addBcc())}
              placeholder="cci@email.com"
              className="input-field"
            />
            {bccError && <p style={{ fontSize: '0.75rem', color: '#ff7055', marginTop: '0.375rem' }}>{bccError}</p>}
          </div>
          <button onClick={addBcc} className="btn-outline" style={{ padding: '0.75rem 1rem', flexShrink: 0 }}>
            <Plus size={15} />
          </button>
        </div>
      </div>

      {/* Récap */}
      {(cc.length > 0 || bcc.length > 0) && (
        <div style={{ padding: '0.875rem', borderRadius: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.04)' }}>
          <p style={{ fontSize: '0.75rem', color: '#6B9980', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Récapitulatif</p>
          <div style={{ fontSize: '0.8125rem', color: '#C8DDD4', lineHeight: 1.8 }}>
            <div>📧 <strong>To :</strong> {to || '—'}</div>
            {cc.length  > 0 && <div>📋 <strong>CC :</strong>  {cc.join(', ')}</div>}
            {bcc.length > 0 && <div>🔒 <strong>BCC :</strong> {bcc.join(', ')}</div>}
          </div>
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={save.isPending}
        className="btn-primary"
        style={{ alignSelf: 'flex-start', opacity: save.isPending ? 0.6 : 1 }}
      >
        {save.isPending
          ? <><svg style={{ animation: 'spin 1s linear infinite', width: 14, height: 14 }} fill="none" viewBox="0 0 24 24"><circle opacity=".25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path opacity=".75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Sauvegarde…</>
          : <><Save size={14} /> Sauvegarder</>
        }
      </button>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </Section>
  );
};

/* ════════════════════════════════════════
   Autres sections (Hero, About, Social, SEO)
════════════════════════════════════════ */
const HeroSettings = () => {
  const { data } = useSettings('hero');
  const update   = useUpdateSetting();
  const [form, setForm] = useState({ headline: '', subheadline: '', cta_primary: '', cta_secondary: '' });

  useEffect(() => { if (data?.value) setForm(data.value); }, [data]);

  const set  = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));
  const save = async () => {
    try { await update.mutateAsync({ key: 'hero', value: form }); toast.success('Hero sauvegardé !'); }
    catch { toast.error('Erreur.'); }
  };

  return (
    <Section icon={Globe} title="Section Hero">
      <Field label="Titre principal" hint="Saut de ligne avec \\n — ex: Développeur Web\\n& Mobile">
        <input className="input-field" value={form.headline} onChange={set('headline')} placeholder="Développeur Web\n& Mobile" />
      </Field>
      <Field label="Sous-titre">
        <textarea className="input-field" style={{ resize: 'none' }} rows={2} value={form.subheadline} onChange={set('subheadline')} />
      </Field>
      <div className="form-2col">
        <Field label="Bouton principal"><input className="input-field" value={form.cta_primary} onChange={set('cta_primary')} placeholder="Voir mes projets" /></Field>
        <Field label="Bouton secondaire"><input className="input-field" value={form.cta_secondary} onChange={set('cta_secondary')} placeholder="Me contacter" /></Field>
      </div>
      <button onClick={save} disabled={update.isPending} className="btn-primary" style={{ alignSelf: 'flex-start' }}>
        <Save size={14} /> Sauvegarder
      </button>
    </Section>
  );
};

const AboutSettings = () => {
  const { data } = useSettings('about');
  const update   = useUpdateSetting();
  const [form,       setForm]       = useState({ bio: '', location: '', availability: true, photo_url: '' });
  const [uploading,  setUploading]  = useState(false);
  const [uploadErr,  setUploadErr]  = useState('');

  useEffect(() => { if (data?.value) setForm(data.value); }, [data]);

  const set = (f) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(p => ({ ...p, [f]: val }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_MB = 5;
    if (file.size > MAX_MB * 1024 * 1024) {
      setUploadErr(`Fichier trop lourd (max ${MAX_MB} Mo)`);
      return;
    }
    if (!file.type.startsWith('image/')) {
      setUploadErr('Seules les images sont acceptées.');
      return;
    }

    setUploading(true);
    setUploadErr('');

    try {
      const ext  = file.name.split('.').pop().toLowerCase();
      const path = `photos/profile.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-media')
        .upload(path, file, { upsert: true, contentType: file.type });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('portfolio-media')
        .getPublicUrl(path);

      // Ajouter un cache-buster pour forcer le rechargement
      const publicUrl = `${urlData.publicUrl}?v=${Date.now()}`;
      setForm(p => ({ ...p, photo_url: publicUrl }));
      toast.success('Photo uploadée !');
    } catch (err) {
      setUploadErr(`Erreur upload : ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    try { await update.mutateAsync({ key: 'about', value: form }); toast.success('À propos sauvegardé !'); }
    catch { toast.error('Erreur.'); }
  };

  return (
    <Section icon={User} title="Section À propos">
      <Field label="Biographie">
        <textarea className="input-field" style={{ resize: 'none' }} rows={5} value={form.bio} onChange={set('bio')} placeholder="Votre biographie..." />
      </Field>
      <Field label="Localisation">
        <input className="input-field" value={form.location} onChange={set('location')} placeholder="Saint-Denis, La Réunion" />
      </Field>
      <Field label="Photo de profil (utilisée dans le CV)">
        {/* Upload Supabase Storage */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Aperçu + bouton upload */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Aperçu */}
            <div style={{ width: '4rem', height: '4rem', borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid rgba(0,229,160,0.2)', background: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {form.photo_url
                ? <img src={form.photo_url} alt="Photo profil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: '0.7rem', color: '#2E4A3A', fontWeight: 700 }}>DT</span>
              }
            </div>

            {/* Bouton upload */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <label style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.5rem 1rem', borderRadius: '100px',
                border: '1px solid rgba(0,229,160,0.2)', cursor: 'pointer',
                fontSize: '0.8125rem', fontWeight: 500, color: '#EEF5F1',
                background: uploading ? 'rgba(0,229,160,0.05)' : 'transparent',
                transition: 'all 0.2s', opacity: uploading ? 0.7 : 1,
              }}>
                {uploading ? '⏳ Upload en cours…' : '📁 Choisir une photo'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={uploading}
                  style={{ display: 'none' }}
                />
              </label>
              <span style={{ fontSize: '0.7rem', color: '#6B9980' }}>
                JPG, PNG, WebP — max 5 Mo · Stocké sur Supabase Storage
              </span>
            </div>
          </div>

          {/* Erreur upload */}
          {uploadErr && (
            <div style={{ padding: '0.625rem 0.875rem', borderRadius: '0.625rem', background: 'rgba(255,80,50,0.08)', border: '1px solid rgba(255,80,50,0.2)', fontSize: '0.8125rem', color: '#ff7055' }}>
              {uploadErr}
            </div>
          )}

          {/* URL manuelle (fallback) */}
          <div>
            <div style={{ fontSize: '0.625rem', fontWeight: 600, color: '#2E4A3A', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.375rem' }}>
              Ou saisir une URL directe
            </div>
            <input
              className="input-field"
              type="url"
              value={form.photo_url || ''}
              onChange={set('photo_url')}
              placeholder="https://..."
              style={{ fontSize: '0.8125rem' }}
            />
          </div>

          {/* Info Supabase bucket */}
          <div style={{ padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(0,229,160,0.05)', border: '1px solid rgba(0,229,160,0.1)', fontSize: '0.75rem', color: '#6B9980', lineHeight: 1.6 }}>
            <strong style={{ color: '#00E5A0' }}>📦 Setup requis (une seule fois) :</strong> dans Supabase → Storage → créer un bucket nommé <code style={{ background: 'rgba(0,229,160,0.1)', padding: '0 4px', borderRadius: 3 }}>portfolio-media</code> en mode <strong>Public</strong>.
          </div>
        </div>
      </Field>
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
        <input type="checkbox" checked={form.availability} onChange={set('availability')} style={{ width: '1rem', height: '1rem', accentColor: '#00E5A0' }} />
        <span style={{ fontSize: '0.875rem', color: '#C8DDD4' }}>Afficher le badge "Disponible pour missions"</span>
      </label>
      <button onClick={save} disabled={update.isPending} className="btn-primary" style={{ alignSelf: 'flex-start' }}>
        <Save size={14} /> Sauvegarder
      </button>
    </Section>
  );
};

const SocialSettings = () => {
  const { data } = useSettings('social');
  const update   = useUpdateSetting();
  const [form, setForm] = useState({ github: '', linkedin: '', facebook: '', instagram: '', email: '' });

  useEffect(() => { if (data?.value) setForm(data.value); }, [data]);

  const set  = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));
  const save = async () => {
    try { await update.mutateAsync({ key: 'social', value: form }); toast.success('Réseaux sauvegardés !'); }
    catch { toast.error('Erreur.'); }
  };

  const fields = [
    { key: 'email',     label: 'Email',     placeholder: 'contact@velt.re', type: 'email' },
    { key: 'github',    label: 'GitHub',    placeholder: 'https://github.com/...', type: 'url' },
    { key: 'linkedin',  label: 'LinkedIn',  placeholder: 'https://linkedin.com/in/...', type: 'url' },
    { key: 'facebook',  label: 'Facebook',  placeholder: 'https://facebook.com/...', type: 'url' },
    { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/...', type: 'url' },
  ];

  return (
    <Section icon={Share2} title="Réseaux sociaux">
      <div className="form-2col">
        {fields.map(({ key, label, placeholder, type }) => (
          <Field key={key} label={label}>
            <input className="input-field" type={type} value={form[key]} onChange={set(key)} placeholder={placeholder} />
          </Field>
        ))}
      </div>
      <button onClick={save} disabled={update.isPending} className="btn-primary" style={{ alignSelf: 'flex-start' }}>
        <Save size={14} /> Sauvegarder
      </button>
    </Section>
  );
};

const SeoSettings = () => {
  const { data } = useSettings('seo');
  const update   = useUpdateSetting();
  const [form, setForm] = useState({ title: '', description: '', og_image: '' });

  useEffect(() => { if (data?.value) setForm(data.value); }, [data]);

  const set  = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));
  const save = async () => {
    try { await update.mutateAsync({ key: 'seo', value: form }); toast.success('SEO sauvegardé !'); }
    catch { toast.error('Erreur.'); }
  };

  return (
    <Section icon={Search} title="SEO & Métadonnées">
      <Field label="Titre de la page" hint="Affiché dans l'onglet et les résultats Google">
        <input className="input-field" value={form.title} onChange={set('title')} placeholder="Djebarlen Tambon — Développeur Web & Mobile" />
      </Field>
      <Field label="Description" hint={`${form.description.length}/160 caractères recommandés`}>
        <textarea className="input-field" style={{ resize: 'none' }} rows={3} value={form.description} onChange={set('description')} placeholder="Portfolio de Djebarlen Tambon..." />
      </Field>
      <Field label="Image Open Graph" hint="URL d'une image 1200×630px pour les partages réseaux sociaux">
        <input className="input-field" type="url" value={form.og_image} onChange={set('og_image')} placeholder="https://..." />
      </Field>
      <button onClick={save} disabled={update.isPending} className="btn-primary" style={{ alignSelf: 'flex-start' }}>
        <Save size={14} /> Sauvegarder
      </button>
    </Section>
  );
};

/* ════════════════════════════════════════
   Page principale
════════════════════════════════════════ */
const AdminSettings = () => (
  <div style={{ padding: '2rem' }}>
    <AdminPageHeader title="Paramètres" description="Gérez le contenu et la configuration de votre portfolio" />
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '48rem' }}>
      <EmailConfigSection />
      <HeroSettings />
      <AboutSettings />
      <SocialSettings />
      <SeoSettings />
    </div>
  </div>
);

export default AdminSettings;