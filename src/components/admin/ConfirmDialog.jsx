import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const ConfirmDialog = ({ open, onClose, onConfirm, title, description, loading }) => (
  <AnimatePresence>
    {open && (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div
          className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
        <motion.div
          className="relative w-full max-w-sm glass-strong rounded-2xl p-6"
          initial={{ opacity: 0, scale: 0.93, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[rgba(255,80,50,0.1)] flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={18} className="text-red-400" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-sm text-[#EEF5F1]">{title}</h3>
              {description && <p className="text-xs text-[#6B9980] mt-0.5">{description}</p>}
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={onClose} className="btn-outline py-2 px-4 text-xs">
              Annuler
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full text-xs font-semibold transition-all disabled:opacity-60"
            >
              {loading
                ? <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                : null
              }
              Supprimer
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default ConfirmDialog;