import { supabase } from '../lib/supabase';

// Génère ou récupère un session ID
const getSessionId = () => {
  let id = sessionStorage.getItem('velt_session_id');
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem('velt_session_id', id);
  }
  return id;
};

// Détecte le type d'appareil
const getDeviceType = () => {
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
  if (/mobile|iphone|ipod|android|blackberry|mini|windows\sce|palm/i.test(ua)) return 'mobile';
  return 'desktop';
};

// Détecte le navigateur
const getBrowser = () => {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
  return 'Other';
};

let pageEnterTime = Date.now();

// Track une vue de page
export const trackPageView = async (path) => {
  try {
    pageEnterTime = Date.now();
    const sessionId = getSessionId();

    const viewData = {
      path,
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
      device_type: getDeviceType(),
      browser: getBrowser(),
      session_id: sessionId,
    };

    await supabase.from('page_views').insert(viewData);

    // Upsert session
    const { data: existingSession } = await supabase
      .from('visitor_sessions')
      .select('page_count')
      .eq('id', sessionId)
      .single();

    if (existingSession) {
      await supabase
        .from('visitor_sessions')
        .update({ last_page: path, page_count: existingSession.page_count + 1, last_seen_at: new Date().toISOString() })
        .eq('id', sessionId);
    } else {
      await supabase.from('visitor_sessions').insert({
        id: sessionId,
        first_page: path,
        last_page: path,
        device_type: getDeviceType(),
        browser: getBrowser(),
        referrer: document.referrer || null,
      });
    }
  } catch (e) {
    // Analytics silently fail
  }
};

// Track durée passée sur la page avant de quitter
export const trackPageDuration = async (path) => {
  try {
    const duration = Math.round((Date.now() - pageEnterTime) / 1000);
    if (duration < 1) return;

    const sessionId = getSessionId();
    await supabase
      .from('page_views')
      .update({ duration_seconds: duration })
      .eq('session_id', sessionId)
      .eq('path', path)
      .order('created_at', { ascending: false })
      .limit(1);
  } catch (e) {
    // silent
  }
};