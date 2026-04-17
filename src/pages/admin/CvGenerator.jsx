import { useState, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Download, RefreshCw, Eye, FileText, Loader2, AlertCircle } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import { useCvData } from '../../lib/cvData';
import CvDocument from '../../components/cv/CvDocument';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

// PDFViewer est lourd — on le lazy load
const PDFViewer = lazy(() =>
  import('@react-pdf/renderer').then(m => ({ default: m.PDFViewer }))
);

/* ── Stat mini ── */
const InfoChip = ({ label, value }) => (
  <div className="glass" style={{ borderRadius: '0.625rem', padding: '0.625rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.125rem' }}>
    <span style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#6B9980' }}>{label}</span>
    <span style={{ fontSize: '1rem', fontWeight: 800, color: '#00E5A0', lineHeight: 1 }}>{value}</span>
  </div>
);

const CvGenerator = () => {
  const { data: cvData, isLoading, refetch, isFetching } = useCvData();
  const [showPreview,  setShowPreview]  = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (!cvData || isGenerating) return;
    setIsGenerating(true);
    try {
      const blob    = await pdf(<CvDocument data={cvData} />).toBlob();
      const url     = URL.createObjectURL(blob);
      const link    = document.createElement('a');
      link.href     = url;
      link.download = `CV_Djebarlen_Tambon_${new Date().getFullYear()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('[CV] Erreur :', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const stats = cvData ? [
    { label: 'Expériences', value: cvData.experiences?.length || 0 },
    { label: 'Formations',  value: cvData.education?.length  || 0 },
    { label: 'Compétences', value: cvData.skills?.length     || 0 },
    { label: 'Langues',     value: cvData.languages?.length  || 0 },
  ] : [];

  return (
    <div style={{ padding: '2rem' }}>
      <AdminPageHeader
        title="Générateur de CV"
        description="Le CV est généré automatiquement depuis les données de la base de données."
        action={
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="btn-outline"
              style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}
            >
              <RefreshCw size={14} style={{ animation: isFetching ? 'spin 1s linear infinite' : 'none' }} />
              Actualiser
            </button>
            <button
              onClick={handleDownload}
              disabled={!cvData || isGenerating || isLoading}
              className="btn-primary"
              style={{ padding: '0.5rem 1.25rem', fontSize: '0.8125rem', opacity: (!cvData || isGenerating) ? 0.65 : 1 }}
            >
              {isGenerating
                ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Génération…</>
                : <><Download size={14} /> Télécharger PDF</>
              }
            </button>
          </div>
        }
      />

      {/* ── Info banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass"
        style={{ borderRadius: '0.875rem', padding: '0.875rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderColor: 'rgba(0,229,160,0.15)' }}
      >
        <AlertCircle size={15} color="#00E5A0" style={{ flexShrink: 0 }} />
        <p style={{ fontSize: '0.8125rem', color: '#6B9980', lineHeight: 1.5 }}>
          Le contenu du CV est généré depuis la base de données.
          Pour modifier les données, utilisez les sections{' '}
          <strong style={{ color: '#00E5A0' }}>Expériences</strong>,{' '}
          <strong style={{ color: '#00E5A0' }}>Compétences</strong> et{' '}
          <strong style={{ color: '#00E5A0' }}>Paramètres → À propos</strong>.
        </p>
      </motion.div>

      {isLoading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem', gap: '1rem' }}>
          <div style={{ width: '2rem', height: '2rem', border: '2px solid #00E5A0', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: '0.875rem', color: '#6B9980' }}>Chargement des données…</span>
        </div>
      ) : cvData ? (
        <>
          {/* ── Chips stats ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {stats.map(s => <InfoChip key={s.label} {...s} />)}
          </div>

          {/* ── Aperçu données ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>

            {/* Expériences */}
            <div className="glass" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
              <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid rgba(0,229,160,0.06)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={14} color="#00E5A0" />
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#EEF5F1' }}>Expériences</span>
              </div>
              <div style={{ padding: '0.875rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {cvData.experiences.length > 0
                  ? cvData.experiences.map(exp => (
                      <div key={exp.id} style={{ borderLeft: '2px solid rgba(0,229,160,0.3)', paddingLeft: '0.75rem' }}>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#EEF5F1' }}>{exp.role}</div>
                        <div style={{ fontSize: '0.75rem', color: '#00E5A0' }}>{exp.company}</div>
                        <div style={{ fontSize: '0.6875rem', color: '#6B9980' }}>
                          {exp.type} · {exp.is_current ? "En cours" : exp.end_date?.slice(0, 7) || ''}
                        </div>
                      </div>
                    ))
                  : <p style={{ fontSize: '0.8125rem', color: '#6B9980' }}>Aucune expérience en base.</p>
                }
              </div>
            </div>

            {/* Formation */}
            <div className="glass" style={{ borderRadius: '1rem', overflow: 'hidden' }}>
              <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid rgba(0,229,160,0.06)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={14} color="#00E5A0" />
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#EEF5F1' }}>Formation</span>
              </div>
              <div style={{ padding: '0.875rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {cvData.education.length > 0
                  ? cvData.education.map(edu => (
                      <div key={edu.id} style={{ borderLeft: '2px solid rgba(0,229,160,0.3)', paddingLeft: '0.75rem' }}>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#EEF5F1' }}>{edu.degree}</div>
                        <div style={{ fontSize: '0.75rem', color: '#00E5A0' }}>{edu.institution}</div>
                        <div style={{ fontSize: '0.6875rem', color: '#6B9980' }}>
                          {edu.start_year || ''}{edu.end_year ? ` – ${edu.end_year}` : ''}
                          {edu.is_alternance ? ' · Alternance' : ''}
                        </div>
                      </div>
                    ))
                  : <p style={{ fontSize: '0.8125rem', color: '#6B9980' }}>Aucune formation en base.</p>
                }
              </div>
            </div>
          </div>

          {/* ── Toggle prévisualisation ── */}
          <div style={{ marginBottom: '1rem' }}>
            <button
              onClick={() => setShowPreview(v => !v)}
              className="btn-outline"
              style={{ fontSize: '0.8125rem', padding: '0.5rem 1.25rem' }}
            >
              <Eye size={14} />
              {showPreview ? 'Masquer la prévisualisation' : 'Prévisualiser le PDF'}
            </button>
          </div>

          {/* ── Prévisualisation PDF ── */}
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="glass"
              style={{ borderRadius: '1rem', overflow: 'hidden', height: '80vh' }}
            >
              <Suspense fallback={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '0.75rem' }}>
                  <div style={{ width: '1.5rem', height: '1.5rem', border: '2px solid #00E5A0', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  <span style={{ fontSize: '0.875rem', color: '#6B9980' }}>Chargement du viewer…</span>
                </div>
              }>
                <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
                  <CvDocument data={cvData} />
                </PDFViewer>
              </Suspense>
            </motion.div>
          )}
        </>
      ) : null}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default CvGenerator;