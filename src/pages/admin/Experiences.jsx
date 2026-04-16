import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import { useExperiences, useUpsertExperience, useDeleteExperience } from '../../hooks/useExperiences';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import Modal           from '../../components/admin/Modal';
import ConfirmDialog   from '../../components/admin/ConfirmDialog';

const EMPTY = {
  company: '', role: '', type: 'Salarié', start_date: '', end_date: '',
  is_current: false, description: '', logo_url: '', order_index: 0,
};

const Field = ({ label, required, children }) => (
  <div>
    <label className="block text-xs font-semibold text-[#6B9980] uppercase tracking-widest mb-2">
      {label} {required && <span className="text-[#00E5A0]">*</span>}
    </label>
    {children}
  </div>
);

const ExpForm = ({ initial, onSubmit, onCancel, loading }) => {
  const [form, setForm] = useState({ ...EMPTY, ...initial });
  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(f => ({ ...f, [field]: val }));
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Entreprise" required>
          <input className="input-field" value={form.company} onChange={set('company')} required placeholder="Synergie OI" />
        </Field>
        <Field label="Rôle" required>
          <input className="input-field" value={form.role} onChange={set('role')} required placeholder="Développeur Full-Stack" />
        </Field>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Type de contrat">
          <select className="input-field" value={form.type} onChange={set('type')}>
            {['CDI','CDD','Alternance','Freelance','Auto-entrepreneur','Stage'].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </Field>
        <Field label="Ordre">
          <input className="input-field" type="number" value={form.order_index} onChange={set('order_index')} min="0" />
        </Field>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Date de début" required>
          <input className="input-field" type="date" value={form.start_date} onChange={set('start_date')} required />
        </Field>
        <Field label="Date de fin">
          <input className="input-field" type="date" value={form.end_date || ''} onChange={set('end_date')} disabled={form.is_current} />
        </Field>
      </div>
      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={form.is_current} onChange={set('is_current')} className="w-4 h-4 accent-[#00E5A0]" />
        <span className="text-sm text-[#C8DDD4]">Poste actuel</span>
      </label>
      <Field label="Description">
        <textarea className="input-field resize-none" rows={3} value={form.description} onChange={set('description')} placeholder="Missions, réalisations..." />
      </Field>
      <Field label="URL du logo">
        <input className="input-field" type="url" value={form.logo_url} onChange={set('logo_url')} placeholder="https://..." />
      </Field>
      <div className="flex gap-3 pt-2 border-t border-[rgba(0,229,160,0.08)]">
        <button type="button" onClick={onCancel} className="btn-outline flex-1 justify-center text-sm py-2.5">Annuler</button>
        <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center text-sm py-2.5 disabled:opacity-60">
          {loading ? <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> : initial?.id ? 'Enregistrer' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
};

const Experiences = () => {
  const { data: experiences, isLoading } = useExperiences();
  const upsert  = useUpsertExperience();
  const destroy = useDeleteExperience();
  const [modal,   setModal]   = useState(null);
  const [confirm, setConfirm] = useState(null);

  const handleSave = async (data) => {
    try {
      await upsert.mutateAsync({ ...data, end_date: data.is_current ? null : data.end_date || null });
      toast.success(data.id ? 'Expérience mise à jour !' : 'Expérience ajoutée !');
      setModal(null);
    } catch (err) { toast.error(err.message); }
  };

  const handleDelete = async () => {
    try {
      await destroy.mutateAsync(confirm);
      toast.success('Expérience supprimée.');
      setConfirm(null);
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div className="p-8">
      <AdminPageHeader
        title="Expériences"
        description={`${experiences?.length || 0} expérience(s)`}
        action={
          <button onClick={() => setModal('create')} className="btn-primary text-sm py-2 px-5">
            <Plus size={15} /> Ajouter
          </button>
        }
      />

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="shimmer h-20 rounded-xl" />)}</div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {experiences?.map((exp, i) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="glass rounded-xl p-5 flex items-center gap-4 hover:border-[rgba(0,229,160,0.15)] transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[rgba(0,229,160,0.1)] flex items-center justify-center flex-shrink-0">
                  {exp.logo_url
                    ? <img src={exp.logo_url} alt="" className="w-8 h-8 object-contain rounded" />
                    : <Briefcase size={16} className="text-[#00E5A0]" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-[#EEF5F1]">{exp.role}</span>
                    <span className="tag text-[9px] py-0.5">{exp.type}</span>
                    {exp.is_current && <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[rgba(0,229,160,0.12)] text-[#00E5A0]">En cours</span>}
                  </div>
                  <span className="text-xs text-[#00E5A0] font-medium">{exp.company}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button onClick={() => setModal(exp)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B9980] hover:text-[#00E5A0] hover:bg-[rgba(0,229,160,0.08)] transition-all">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setConfirm(exp.id)} className="w-8 h-8 rounded-lg flex items-center justify-center text-[#6B9980] hover:text-red-400 hover:bg-[rgba(255,80,50,0.08)] transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {!experiences?.length && (
            <div className="flex flex-col items-center justify-center py-16 text-center glass rounded-2xl">
              <Briefcase size={32} className="text-[#2E4A3A] mb-3" />
              <p className="text-sm text-[#6B9980]">Aucune expérience encore</p>
            </div>
          )}
        </div>
      )}

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === 'create' ? 'Nouvelle expérience' : 'Modifier l\'expérience'} size="md">
        <ExpForm initial={modal === 'create' ? {} : modal} onSubmit={handleSave} onCancel={() => setModal(null)} loading={upsert.isPending} />
      </Modal>
      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={handleDelete} loading={destroy.isPending} title="Supprimer cette expérience ?" description="Cette action est irréversible." />
    </div>
  );
};

export default Experiences;