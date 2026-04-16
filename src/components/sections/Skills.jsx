import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useSkills } from '../../hooks/useExperiences';

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.8, delay, ease: [0.19, 1, 0.22, 1] },
});

/* Fallback si DB vide */
const FALLBACK_SKILLS = [
  { id: '1',  name: 'Laravel',      category: 'Backend',   level: 90 },
  { id: '2',  name: 'Vue.js 3',     category: 'Frontend',  level: 85 },
  { id: '3',  name: 'React',        category: 'Frontend',  level: 80 },
  { id: '4',  name: 'InertiaJS',    category: 'Backend',   level: 85 },
  { id: '5',  name: 'MySQL',        category: 'Backend',   level: 80 },
  { id: '6',  name: 'WordPress',    category: 'Frontend',  level: 88 },
  { id: '7',  name: 'NativePHP',    category: 'Mobile',    level: 70 },
  { id: '8',  name: 'Tailwind CSS', category: 'Frontend',  level: 92 },
  { id: '9',  name: 'Axios',        category: 'Frontend',  level: 88 },
  { id: '10', name: 'Supabase',     category: 'Backend',   level: 78 },
  { id: '11', name: 'Photoshop',    category: 'Design',    level: 75 },
  { id: '12', name: 'Illustrator',  category: 'Design',    level: 70 },
  { id: '13', name: 'Figma',        category: 'Design',    level: 72 },
  { id: '14', name: 'Canva',        category: 'Design',    level: 90 },
  { id: '15', name: 'VS Code',      category: 'Tools',     level: 95 },
  { id: '16', name: 'Git',          category: 'Tools',     level: 82 },
  { id: '17', name: 'Nuxt.js',      category: 'Frontend',  level: 72 },
  { id: '18', name: 'Electron.js',  category: 'Mobile',    level: 65 },
];

const CATEGORIES = ['Tous', 'Frontend', 'Backend', 'Mobile', 'Design', 'Tools'];

const SkillBar = ({ skill, delay }) => {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.19, 1, 0.22, 1] }}
      className="glass rounded-xl p-4 hover:border-[rgba(0,229,160,0.2)] transition-all duration-300 group"
    >
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-semibold text-[#EEF5F1] group-hover:text-[#00E5A0] transition-colors">
          {skill.name}
        </span>
        <span className="text-xs font-bold text-[#00E5A0] font-mono">{skill.level}%</span>
      </div>
      <div className="h-1.5 bg-[rgba(0,229,160,0.08)] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg,#00C280,#00E5A0)' }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.level}%` } : { width: 0 }}
          transition={{ duration: 1, delay: delay + 0.2, ease: [0.19, 1, 0.22, 1] }}
        />
      </div>
    </motion.div>
  );
};

/* Marquee de logos tech */
const MARQUEE_ITEMS = [
  'Laravel', 'Vue.js', 'React', 'InertiaJS', 'MySQL', 'Supabase',
  'WordPress', 'Tailwind', 'NativePHP', 'Electron.js', 'Nuxt.js', 'Axios',
  'Figma', 'Photoshop', 'Git', 'VS Code', 'Canva', 'PHP',
];

const Skills = () => {
  const { data: skills, isLoading } = useSkills();
  const [activeCategory, setActiveCategory] = useState('Tous');

  const data = skills?.length ? skills : FALLBACK_SKILLS;

  const filtered = activeCategory === 'Tous'
    ? data
    : data.filter(s => s.category === activeCategory);

  return (
    <section id="skills" className="section-padding relative overflow-hidden">
      {/* Orb */}
      <div className="absolute right-0 bottom-0 w-96 h-96 rounded-full pointer-events-none opacity-30"
        style={{ background: 'radial-gradient(circle,rgba(0,229,160,0.08) 0%,transparent 70%)' }} />

      <div className="container-custom">
        <div className="section-header-row">
          <motion.div {...fadeIn(0)}>
            <div className="section-label">Compétences</div>
            <h2 className="font-display font-black text-[clamp(2rem,4vw,3.5rem)] text-[#EEF5F1] leading-tight tracking-tight">
              Ma <span className="text-gradient">stack</span>
            </h2>
          </motion.div>

          {/* Tabs catégorie */}
          <motion.div {...fadeIn(0.1)} className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-[#00E5A0] text-[#050E0A]'
                    : 'glass text-[#6B9980] hover:text-[#EEF5F1]'
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Grid skills */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="shimmer h-20 rounded-xl" />
            ))}
          </div>
        ) : (
          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((skill, i) => (
              <SkillBar key={skill.id} skill={skill} delay={i * 0.05} />
            ))}
          </motion.div>
        )}
      </div>

      {/* Marquee */}
      <div className="mt-20 overflow-hidden border-y border-[rgba(0,229,160,0.06)] py-5">
        <div className="marquee-track whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-3 text-sm font-semibold text-[#2E4A3A] hover:text-[#00E5A0] transition-colors"
            >
              <span className="text-[#00E5A0] opacity-40">◆</span>
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;