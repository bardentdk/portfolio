import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;

/*
══════════════════════════════════════════════
  SUPABASE SQL SCHEMA — à exécuter dans l'éditeur SQL Supabase
══════════════════════════════════════════════

-- PROJECTS
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  description text,
  long_description text,
  cover_url text,
  images text[] default '{}',
  tags text[] default '{}',
  tech_stack text[] default '{}',
  live_url text,
  github_url text,
  featured boolean default false,
  order_index int default 0,
  status text default 'published', -- draft | published
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- EXPERIENCES
create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  type text default 'Salarié', -- Salarié | Alternance | Freelance | Auto-entrepreneur
  start_date date not null,
  end_date date,
  is_current boolean default false,
  description text,
  logo_url text,
  order_index int default 0,
  created_at timestamptz default now()
);

-- EDUCATION
create table public.education (
  id uuid primary key default gen_random_uuid(),
  institution text not null,
  degree text not null,
  field text,
  start_year int,
  end_year int,
  logo_url text,
  is_alternance boolean default false,
  order_index int default 0,
  created_at timestamptz default now()
);

-- SKILLS
create table public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null, -- Frontend | Backend | Tools | Design | Mobile
  icon_url text,
  level int default 80, -- percentage
  order_index int default 0
);

-- CONTACTS
create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  status text default 'new', -- new | read | replied | archived
  ip_address text,
  created_at timestamptz default now()
);

-- SITE SETTINGS (key-value store pour le CMS)
create table public.site_settings (
  key text primary key,
  value jsonb,
  updated_at timestamptz default now()
);

-- Insert default settings
insert into public.site_settings (key, value) values
  ('hero', '{"headline":"Développeur Web & Mobile","subheadline":"Je conçois des expériences numériques qui marient performance et esthétique.","cta_primary":"Voir mes projets","cta_secondary":"Me contacter"}'),
  ('about', '{"bio":"Passionné du web depuis plus de 7 ans, je crée des solutions digitales complètes — du front-end soigné au back-end robuste. Basé à La Réunion, je travaille avec des clients locaux et internationaux.","location":"Saint-Denis, La Réunion","availability":true}'),
  ('social', '{"github":"","linkedin":"https://linkedin.com","facebook":"","instagram":"","email":"contact@velt.re"}'),
  ('seo', '{"title":"Djebarlen Tambon — Développeur Web & Mobile","description":"Portfolio de Djebarlen Tambon, développeur web et mobile basé à La Réunion.","og_image":""}');

-- PAGE VIEWS (analytics maison)
create table public.page_views (
  id bigserial primary key,
  path text not null,
  referrer text,
  user_agent text,
  country text,
  city text,
  device_type text, -- desktop | mobile | tablet
  browser text,
  session_id text,
  duration_seconds int,
  created_at timestamptz default now()
);

-- VISITOR SESSIONS
create table public.visitor_sessions (
  id text primary key, -- session UUID généré côté client
  first_page text,
  last_page text,
  page_count int default 1,
  device_type text,
  browser text,
  country text,
  city text,
  referrer text,
  started_at timestamptz default now(),
  last_seen_at timestamptz default now()
);

-- RLS POLICIES
alter table public.projects enable row level security;
alter table public.experiences enable row level security;
alter table public.education enable row level security;
alter table public.skills enable row level security;
alter table public.contacts enable row level security;
alter table public.site_settings enable row level security;
alter table public.page_views enable row level security;
alter table public.visitor_sessions enable row level security;

-- Public read access
create policy "Public can read published projects" on public.projects for select using (status = 'published');
create policy "Public can read experiences" on public.experiences for select using (true);
create policy "Public can read education" on public.education for select using (true);
create policy "Public can read skills" on public.skills for select using (true);
create policy "Public can read settings" on public.site_settings for select using (true);

-- Public insert for contacts and analytics
create policy "Public can insert contacts" on public.contacts for insert with check (true);
create policy "Public can insert page views" on public.page_views for insert with check (true);
create policy "Public can insert sessions" on public.visitor_sessions for insert with check (true);
create policy "Public can update sessions" on public.visitor_sessions for update using (true);

-- Authenticated (admin) full access
create policy "Admins full access projects" on public.projects for all using (auth.role() = 'authenticated');
create policy "Admins full access experiences" on public.experiences for all using (auth.role() = 'authenticated');
create policy "Admins full access education" on public.education for all using (auth.role() = 'authenticated');
create policy "Admins full access skills" on public.skills for all using (auth.role() = 'authenticated');
create policy "Admins full access contacts" on public.contacts for all using (auth.role() = 'authenticated');
create policy "Admins full access settings" on public.site_settings for all using (auth.role() = 'authenticated');
create policy "Admins full access page_views" on public.page_views for all using (auth.role() = 'authenticated');
create policy "Admins full access sessions" on public.visitor_sessions for all using (auth.role() = 'authenticated');

══════════════════════════════════════════════
*/