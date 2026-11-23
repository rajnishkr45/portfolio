const STORAGE_KEY = 'deadline-studio-state-v1';

/**
 * Helper: returns a `YYYY-MM-DDTHH:MM` string offset by `daysOffset` from now.
 */
function offsetDateTime(daysOffset, hour = 9, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  d.setHours(hour, minute, 0, 0);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/**
 * Helper: formats a short milestone date like "Dec 04" offset from today.
 */
function offsetShortDate(daysOffset) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
}

/**
 * 5 Distinct Visual Lock Screen Templates
 */
export const TEMPLATES = [
  {
    id: 'mission-control',
    name: 'Mission Control',
    sub: 'Dark telemetry & grid',
    isLightWallpaper: false,
  },
  {
    id: 'boarding-pass',
    name: 'Boarding Pass',
    sub: 'Minimalist flight ticket',
    isLightWallpaper: false,
  },
  {
    id: 'editorial',
    name: 'Editorial Poster',
    sub: 'Warm paper & serif',
    isLightWallpaper: true,
  },
  {
    id: 'frosted',
    name: 'Frosted Depth',
    sub: 'Aurora mesh & glass',
    isLightWallpaper: false,
  },
  {
    id: 'terminal',
    name: 'Terminal / Dev',
    sub: 'CLI & git milestones',
    isLightWallpaper: false,
  },
];

/**
 * 4 Ready-to-Use Demo Presets (each paired with a matching visual style)
 */
export const PRESETS = [
  {
    id: 'offer-sprint',
    name: 'Offer Sprint',
    sub: 'Placement & interview prep',
    data: () => ({
      template: 'mission-control',
      title: 'Offer Sprint',
      subtitle: 'FINAL INTERVIEW COUNTDOWN',
      tag: 'BATCH 2026',
      startDate: offsetDateTime(-10, 0, 0),
      targetDate: offsetDateTime(21, 9, 0),
      milestones: [
        { id: 1, text: 'Core DSA & Patterns', date: offsetShortDate(-5), status: 'done' },
        { id: 2, text: 'System Design & DBMS', date: offsetShortDate(4), status: 'active' },
        { id: 3, text: '3 Full Mock Rounds', date: offsetShortDate(14), status: 'upcoming' },
        { id: 4, text: 'Final Interview Day', date: offsetShortDate(21), status: 'upcoming' },
      ],
    }),
  },
  {
    id: 'product-launch',
    name: 'Product Launch',
    sub: 'App v2.0 public release',
    data: () => ({
      template: 'boarding-pass',
      title: 'Launch v2.0',
      subtitle: 'PUBLIC RELEASE FLIGHT',
      tag: 'FLT-204',
      startDate: offsetDateTime(-14, 0, 0),
      targetDate: offsetDateTime(12, 18, 0),
      milestones: [
        { id: 1, text: 'Core UI & Payments Live', date: offsetShortDate(-7), status: 'done' },
        { id: 2, text: 'Closed Beta Feedback', date: offsetShortDate(2), status: 'active' },
        { id: 3, text: 'Landing Page & Demo', date: offsetShortDate(8), status: 'upcoming' },
        { id: 4, text: 'Public Launch Day', date: offsetShortDate(12), status: 'upcoming' },
      ],
    }),
  },
  {
    id: 'habit-sprint',
    name: '30-Day Deep Work',
    sub: 'Editorial habit challenge',
    data: () => ({
      template: 'editorial',
      title: '30-Day Deep Work',
      subtitle: 'NO DISTRACTIONS EDITION',
      tag: 'VOL. 04',
      startDate: offsetDateTime(-12, 6, 0),
      targetDate: offsetDateTime(18, 21, 0),
      milestones: [
        { id: 1, text: 'Audit Phone & Notifications', date: offsetShortDate(-10), status: 'done' },
        { id: 2, text: '2 Hours Daily Focus Block', date: offsetShortDate(0), status: 'active' },
        { id: 3, text: 'Ship Portfolio Case Study', date: offsetShortDate(10), status: 'upcoming' },
        { id: 4, text: '30-Day Review & Reset', date: offsetShortDate(18), status: 'upcoming' },
      ],
    }),
  },
  {
    id: 'hackathon-ship',
    name: 'Hackathon Ship',
    sub: '48-hour build & pitch',
    data: () => ({
      template: 'terminal',
      title: 'ship --prod',
      subtitle: 'HACKATHON FINALS',
      tag: 'v1.0.0-rc',
      startDate: offsetDateTime(-1, 10, 0),
      targetDate: offsetDateTime(2, 17, 0),
      milestones: [
        { id: 1, text: 'feat: lock architecture', date: offsetShortDate(-1), status: 'done' },
        { id: 2, text: 'feat: wire core API', date: offsetShortDate(0), status: 'active' },
        { id: 3, text: 'polish: UI & edge cases', date: offsetShortDate(1), status: 'upcoming' },
        { id: 4, text: 'release: 3-min live demo', date: offsetShortDate(2), status: 'upcoming' },
      ],
    }),
  },
];

export function createDefaultState() {
  return {
    device: 'mobile',
    showOsOverlay: true,
    ...PRESETS[0].data(),
  };
}

export function loadState() {
  // 1. Check URL hash first (supports shared links)
  try {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#s=')) {
      const encoded = hash.slice(3);
      const json = decodeURIComponent(escape(atob(encoded)));
      const parsed = JSON.parse(json);
      if (parsed && parsed.title && Array.isArray(parsed.milestones)) {
        return { ...createDefaultState(), ...parsed };
      }
    }
  } catch (err) {
    console.warn('Could not parse shared URL state:', err);
  }

  // 2. Check localStorage
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.title && Array.isArray(parsed.milestones)) {
        return { ...createDefaultState(), ...parsed };
      }
    }
  } catch (err) {
    console.warn('Could not load saved state:', err);
  }

  // 3. Default preset
  return createDefaultState();
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('Could not save state to localStorage:', err);
  }
}

export function encodeStateToUrl(state) {
  const payload = {
    template: state.template,
    device: state.device,
    title: state.title,
    subtitle: state.subtitle,
    tag: state.tag,
    startDate: state.startDate,
    targetDate: state.targetDate,
    milestones: state.milestones,
  };
  const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
  const baseUrl = `${window.location.origin}${window.location.pathname}`;
  return `${baseUrl}#s=${encoded}`;
}