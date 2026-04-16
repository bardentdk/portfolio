import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Download } from 'lucide-react';
import { cn } from '../../utils/cn';

const NAV_LINKS = [
  { label: 'Accueil',      id: 'hero' },
  { label: 'À propos',     id: 'about' },
  { label: 'Projets',      id: 'projects' },
  { label: 'Compétences',  id: 'skills' },
  { label: 'Contact',      id: 'contact' },
];

const scrollTo = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

const Navbar = () => {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active,     setActive]     = useState('hero');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); }),
      { threshold: 0.35 }
    );
    sections.forEach(s => io.observe(s));
    return () => io.disconnect();
  }, []);

  const handleNav = (id) => { setMobileOpen(false); scrollTo(id); };

  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 inset-x-0 z-50 transition-all duration-500',
          scrolled ? 'glass-strong py-3 shadow-[0_1px_0_rgba(0,229,160,0.08)]' : 'py-6'
        )}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
      >
        <div className="container-custom flex items-center justify-between">

          {/* ─ Logo ─ */}
          <Link to="/" className="group flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00E5A0] to-[#007A54] flex items-center justify-center shadow-[0_0_20px_rgba(0,229,160,0.3)]">
              <span className="font-display font-black text-[#050E0A] text-sm leading-none">DT</span>
            </div>
            <span className="font-display font-semibold text-base text-neutral-50 hidden sm:block tracking-tight">
              Velt<span className="text-gradient">.</span>re
            </span>
          </Link>

          {/* ─ Desktop Nav ─ */}
          <nav className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map(({ label, id }) => (
              <button
                key={id}
                onClick={() => handleNav(id)}
                className={cn(
                  'relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-full',
                  active === id ? 'text-[#00E5A0]' : 'text-[#6B9980] hover:text-[#EEF5F1]'
                )}
              >
                {active === id && (
                  <motion.span
                    layoutId="pill"
                    className="absolute inset-0 rounded-full bg-[rgba(0,229,160,0.1)] border border-[rgba(0,229,160,0.15)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
              </button>
            ))}
          </nav>

          {/* ─ CTA ─ */}
          <div className="hidden md:flex items-center gap-2">
            <a
              href="/cv-djebarlen-tambon.pdf"
              download
              className="btn-outline py-2 px-4 text-sm"
            >
              <Download size={14} /> CV
            </a>
            <button
              onClick={() => handleNav('contact')}
              className="btn-primary py-2 px-5 text-sm"
            >
              Discutons
            </button>
          </div>

          {/* ─ Burger ─ */}
          <button
            className="md:hidden p-2 text-[#6B9980] hover:text-white transition-colors"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.header>

      {/* ─ Mobile Menu ─ */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-center items-center gap-7"
            style={{ background: 'rgba(5,14,10,0.97)', backdropFilter: 'blur(30px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {NAV_LINKS.map(({ label, id }, i) => (
              <motion.button
                key={id}
                onClick={() => handleNav(id)}
                className="font-display text-4xl font-bold text-white hover:text-[#00E5A0] transition-colors"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ delay: i * 0.07, duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
              >
                {label}
              </motion.button>
            ))}
            <motion.button
              onClick={() => handleNav('contact')}
              className="btn-primary mt-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38 }}
            >
              Me contacter
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;