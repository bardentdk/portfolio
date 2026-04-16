import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
    {/* Grid déco */}
    <div className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage:
          'linear-gradient(rgba(0,229,160,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,160,0.03) 1px,transparent 1px)',
        backgroundSize: '70px 70px',
      }}
    />

    {/* Orb */}
    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
      style={{ background: 'radial-gradient(circle,rgba(0,229,160,0.07) 0%,transparent 65%)' }} />

    <div className="relative z-10 text-center px-6">
      {/* 404 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        className="font-display font-black text-gradient leading-none mb-6 select-none"
        style={{ fontSize: 'clamp(6rem,20vw,14rem)' }}
      >
        404
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15, ease: [0.19, 1, 0.22, 1] }}
        className="font-display font-bold text-2xl text-[#EEF5F1] mb-3"
      >
        Page introuvable
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25 }}
        className="text-sm text-[#6B9980] mb-10 max-w-sm mx-auto leading-relaxed"
      >
        La page que vous cherchez n'existe pas ou a été déplacée.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35 }}
        className="flex flex-wrap gap-3 justify-center"
      >
        <button onClick={() => window.history.back()} className="btn-outline">
          <ArrowLeft size={15} /> Retour
        </button>
        <Link to="/" className="btn-primary">
          <Home size={15} /> Accueil
        </Link>
      </motion.div>
    </div>
  </div>
);

export default NotFound;