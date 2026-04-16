import { supabase } from '../lib/supabase';

const getSessionId = () => {
  let id = sessionStorage.getItem('velt_session_id');
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem('velt_session_id', id);
  }
  return id;
};

const getDeviceType = () => {
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
  if (/mobile|iphone|ipod|android|blackberry/i.test(ua)) return 'mobile';
  return 'desktop';
};

const getBrowser = () => {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Edg'))     return 'Edge';
  if (ua.includes('Chrome'))  return 'Chrome';
  if (ua.includes('Safari'))  return 'Safari';
  if (ua.includes('OPR'))     return 'Opera';
  return 'Other';
};

let pageEnterTime = Date.now();

export const trackPageView = async (path) => {
  try {
    pageEnterTime = Date.now();
    const sessionId = getSessionId();

    // 1. Insérer la vue de page
    await supabase.from('page_views').insert({
      path,
      referrer:    document.referrer || null,
      user_agent:  navigator.userAgent,
      device_type: getDeviceType(),
      browser:     getBrowser(),
      session_id:  sessionId,
    });

    // 2. Vérifier si la session existe — maybeSingle() ne plante pas si absent
    const { data: existing } = await supabase
      .from('visitor_sessions')
      .select('page_count')
      .eq('id', sessionId)
      .maybeSingle();          // ← fix 406 : ne throw pas si 0 résultat

    if (existing) {
      // Mise à jour de la session existante
      await supabase
        .from('visitor_sessions')
        .update({
          last_page:    path,
          page_count:   existing.page_count + 1,
          last_seen_at: new Date().toISOString(),
        })
        .eq('id', sessionId);
    } else {
      // Nouvelle session — on ignore l'erreur 409 si race condition
      const { error } = await supabase.from('visitor_sessions').insert({
        id:          sessionId,
        first_page:  path,
        last_page:   path,
        device_type: getDeviceType(),
        browser:     getBrowser(),
        referrer:    document.referrer || null,
      });

      // 409 = duplicate key (race condition), on ignore silencieusement
      if (error && error.code !== '23505') {
        console.debug('[analytics] session insert error:', error.code);
      }
    }
  } catch {
    // Analytics toujours silencieux
  }
};

export const trackPageDuration = async (path) => {
  try {
    const duration = Math.round((Date.now() - pageEnterTime) / 1000);
    if (duration < 1) return;

    const sessionId = getSessionId();
    // On met à jour la dernière vue de page pour cette session
    await supabase
      .from('page_views')
      .update({ duration_seconds: duration })
      .eq('session_id', sessionId)
      .eq('path', path)
      .order('created_at', { ascending: false })
      .limit(1);
  } catch {
    // silent
  }
};