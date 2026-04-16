import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Hero     from '../components/sections/Hero';
import About    from '../components/sections/About';
import Projects from '../components/sections/Projects';
import Skills   from '../components/sections/Skills';
import Contact  from '../components/sections/Contact';
import { trackPageView, trackPageDuration } from '../utils/analytics';

const Home = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    trackPageView(pathname);
    return () => trackPageDuration(pathname);
  }, [pathname]);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Contact />
    </motion.main>
  );
};

export default Home;