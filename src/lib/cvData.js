import { useQuery } from '@tanstack/react-query';
import { supabase } from './supabase';

export const useCvData = () =>
  useQuery({
    queryKey: ['cv-data'],
    queryFn: async () => {
      const [aboutRes, socialRes, experiencesRes, educationRes, skillsRes, projectsRes] =
        await Promise.all([
          supabase.from('site_settings').select('value').eq('key', 'about').maybeSingle(),
          supabase.from('site_settings').select('value').eq('key', 'social').maybeSingle(),
          supabase.from('experiences').select('*').order('order_index'),
          supabase.from('education').select('*').order('order_index'),
          supabase.from('skills').select('*').order('order_index'),
          supabase.from('projects')
            .select('id,title,description,tags,tech_stack,featured,order_index,cover_url,live_url,github_url')
            .eq('status', 'published')
            .order('featured', { ascending: false })
            .order('order_index'),
        ]);

      const about  = aboutRes.data?.value  || {};
      const social = socialRes.data?.value || {};

      return {
        name:      'Djebarlen TAMBON',
        title:     'Développeur Web & Mobile',
        location:  about.location    || 'Saint-Denis, La Réunion',
        email:     social.email      || 'contact@velt.re',
        phone:     '+262 693 057 066',
        website:   'velt.re',
        bio:       about.bio         || '',
        available: about.availability ?? true,
        photo_url: about.photo_url   || null,

        experiences: experiencesRes.data || [],
        education:   educationRes.data   || [],
        skills:      skillsRes.data      || [],
        projects:    projectsRes.data    || [],

        languages: [
          { name: 'Créole Réunionnais', level: 5 },
          { name: 'Français',            level: 5 },
          { name: 'Anglais',             level: 3 },
          { name: 'Allemand',            level: 2 },
        ],
        passions: ['Foot', 'Musique', 'Coding', 'Jeu Vidéo', 'Automobile'],

        linkedin: social.linkedin || '',
        github:   social.github   || '',
      };
    },
    staleTime: 5 * 60 * 1000,
  });