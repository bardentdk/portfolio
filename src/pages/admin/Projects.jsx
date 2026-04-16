import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, ExternalLink, GitBranch, Star, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useProjects, useUpsertProject, useDeleteProject } from '../../hooks/useProjects';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import Modal           from '../../components/admin/Modal';
import ConfirmDialog   from '../../components/admin/ConfirmDialog';

/* ── Formulaire projet ── */
const EMPTY_PROJECT = {
  title: '', slug: '', description: '', long_description: '',
  cover_url: '', tags: '', tech_stack: '', live_url: '', github_url: '',
  featured: false, status: 'published', order_index: 0,
};

const toSlug = (str) =>
  str.toLowerCase().replace(/[àáâãäå]/g, 'a').replace(/[éêëè]/g, 'e')
    .replace(/[îïí]/g, 'i').replace(/[ôö]/g, 'o').replace(/[ùûü]/g, 'u')
    .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');

const Field = ({ label, required, children }) => (
  <div>
    <label className="block text-xs font-semibold text-[#6B9980] uppercase tracking-widest mb-2">
      {label} {required && <span className="text-[#00E5A0]">*</span>}
    </label>
    {children}
  </div>
);

const ProjectForm = ({ initial, onSubmit, onCancel, loading }) => {
  const [form, setForm] = useState({
    ...EMPTY_PROJECT,
    ...initial,
    tags:      Array.isArray(initial?.tags)       ? initial.tags.join(', ')       : initial?.tags       || '',
    tech_stack: Array.isArray(initial?.tech_stack) ? initial.tech_stack.join(', ') : initial?.tech_stack || '',
  });

  const set = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(f => {
      const next = { ...f, [field]: val };
      if (field === 'title' && !initial?.id) next.slug = toSlug(val);
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      tags:       form.tags.split(',').map(s => s.trim()).filter(Boolean),
      tech_stack: form.tech_stack.split(',').map(s => s.trim()).filter(Boolean),
      order_index: Number(form.order_index) || 0,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Titre" required>
          <input className="input-field" value={form.title} onChange={set('title')} required placeholder="Mon super projet" />
        </Field>
        <Field label="Slug" required>
          <input className="input-field font-mono text-sm" value={form.slug} onChange={set('slug')} required placeholder="mon-super-projet" />
        </Field>
      </div>

      <Field label="Description courte" required>
        <input className="input-field" value={form.description} onChange={set('description')} required placeholder="Une ligne résumant le projet" />
      </Field>

      <Field label="Description longue">
        <textarea className="input-field resize-none" rows={5} value={form.long_description} onChange={set('long_description')} placeholder="Description détaillée du projet, contexte, objectifs, résultats..." />
      </Field>

      <Field label="URL cover (image principale)">
        <input className="input-field" value={form.cover_url} onChange={set('cover_url')} type="url" placeholder="https://..." />
      </Field>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Tags (séparés par virgule)">
          <input className="input-field" value={form.tags} onChange={set('tags')} placeholder="Web, Laravel, Design" />
        </Field>
        <Field label="Stack tech (séparés par virgule)">
          <input className="input-field" value={form.tech_stack} onChange={set('tech_stack')} placeholder="Laravel, Vue 3, MySQL" />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="URL du site live">
          <input className="input-field" value={form.live_url} onChange={set('live_url')} type="url" placeholder="https://..." />
        </Field>
        <Field label="URL GitHub">
          <input className="input-field" value={form.github_url} onChange={set('github_url')} type="url" placeholder="https://github.com/..." />
        </Field>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Field label="Statut">
          <select className="input-field" value={form.status} onChange={set('status')}>
            <option value="published">Publié</option>
            <option value="draft">Brouillon</option>
          </select>
        </Field>
        <Field label="Ordre d'affichage">
          <input className="input-field" value={form.order_index} onChange={set('order_index')} type="number" min="0" />
        </Field>
        <Field label="Options">
          <label className="flex items-center gap-2 h-[46px] cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={set('featured')} className="w-4 h-4 accent-[#00E5A0]" />
            <span className="text-sm text-[#C8DDD4]">Mis en avant</span>
          </label>
        </Field>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2 border-t border-[rgba(0,229,160,0.08)]">
        <button type="button" onClick={onCancel} className="btn-outline flex-1 justify-center text-sm py-2.5">
          Annuler
        </button>
        <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center text-sm py-2.5 disabled:opacity-60">
          {loading
            ? <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            : initial?.id ? 'Enregistrer' : 'Créer le projet'
          }
        </button>
      </div>
    </form>
  );
};

/* ── Page principale ── */
const AdminProjects = () => {
  const { data: projects, isLoading } = useProjects({ all: true });
  const upsert  = useUpsertProject();
  const destroy = useDeleteProject();

  const [modal,   setModal]   = useState(null);  // null | 'create' | project
  const [confirm, setConfirm] = useState(null);  // null | projectId

  const handleSave = async (data) => {
    try {
      await upsert.mutateAsync(data);
      toast.success(data.id ? 'Projet mis à jour !' : 'Projet créé !');
      setModal(null);
    } catch (err) {
      toast.error('Erreur : ' + err.message);
    }
  };

  const handleDelete = async () => {
    try {
      await destroy.mutateAsync(confirm);
      toast.success('Projet supprimé.');
      setConfirm(null);
    } catch (err) {
      toast.error('Erreur : ' + err.message);
    }
  };

  return (
    <div className="p-8">
      <AdminPageHeader
        title="Projets"
        description={`${projects?.length || 0} projet(s) au total`}
        action={
          <button onClick={() => setModal('create')} className="btn-primary text-sm py-2 px-5">
            <Plus size={15} /> Nouveau projet
          </button>
        }
      />

      {/* Table */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="shimmer h-16 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(0,229,160,0.06)]">
                {['Projet', 'Tags', 'Stack', 'Statut', 'Actions'].map(h => (
                  <th key={h} className="text-left px-5 py-4 text-[10px] font-bold uppercase tracking-widest text-[#6B9980]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {projects?.map((project, i) => (
                  <motion.tr
                    key={project.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                    className="border-b border-[rgba(0,229,160,0.04)] hover:bg-[rgba(0,229,160,0.03)] transition-colors"
                  >
                    {/* Titre */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        {project.cover_url
                          ? <img src={project.cover_url} alt="" className="w-10 h-7 object-cover rounded-lg flex-shrink-0" />
                          : <div className="w-10 h-7 rounded-lg bg-[rgba(0,229,160,0.08)] flex items-center justify-center flex-shrink-0 text-[9px] font-bold text-[#00E5A0]">
                              {project.title.slice(0, 2).toUpperCase()}
                            </div>
                        }
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-semibold text-[#EEF5F1]">{project.title}</span>
                            {project.featured && <Star size={11} className="text-[#00E5A0]" fill="currentColor" />}
                          </div>
                          <span className="text-[10px] text-[#6B9980] font-mono">{project.slug}</span>
                        </div>
                      </div>
                    </td>

                    {/* Tags */}
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {project.tags?.slice(0, 2).map(t => (
                          <span key={t} className="tag text-[9px] py-0.5">{t}</span>
                        ))}
                      </div>
                    </td>

                    {/* Stack */}
                    <td className="px-5 py-4 text-xs text-[#6B9980]">
                      {project.tech_stack?.slice(0, 2).join(', ')}
                      {project.tech_stack?.length > 2 && ` +${project.tech_stack.length - 2}`}
                    </td>

                    {/* Statut */}
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        project.status === 'published'
                          ? 'bg-[rgba(0,229,160,0.12)] text-[#00E5A0]'
                          : 'bg-[rgba(255,255,255,0.06)] text-[#6B9980]'
                      }`}>
                        {project.status === 'published' ? 'Publié' : 'Brouillon'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        {project.live_url && (
                          <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6B9980] hover:text-[#00E5A0] hover:bg-[rgba(0,229,160,0.08)] transition-all"
                          >
                            <ExternalLink size={13} />
                          </a>
                        )}
                        {project.github_url && (
                          <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6B9980] hover:text-[#00E5A0] hover:bg-[rgba(0,229,160,0.08)] transition-all"
                          >
                            <GitBranch size={13} />
                          </a>
                        )}
                        <button
                          onClick={() => setModal(project)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6B9980] hover:text-[#00E5A0] hover:bg-[rgba(0,229,160,0.08)] transition-all"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => setConfirm(project.id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6B9980] hover:text-red-400 hover:bg-[rgba(255,80,50,0.08)] transition-all"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>

          {!projects?.length && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FolderKanban size={32} className="text-[#2E4A3A] mb-3" />
              <p className="text-sm text-[#6B9980]">Aucun projet pour l'instant</p>
              <button onClick={() => setModal('create')} className="btn-primary text-sm py-2 px-5 mt-4">
                <Plus size={14} /> Créer le premier
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal create/edit */}
      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        title={modal === 'create' ? 'Nouveau projet' : `Modifier — ${modal?.title}`}
        size="lg"
      >
        <ProjectForm
          initial={modal === 'create' ? {} : modal}
          onSubmit={handleSave}
          onCancel={() => setModal(null)}
          loading={upsert.isPending}
        />
      </Modal>

      {/* Confirm delete */}
      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleDelete}
        loading={destroy.isPending}
        title="Supprimer ce projet ?"
        description="Cette action est irréversible. Le projet sera définitivement supprimé."
      />
    </div>
  );
};

export default AdminProjects;