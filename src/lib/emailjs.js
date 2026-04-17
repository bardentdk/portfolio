import emailjs from '@emailjs/browser';

const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TPL_OWNER   = import.meta.env.VITE_EMAILJS_TEMPLATE_OWNER;
const TPL_CONFIRM = import.meta.env.VITE_EMAILJS_TEMPLATE_CONFIRM;

emailjs.init({ publicKey: PUBLIC_KEY });

/**
 * Notification au propriétaire.
 * to_email = ton adresse (champ "To Email" du template EmailJS).
 */
export const sendOwnerNotification = (form, emailConfig = {}) => {
  const params = {
    to_email:    emailConfig.to || 'contact@velt.re', // ← destinataire propriétaire
    from_name:   form.name,
    from_email:  form.email,
    subject:     form.subject || '(Sans sujet)',
    message:     form.message,
    received_at: new Date().toLocaleString('fr-FR', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }),
  };

  console.debug('[EmailJS] owner → to:', params.to_email);
  return emailjs.send(SERVICE_ID, TPL_OWNER, params);
};

/**
 * Confirmation au visiteur.
 * to_email = email du visiteur (champ "To Email" du template EmailJS).
 */
export const sendConfirmation = (form) => {
  const params = {
    to_email:    form.email,  // ← destinataire visiteur
    to_name:     form.name,
    message:     form.message,
    owner_email: 'contact@velt.re',
    owner_phone: '+262 693 057 066',
  };

  console.debug('[EmailJS] confirm → to:', params.to_email);
  return emailjs.send(SERVICE_ID, TPL_CONFIRM, params);
};

export default emailjs;