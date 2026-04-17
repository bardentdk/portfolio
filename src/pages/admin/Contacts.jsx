import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Mail, Check, Archive, Trash2,
  Eye, Search, RefreshCw, ChevronUp, ChevronDown,
  Inbox, Clock, CheckCheck, FolderX,
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import toast from 'react-hot-toast';
import { useContacts, useUpdateContactStatus } from '../../hooks/useContacts';
import { supabase } from '../../lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

/* ── Constantes ── */
const STATUS_CONFIG = {
  new:      { label: 'Nouveau',  color: '#00E5A0', bg: 'rgba(0,229,160,0.12)',  border: 'rgba(0,229,160,0.25)' },
  read:     { label: 'Lu',       color: '#6B9980', bg: 'rgba(107,153,128,0.1)', border: 'rgba(107,153,128,0.2)' },
  replied:  { label: 'Répondu', color: '#00B4FF', bg: 'rgba(0,180,255,0.1)',   border: 'rgba(0,180,255,0.2)' },
  archived: { label: 'Archivé', color: '#2E4A3A', bg: 'rgba(46,74,58,0.3)',    border: 'rgba(46,74,58,0.4)' },
};

const FILTERS = [
  { key: 'all',      label: 'Tous',      icon: Inbox },
  { key: 'new',      label: 'Nouveaux',  icon: MessageSquare },
  { key: 'read',     label: 'Lus',       icon: Eye },
  { key: 'replied',  label: 'Répondus',  icon: CheckCheck },
  { key: 'archived', label: 'Archivés',  icon: Archive },
];

/* ── Badge statut ── */
const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.read;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '0.2rem 0.6rem',
      borderRadius: '100px',
      fontSize: '0.6875rem', fontWeight: 700,
      color: cfg.color,
      background: cfg.bg,
      border: `1px solid ${cfg.border}`,
      whiteSpace: 'nowrap',
    }}>
      {cfg.label}
    </span>
  );
};

/* ── Stat card ── */
const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="glass" style={{ borderRadius: '0.875rem', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
    <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.625rem', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon size={15} color={color} />
    </div>
    <div>
      <div style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, fontSize: '1.375rem', color: '#EEF5F1', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '0.75rem', color: '#6B9980', marginTop: '0.2rem' }}>{label}</div>
    </div>
  </div>
);

/* ── Modal message complet ── */
const MessageModal = ({ contact, onClose, onStatusChange }) => {
  if (!contact) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Infos expéditeur */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {[
          { label: 'Nom',    value: contact.name },
          { label: 'Email',  value: contact.email, href: `mailto:${contact.email}` },
          { label: 'Sujet',  value: contact.subject || '(Sans sujet)', span: 2 },
          { label: 'Reçu le', value: format(new Date(contact.created_at), "d MMMM yyyy 'à' HH:mm", { locale: fr }), span: 2 },
        ].map(({ label, value, href, span }) => (
          <div key={label} style={span ? { gridColumn: `span ${span}` } : {}}>
            <div style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6B9980', marginBottom: '0.375rem' }}>{label}</div>
            {href
              ? <a href={href} style={{ fontSize: '0.875rem', color: '#00E5A0', fontWeight: 500, textDecoration: 'none' }}>{value}</a>
              : <div style={{ fontSize: '0.875rem', color: '#EEF5F1', fontWeight: 500 }}>{value}</div>
            }
          </div>
        ))}
      </div>

      {/* Message */}
      <div>
        <div style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6B9980', marginBottom: '0.5rem' }}>Message</div>
        <div className="glass" style={{ borderRadius: '0.75rem', padding: '1rem', fontSize: '0.875rem', color: '#C8DDD4', lineHeight: 1.75, whiteSpace: 'pre-wrap', minHeight: '7rem' }}>
          {contact.message}
        </div>
      </div>

      {/* Statut actuel */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '0.75rem', color: '#6B9980' }}>Statut :</span>
        <StatusBadge status={contact.status} />
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(0,229,160,0.08)' }}>
        <a
          href={`mailto:${contact.email}?subject=Re: ${contact.subject || 'Votre message'}&body=%0A%0A---%0AMessage original de ${contact.name} :%0A${contact.message}`}
          className="btn-primary"
          style={{ flex: 1, justifyContent: 'center', fontSize: '0.8125rem', padding: '0.625rem 1rem' }}
          onClick={() => onStatusChange(contact.id, 'replied')}
        >
          <Mail size={14} /> Répondre par email
        </a>
        {contact.status !== 'replied' && (
          <button
            onClick={() => { onStatusChange(contact.id, 'replied'); onClose(); }}
            className="btn-outline"
            style={{ flex: 1, justifyContent: 'center', fontSize: '0.8125rem', padding: '0.625rem 1rem' }}
          >
            <Check size={14} /> Marquer répondu
          </button>
        )}
        {contact.status !== 'archived' && (
          <button
            onClick={() => { onStatusChange(contact.id, 'archived'); onClose(); }}
            style={{
              padding: '0.625rem 1rem', borderRadius: '100px',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#6B9980', fontSize: '0.8125rem', fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: '0.375rem', cursor: 'none',
              transition: 'all 0.2s',
            }}
          >
            <Archive size={14} /> Archiver
          </button>
        )}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   PAGE PRINCIPALE
══════════════════════════════════════════ */
const Contacts = () => {
  const qc              = useQueryClient();
  const { data: contacts, isLoading, refetch, isFetching } = useContacts();
  const updateStatus    = useUpdateContactStatus();

  const [filter,   setFilter]   = useState('all');
  const [search,   setSearch]   = useState('');
  const [selected, setSelected] = useState(null);
  const [confirm,  setConfirm]  = useState(null);
  const [sortField, setSortField] = useState('created_at');
  const [sortDir,   setSortDir]   = useState('desc');

  /* ── Counts ── */
  const counts = {
    all:      contacts?.length || 0,
    new:      contacts?.filter(c => c.status === 'new').length      || 0,
    read:     contacts?.filter(c => c.status === 'read').length     || 0,
    replied:  contacts?.filter(c => c.status === 'replied').length  || 0,
    archived: contacts?.filter(c => c.status === 'archived').length || 0,
  };

  /* ── Filtrage + recherche + tri ── */
  const displayed = (contacts || [])
    .filter(c => filter === 'all' || c.status === filter)
    .filter(c => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.subject?.toLowerCase().includes(q) ||
        c.message?.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const valA = a[sortField] || '';
      const valB = b[sortField] || '';
      const cmp  = valA < valB ? -1 : valA > valB ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });

  /* ── Handlers ── */
  const handleStatus = async (id, status) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      // Mettre à jour le contact sélectionné si ouvert
      if (selected?.id === id) setSelected(prev => ({ ...prev, status }));
      toast.success('Statut mis à jour.');
    } catch { toast.error('Erreur.'); }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase.from('contacts').delete().eq('id', confirm);
      if (error) throw error;
      qc.invalidateQueries(['contacts']);
      toast.success('Message supprimé.');
      setConfirm(null);
      if (selected?.id === confirm) setSelected(null);
    } catch { toast.error('Erreur lors de la suppression.'); }
  };

  const openMessage = (c) => {
    setSelected(c);
    if (c.status === 'new') handleStatus(c.id, 'read');
  };

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronUp size={12} style={{ opacity: 0.3 }} />;
    return sortDir === 'asc'
      ? <ChevronUp   size={12} color="#00E5A0" />
      : <ChevronDown size={12} color="#00E5A0" />;
  };

  const thStyle = (field) => ({
    textAlign: 'left', padding: '0.75rem 1rem',
    fontSize: '0.625rem', fontWeight: 700,
    textTransform: 'uppercase', letterSpacing: '0.12em',
    color: '#6B9980', cursor: field ? 'pointer' : 'default',
    userSelect: 'none', whiteSpace: 'nowrap',
  });

  /* ── Render ── */
  return (
    <div style={{ padding: '2rem' }}>
      <AdminPageHeader
        title="Messages"
        description={`${counts.new} non lu(s) · ${counts.all} au total`}
        action={
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="btn-outline"
            style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}
          >
            <RefreshCw size={14} style={{ animation: isFetching ? 'spin 1s linear infinite' : 'none' }} />
            Actualiser
          </button>
        }
      />

      {/* ── Stat cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <StatCard icon={Inbox}       label="Total"    value={counts.all}      color="#6B9980" />
        <StatCard icon={MessageSquare} label="Nouveaux" value={counts.new}    color="#00E5A0" />
        <StatCard icon={Eye}         label="Lus"       value={counts.read}    color="#C8DDD4" />
        <StatCard icon={CheckCheck}  label="Répondus"  value={counts.replied} color="#00B4FF" />
        <StatCard icon={FolderX}     label="Archivés"  value={counts.archived} color="#2E4A3A" />
      </div>

      {/* ── Filtres + Recherche ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
          {FILTERS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
                padding: '0.4rem 0.875rem',
                borderRadius: '100px', border: 'none',
                fontSize: '0.8125rem', fontWeight: 600,
                cursor: 'none', transition: 'all 0.2s',
                background: filter === key ? '#00E5A0' : 'rgba(255,255,255,0.05)',
                color:      filter === key ? '#050E0A' : '#6B9980',
              }}
            >
              <Icon size={13} />
              {label}
              {counts[key] > 0 && (
                <span style={{
                  fontSize: '0.625rem', fontWeight: 800,
                  padding: '0.1rem 0.4rem', borderRadius: '100px',
                  background: filter === key ? 'rgba(5,14,10,0.25)' : 'rgba(0,229,160,0.15)',
                  color:      filter === key ? '#050E0A' : '#00E5A0',
                }}>
                  {counts[key]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Recherche */}
        <div style={{ position: 'relative', flex: 1, minWidth: '200px', maxWidth: '320px', marginLeft: 'auto' }}>
          <Search size={14} color="#6B9980" style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="input-field"
            style={{ paddingLeft: '2.25rem', fontSize: '0.875rem', height: '2.25rem', padding: '0 0.875rem 0 2.25rem' }}
          />
        </div>
      </div>

      {/* ── Tableau ── */}
      <div className="glass" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: '3rem', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '2rem', height: '2rem', border: '2px solid #00E5A0', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : displayed.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <MessageSquare size={36} color="#2E4A3A" style={{ margin: '0 auto 0.75rem' }} />
            <p style={{ fontSize: '0.875rem', color: '#6B9980' }}>
              {search ? 'Aucun résultat pour cette recherche.' : 'Aucun message dans cette catégorie.'}
            </p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(0,229,160,0.07)' }}>
                <th style={thStyle(null)}>Exp.</th>
                <th style={thStyle('subject')} onClick={() => toggleSort('subject')}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    Sujet <SortIcon field="subject" />
                  </span>
                </th>
                <th style={thStyle(null)} className="hidden md:table-cell">Message</th>
                <th style={thStyle('status')} onClick={() => toggleSort('status')}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    Statut <SortIcon field="status" />
                  </span>
                </th>
                <th style={thStyle('created_at')} onClick={() => toggleSort('created_at')}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    Date <SortIcon field="created_at" />
                  </span>
                </th>
                <th style={thStyle(null)}>Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {displayed.map((c, i) => (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.25, delay: i * 0.03 }}
                    onClick={() => openMessage(c)}
                    style={{
                      borderBottom: '1px solid rgba(0,229,160,0.04)',
                      cursor: 'pointer',
                      background: c.status === 'new' ? 'rgba(0,229,160,0.03)' : 'transparent',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,229,160,0.05)'}
                    onMouseLeave={e => e.currentTarget.style.background = c.status === 'new' ? 'rgba(0,229,160,0.03)' : 'transparent'}
                  >
                    {/* Expéditeur */}
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        {/* Pastille "nouveau" */}
                        <div style={{ width: '0.4rem', height: '0.4rem', borderRadius: '50%', background: c.status === 'new' ? '#00E5A0' : 'transparent', flexShrink: 0 }} />
                        {/* Avatar initiale */}
                        <div style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', background: 'rgba(0,229,160,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.75rem', fontWeight: 700, color: '#00E5A0' }}>
                          {c.name?.slice(0, 1).toUpperCase()}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '0.8125rem', fontWeight: c.status === 'new' ? 700 : 500, color: '#EEF5F1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>
                            {c.name}
                          </div>
                          <div style={{ fontSize: '0.6875rem', color: '#6B9980', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>
                            {c.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Sujet */}
                    <td style={{ padding: '0.875rem 1rem', maxWidth: '180px' }}>
                      <div style={{ fontSize: '0.8125rem', fontWeight: c.status === 'new' ? 600 : 400, color: '#C8DDD4', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {c.subject || <span style={{ color: '#2E4A3A', fontStyle: 'italic' }}>Sans sujet</span>}
                      </div>
                    </td>

                    {/* Aperçu message */}
                    <td style={{ padding: '0.875rem 1rem', maxWidth: '220px' }}>
                      <div style={{ fontSize: '0.8125rem', color: '#6B9980', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {c.message}
                      </div>
                    </td>

                    {/* Statut */}
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <StatusBadge status={c.status} />
                    </td>

                    {/* Date */}
                    <td style={{ padding: '0.875rem 1rem', whiteSpace: 'nowrap' }}>
                      <div style={{ fontSize: '0.8125rem', color: '#6B9980' }}>
                        {format(new Date(c.created_at), 'd MMM yyyy', { locale: fr })}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: '#2E4A3A' }}>
                        {format(new Date(c.created_at), 'HH:mm')}
                      </div>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '0.875rem 1rem' }} onClick={e => e.stopPropagation()}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        {/* Ouvrir */}
                        <button
                          onClick={() => openMessage(c)}
                          title="Lire le message"
                          style={actionBtn()}
                          onMouseEnter={e => e.currentTarget.style.color = '#00E5A0'}
                          onMouseLeave={e => e.currentTarget.style.color = '#6B9980'}
                        >
                          <Eye size={13} />
                        </button>

                        {/* Répondre par email */}
                        <a
                          href={`mailto:${c.email}?subject=Re: ${c.subject || 'Votre message'}`}
                          title="Répondre"
                          style={{ ...actionBtn(), display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: '#6B9980' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#00B4FF'}
                          onMouseLeave={e => e.currentTarget.style.color = '#6B9980'}
                          onClick={() => handleStatus(c.id, 'replied')}
                        >
                          <Mail size={13} />
                        </a>

                        {/* Marquer répondu / non-répondu */}
                        <button
                          onClick={() => handleStatus(c.id, c.status === 'replied' ? 'read' : 'replied')}
                          title={c.status === 'replied' ? 'Marquer non-répondu' : 'Marquer répondu'}
                          style={actionBtn()}
                          onMouseEnter={e => e.currentTarget.style.color = '#00E5A0'}
                          onMouseLeave={e => e.currentTarget.style.color = '#6B9980'}
                        >
                          <Check size={13} />
                        </button>

                        {/* Archiver */}
                        <button
                          onClick={() => handleStatus(c.id, c.status === 'archived' ? 'read' : 'archived')}
                          title={c.status === 'archived' ? 'Désarchiver' : 'Archiver'}
                          style={actionBtn()}
                          onMouseEnter={e => e.currentTarget.style.color = '#6B9980'}
                          onMouseLeave={e => e.currentTarget.style.color = '#2E4A3A'}
                        >
                          <Archive size={13} />
                        </button>

                        {/* Supprimer */}
                        <button
                          onClick={() => setConfirm(c.id)}
                          title="Supprimer"
                          style={actionBtn()}
                          onMouseEnter={e => e.currentTarget.style.color = '#ff5032'}
                          onMouseLeave={e => e.currentTarget.style.color = '#6B9980'}
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
        )}

        {/* Footer tableau */}
        {!isLoading && displayed.length > 0 && (
          <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid rgba(0,229,160,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', color: '#6B9980' }}>
              {displayed.length} message{displayed.length > 1 ? 's' : ''} affiché{displayed.length > 1 ? 's' : ''}
              {search && ` · recherche "${search}"`}
            </span>
            {search && (
              <button
                onClick={() => setSearch('')}
                style={{ fontSize: '0.75rem', color: '#00E5A0', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Effacer la recherche
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Modal lecture ── */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={`Message de ${selected?.name || ''}`}
        size="md"
      >
        <MessageModal
          contact={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatus}
        />
      </Modal>

      {/* ── Confirm suppression ── */}
      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        onConfirm={handleDelete}
        title="Supprimer ce message ?"
        description="Cette action est irréversible."
      />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

const actionBtn = () => ({
  width: '1.75rem', height: '1.75rem',
  borderRadius: '0.5rem',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'none', border: 'none',
  color: '#6B9980', cursor: 'none',
  transition: 'color 0.2s, background 0.2s',
});

export default Contacts;