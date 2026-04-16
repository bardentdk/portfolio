import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Globe, User, Share2, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSettings, useUpdateSetting } from '../../hooks/useSettings';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

const Field = ({ label, children, hint }) => (
  <div>
    <label className="block text-xs font-semibold text-[#6B9980] uppercase tracking-widest mb-2">{label}</label>
    {children}
    {hint && <p className="text-[10px] text-[#6B9980] mt-1">{hint}</p>}
  </div>
);

const Section = ({ icon: Icon, title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
    className="glass rounded-2xl overflow-hidden"
  >
    <div className="flex items-center gap-3 px-6 py-4 border-b border-[rgba(0,229,160,0.06)]">
      <div className="w-8 h-8 rounded-lg bg-[rgba(0,229,160,0.1)] flex items-center justify-center">
        <Icon size={15} className="text-[#00E5A0]" />
      </div>
      <h2 className="font-display font-semibold text-sm text-[#EEF5F1]">{title}</h2>
    </div>
    <div className="p-6 space-y-5">{children}</div>
  </motion.div>
);

/* Sous-formulaire Hero */
const HeroSettings = () => {
  const { data }        = useSettings('hero');
  const update          = useUpdateSetting();
  const [form, setForm] = useState({ headline: '', subheadline: '', cta_primary: '', cta_secondary: '' });

  useEffect(() => {
    if (data?.value) setForm(data.value);
  }, [data]);

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));

  const save = async () => {
    try {
      await update.mutateAsync({ key: 'hero', value: form });
      toast.success('Section Hero sauvegardée !');
    } catch { toast.error('Erreur lors de la sauvegarde.'); }
  };

  return (
    <Section icon={Globe} title="Section Hero">
      <Field label="Titre principal" hint="Utilisez \\n pour un saut de ligne (ex: Développeur Web\\n& Mobile)">
        <input className="input-field" value={form.headline} onChange={set('headline')} placeholder="Développeur Web\n& Mobile" />
      </Field>
      <Field label="Sous-titre">
        <textarea className="input-field resize-none" rows={2} value={form.subheadline} onChange={set('subheadline')} />
      </Field>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Bouton principal">
          <input className="input-field" value={form.cta_primary} onChange={set('cta_primary')} placeholder="Voir mes projets" />
        </Field>
        <Field label="Bouton secondaire">
          <input className="input-field" value={form.cta_secondary} onChange={set('cta_secondary')} placeholder="Me contacter" />
        </Field>
      </div>
      <button onClick={save} disabled={update.isPending} className="btn-primary text-sm py-2 px-5 disabled:opacity-60">
        <Save size={14} /> Sauvegarder
      </button>
    </Section>
  );
};

/* Sous-formulaire About */
const AboutSettings = () => {
  const { data }        = useSettings('about');
  const update          = useUpdateSetting();
  const [form, setForm] = useState({ bio: '', location: '', availability: true });

  useEffect(() => {
    if (data?.value) setForm(data.value);
  }, [data]);

  const set = (f) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(p => ({ ...p, [f]: val }));
  };

  const save = async () => {
    try {
      await update.mutateAsync({ key: 'about', value: form });
      toast.success('Section À propos sauvegardée !');
    } catch { toast.error('Erreur.'); }
  };

  return (
    <Section icon={User} title="Section À propos">
      <Field label="Biographie">
        <textarea className="input-field resize-none" rows={5} value={form.bio} onChange={set('bio')} placeholder="Votre biographie..." />
      </Field>
      <Field label="Localisation">
        <input className="input-field" value={form.location} onChange={set('location')} placeholder="Saint-Denis, La Réunion" />
      </Field>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={form.availability} onChange={set('availability')} className="w-4 h-4 accent-[#00E5A0]" />
        <span className="text-sm text-[#C8DDD4]">Afficher le badge "Disponible pour missions"</span>
      </label>
      <button onClick={save} disabled={update.isPending} className="btn-primary text-sm py-2 px-5 disabled:opacity-60">
        <Save size={14} /> Sauvegarder
      </button>
    </Section>
  );
};

/* Sous-formulaire Social */
const SocialSettings = () => {
  const { data }        = useSettings('social');
  const update          = useUpdateSetting();
  const [form, setForm] = useState({ github: '', linkedin: '', facebook: '', instagram: '', email: '' });

  useEffect(() => {
    if (data?.value) setForm(data.value);
  }, [data]);

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));

  const save = async () => {
    try {
      await update.mutateAsync({ key: 'social', value: form });
      toast.success('Réseaux sociaux sauvegardés !');
    } catch { toast.error('Erreur.'); }
  };

  const fields = [
    { key: 'email',    label: 'Email',     placeholder: 'contact@velt.re' },
    { key: 'github',   label: 'GitHub',    placeholder: 'https://github.com/...' },
    { key: 'linkedin', label: 'LinkedIn',  placeholder: 'https://linkedin.com/in/...' },
    { key: 'facebook', label: 'Facebook',  placeholder: 'https://facebook.com/...' },
    { key: 'instagram',label: 'Instagram', placeholder: 'https://instagram.com/...' },
  ];

  return (
    <Section icon={Share2} title="Réseaux sociaux">
      <div className="grid sm:grid-cols-2 gap-4">
        {fields.map(({ key, label, placeholder }) => (
          <Field key={key} label={label}>
            <input className="input-field" value={form[key]} onChange={set(key)} placeholder={placeholder} type={key === 'email' ? 'email' : 'url'} />
          </Field>
        ))}
      </div>
      <button onClick={save} disabled={update.isPending} className="btn-primary text-sm py-2 px-5 disabled:opacity-60">
        <Save size={14} /> Sauvegarder
      </button>
    </Section>
  );
};

/* Sous-formulaire SEO */
const SeoSettings = () => {
  const { data }        = useSettings('seo');
  const update          = useUpdateSetting();
  const [form, setForm] = useState({ title: '', description: '', og_image: '' });

  useEffect(() => {
    if (data?.value) setForm(data.value);
  }, [data]);

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));

  const save = async () => {
    try {
      await update.mutateAsync({ key: 'seo', value: form });
      toast.success('SEO sauvegardé !');
    } catch { toast.error('Erreur.'); }
  };

  return (
    <Section icon={Search} title="SEO & Métadonnées">
      <Field label="Titre de la page" hint="Affiché dans l'onglet du navigateur et les résultats Google">
        <input className="input-field" value={form.title} onChange={set('title')} placeholder="Djebarlen Tambon — Développeur Web & Mobile" />
      </Field>
      <Field label="Description" hint="Entre 120 et 160 caractères recommandés">
        <textarea className="input-field resize-none" rows={3} value={form.description} onChange={set('description')} placeholder="Portfolio de Djebarlen Tambon..." />
        <p className="text-[10px] text-[#6B9980] mt-1">{form.description.length} caractères</p>
      </Field>
      <Field label="Image Open Graph (réseaux sociaux)" hint="URL d'une image 1200x630px">
        <input className="input-field" value={form.og_image} onChange={set('og_image')} placeholder="https://..." type="url" />
      </Field>
      <button onClick={save} disabled={update.isPending} className="btn-primary text-sm py-2 px-5 disabled:opacity-60">
        <Save size={14} /> Sauvegarder
      </button>
    </Section>
  );
};

const AdminSettings = () => (
  <div className="p-8">
    <AdminPageHeader title="Paramètres" description="Gérez le contenu de votre portfolio" />
    <div className="space-y-6 max-w-3xl">
      <HeroSettings />
      <AboutSettings />
      <SocialSettings />
      <SeoSettings />
    </div>
  </div>
);

export default AdminSettings;