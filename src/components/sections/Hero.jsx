import { motion } from 'framer-motion';
import { ArrowDown, Code2, Sparkles } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import Djeb from "../../assets/dt.png"

const Particles = () => {
  const dots = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 5,
    dur: Math.random() * 8 + 6,
  }));
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {dots.map(d => (
        <motion.div
          key={d.id}
          style={{
            position: 'absolute',
            left: `${d.x}%`, top: `${d.y}%`,
            width: d.size, height: d.size,
            borderRadius: '50%',
            background: '#00E5A0',
          }}
          animate={{ y: [0, -18, 0], opacity: [0.08, 0.25, 0.08] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.19, 1, 0.22, 1] },
});

const Hero = () => {
  const { data: heroData } = useSettings('hero');
  const hero = heroData?.value || {};

  const headline    = hero.headline    || 'Développeur Web\n& Mobile';
  const subheadline = hero.subheadline || 'Je conçois des expériences numériques qui marient performance et esthétique.';

  const stats = [
    { value: '7+',   label: "Ans d'expérience" },
    { value: '30+',  label: 'Projets livrés' },
    { value: '100%', label: 'Satisfaction client' },
  ];

  const stack = ['Laravel', 'Vue 3', 'React', 'InertiaJS', 'Supabase', 'WordPress'];

  return (
    <section id="hero" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
      {/* Grid décoratif */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'linear-gradient(rgba(0,229,160,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,160,0.035) 1px,transparent 1px)',
        backgroundSize: '80px 80px',
      }} />

      <Particles />

      {/* Orbs */}
      <div style={{ position: 'absolute', left: '-20rem', top: '33%', width: '700px', height: '700px', borderRadius: '50%', pointerEvents: 'none', background: 'radial-gradient(circle,rgba(0,229,160,0.09) 0%,transparent 65%)' }} />
      <div style={{ position: 'absolute', right: '-10rem', bottom: '-5rem', width: '500px', height: '500px', borderRadius: '50%', pointerEvents: 'none', background: 'radial-gradient(circle,rgba(0,194,128,0.06) 0%,transparent 65%)' }} />

      <div className="container-custom" style={{ position: 'relative', zIndex: 10, paddingTop: '9rem', paddingBottom: '7rem' }}>
        
        {/* Grille Flex JSX */}
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">

          {/* ─ Colonne gauche ─ */}
          <div>
            {/* Badge dispo */}
            <motion.div {...fadeUp(0.1)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem', marginBottom: '2rem' }}>
              <span style={{ position: 'relative', display: 'flex', width: '0.5rem', height: '0.5rem' }}>
                <span style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  background: '#00E5A0', opacity: 0.7,
                  animation: 'ping 1s cubic-bezier(0,0,0.2,1) infinite',
                }} />
                <span style={{ position: 'relative', display: 'flex', width: '0.5rem', height: '0.5rem', borderRadius: '50%', background: '#00E5A0' }} />
              </span>
              <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#00E5A0', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                Disponible — Open to work
              </span>
            </motion.div>

            {/* Titre */}
            <motion.h1
              {...fadeUp(0.2)}
              style={{
                fontFamily: 'Poppins, sans-serif', fontWeight: 900,
                lineHeight: 1.0, letterSpacing: '-0.02em',
                color: '#EEF5F1', marginBottom: '1.5rem',
                fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
              }}
            >
              {headline.split('\n').map((line, i) => (
                <span key={i} className={i % 2 !== 0 ? 'text-gradient' : ''} style={{ display: 'block' }}>
                  {line}
                </span>
              ))}
            </motion.h1>

            {/* Description */}
            <motion.p {...fadeUp(0.32)} style={{ fontSize: '1.05rem', color: '#6B9980', lineHeight: 1.8, maxWidth: '480px', marginBottom: '2.5rem', fontWeight: 300 }}>
              {subheadline}
            </motion.p>

            {/* Boutons */}
            <motion.div {...fadeUp(0.42)} className="flex flex-wrap gap-4 mb-14">
              <button
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary"
              >
                <Sparkles size={15} /> Voir mes projets
              </button>
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-outline"
              >
                Me contacter
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div {...fadeUp(0.52)} className="flex flex-wrap gap-8 sm:gap-12">
              {stats.map(({ value, label }) => (
                <div key={label}>
                  <div className="text-gradient" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900, fontSize: '1.75rem', lineHeight: 1, marginBottom: '0.35rem' }}>{value}</div>
                  <div style={{ fontSize: '0.75rem', color: '#6B9980', fontWeight: 500 }}>{label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ─ Colonne droite — IMAGE FLOTTANTE (desktop only) ─ */}
          <motion.div {...fadeUp(0.3)} className="hidden lg:flex justify-center items-center relative pl-8">
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-full max-w-[24rem]"
            >
              {/* Conteneur principal de l'image */}
              <div className="glass p-2 rounded-[2rem] shadow-[0_0_80px_rgba(0,229,160,0.12)]">
                <div className="relative sm:aspect-[9/16] aspect-[3/4] w-full rounded-[1.5rem] overflow-hidden bg-gradient-to-br from-[#0C1A13] to-[#1A2E23] group">
                  <img 
                    src={Djeb} 
                    alt="Djebarlen Tambon" 
                    className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-out"
                  />
                  {/* Petit overlay subtil en bas pour l'intégration */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050E0A] via-transparent to-transparent opacity-40 pointer-events-none" />
                </div>
              </div>

              {/* Badge gauche */}
              <motion.div
                className="glass absolute -left-10 top-12 rounded-2xl py-3 px-4 flex items-center gap-3 shadow-lg"
                animate={{ x: [0, -6, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <div className="w-10 h-10 rounded-xl bg-[rgba(0,229,160,0.15)] flex items-center justify-center flex-shrink-0">
                  <Code2 size={16} color="#00E5A0" />
                </div>
                <div>
                  <div className="text-[0.85rem] font-bold text-[#EEF5F1] leading-tight">Full-Stack</div>
                  <div className="text-[0.7rem] text-[#6B9980]">Web & Mobile</div>
                </div>
              </motion.div>

              {/* Badge droite */}
              <motion.div
                className="glass absolute -right-8 bottom-28 rounded-2xl py-3 px-4 shadow-lg"
                animate={{ x: [0, 6, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              >
                <div className="text-[0.7rem] text-[#6B9980] mb-0.5">Basé à</div>
                <div className="text-[0.85rem] font-bold text-[#EEF5F1]">🌴 La Réunion</div>
              </motion.div>

              {/* Stack pills (en bas au centre) */}
              <div className="glass absolute -bottom-6 left-1/2 -translate-x-1/2 w-72 rounded-2xl p-4 shadow-xl z-20">
                <div className="text-[0.7rem] text-[#6B9980] mb-2 uppercase tracking-widest font-bold">Stack</div>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {stack.map(t => (
                    <span key={t} className="text-[0.65rem] font-semibold px-2.5 py-1 rounded-full bg-[rgba(0,229,160,0.08)] text-[#00E5A0] border border-[rgba(0,229,160,0.15)]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.button
          onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          style={{
            position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
            color: '#2E4A3A', background: 'none', border: 'none', cursor: 'none', transition: 'color 0.3s',
          }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          onMouseEnter={e => e.currentTarget.style.color = '#00E5A0'}
          onMouseLeave={e => e.currentTarget.style.color = '#2E4A3A'}
        >
          <span style={{ fontSize: '0.5625rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Scroll</span>
          <ArrowDown size={14} />
        </motion.button>
      </div>

      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </section>
  );
};

export default Hero;