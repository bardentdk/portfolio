import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export const useProjects = (options = {}) =>
  useQuery({
    queryKey: ['projects', options],
    queryFn: async () => {
      let q = supabase.from('projects').select('*').order('order_index');
      if (!options.all) q = q.eq('status', 'published');
      if (options.featured) q = q.eq('featured', true);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
    staleTime: 2 * 60 * 1000,
  });

export const useProject = (slug) =>
  useQuery({
    queryKey: ['project', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects').select('*').eq('slug', slug).single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });

export const useUpsertProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (project) => {
      const { data, error } = project.id
        ? await supabase.from('projects').update({ ...project, updated_at: new Date().toISOString() }).eq('id', project.id).select().single()
        : await supabase.from('projects').insert(project).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries(['projects']),
  });
};

export const useDeleteProject = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries(['projects']),
  });
};