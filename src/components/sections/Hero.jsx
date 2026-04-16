import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Code2, Sparkles } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';

/* Particules flottantes en arrière-plan */
const Particles = () => {
  const dots = Array.from({ length: 32 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 5,
    dur: Math.random() * 8 + 6,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map(d => (
        <motion.div
          key={d.id}
          className="absolute rounded-full bg-[#00E5A0]"
          style={{ left: `${d.x}%`, top: `${d.y}%`, width: d.size, height: d.size, opacity: 0.15 }}
          animate={{ y: [0, -20, 0], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
};

/* Grille décorative */
const GridLines = () => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage:
        'linear-gradient(rgba(0,229,160,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,160,0.04) 1px,transparent 1px)',
      backgroundSize: '80px 80px',
    }}
  />
);

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.19, 1, 0.22, 1] },
});

const Hero = () => {
  const { data: heroData } = useSettings('hero');
  const hero = heroData?.value || {};

  const headline    = hero.headline    || 'Développeur Web\n& Mobile';
  const subheadline = hero.subheadline || 'Je conçois des expériences numériques qui marient performance et esthétique.';

  const scrollDown = () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });

  const stats = [
    { value: '7+',  label: 'Ans d\'expérience' },
    { value: '30+', label: 'Projets livrés' },
    { value: '100%', label: 'Qualiopi certifié' },
  ];

  const stack = ['Laravel', 'Vue 3', 'React', 'InertiaJS', 'Supabase', 'WordPress', 'NativePHP'];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      <GridLines />
      <Particles />

      {/* Orb gauche */}
      <div className="absolute -left-64 top-1/3 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle,rgba(0,229,160,0.1) 0%,transparent 70%)' }} />
      {/* Orb droite */}
      <div className="absolute -right-32 bottom-0 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle,rgba(0,194,128,0.07) 0%,transparent 70%)' }} />

      <div className="container-custom relative z-10 pt-32 pb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ─ LEFT ─ */}
          <div>
            {/* Badge disponibilité */}
            <motion.div {...fadeUp(0.1)} className="inline-flex items-center gap-2 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5A0] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E5A0]" />
              </span>
              <span className="text-xs font-semibold text-[#00E5A0] tracking-widest uppercase">Disponible — Open to work</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              {...fadeUp(0.2)}
              className="font-display font-black text-[clamp(2.6rem,6vw,5.5rem)] leading-[1.0] tracking-tight text-[#EEF5F1] mb-6"
            >
              {headline.split('\n').map((line, i) => (
                <span key={i} className={i === 1 ? 'text-gradient block' : 'block'}>{line}</span>
              ))}
            </motion.h1>

            {/* Sub */}
            <motion.p {...fadeUp(0.32)} className="text-base text-[#6B9980] leading-relaxed max-w-md mb-10 font-light">
              {subheadline}
            </motion.p>

            {/* CTAs */}
            <motion.div {...fadeUp(0.42)} className="flex flex-wrap gap-3 mb-14">
              <button
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary"
              >
                <Sparkles size={16} /> Voir mes projets
              </button>
              <button
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-outline"
              >
                Me contacter
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div {...fadeUp(0.52)} className="flex gap-8">
              {stats.map(({ value, label }) => (
                <div key={label}>
                  <div className="font-display font-black text-2xl text-gradient leading-none mb-1">{value}</div>
                  <div className="text-xs text-[#6B9980] font-medium">{label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ─ RIGHT — carte flottante ─ */}
          <motion.div
            {...fadeUp(0.3)}
            className="relative hidden lg:flex justify-center"
          >
            {/* Carte principale */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-80"
            >
              {/* Photo placeholder ou initiales */}
              <div className="glass rounded-3xl p-1 shadow-[0_0_60px_rgba(0,229,160,0.12)]">
                <div className="rounded-[1.375rem] overflow-hidden aspect-[3/4] bg-gradient-to-br from-[#0C1A13] to-[#1A2E23] flex items-center justify-center relative">
                  {/* Pattern décoratif */}
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 30% 70%,rgba(0,229,160,0.15) 0%,transparent 50%)',
                  }} />
                  <span className="relative font-display font-black text-8xl text-gradient opacity-40 select-none">DT</span>
                </div>
              </div>

              {/* Badge Code */}
              <motion.div
                className="absolute -left-10 top-10 glass rounded-2xl px-4 py-3 flex items-center gap-2.5"
                animate={{ x: [0, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <div className="w-8 h-8 rounded-lg bg-[rgba(0,229,160,0.15)] flex items-center justify-center">
                  <Code2 size={16} className="text-[#00E5A0]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#EEF5F1]">Full-Stack</div>
                  <div className="text-[10px] text-[#6B9980]">Web & Mobile</div>
                </div>
              </motion.div>

              {/* Badge location */}
              <motion.div
                className="absolute -right-8 bottom-20 glass rounded-2xl px-4 py-3"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              >
                <div className="text-[10px] text-[#6B9980] mb-0.5">Basé à</div>
                <div className="text-xs font-bold text-[#EEF5F1]">🌴 La Réunion</div>
              </motion.div>
            </motion.div>

            {/* Stack ring décoratif */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-72">
              <div className="glass rounded-2xl px-5 py-3">
                <div className="text-[10px] text-[#6B9980] mb-2 uppercase tracking-widest font-semibold">Stack principale</div>
                <div className="flex flex-wrap gap-1.5">
                  {stack.map(t => (
                    <span key={t} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[rgba(0,229,160,0.1)] text-[#00E5A0] border border-[rgba(0,229,160,0.15)]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.button
          onClick={scrollDown}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#2E4A3A] hover:text-[#00E5A0] transition-colors"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-[10px] font-semibold tracking-widest uppercase">Scroll</span>
          <ArrowDown size={16} />
        </motion.button>
      </div>
    </section>
  );
};

export default Hero;