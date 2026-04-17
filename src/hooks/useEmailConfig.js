import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

const KEY = 'email_config';

const DEFAULT_CONFIG = {
  to:  'contact@velt.re',
  cc:  [],
  bcc: [],
};

/** Récupère la config email depuis site_settings */
export const useEmailConfig = () =>
  useQuery({
    queryKey: ['settings', KEY],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', KEY)
        .maybeSingle();

      if (error) throw error;
      // Si pas encore de config en base, retourner les valeurs par défaut
      return data?.value ?? DEFAULT_CONFIG;
    },
    staleTime: 2 * 60 * 1000,
  });

/** Sauvegarde la config email (upsert) */
export const useSaveEmailConfig = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (config) => {
      const { error } = await supabase
        .from('site_settings')
        .upsert(
          { key: KEY, value: config, updated_at: new Date().toISOString() },
          { onConflict: 'key' }
        );
      if (error) throw error;
      return config;
    },
    onSuccess: () => qc.invalidateQueries(['settings', KEY]),
  });
};

/*
══════════════════════════════════════════════
  SQL à exécuter dans Supabase si pas déjà fait :

  INSERT INTO public.site_settings (key, value)
  VALUES (
    'email_config',
    '{"to":"contact@velt.re","cc":[],"bcc":[]}'
  )
  ON CONFLICT (key) DO NOTHING;

══════════════════════════════════════════════
*/