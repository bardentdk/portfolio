import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, GitBranch, ArrowRight } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import { Link } from 'react-router-dom';

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.8, delay, ease: [0.19, 1, 0.22, 1] },
});

const ProjectCard = ({ project, index }) => (
  <motion.article
    layout
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20, scale: 0.95 }}
    transition={{ duration: 0.5, delay: index * 0.06, ease: [0.19, 1, 0.22, 1] }}
    className="group relative glass rounded-2xl overflow-hidden hover:border-[rgba(0,229,160,0.2)] transition-all duration-500 hover:shadow-[0_8px_40px_rgba(0,229,160,0.08)] flex flex-col h-full"
  >
    {/* Cover */}
    <div className="relative overflow-hidden aspect-[16/9] bg-gradient-to-br from-[#0C1A13] to-[#1A2E23] flex-shrink-0">
      {project.cover_url
        ? <img
            src={project.cover_url}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        : <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display font-black text-4xl text-gradient opacity-25 select-none">
              {project.title.slice(0, 2).toUpperCase()}
            </span>
          </div>
      }
      {/* Featured badge */}
      {project.featured && (
        <div className="absolute top-3 left-3 tag">Mis en avant</div>
      )}
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-[rgba(5,14,10,0.6)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
        {project.live_url && (
          <a href={project.live_url} target="_blank" rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-[#00E5A0] flex items-center justify-center text-[#050E0A] hover:scale-110 transition-transform"
            onClick={e => e.stopPropagation()}
          >
            <ExternalLink size={16} />
          </a>
        )}
        {project.github_url && (
          <a href={project.github_url} target="_blank" rel="noopener noreferrer"
            className="w-10 h-10 rounded-full glass border border-[rgba(0,229,160,0.3)] flex items-center justify-center text-[#00E5A0] hover:scale-110 transition-transform"
            onClick={e => e.stopPropagation()}
          >
            <GitBranch size={16} />
          </a>
        )}
      </div>
    </div>

    {/* Content */}
    <div className="p-6 flex flex-col flex-grow">
      {/* Tags */}
      {project.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.slice(0, 3).map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      )}

      <h3 className="font-display font-bold text-[#EEF5F1] text-[1.1rem] mb-2 leading-tight group-hover:text-[#00E5A0] transition-colors">
        {project.title}
      </h3>
      <p className="text-sm text-[#6B9980] leading-relaxed mb-6 line-clamp-2 flex-grow">
        {project.description}
      </p>

      {/* Tech stack pills */}
      {project.tech_stack?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-5 mt-auto">
          {project.tech_stack.slice(0, 4).map(tech => (
            <span key={tech} className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[rgba(0,229,160,0.06)] text-[#6B9980] border border-[rgba(0,229,160,0.1)]">
              {tech}
            </span>
          ))}
        </div>
      )}

      <Link
        to={`/projects/${project.slug}`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[#00E5A0] hover:gap-3 transition-all duration-300 w-fit"
      >
        Voir le projet <ArrowRight size={14} />
      </Link>
    </div>
  </motion.article>
);

/* Fallback projects si Supabase vide */
const FALLBACK = [
  { id: '1', slug: 'amc-interpretariat', title: 'AMC Interprétariat', description: 'Site vitrine + admin panel complet pour un cabinet de services juridiques d\'immigration.', tags: ['Web', 'Laravel'], tech_stack: ['Laravel 12', 'InertiaJS', 'Vue 3'], featured: true, cover_url: null },
  { id: '2', slug: 'luxy-coaching', title: 'Luxy Coaching & Formation', description: 'Plateforme de formation haut de gamme avec design éditorial raffiné.', tags: ['Web', 'Design'], tech_stack: ['Laravel 12', 'Vue 3', 'InertiaJS'], featured: false, cover_url: null },
  { id: '3', slug: 'felieasy-ads', title: 'Feli\'Easy — Stratégie Ads', description: 'Stratégie publicitaire Meta Ads + Google Ads pour un produit vétérinaire 4-en-1.', tags: ['Marketing', 'Ads'], tech_stack: ['Meta Ads', 'Google Ads'], featured: false, cover_url: null },
  { id: '4', slug: 'australe-formation', title: 'Australe Formation', description: 'Site WordPress premium pour un CFA certifié Qualiopi à La Réunion.', tags: ['Web', 'WordPress'], tech_stack: ['WordPress', 'CSS'], featured: false, cover_url: null },
  { id: '5', slug: 'obd-diagnostic', title: 'OBD-II Diagnostic App', description: 'Application Electron.js de diagnostic automobile via ELM327 pour Seat Ibiza FR.', tags: ['Mobile', 'Electron'], tech_stack: ['Electron.js', 'JavaScript'], featured: false, cover_url: null },
  { id: '6', slug: 'cab-gestion', title: 'CAB Gestion — B2B Funnel', description: 'Questionnaire de qualification B2B pour externalisation de paie.', tags: ['Web', 'B2B'], tech_stack: ['Systeme.io', 'HTML/CSS'], featured: false, cover_url: null },
];

const ALL_TAGS = ['Tous', 'Web', 'Mobile', 'Design', 'Marketing', 'Laravel', 'WordPress'];

const Projects = () => {
  const { data: projects, isLoading } = useProjects();
  const [activeTag, setActiveTag] = useState('Tous');

  const data = projects?.length ? projects : FALLBACK;

  const filtered = activeTag === 'Tous'
    ? data
    : data.filter(p => p.tags?.some(t => t.toLowerCase() === activeTag.toLowerCase()));

  return (
    <section id="projects" className="section-padding relative">
      <div className="absolute left-0 top-1/2 w-80 h-80 rounded-full pointer-events-none opacity-30"
        style={{ background: 'radial-gradient(circle,rgba(0,229,160,0.07) 0%,transparent 70%)' }} />

      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <motion.div {...fadeIn(0)}>
            <div className="section-label">Projets</div>
            <h2 className="font-display font-black text-[clamp(2rem,4vw,3.5rem)] text-[#EEF5F1] leading-tight tracking-tight">
              Mes <span className="text-gradient">réalisations</span>
            </h2>
          </motion.div>

          {/* Filtres */}
          <motion.div {...fadeIn(0.1)} className="flex flex-wrap gap-2">
            {ALL_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  activeTag === tag
                    ? 'bg-[#00E5A0] text-[#050E0A]'
                    : 'glass text-[#6B9980] hover:text-[#EEF5F1] hover:border-[rgba(0,229,160,0.2)]'
                }`}
              >
                {tag}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden glass flex flex-col h-full">
                <div className="shimmer aspect-[16/9]" />
                <div className="p-6 space-y-4 flex-grow">
                  <div className="shimmer h-5 rounded w-3/4" />
                  <div className="shimmer h-4 rounded w-full" />
                  <div className="shimmer h-4 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            layout 
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full" 
            style={{position:"relative", zIndex:10}}
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Projects;