import { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import CustomCursor   from './components/ui/CustomCursor';
import SmoothScroll   from './components/ui/SmoothScroll';
import Navbar         from './components/layout/Navbar';
import Footer         from './components/layout/Footer';
import ProtectedRoute from './components/admin/ProtectedRoute';

/* ── Lazy loading des pages ── */
const Home           = lazy(() => import('./pages/Home'));
const ProjectDetail  = lazy(() => import('./pages/ProjectDetail'));
const NotFound       = lazy(() => import('./pages/NotFound'));
const AdminLogin     = lazy(() => import('./pages/admin/Login'));
const AdminLayout    = lazy(() => import('./components/admin/AdminLayout'));
const Dashboard      = lazy(() => import('./pages/admin/Dashboard'));
const AdminProjects  = lazy(() => import('./pages/admin/Projects'));
const AdminExp       = lazy(() => import('./pages/admin/Experiences'));
const AdminSkills    = lazy(() => import('./pages/admin/Skills'));
const AdminContacts  = lazy(() => import('./pages/admin/Contacts'));
const AdminSettings  = lazy(() => import('./pages/admin/AdminSettings'));

/* ── Spinner de chargement ── */
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-[#00E5A0] border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => {
  const location = useLocation();
  const isAdmin  = location.pathname.startsWith('/admin');

  return (
    <>
      {/* ── Couche globale portfolio (hors admin) ── */}
      {!isAdmin && (
        <>
          <div className="grain-overlay" aria-hidden="true" />
          <CustomCursor />
          <SmoothScroll />
          <Navbar />
        </>
      )}

      <Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>

            {/* ── Pages publiques ── */}
            <Route path="/"                 element={<Home />} />
            <Route path="/projects/:slug"   element={<ProjectDetail />} />

            {/* ── Auth admin ── */}
            <Route path="/admin/login"      element={<AdminLogin />} />

            {/* ── Admin protégé ── */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index                  element={<Dashboard />} />
              <Route path="projects"        element={<AdminProjects />} />
              <Route path="experiences"     element={<AdminExp />} />
              <Route path="skills"          element={<AdminSkills />} />
              <Route path="contacts"        element={<AdminContacts />} />
              <Route path="settings"        element={<AdminSettings />} />
            </Route>

            {/* ── 404 ── */}
            <Route path="*"                 element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </Suspense>

      {!isAdmin && <Footer />}
    </>
  );
};

export default App;