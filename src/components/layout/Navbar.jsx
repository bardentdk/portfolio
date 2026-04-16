import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Download } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Accueil',     id: 'hero' },
  { label: 'À propos',   id: 'about' },
  { label: 'Projets',    id: 'projects' },
  { label: 'Compétences', id: 'skills' },
  { label: 'Contact',    id: 'contact' },
];

const scrollTo = (id) =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

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
        style={{
          position: 'fixed', top: 0, left: 0, right: 0,
          zIndex: 50,
          transition: 'all 0.5s',
          padding: scrolled ? '0.75rem 0' : '1.5rem 0',
          background: scrolled ? 'rgba(5,14,10,0.9)' : 'transparent',
          backdropFilter: scrolled ? 'blur(40px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(0,229,160,0.1)' : 'none',
        }}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
      >
        <div className="container-custom flex items-center justify-between w-full">

          {/* ─ Logo ─ */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', textDecoration: 'none' }}>
            <div style={{
              width: '2.25rem', height: '2.25rem', borderRadius: '0.75rem',
              background: 'linear-gradient(135deg, #00E5A0, #007A54)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(0,229,160,0.3)',
            }}>
              <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900, color: '#050E0A', fontSize: '0.875rem' }}>DT</span>
            </div>
            <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: '1rem', color: '#EEF5F1' }}>
              {/* Velt<span className="text-gradient">.</span>re */}
              <img src="https://velt.re/build/assets/logo-DQBvSblT.svg" alt="" className='brightness' width={100}/>
            </span>
          </Link>

          {/* ─ Desktop Nav ─ */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, id }) => (
              <button
                key={id}
                onClick={() => handleNav(id)}
                style={{
                  position: 'relative',
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  fontFamily: 'Poppins, sans-serif',
                  background: 'none',
                  border: 'none',
                  borderRadius: '100px',
                  color: active === id ? '#00E5A0' : '#6B9980',
                  cursor: 'none',
                  transition: 'color 0.3s',
                }}
                onMouseEnter={e => { if (active !== id) e.target.style.color = '#EEF5F1'; }}
                onMouseLeave={e => { if (active !== id) e.target.style.color = '#6B9980'; }}
              >
                {active === id && (
                  <motion.span
                    layoutId="pill"
                    style={{
                      position: 'absolute', inset: 0,
                      borderRadius: '100px',
                      background: 'rgba(0,229,160,0.1)',
                      border: '1px solid rgba(0,229,160,0.15)',
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span style={{ position: 'relative', zIndex: 1 }}>{label}</span>
              </button>
            ))}
          </nav>

          {/* ─ CTA desktop ─ */}
          <div className="hidden md:flex items-center gap-2">
            <a
              href="/cv-djebarlen-tambon.pdf"
              download
              className="btn-outline"
              style={{ padding: '0.5rem 1.25rem', fontSize: '0.8125rem' }}
            >
              <Download size={13} /> CV
            </a>
            <button
              onClick={() => handleNav('contact')}
              className="btn-primary"
              style={{ padding: '0.5rem 1.25rem', fontSize: '0.8125rem' }}
            >
              Discutons
            </button>
          </div>

          {/* ─ Burger mobile ─ */}
          <button
            className="md:hidden flex items-center justify-center p-2 text-[#6B9980]"
            style={{
              padding: '0.5rem', background: 'none', border: 'none',
              color: '#6B9980', cursor: 'none', alignItems: 'center', justifyContent: 'center',
            }}
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} color="#EEF5F1" /> : <Menu size={22} />}
          </button>
        </div>
      </motion.header>

      {/* ─ Menu Mobile ─ */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            style={{
              position: 'fixed', inset: 0, zIndex: 40,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: '1.75rem',
              background: 'rgba(5,14,10,0.97)',
              backdropFilter: 'blur(30px)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {NAV_LINKS.map(({ label, id }, i) => (
              <motion.button
                key={id}
                onClick={() => handleNav(id)}
                style={{
                  fontFamily: 'Poppins, sans-serif', fontWeight: 800,
                  fontSize: '2.5rem', color: 'white',
                  background: 'none', border: 'none', cursor: 'none',
                  transition: 'color 0.3s',
                }}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ delay: i * 0.07, duration: 0.45, ease: [0.19, 1, 0.22, 1] }}
                onMouseEnter={e => e.currentTarget.style.color = '#00E5A0'}
                onMouseLeave={e => e.currentTarget.style.color = 'white'}
              >
                {label}
              </motion.button>
            ))}
            <motion.button
              onClick={() => handleNav('contact')}
              className="btn-primary"
              style={{ marginTop: '1rem' }}
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