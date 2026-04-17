import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { Download, Loader2 } from 'lucide-react';
import { useCvData } from '../../lib/cvData';
import CvDocument from './CvDocument';

/**
 * Tente de charger une image en contournant les restrictions CORS :
 * 1. fetch direct avec mode cors
 * 2. fetch via proxy corsproxy.io
 * 3. Retourne null → le composant affichera l'avatar DT
 */
const fetchImageAsBlob = async (url) => {
  // Essai 1 — fetch direct CORS
  try {
    const res = await fetch(url, { mode: 'cors' });
    if (res.ok) return await res.blob();
  } catch { /* CORS bloqué */ }

  // Essai 2 — via proxy CORS public
  try {
    const proxy = `https://corsproxy.io/?${encodeURIComponent(url)}`;
    const res   = await fetch(proxy);
    if (res.ok) return await res.blob();
  } catch { /* proxy indisponible */ }

  return null;
};

/**
 * Convertit un Blob image en base64 grayscale via Canvas.
 */
const blobToGrayscaleBase64 = (blob) =>
  new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(blob);
    const img       = new window.Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width  = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d    = data.data;
      for (let i = 0; i < d.length; i += 4) {
        const g    = d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114;
        d[i] = d[i + 1] = d[i + 2] = g;
      }
      ctx.putImageData(data, 0, 0);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(null);
    };

    img.src = objectUrl;
  });

/**
 * Bouton réutilisable — génère le PDF dynamiquement au clic.
 */
const CvDownloadButton = ({
  variant = 'outline',
  label   = 'Télécharger CV',
  size    = 'md',
}) => {
  const { data: cvData, isLoading } = useCvData();
  const [generating, setGenerating] = useState(false);

  const handleDownload = async () => {
    if (!cvData || generating) return;
    setGenerating(true);

    try {
      // ── Pré-traitement photo ──
      let grayscalePhoto = null;

      if (cvData.photo_url) {
        const blob = await fetchImageAsBlob(cvData.photo_url);
        if (blob) {
          grayscalePhoto = await blobToGrayscaleBase64(blob);
        } else {
          console.warn('[CV] Photo inaccessible (CORS) — avatar DT affiché à la place.');
          console.info('[CV] Solution : héberger la photo sur Supabase Storage (CORS activé par défaut).');
        }
      }

      // ── Génération PDF ──
      const blob = await pdf(
        <CvDocument data={{ ...cvData, grayscale_photo: grayscalePhoto }} />
      ).toBlob();

      const url  = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href     = url;
      link.download = `CV_Djebarlen_Tambon_${new Date().getFullYear()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('[CV] Erreur génération PDF :', err);
    } finally {
      setGenerating(false);
    }
  };

  const busy    = isLoading || generating;
  const padding = size === 'sm' ? '0.4rem 1rem'  : '0.875rem 2rem';
  const fSize   = size === 'sm' ? '0.8125rem'    : '0.875rem';

  return (
    <button
      onClick={handleDownload}
      disabled={busy}
      className={variant === 'primary' ? 'btn-primary' : 'btn-outline'}
      style={{ padding, fontSize: fSize, opacity: busy ? 0.7 : 1 }}
    >
      {busy
        ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
        : <Download size={15} />
      }
      {generating ? 'Génération…' : isLoading ? 'Chargement…' : label}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </button>
  );
};

export default CvDownloadButton;