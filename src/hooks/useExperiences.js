import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

/* ── Experiences ── */
export const useExperiences = () =>
  useQuery({
    queryKey: ['experiences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('experiences').select('*').order('order_index');
      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });

export const useUpsertExperience = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (exp) => {
      const { data, error } = exp.id
        ? await supabase.from('experiences').update(exp).eq('id', exp.id).select().single()
        : await supabase.from('experiences').insert(exp).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries(['experiences']),
  });
};

export const useDeleteExperience = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('experiences').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries(['experiences']),
  });
};

/* ── Skills ── */
export const useSkills = () =>
  useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skills').select('*').order('order_index');
      if (error) throw error;
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });

export const useUpsertSkill = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (skill) => {
      const { data, error } = skill.id
        ? await supabase.from('skills').update(skill).eq('id', skill.id).select().single()
        : await supabase.from('skills').insert(skill).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries(['skills']),
  });
};

export const useDeleteSkill = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from('skills').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries(['skills']),
  });
};

/* ── Education ── */
export const useEducation = () =>
  useQuery({
    queryKey: ['education'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('education').select('*').order('order_index');
      if (error) throw error;
      return data;
    },
    staleTime: 10 * 60 * 1000,
  });