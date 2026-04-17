import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Mail, Check, Archive, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { useContacts, useUpdateContactStatus } from '../../hooks/useContacts';
import { supabase } from '../../lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import Modal           from '../../components/admin/Modal';
import ConfirmDialog   from '../../components/admin/ConfirmDialog';

const STATUS_COLORS = {
  new:      'bg-[rgba(0,229,160,0.12)] text-[#00E5A0]',
  read:     'bg-[rgba(255,255,255,0.06)] text-[#6B9980]',
  replied:  'bg-[rgba(0,180,255,0.12)] text-[#00B4FF]',
  archived: 'bg-[rgba(255,255,255,0.04)] text-[#2E4A3A]',
};

const STATUS_LABELS = { new: 'Nouveau', read: 'Lu', replied: 'Répondu', archived: 'Archivé' };

const Contacts = () => {
  const qc = useQueryClient();
  const { data: contacts, isLoading } = useContacts();
  const updateStatus = useUpdateContactStatus();
  const [selected, setSelected] = useState(null);
  const [confirm,  setConfirm]  = useState(null);
  const [filter,   setFilter]   = useState('all');

  const displayed = filter === 'all'
    ? contacts
    : contacts?.filter(c => c.status === filter);

  const handleStatus = async (id, status) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success('Statut mis à jour.');
    } catch (err) { toast.error(err.message); }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase.from('contacts').delete().eq('id', confirm);
      if (error) throw error;
      qc.invalidateQueries(['contacts']);
      toast.success('Message supprimé.');
      setConfirm(null);
      if (selected?.id === confirm) setSelected(null);
    } catch (err) { toast.error(err.message); }
  };

  const openMessage = (c) => {
    setSelected(c);
    if (c.status === 'new') handleStatus(c.id, 'read');
  };

  const counts = {
    all:      contacts?.length || 0,
    new:      contacts?.filter(c => c.status === 'new').length || 0,
    read:     contacts?.filter(c => c.status === 'read').length || 0,
    replied:  contacts?.filter(c => c.status === 'replied').length || 0,
    archived: contacts?.filter(c => c.status === 'archived').length || 0,
  };

  return (
    <div className="p-8">
      <AdminPageHeader
        title="Messages"
        description={`${counts.new} non lu(s) · ${counts.all} au total`}
      />

      {/* Filtres */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: 'all',      label: 'Tous' },
          { key: 'new',      label: 'Nouveaux' },
          { key: 'read',     label: 'Lus' },
          { key: 'replied',  label: 'Répondus' },
          { key: 'archived', label: 'Archivés' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              filter === key ? 'bg-[#00E5A0] text-[#050E0A]' : 'glass text-[#6B9980] hover:text-[#EEF5F1]'
            }`}
          >
            {label}
            {counts[key] > 0 && (
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${filter === key ? 'bg-[rgba(5,14,10,0.3)]' : 'bg-[rgba(0,229,160,0.15)] text-[#00E5A0]'}`}>
                {counts[key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="shimmer h-20 rounded-xl" />)}</div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {displayed?.map((c, i) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
                className={`glass rounded-xl p-4 flex items-center gap-4 cursor-pointer hover:border-[rgba(0,229,160,0.15)] transition-all ${
                  c.status === 'new' ? 'border-[rgba(0,229,160,0.12)]' : ''
                }`}
                onClick={() => openMessage(c)}
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-xl bg-[rgba(0,229,160,0.1)] flex items-center justify-center flex-shrink-0 text-sm font-bold text-[#00E5A0]">
                  {c.name.slice(0, 1).toUpperCase()}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-sm font-semibold ${c.status === 'new' ? 'text-[#EEF5F1]' : 'text-[#C8DDD4]'}`}>{c.name}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[c.status]}`}>{STATUS_LABELS[c.status]}</span>
                  </div>
                  <p className="text-xs text-[#6B9980] truncate">{c.subject || c.message}</p>
                </div>

                {/* Date + actions */}
                <div className="flex items-center gap-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
                  <span className="text-[10px] text-[#6B9980]">
                    {format(new Date(c.created_at), 'd MMM', { locale: fr })}
                  </span>
                  <button
                    onClick={() => handleStatus(c.id, c.status === 'replied' ? 'read' : 'replied')}
                    title="Marquer comme répondu"
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6B9980] hover:text-[#00E5A0] hover:bg-[rgba(0,229,160,0.08)] transition-all"
                  >
                    <Check size={13} />
                  </button>
                  <button
                    onClick={() => handleStatus(c.id, c.status === 'archived' ? 'read' : 'archived')}
                    title="Archiver"
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6B9980] hover:text-[#6B9980] hover:bg-[rgba(255,255,255,0.06)] transition-all"
                  >
                    <Archive size={13} />
                  </button>
                  <button
                    onClick={() => setConfirm(c.id)}
                    title="Supprimer"
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6B9980] hover:text-red-400 hover:bg-[rgba(255,80,50,0.08)] transition-all"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {!displayed?.length && (
            <div className="flex flex-col items-center justify-center py-16 text-center glass rounded-2xl">
              <MessageSquare size={32} className="text-[#2E4A3A] mb-3" />
              <p className="text-sm text-[#6B9980]">Aucun message dans cette catégorie</p>
            </div>
          )}
        </div>
      )}

      {/* Modal message */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title="Message" size="md">
        {selected && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#6B9980] mb-1">De</div>
                <div className="text-sm font-semibold text-[#EEF5F1]">{selected.name}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#6B9980] mb-1">Email</div>
                <a href={`mailto:${selected.email}`} className="text-sm text-[#00E5A0] hover:underline">{selected.email}</a>
              </div>
              {selected.subject && (
                <div className="col-span-2">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[#6B9980] mb-1">Sujet</div>
                  <div className="text-sm text-[#EEF5F1]">{selected.subject}</div>
                </div>
              )}
              <div className="col-span-2">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#6B9980] mb-1">Reçu le</div>
                <div className="text-sm text-[#C8DDD4]">{format(new Date(selected.created_at), "d MMMM yyyy 'à' HH:mm", { locale: fr })}</div>
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#6B9980] mb-2">Message</div>
              <div className="glass rounded-xl p-4 text-sm text-[#C8DDD4] leading-relaxed whitespace-pre-wrap">
                {selected.message}
              </div>
            </div>
            <div className="flex gap-3 pt-2 border-t border-[rgba(0,229,160,0.08)]">
              <a href={`mailto:${selected.email}?subject=Re: ${selected.subject || 'Votre message'}`}
                className="btn-primary flex-1 justify-center text-sm py-2.5">
                <Mail size={14} /> Répondre par email
              </a>
              <button
                onClick={() => { handleStatus(selected.id, 'replied'); setSelected(null); }}
                className="btn-outline flex-1 justify-center text-sm py-2.5">
                <Check size={14} /> Marquer répondu
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleDelete}
        title="Supprimer ce message ?"
        description="Cette action est irréversible."
      />
    </div>
  );
};

export default Contacts;