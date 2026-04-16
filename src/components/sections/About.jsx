import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { MapPin, Calendar, Briefcase, GraduationCap, Languages } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { useExperiences, useEducation } from '../../hooks/useExperiences';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.8, delay, ease: [0.19, 1, 0.22, 1] },
});

const languages = [
  { name: 'Créole réunionnais', level: 5, flag: '🌴' },
  { name: 'Français',            level: 5, flag: '🇫🇷' },
  { name: 'Anglais',             level: 3, flag: '🇬🇧' },
  { name: 'Allemand',            level: 2, flag: '🇩🇪' },
];

const SkillBar = ({ level }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className={`h-1.5 w-6 rounded-full transition-colors`}
          style={{ background: i < level ? '#00E5A0' : 'rgba(0,229,160,0.12)' }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.4, delay: i * 0.08 }}
        />
      ))}
    </div>
  );
};

const TimelineItem = ({ item, isExp, index }) => {
  const isLast = false;
  return (
    <motion.div {...fadeIn(index * 0.08)} className="relative flex gap-5">
      {/* Ligne verticale */}
      <div className="flex flex-col items-center">
        <div className="w-9 h-9 rounded-xl bg-[rgba(0,229,160,0.12)] border border-[rgba(0,229,160,0.2)] flex items-center justify-center flex-shrink-0 z-10">
          {isExp
            ? <Briefcase size={15} className="text-[#00E5A0]" />
            : <GraduationCap size={15} className="text-[#00E5A0]" />
          }
        </div>
        <div className="w-px flex-1 mt-2 bg-[rgba(0,229,160,0.08)]" />
      </div>

      <div className="pb-8 flex-1">
        {/* Type badge */}
        {item.type && (
          <span className="tag mb-2 inline-block">{item.type}</span>
        )}
        {item.is_alternance && (
          <span className="tag mb-2 inline-block">En alternance</span>
        )}

        <h4 className="font-display font-semibold text-[#EEF5F1] text-sm leading-tight mb-0.5">
          {isExp ? item.role : item.degree}
        </h4>
        <p className="text-xs font-semibold text-[#00E5A0] mb-1">
          {isExp ? item.company : item.institution}
        </p>
        <div className="flex items-center gap-1.5 text-[10px] text-[#6B9980] mb-2">
          <Calendar size={10} />
          <span>
            {isExp
              ? `${item.start_date ? format(new Date(item.start_date), 'MMM yyyy', { locale: fr }) : ''} — ${item.is_current ? "Aujourd'hui" : item.end_date ? format(new Date(item.end_date), 'MMM yyyy', { locale: fr }) : ''}`
              : `${item.start_year || ''} — ${item.end_year || ''}`
            }
          </span>
        </div>
        {item.description && (
          <p className="text-xs text-[#6B9980] leading-relaxed">{item.description}</p>
        )}
      </div>
    </motion.div>
  );
};

const About = () => {
  const { data: aboutData }  = useSettings('about');
  const { data: experiences } = useExperiences();
  const { data: education }   = useEducation();
  const about = aboutData?.value || {};

  return (
    <section id="about" className="section-padding relative overflow-hidden">
      {/* Orb déco */}
      <div className="absolute right-0 top-1/2 w-96 h-96 rounded-full pointer-events-none opacity-40"
        style={{ background: 'radial-gradient(circle,rgba(0,229,160,0.07) 0%,transparent 70%)' }} />

      <div className="container-custom">
        {/* Header */}
        <motion.div {...fadeIn(0)} className="mb-16">
          <div className="section-label">À propos</div>
          <h2 className="font-display font-black text-[clamp(2rem,4vw,3.5rem)] text-[#EEF5F1] leading-tight tracking-tight">
            Qui suis-<span className="text-gradient">je</span> ?
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 xl:gap-24">

          {/* ─ Gauche : bio + langues ─ */}
          <div>
            <motion.p {...fadeIn(0.1)} className="text-[0.975rem] text-[#C8DDD4] leading-[1.85] mb-8 font-light">
              {about.bio || 'Passionné du web depuis plus de 7 ans, je crée des solutions digitales complètes — du front-end soigné au back-end robuste. Basé à La Réunion, je travaille avec des clients locaux et internationaux pour transformer leurs idées en réalité numérique.'}
            </motion.p>

            {/* Infos */}
            <motion.div {...fadeIn(0.18)} className="flex flex-wrap gap-4 mb-10">
              <div className="flex items-center gap-2 text-sm text-[#6B9980]">
                <MapPin size={14} className="text-[#00E5A0]" />
                {about.location || 'Saint-Denis, La Réunion'}
              </div>
              {about.availability && (
                <div className="flex items-center gap-2 text-sm text-[#00E5A0] font-medium">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5A0] opacity-70" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00E5A0]" />
                  </span>
                  Disponible pour missions
                </div>
              )}
            </motion.div>

            {/* Langues */}
            <motion.div {...fadeIn(0.26)}>
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#6B9980] mb-5">
                <Languages size={14} className="text-[#00E5A0]" /> Langues parlées
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {languages.map(({ name, level, flag }) => (
                  <div key={name} className="glass rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base">{flag}</span>
                      <span className="text-xs font-semibold text-[#EEF5F1]">{name}</span>
                    </div>
                    <SkillBar level={level} />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ─ Droite : timeline ─ */}
          <div>
            {/* Expériences */}
            <motion.div {...fadeIn(0.1)} className="mb-8">
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#6B9980] mb-6">
                <Briefcase size={14} className="text-[#00E5A0]" /> Expériences
              </h3>
              {experiences?.length
                ? experiences.map((exp, i) => (
                    <TimelineItem key={exp.id} item={exp} isExp index={i} />
                  ))
                : /* Fallback si Supabase vide */ [
                    { id: 1, role: 'Chargé de développement informatique & digital', company: 'Synergie OI', type: 'CDI', start_date: '2021-01-01', is_current: false, end_date: '2025-01-01', description: 'Centre de formation professionnelle Qualiopi.' },
                    { id: 2, role: 'Chargé de production vidéo & Conception de site', company: 'Société privée', type: 'CDI', start_date: '2025-01-01', is_current: true, description: '' },
                    { id: 3, role: 'Auto-entrepreneur : Velt', company: 'Velt Reunion', type: 'Freelance', start_date: '2024-01-01', is_current: true, description: 'Développeur web et mobile.' },
                  ].map((exp, i) => <TimelineItem key={exp.id} item={exp} isExp index={i} />)
              }
            </motion.div>

            {/* Formation */}
            <motion.div {...fadeIn(0.2)}>
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#6B9980] mb-6">
                <GraduationCap size={14} className="text-[#00E5A0]" /> Formation
              </h3>
              {education?.length
                ? education.map((edu, i) => (
                    <TimelineItem key={edu.id} item={edu} isExp={false} index={i} />
                  ))
                : [
                    { id: 1, degree: 'BAC+3 — Chef de Projet Marketing Internet & Conception de Site', institution: 'EDN', start_year: 2019, end_year: 2020, is_alternance: true },
                    { id: 2, degree: 'BAC+2 — Développeur Intégrateur Intranet/Internet', institution: 'EDN', start_year: 2017, end_year: 2019, is_alternance: true },
                    { id: 3, degree: 'BAC Économie & Social', institution: 'Paul Moreau', start_year: 2017, end_year: 2017, is_alternance: false },
                  ].map((edu, i) => <TimelineItem key={edu.id} item={edu} isExp={false} index={i} />)
              }
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;