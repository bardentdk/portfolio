import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, GitBranch, Calendar, Tag } from "lucide-react";
import { useProject } from '../hooks/useProjects';
import { trackPageView } from '../utils/analytics';

const ProjectDetail = () => {
  const { slug } = useParams();
  const { data: project, isLoading } = useProject(slug);

  useEffect(() => { trackPageView(`/projects/${slug}`); }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#00E5A0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="font-display font-bold text-2xl text-[#EEF5F1]">Projet introuvable</h1>
        <Link to="/" className="btn-outline">
          <ArrowLeft size={16} /> Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      className="min-h-screen pt-28 pb-20"
    >
      <div className="container-custom max-w-4xl">
        {/* Back */}
        <Link
          to="/#projects"
          className="inline-flex items-center gap-2 text-sm text-[#6B9980] hover:text-[#00E5A0] transition-colors mb-10"
        >
          <ArrowLeft size={16} /> Tous les projets
        </Link>

        {/* Header */}
        <div className="mb-8">
          {project.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}
            </div>
          )}
          <h1 className="font-display font-black text-[clamp(2rem,5vw,4rem)] text-[#EEF5F1] leading-tight mb-4">
            {project.title}
          </h1>
          <p className="text-[#6B9980] text-lg font-light leading-relaxed">{project.description}</p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-3 mb-10">
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="btn-primary">
              <ExternalLink size={15} /> Voir le site
            </a>
          )}
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="btn-outline">
              <GitBranch size={15} /> Code source
            </a>
          )}
        </div>

        {/* Cover */}
        {project.cover_url && (
          <div className="rounded-2xl overflow-hidden mb-10 aspect-video bg-[#0C1A13]">
            <img src={project.cover_url} alt={project.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Meta */}
        <div className="grid sm:grid-cols-2 gap-5 mb-10">
          {project.tech_stack?.length > 0 && (
            <div className="glass rounded-xl p-5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#6B9980] mb-3">
                <Tag size={12} className="text-[#00E5A0]" /> Technologies
              </div>
              <div className="flex flex-wrap gap-2">
                {project.tech_stack.map(tech => (
                  <span key={tech} className="text-xs font-semibold px-3 py-1 rounded-full bg-[rgba(0,229,160,0.08)] text-[#00E5A0] border border-[rgba(0,229,160,0.15)]">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="glass rounded-xl p-5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#6B9980] mb-3">
              <Calendar size={12} className="text-[#00E5A0]" /> Informations
            </div>
            <div className="space-y-1.5 text-sm">
              {project.created_at && (
                <div className="text-[#C8DDD4]">
                  Créé le {new Date(project.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' })}
                </div>
              )}
              {project.featured && <div className="text-[#00E5A0] font-medium">⭐ Projet mis en avant</div>}
            </div>
          </div>
        </div>

        {/* Long description */}
        {project.long_description && (
          <div className="glass rounded-2xl p-8">
            <h2 className="font-display font-bold text-xl text-[#EEF5F1] mb-5">À propos du projet</h2>
            <div className="text-[#C8DDD4] leading-relaxed whitespace-pre-wrap text-sm">
              {project.long_description}
            </div>
          </div>
        )}

        {/* Image gallery */}
        {project.images?.length > 0 && (
          <div className="mt-8">
            <h2 className="font-display font-bold text-xl text-[#EEF5F1] mb-5">Galerie</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {project.images.map((img, i) => (
                <div key={i} className="rounded-xl overflow-hidden aspect-video bg-[#0C1A13]">
                  <img src={img} alt={`${project.title} ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectDetail;