import { GitBranch, Link2, AtSign, Mail, Heart, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSettings } from '../../hooks/useSettings';
import CustomLogo from '../ui/CustomLogo';

const Footer = () => {
  const { data: settings } = useSettings('social');
  const social = settings?.value || {};

  const links = [
    { icon: GitBranch,    href: social.github    || null, label: 'GitHub' },
    { icon: Link2,        href: social.linkedin  || null, label: 'LinkedIn' },
    { icon: ExternalLink, href: social.facebook  || null, label: 'Facebook' },
    { icon: AtSign,       href: social.instagram || null, label: 'Instagram' },
    { icon: Mail,         href: social.email ? `mailto:${social.email}` : null, label: 'Email' },
  ].filter(l => l.href);

  const navItems = [
    { label: 'Accueil',      id: 'hero' },
    { label: 'À propos',     id: 'about' },
    { label: 'Projets',      id: 'projects' },
    { label: 'Compétences',  id: 'skills' },
    { label: 'Contact',      id: 'contact' },
  ];

  return (
    <footer className="border-t border-[rgba(0,229,160,0.08)] bg-[#080F0B] pb-10">
      <div className="container-custom py-16 relative top-20">
        <div className="grid md:grid-cols-3 gap-12 lg:gap-16">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              {/* <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00E5A0] to-[#007A54] flex items-center justify-center">
                <span className="font-display font-black text-[#050E0A] text-sm">DT</span>
              </div> */}
              <span className="font-display font-semibold text-lg text-[#EEF5F1]">
                <CustomLogo />
                {/* <img src="https://velt.re/build/assets/logo-DQBvSblT.svg" alt="" width={100}/> */}
                {/* Velt<span className="text-gradient">.</span>re */}
              </span>
            </div>
            <p className="text-sm text-[#6B9980] leading-relaxed max-w-xs">
              Développeur Web & Mobile basé à La Réunion. Je crée des expériences numériques qui font la différence.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display font-semibold text-xs text-[#EEF5F1] mb-5 uppercase tracking-widest">Navigation</h4>
            <ul className="space-y-3 list-none p-0 m-0">
              {navItems.map(({ label, id }) => (
                <li key={id}>
                  <button
                    onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-sm text-[#6B9980] hover:text-[#00E5A0] transition-colors p-0 text-left"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Réseaux */}
          <div>
            <h4 className="font-display font-semibold text-xs text-[#EEF5F1] mb-5 uppercase tracking-widest">Réseaux</h4>
            <div className="flex flex-wrap gap-3">
              {links.length > 0 ? links.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto') ? '_self' : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-xl flex items-center justify-center border border-[rgba(0,229,160,0.12)] text-[#6B9980] hover:text-[#00E5A0] hover:border-[rgba(0,229,160,0.3)] hover:bg-[rgba(0,229,160,0.06)] transition-all"
                  whileHover={{ y: -3 }}
                  transition={{ type: 'spring', stiffness: 400 }}
                  title={label}
                >
                  <Icon size={16} />
                </motion.a>
              )) : (
                <p className="text-xs text-[#2E4A3A]">Configurez vos réseaux dans l'admin</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[rgba(0,229,160,0.06)] flex flex-col sm:flex-row items-center justify-between gap-4 py-20">
          <p className="text-xs text-[#6B9980]">
            © {new Date().getFullYear()} Djebarlen Tambon — Tous droits réservés
          </p>
          <p className="text-xs text-[#6B9980] flex items-center gap-1.5">
            Fait avec <Heart size={12} className="text-[#00E5A0]" fill="currentColor" /> à La Réunion
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;