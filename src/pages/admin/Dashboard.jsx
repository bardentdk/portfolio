import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
} from 'recharts';
import {
  Eye, Users, FolderKanban, MessageSquare,
  TrendingUp, Monitor, Smartphone, Tablet,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { format, subDays, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';

/* ── Requêtes analytics ── */
const useStats = () =>
  useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [views, sessions, projects, contacts, recentViews] = await Promise.all([
        supabase.from('page_views').select('id', { count: 'exact', head: true }),
        supabase.from('visitor_sessions').select('id', { count: 'exact', head: true }),
        supabase.from('projects').select('id', { count: 'exact', head: true }),
        supabase.from('contacts').select('id', { count: 'exact', head: true }),
        // Vues des 14 derniers jours
        supabase
          .from('page_views')
          .select('created_at, path')
          .gte('created_at', subDays(new Date(), 14).toISOString())
          .order('created_at'),
      ]);

      return {
        totalViews:    views.count    || 0,
        totalSessions: sessions.count || 0,
        totalProjects: projects.count || 0,
        totalContacts: contacts.count || 0,
        recentViews:   recentViews.data || [],
      };
    },
    refetchInterval: 60_000,
  });

const useDeviceStats = () =>
  useQuery({
    queryKey: ['device-stats'],
    queryFn: async () => {
      const { data } = await supabase
        .from('visitor_sessions')
        .select('device_type');
      if (!data) return [];
      const counts = data.reduce((acc, { device_type }) => {
        const key = device_type || 'desktop';
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});
      return Object.entries(counts).map(([name, value]) => ({ name, value }));
    },
  });

const useTopPages = () =>
  useQuery({
    queryKey: ['top-pages'],
    queryFn: async () => {
      const { data } = await supabase
        .from('page_views')
        .select('path')
        .gte('created_at', subDays(new Date(), 30).toISOString());
      if (!data) return [];
      const counts = data.reduce((acc, { path }) => {
        acc[path] = (acc[path] || 0) + 1;
        return acc;
      }, {});
      return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([path, count]) => ({ path, count }));
    },
  });

const useRecentContacts = () =>
  useQuery({
    queryKey: ['recent-contacts'],
    queryFn: async () => {
      const { data } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      return data || [];
    },
  });

/* ── Helpers ── */
const buildChartData = (views) => {
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = subDays(new Date(), 13 - i);
    return {
      date:  format(d, 'd MMM', { locale: fr }),
      day:   startOfDay(d).toISOString(),
      views: 0,
    };
  });
  views.forEach(v => {
    const day = startOfDay(new Date(v.created_at)).toISOString();
    const found = days.find(d => d.day === day);
    if (found) found.views++;
  });
  return days;
};

const DEVICE_ICON = { desktop: Monitor, mobile: Smartphone, tablet: Tablet };

const customTooltipStyle = {
  background: '#0C1A13',
  border: '1px solid rgba(0,229,160,0.15)',
  borderRadius: 10,
  color: '#EEF5F1',
  fontSize: 12,
  fontFamily: 'Poppins, sans-serif',
};

/* ── StatCard ── */
const StatCard = ({ icon: Icon, label, value, sub, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: [0.19, 1, 0.22, 1] }}
    className="glass rounded-2xl p-6 hover:border-[rgba(0,229,160,0.18)] transition-all"
  >
    <div className="flex items-start justify-between mb-4">
      <div className="w-10 h-10 rounded-xl bg-[rgba(0,229,160,0.1)] flex items-center justify-center">
        <Icon size={18} className="text-[#00E5A0]" />
      </div>
      {sub !== undefined && (
        <span className="flex items-center gap-1 text-xs font-semibold text-[#00E5A0]">
          <TrendingUp size={11} /> +{sub}
        </span>
      )}
    </div>
    <div className="font-display font-black text-3xl text-[#EEF5F1] mb-1 leading-none">
      {value ?? <div className="shimmer h-8 w-16 rounded" />}
    </div>
    <div className="text-xs text-[#6B9980] font-medium">{label}</div>
  </motion.div>
);

/* ── Dashboard ── */
const Dashboard = () => {
  const { data: stats }    = useStats();
  const { data: devices }  = useDeviceStats();
  const { data: topPages } = useTopPages();
  const { data: contacts } = useRecentContacts();

  const chartData = stats?.recentViews ? buildChartData(stats.recentViews) : [];

  const statCards = [
    { icon: Eye,          label: 'Vues totales',   value: stats?.totalViews,    sub: stats?.recentViews?.length },
    { icon: Users,        label: 'Sessions',        value: stats?.totalSessions, sub: undefined },
    { icon: FolderKanban, label: 'Projets',         value: stats?.totalProjects, sub: undefined },
    { icon: MessageSquare,label: 'Messages reçus',  value: stats?.totalContacts, sub: undefined },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="font-display font-bold text-2xl text-[#EEF5F1] mb-1">Dashboard</h1>
        <p className="text-sm text-[#6B9980]">
          {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
        </p>
      </motion.div>

      {/* Stats cards */}
      <div className="stat-cards-grid">
        {statCards.map((s, i) => (
          <StatCard key={s.label} {...s} delay={i * 0.07} />
        ))}
      </div>

      {/* Charts row */}
      <div className="charts-grid">

        {/* Vues 14j */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass rounded-2xl p-6 lg:col-span-2"
        >
          <h2 className="font-display font-semibold text-sm text-[#EEF5F1] mb-5">
            Vues — 14 derniers jours
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,229,160,0.06)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: '#6B9980', fontSize: 10, fontFamily: 'Poppins' }}
                axisLine={false} tickLine={false}
              />
              <YAxis
                tick={{ fill: '#6B9980', fontSize: 10, fontFamily: 'Poppins' }}
                axisLine={false} tickLine={false} width={28}
              />
              <Tooltip
                contentStyle={customTooltipStyle}
                cursor={{ fill: 'rgba(0,229,160,0.05)' }}
                formatter={(v) => [v, 'Vues']}
              />
              <Bar dataKey="views" fill="#00E5A0" radius={[4, 4, 0, 0]} opacity={0.85} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Appareils */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.38 }}
          className="glass rounded-2xl p-6"
        >
          <h2 className="font-display font-semibold text-sm text-[#EEF5F1] mb-5">Appareils</h2>
          {devices?.length ? (
            <div className="space-y-4">
              {devices.map(({ name, value }) => {
                const Icon  = DEVICE_ICON[name] || Monitor;
                const total = devices.reduce((a, d) => a + d.value, 0);
                const pct   = total ? Math.round((value / total) * 100) : 0;
                return (
                  <div key={name}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="flex items-center gap-2 text-[#C8DDD4] font-medium capitalize">
                        <Icon size={12} className="text-[#00E5A0]" /> {name}
                      </span>
                      <span className="text-[#00E5A0] font-bold">{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-[rgba(0,229,160,0.08)] rounded-full">
                      <motion.div
                        className="h-full rounded-full bg-[#00E5A0]"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, delay: 0.5, ease: [0.19, 1, 0.22, 1] }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-xs text-[#6B9980]">
              Aucune donnée encore
            </div>
          )}
        </motion.div>
      </div>

      {/* Bottom row */}
      <div className="admin-bottom-grid">

        {/* Top pages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.44 }}
          className="glass rounded-2xl p-6"
        >
          <h2 className="font-display font-semibold text-sm text-[#EEF5F1] mb-5">
            Pages populaires — 30j
          </h2>
          {topPages?.length ? (
            <div className="space-y-3">
              {topPages.map(({ path, count }, i) => {
                const max = topPages[0]?.count || 1;
                return (
                  <div key={path} className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-[#6B9980] w-4">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-[#C8DDD4] truncate font-medium">{path}</span>
                        <span className="text-xs font-bold text-[#00E5A0] ml-2 flex-shrink-0">{count}</span>
                      </div>
                      <div className="h-1 bg-[rgba(0,229,160,0.08)] rounded-full">
                        <motion.div
                          className="h-full rounded-full bg-[rgba(0,229,160,0.5)]"
                          initial={{ width: 0 }}
                          animate={{ width: `${(count / max) * 100}%` }}
                          transition={{ duration: 0.7, delay: 0.5 + i * 0.07 }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-xs text-[#6B9980]">
              Aucune donnée encore
            </div>
          )}
        </motion.div>

        {/* Messages récents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="glass rounded-2xl p-6"
        >
          <h2 className="font-display font-semibold text-sm text-[#EEF5F1] mb-5">Messages récents</h2>
          {contacts?.length ? (
            <div className="space-y-3">
              {contacts.map(c => (
                <div key={c.id} className="flex items-start gap-3 p-3 rounded-xl bg-[rgba(0,229,160,0.04)] border border-[rgba(0,229,160,0.06)] hover:border-[rgba(0,229,160,0.12)] transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-[rgba(0,229,160,0.1)] flex items-center justify-center flex-shrink-0 text-xs font-bold text-[#00E5A0]">
                    {c.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-[#EEF5F1] truncate">{c.name}</span>
                      <span className={`flex-shrink-0 text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        c.status === 'new'
                          ? 'bg-[rgba(0,229,160,0.15)] text-[#00E5A0]'
                          : 'bg-[rgba(255,255,255,0.05)] text-[#6B9980]'
                      }`}>
                        {c.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6B9980] truncate mt-0.5">{c.message}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-xs text-[#6B9980]">
              Aucun message pour l'instant
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;