import {
  Document, Page, View, Text, StyleSheet, Font, Link,
  Svg, Defs, LinearGradient, Stop, Rect 
} from '@react-pdf/renderer';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

/* ── Polices locales ── */
const BASE = typeof window !== 'undefined' ? window.location.origin : '';
Font.register({
  family: 'Poppins',
  fonts: [
    { src: `${BASE}/fonts/Poppins-Light.woff`,    fontWeight: 300 },
    { src: `${BASE}/fonts/Poppins-Regular.woff`,   fontWeight: 400 },
    { src: `${BASE}/fonts/Poppins-Medium.woff`,    fontWeight: 500 },
    { src: `${BASE}/fonts/Poppins-SemiBold.woff`,  fontWeight: 600 },
    { src: `${BASE}/fonts/Poppins-Bold.woff`,      fontWeight: 700 },
    { src: `${BASE}/fonts/Poppins-ExtraBold.woff`, fontWeight: 800 },
    { src: `${BASE}/fonts/Poppins-Black.woff`,     fontWeight: 900 },
  ],
});

/* ── Palette ── */
const C = {
  bg:      '#07090E',
  sidebar: '#0C1118',
  card:    '#111827',
  card2:   '#0E1520',
  emerald: '#00E5A0',
  white:   '#F0F4F0',
  muted:   '#8899A0',
  mutedDk: '#334455',
  border:  '#1A2530',
};

/* ── 6 dégradés pour les covers de projets ── */
const GRADIENTS = [
  ['#00E5A0', '#007A54'],
  ['#00B4FF', '#0044AA'],
  ['#A855F7', '#6D28D9'],
  ['#F59E0B', '#B45309'],
  ['#EF4444', '#991B1B'],
  ['#10B981', '#065F46'],
];

const s = StyleSheet.create({
  /* ─ Page 1 ─ */
  page: {
    fontFamily: 'Poppins', backgroundColor: C.bg,
    flexDirection: 'row', fontSize: 8, color: C.white,
  },
  sidebar: {
    width: '33%', backgroundColor: C.sidebar,
    borderRightWidth: 1, borderRightColor: C.border,
    padding: 15, flexDirection: 'column', gap: 10,
  },
  photoWrap: {
    width: '100%', height: 105, position: 'relative',
    overflow: 'hidden', borderRadius: 7, marginBottom: 2,
  },
  photoImg: {
    position: 'absolute', top: 0, left: 0,
    width: '100%', height: '100%',
    objectFit: 'cover', objectPosition: 'top center',
  },
  avatar: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: C.card, borderWidth: 1.5, borderColor: C.emerald,
    alignItems: 'center', justifyContent: 'center', marginBottom: 3,
  },
  avatarTxt: { color: C.emerald, fontWeight: 900, fontSize: 15, letterSpacing: 1 },
  name:      { fontSize: 13, fontWeight: 900, color: C.white, letterSpacing: -0.5, lineHeight: 1.1 },
  nameAcc:   { color: C.emerald },
  titleTxt:  { fontSize: 6.5, fontWeight: 600, color: C.emerald, textTransform: 'uppercase', letterSpacing: 1.2, marginTop: 2 },
  badge:     { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  badgeDot:  { width: 4, height: 4, borderRadius: 2, backgroundColor: C.emerald },
  badgeTxt:  { fontSize: 6, fontWeight: 600, color: C.emerald, textTransform: 'uppercase', letterSpacing: 0.8 },
  sideTitle: {
    fontSize: 6, fontWeight: 700, color: C.emerald,
    textTransform: 'uppercase', letterSpacing: 1.2,
    borderBottomWidth: 0.5, borderBottomColor: C.border,
    paddingBottom: 3, marginBottom: 4,
  },
  sideSection: { gap: 3 },
  contactRow:  { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
  contactDot:  { width: 2.5, height: 2.5, borderRadius: 1.5, backgroundColor: C.emerald, flexShrink: 0 },
  contactTxt:  { fontSize: 7, color: C.muted },
  contactLink: { fontSize: 7, color: C.emerald, textDecoration: 'none' },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 3 },
  pillEm:  { backgroundColor: `${C.emerald}18`, borderWidth: 0.5, borderColor: `${C.emerald}40`, borderRadius: 100, paddingHorizontal: 5, paddingVertical: 1.5 },
  pillEmTxt:  { fontSize: 6.5, color: C.emerald, fontWeight: 600 },
  pillNeu:    { backgroundColor: C.card, borderWidth: 0.5, borderColor: C.border, borderRadius: 100, paddingHorizontal: 5, paddingVertical: 1.5 },
  pillNeuTxt: { fontSize: 6.5, color: C.muted, fontWeight: 500 },
  langRow:    { marginBottom: 5 },
  langHead:   { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 },
  langName:   { fontSize: 7, fontWeight: 500, color: C.white },
  langStars:  { fontSize: 6.5, color: C.muted },
  langBg:     { height: 2.5, backgroundColor: C.border, borderRadius: 2 },
  langFill:   { height: 2.5, backgroundColor: C.emerald, borderRadius: 2 },
  main:       { flex: 1, padding: 15, flexDirection: 'column', gap: 10 },
  mainTitle:  {
    fontSize: 7, fontWeight: 700, color: C.emerald,
    textTransform: 'uppercase', letterSpacing: 1.2,
    borderBottomWidth: 0.5, borderBottomColor: C.border,
    paddingBottom: 3, marginBottom: 4,
  },
  card: {
    backgroundColor: C.card, borderRadius: 5,
    borderWidth: 0.5, borderColor: C.border,
    padding: 6, marginBottom: 4,
  },
  cardHead:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 1.5 },
  cardRole:    { fontSize: 8, fontWeight: 700, color: C.white, flex: 1, lineHeight: 1.3 },
  cardDate:    { fontSize: 6, color: C.emerald, fontWeight: 600, backgroundColor: `${C.emerald}15`, borderRadius: 100, paddingHorizontal: 4, paddingVertical: 1, marginLeft: 5, flexShrink: 0 },
  cardCompany: { fontSize: 7, color: C.emerald, fontWeight: 500, marginBottom: 2 },
  cardBadge:   { backgroundColor: `${C.emerald}10`, borderWidth: 0.5, borderColor: `${C.emerald}30`, borderRadius: 100, paddingHorizontal: 4, paddingVertical: 0.5, alignSelf: 'flex-start', marginBottom: 3 },
  cardBadgeTxt:{ fontSize: 5.5, color: C.emerald, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 },
  cardDesc:    { fontSize: 6.5, color: C.muted, lineHeight: 1.5 },
  skillGrid:   { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  skillCard:   { backgroundColor: C.card, borderWidth: 0.5, borderColor: C.border, borderRadius: 5, padding: 5, width: '31%' },
  skillName:   { fontSize: 6.5, fontWeight: 600, color: C.white, marginBottom: 2 },
  skillBg:     { height: 2, backgroundColor: C.border, borderRadius: 2 },
  skillFill:   { height: 2, backgroundColor: C.emerald, borderRadius: 2 },
  skillPct:    { fontSize: 6, color: C.emerald, fontWeight: 700, textAlign: 'right', marginTop: 1 },
  catLabel:    { fontSize: 6, fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3, marginTop: 2 },
  footer:      { position: 'absolute', bottom: 8, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 5 },
  footerTxt:   { fontSize: 6, color: C.mutedDk },
  footerDot:   { width: 2, height: 2, borderRadius: 1, backgroundColor: C.mutedDk },

  /* ─ Pages Projets ─ */
  projPage:    { fontFamily: 'Poppins', backgroundColor: C.bg, padding: 24, fontSize: 8, color: C.white },
  projHeader:  { flexDirection: 'row', alignItems: 'center', marginBottom: 14, paddingBottom: 8, borderBottomWidth: 0.5, borderBottomColor: C.border },
  projHDot:    { width: 7, height: 7, borderRadius: 3.5, backgroundColor: C.emerald, marginRight: 7 },
  projHName:   { fontSize: 9, fontWeight: 700, color: C.white, marginRight: 5 },
  projHTitle:  { fontSize: 6.5, color: C.muted },
  projHLine:   { flex: 1, height: 0.5, backgroundColor: C.border, marginLeft: 10 },
  projSecTitle:{ fontSize: 8.5, fontWeight: 800, color: C.white, letterSpacing: -0.3, marginBottom: 12 },
  projSecAcc:  { color: C.emerald },

  /* Grille 3 colonnes × 2 lignes = 6 par page */
  projGrid:   { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  projCard:   {
    width: '31.8%',             /* 3 colonnes avec les gaps */
    backgroundColor: C.card2,
    borderRadius: 7, borderWidth: 0.5, borderColor: C.border,
    overflow: 'hidden',
  },

  /* Cover SVG — hauteur fixe, pas de déformation */
  projCoverSvg: { width: '100%', height: 55 },

  projBody:    { padding: 7 },
  projTitle:   { fontSize: 7.5, fontWeight: 700, color: C.white, marginBottom: 2.5, lineHeight: 1.2 },
  projDesc:    { fontSize: 6.5, color: C.muted, lineHeight: 1.5, marginBottom: 5 },
  projTagRow:  { flexDirection: 'row', flexWrap: 'wrap', gap: 2, marginBottom: 3 },
  projTag:     { backgroundColor: `${C.emerald}12`, borderWidth: 0.5, borderColor: `${C.emerald}30`, borderRadius: 100, paddingHorizontal: 4, paddingVertical: 1 },
  projTagTxt:  { fontSize: 5.5, color: C.emerald, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 },
  projTechRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 2 },
  projTech:    { backgroundColor: C.card, borderWidth: 0.5, borderColor: C.border, borderRadius: 100, paddingHorizontal: 4, paddingVertical: 1 },
  projTechTxt: { fontSize: 5.5, color: C.muted, fontWeight: 500 },
  projLinks:   { flexDirection: 'row', gap: 5, marginTop: 5, paddingTop: 4, borderTopWidth: 0.5, borderTopColor: C.border },
  projLink:    { fontSize: 6, color: C.emerald, fontWeight: 600, textDecoration: 'none' },
  projLinkNeu: { fontSize: 6, color: C.muted,   fontWeight: 500, textDecoration: 'none' },
  projFooter:  { position: 'absolute', bottom: 10, left: 24, right: 24, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 5 },
});

/* ── Helpers ── */
const fmtDate  = (d, curr) => { if (curr) return "Aujourd'hui"; if (!d) return ''; try { return format(new Date(d), 'MMM yyyy', { locale: fr }); } catch { return d; } };
const truncate = (str, n) => str && str.length > n ? str.slice(0, n) + '…' : (str || '');

/* ── Photo + fondu SVG (page 1 sidebar) ── */
const { Image: PdfImage } = require('@react-pdf/renderer');
const PhotoBlock = ({ photo }) => (
  <View style={s.photoWrap}>
    <PdfImage src={photo} style={s.photoImg} />
    <Svg style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 60 }} viewBox="0 0 100 60">
      <Defs>
        <LinearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%"   stopColor={C.sidebar} stopOpacity="0" />
          <Stop offset="100%" stopColor={C.sidebar} stopOpacity="1" />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="100" height="60" fill="url(#fade)" />
    </Svg>
  </View>
);

/* ── Cover projet — SVG vectoriel, pas d'image externe ── */
const ProjCover = ({ index }) => {
  const [c1, c2] = GRADIENTS[index % GRADIENTS.length];
  const id       = `g${index}`;
  return (
    <Svg style={s.projCoverSvg} viewBox="0 0 300 55">
      <Defs>
        <LinearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%"   stopColor={c1} stopOpacity="0.3" />
          <Stop offset="100%" stopColor={c2} stopOpacity="0.5" />
        </LinearGradient>
      </Defs>
      {/* Fond sombre */}
      <Rect x="0" y="0" width="300" height="55" fill={C.card} />
      {/* Dégradé */}
      <Rect x="0" y="0" width="300" height="55" fill={`url(#${id})`} />
      {/* Bande déco bas */}
      <Rect x="0" y="48" width="300" height="7" fill={C.card2} opacity="0.6" />
      {/* Accent ligne gauche */}
      <Rect x="0" y="0" width="3" height="55" fill={c1} opacity="0.8" />
    </Svg>
  );
};

/* ── Card projet ── */
const ProjectCard = ({ project, index }) => (
  <View style={s.projCard}>
    <ProjCover index={index} />
    <View style={s.projBody}>
      <Text style={s.projTitle}>{project.title}</Text>
      {project.description
        ? <Text style={s.projDesc}>{truncate(project.description, 90)}</Text>
        : null
      }
      {project.tags?.length > 0 && (
        <View style={s.projTagRow}>
          {project.tags.slice(0, 3).map(t => (
            <View key={t} style={s.projTag}><Text style={s.projTagTxt}>{t}</Text></View>
          ))}
        </View>
      )}
      {project.tech_stack?.length > 0 && (
        <View style={s.projTechRow}>
          {project.tech_stack.slice(0, 4).map(t => (
            <View key={t} style={s.projTech}><Text style={s.projTechTxt}>{t}</Text></View>
          ))}
        </View>
      )}
      {(project.live_url || project.github_url) && (
        <View style={s.projLinks}>
          {project.live_url   && <Link src={project.live_url}   style={s.projLink}>🔗 Voir le site</Link>}
          {project.github_url && <Link src={project.github_url} style={s.projLinkNeu}>⌥ GitHub</Link>}
        </View>
      )}
    </View>
  </View>
);

const SS = ({ title, children }) => (
  <View style={s.sideSection}>
    <Text style={s.sideTitle}>{title}</Text>
    {children}
  </View>
);

const MS = ({ title, children }) => (
  <View>
    <Text style={s.mainTitle}>{title}</Text>
    {children}
  </View>
);

const ExpCard = ({ item }) => {
  const start = fmtDate(item.start_date);
  const end   = fmtDate(item.end_date, item.is_current);
  return (
    <View style={s.card}>
      <View style={s.cardHead}>
        <Text style={s.cardRole}>{item.role}</Text>
        <Text style={s.cardDate}>{start}{start && end ? ' – ' : ''}{end}</Text>
      </View>
      <Text style={s.cardCompany}>{item.company}</Text>
      {(item.type || item.is_alternance) && (
        <View style={s.cardBadge}><Text style={s.cardBadgeTxt}>{item.is_alternance ? 'Alternance' : item.type}</Text></View>
      )}
      {item.description ? <Text style={s.cardDesc}>{truncate(item.description, 130)}</Text> : null}
    </View>
  );
};

const EduCard = ({ item }) => (
  <View style={s.card}>
    <View style={s.cardHead}>
      <Text style={s.cardRole}>{item.degree}</Text>
      <Text style={s.cardDate}>{item.start_year || ''}{item.end_year ? ` – ${item.end_year}` : ''}</Text>
    </View>
    <Text style={s.cardCompany}>{item.institution}</Text>
    {item.is_alternance && <View style={s.cardBadge}><Text style={s.cardBadgeTxt}>Alternance</Text></View>}
  </View>
);

/* ════════════════════════════════════════
   DOCUMENT
════════════════════════════════════════ */
const CvDocument = ({ data }) => {
  if (!data) return null;

  const {
    name, title, location, email, phone, website,
    experiences = [], education = [], skills = [], projects = [],
    languages = [], passions = [], linkedin, github, available,
    grayscale_photo,
  } = data;

  const exps = experiences.slice(0, 4);
  const edus = education.slice(0, 3);

  const cats = skills.reduce((acc, sk) => {
    const c = sk.category || 'Autres';
    if (!acc[c]) acc[c] = [];
    if (acc[c].length < 6) acc[c].push(sk);
    return acc;
  }, {});
  const catEntries = Object.entries(cats).slice(0, 4);
  const mainStack  = [...(cats['Frontend'] || []), ...(cats['Backend'] || [])].slice(0, 8);
  const tools      = [...(cats['Design'] || []), ...(cats['Tools'] || [])].slice(0, 5);

  const parts     = name.split(' ');
  const firstName = parts.slice(0, -1).join(' ');
  const lastName  = parts.slice(-1).join('').toUpperCase();

  /* 6 projets par page */
  const PROJ_PER_PAGE = 6;
  const projPages = [];
  for (let i = 0; i < projects.length; i += PROJ_PER_PAGE) {
    projPages.push(projects.slice(i, i + PROJ_PER_PAGE));
  }

  return (
    <Document title={`CV — ${name}`} author={name}>

      {/* ══ PAGE 1 ══ */}
      <Page size="A4" style={s.page}>
        {/* Sidebar */}
        <View style={s.sidebar}>
          {grayscale_photo
            ? <PhotoBlock photo={grayscale_photo} />
            : <View style={s.avatar}><Text style={s.avatarTxt}>DT</Text></View>
          }
          <View>
            <Text style={s.name}><Text>{firstName} </Text><Text style={s.nameAcc}>{lastName}</Text></Text>
            <Text style={s.titleTxt}>{title}</Text>
            {available && <View style={s.badge}><View style={s.badgeDot} /><Text style={s.badgeTxt}>Disponible</Text></View>}
          </View>
          <SS title="Contact">
            {[
              { label: location },
              { label: phone,   href: `tel:${phone}` },
              { label: email,   href: `mailto:${email}` },
              { label: website, href: `https://${website}` },
              linkedin && { label: 'LinkedIn', href: linkedin },
              github   && { label: 'GitHub',   href: github },
            ].filter(Boolean).map((item, i) => (
              <View key={i} style={s.contactRow}>
                <View style={s.contactDot} />
                {item.href
                  ? <Link src={item.href} style={s.contactLink}>{item.label}</Link>
                  : <Text style={s.contactTxt}>{item.label}</Text>
                }
              </View>
            ))}
          </SS>
          {mainStack.length > 0 && (
            <SS title="Stack principale">
              <View style={s.pillRow}>
                {mainStack.map(sk => <View key={sk.id} style={s.pillEm}><Text style={s.pillEmTxt}>{sk.name}</Text></View>)}
              </View>
            </SS>
          )}
          {tools.length > 0 && (
            <SS title="Outils & Logiciels">
              <View style={s.pillRow}>
                {tools.map(sk => <View key={sk.id} style={s.pillNeu}><Text style={s.pillNeuTxt}>{sk.name}</Text></View>)}
              </View>
            </SS>
          )}
          <SS title="Langues">
            {languages.map(l => (
              <View key={l.name} style={s.langRow}>
                <View style={s.langHead}>
                  <Text style={s.langName}>{l.name}</Text>
                  <Text style={s.langStars}>{'★'.repeat(l.level)}{'☆'.repeat(5 - l.level)}</Text>
                </View>
                <View style={s.langBg}>
                  <View style={[s.langFill, { width: `${(l.level / 5) * 100}%` }]} />
                </View>
              </View>
            ))}
          </SS>
          {passions.length > 0 && (
            <SS title="Passions">
              <View style={s.pillRow}>
                {passions.map(p => <View key={p} style={s.pillNeu}><Text style={s.pillNeuTxt}>{p}</Text></View>)}
              </View>
            </SS>
          )}
          <View style={{ marginTop: 'auto' }}>
            <Text style={{ fontSize: 5.5, color: C.mutedDk, textAlign: 'center' }}>velt.re — DT v{new Date().getFullYear()}</Text>
          </View>
        </View>

        {/* Main */}
        <View style={s.main}>
          {edus.length > 0 && (
            <MS title="Parcours de formation">
              {edus.map(edu => <EduCard key={edu.id} item={edu} />)}
            </MS>
          )}
          {exps.length > 0 && (
            <MS title="Expériences professionnelles">
              {exps.map(exp => <ExpCard key={exp.id} item={exp} />)}
            </MS>
          )}
          {catEntries.length > 0 && (
            <MS title="Compétences & Niveaux">
              {catEntries.map(([cat, items]) => (
                <View key={cat}>
                  <Text style={s.catLabel}>{cat}</Text>
                  <View style={s.skillGrid}>
                    {items.map(sk => (
                      <View key={sk.id} style={s.skillCard}>
                        <Text style={s.skillName}>{sk.name}</Text>
                        <View style={s.skillBg}><View style={[s.skillFill, { width: `${sk.level}%` }]} /></View>
                        <Text style={s.skillPct}>{sk.level}%</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </MS>
          )}
        </View>
        <View style={s.footer} fixed>
          <Text style={s.footerTxt}>{name}</Text>
          <View style={s.footerDot} />
          <Text style={s.footerTxt}>{title}</Text>
          <View style={s.footerDot} />
          <Text style={s.footerTxt}>{email}</Text>
        </View>
      </Page>

      {/* ══ PAGES PROJETS (6 par page, 3 colonnes × 2 lignes) ══ */}
      {projPages.map((group, pageIdx) => (
        <Page key={pageIdx} size="A4" style={s.projPage}>
          {/* En-tête */}
          <View style={s.projHeader}>
            <View style={s.projHDot} />
            <Text style={s.projHName}>{name}</Text>
            <Text style={{ fontSize: 7, color: C.mutedDk }}>·</Text>
            <Text style={s.projHTitle}> {title}</Text>
            <View style={s.projHLine} />
          </View>

          {/* Titre */}
          <Text style={s.projSecTitle}>
            Projets{' '}
            <Text style={s.projSecAcc}>réalisés</Text>
            {projPages.length > 1
              ? <Text style={{ fontSize: 7, color: C.muted, fontWeight: 400 }}>  ({pageIdx + 1}/{projPages.length})</Text>
              : null
            }
          </Text>

          {/* Grille 3 colonnes */}
          <View style={s.projGrid}>
            {group.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={pageIdx * PROJ_PER_PAGE + i}
              />
            ))}
          </View>

          {/* Footer */}
          <View style={s.projFooter}>
            <Text style={s.footerTxt}>{name}</Text>
            <View style={s.footerDot} />
            <Text style={s.footerTxt}>Projets réalisés</Text>
            <View style={s.footerDot} />
            <Text style={s.footerTxt}>{website}</Text>
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default CvDocument;