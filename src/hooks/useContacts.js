import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export const useContacts = (status = null) =>
  useQuery({
    queryKey: ['contacts', status],
    queryFn: async () => {
      let q = supabase.from('contacts').select('*').order('created_at', { ascending: false });
      if (status) q = q.eq('status', status);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });

export const useUpdateContactStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }) => {
      const { error } = await supabase.from('contacts').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries(['contacts']),
  });
};

export const useSubmitContact = () =>
  useMutation({
    mutationFn: async (form) => {
      const { error } = await supabase.from('contacts').insert({
        ...form,
        ip_address: null,
      });
      if (error) throw error;
    },
  });