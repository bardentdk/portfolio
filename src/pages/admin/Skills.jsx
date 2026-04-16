import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, Wrench } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSkills, useUpsertSkill, useDeleteSkill } from '../../hooks/useExperiences';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import Modal           from '../../components/admin/Modal';
import ConfirmDialog   from '../../components/admin/ConfirmDialog';

const CATEGORIES = ['Frontend', 'Backend', 'Mobile', 'Design', 'Tools'];
const EMPTY = { name: '', category: 'Frontend', level: 80, order_index: 0, icon_url: '' };

const Field = ({ label, required, children }) => (
  <div>
    <label className="block text-xs font-semibold text-[#6B9980] uppercase tracking-widest mb-2">
      {label} {required && <span className="text-[#00E5A0]">*</span>}
    </label>
    {children}
  </div>
);

const SkillForm = ({ initial, onSubmit, onCancel, loading }) => {
  const [form, setForm] = useState({ ...EMPTY, ...initial });
  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ ...form, level: Number(form.level), order_index: Number(form.order_index) }); }} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Nom" required>
          <input className="input-field" value={form.name} onChange={set('name')} required placeholder="Laravel" />
        </Field>
        <Field label="Catégorie" required>
          <select className="input-field" value={form.category} onChange={set('category')}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
      </div>
      <Field label={`Niveau : ${form.level}%`} required>
        <input className="w-full accent-[#00E5A0]" type="range" min="0" max="100" value={form.level} onChange={set('level')} />
        <div className="mt-2 h-1.5 bg-[rgba(0,229,160,0.08)] rounded-full">
          <div className="h-full rounded-full bg-[#00E5A0] transition-all" style={{ width: `${form.level}%` }} />
        </div>
      </Field>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="URL icône">
          <input className="input-field" type="url" value={form.icon_url} onChange={set('icon_url')} placeholder="https://..." />
        </Field>
        <Field label="Ordre">
          <input className="input-field" type="number" value={form.order_index} onChange={set('order_index')} min="0" />
        </Field>
      </div>
      <div className="flex gap-3 pt-2 border-t border-[rgba(0,229,160,0.08)]">
        <button type="button" onClick={onCancel} className="btn-outline flex-1 justify-center text-sm py-2.5">Annuler</button>
        <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center text-sm py-2.5 disabled:opacity-60">
          {initial?.id ? 'Enregistrer' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
};

const Skills = () => {
  const { data: skills, isLoading } = useSkills();
  const upsert  = useUpsertSkill();
  const destroy = useDeleteSkill();
  const [modal,   setModal]   = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [catFilter, setCatFilter] = useState('Tous');

  const displayed = catFilter === 'Tous' ? skills : skills?.filter(s => s.category === catFilter);

  const handleSave = async (data) => {
    try {
      await upsert.mutateAsync(data);
      toast.success(data.id ? 'Compétence mise à jour !' : 'Compétence ajoutée !');
      setModal(null);
    } catch (err) { toast.error(err.message); }
  };

  const handleDelete = async () => {
    try {
      await destroy.mutateAsync(confirm);
      toast.success('Compétence supprimée.');
      setConfirm(null);
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div className="p-8">
      <AdminPageHeader
        title="Compétences"
        description={`${skills?.length || 0} compétence(s)`}
        action={
          <button onClick={() => setModal('create')} className="btn-primary text-sm py-2 px-5">
            <Plus size={15} /> Ajouter
          </button>
        }
      />

      {/* Filtres */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['Tous', ...CATEGORIES].map(cat => (
          <button key={cat} onClick={() => setCatFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${catFilter === cat ? 'bg-[#00E5A0] text-[#050E0A]' : 'glass text-[#6B9980] hover:text-[#EEF5F1]'}`}>
            {cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="shimmer h-16 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <AnimatePresence>
            {displayed?.map((skill, i) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
                className="glass rounded-xl p-4 hover:border-[rgba(0,229,160,0.18)] transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-sm font-semibold text-[#EEF5F1]">{skill.name}</span>
                    <span className="block text-[10px] text-[#6B9980] mt-0.5">{skill.category}</span>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setModal(skill)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6B9980] hover:text-[#00E5A0] hover:bg-[rgba(0,229,160,0.08)] transition-all">
                      <Pencil size={12} />
                    </button>
                    <button onClick={() => setConfirm(skill.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6B9980] hover:text-red-400 hover:bg-[rgba(255,80,50,0.08)] transition-all">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-[rgba(0,229,160,0.08)] rounded-full">
                    <div className="h-full rounded-full bg-[#00E5A0]" style={{ width: `${skill.level}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-[#00E5A0] font-mono w-8 text-right">{skill.level}%</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal === 'create' ? 'Nouvelle compétence' : 'Modifier'} size="md">
        <SkillForm initial={modal === 'create' ? {} : modal} onSubmit={handleSave} onCancel={() => setModal(null)} loading={upsert.isPending} />
      </Modal>
      <ConfirmDialog open={!!confirm} onClose={() => setConfirm(null)} onConfirm={handleDelete} loading={destroy.isPending} title="Supprimer cette compétence ?" description="Cette action est irréversible." />
    </div>
  );
};

export default Skills;