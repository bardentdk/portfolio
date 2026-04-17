import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, LayoutDashboard, FolderKanban, Briefcase, Wrench,
  MessageSquare, Settings, LogOut, Menu, X, ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';

const NAV = [
  { label: 'Dashboard',   href: '/admin',             icon: LayoutDashboard, end: true },
  { label: 'Projets',     href: '/admin/projects',    icon: FolderKanban },
  { label: 'Expériences', href: '/admin/experiences', icon: Briefcase },
  { label: 'Compétences', href: '/admin/skills',      icon: Wrench },
  { label: 'Messages',    href: '/admin/contacts',    icon: MessageSquare },
  { label: 'Paramètres',  href: '/admin/settings',    icon: Settings },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { signOut } = useAuth();
  const navigate    = useNavigate();

  const handleLogout = async () => { await signOut(); navigate('/admin/login'); };

  return (
    <aside className={cn(
      'admin-sidebar h-screen sticky top-0 flex flex-col transition-all duration-300 z-30',
      collapsed ? 'w-16' : 'w-60'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-[rgba(0,229,160,0.06)]">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00E5A0] to-[#007A54] flex items-center justify-center flex-shrink-0">
              <span className="font-display font-black text-[#050E0A] text-xs">DT</span>
            </div>
            <span className="font-display font-semibold text-sm text-[#EEF5F1]">Admin</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(v => !v)}
          className="p-1.5 rounded-lg text-[#6B9980] hover:text-[#EEF5F1] hover:bg-[rgba(0,229,160,0.08)] transition-all ml-auto"
        >
          {collapsed ? <Menu size={16} /> : <X size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {NAV.map(({ label, href, icon: Icon, end }) => (
          <NavLink
            key={href}
            to={href}
            end={end}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-[rgba(0,229,160,0.12)] text-[#00E5A0] border border-[rgba(0,229,160,0.15)]'
                : 'text-[#6B9980] hover:text-[#EEF5F1] hover:bg-[rgba(255,255,255,0.04)]'
            )}
          >
            <Icon size={16} className="flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-2 py-4 border-t border-[rgba(0,229,160,0.06)] space-y-1">
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-[#6B9980] hover:text-[#EEF5F1] hover:bg-[rgba(255,255,255,0.04)] transition-all"
        >
          <ExternalLink size={15} className="flex-shrink-0" />
          {!collapsed && <span>Voir le site</span>}
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-[#6B9980] hover:text-red-400 hover:bg-[rgba(255,80,50,0.06)] transition-all"
        >
          <LogOut size={15} className="flex-shrink-0" />
          {!collapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
};

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#080F0B]" style={{ cursor: 'default' }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;