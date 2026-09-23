// מנוע סאונד: אם יש קבצי שמע אמיתיים בתיקייה assets/audio/ הם ינוגנו קודם.
// אם קובץ חסר/לא נטען — נופלים אוטומטית לגרסה סינתטית משופרת (לא עוד "ביפים" פשוטים):
// אנוולופים (ADSR), רעש מסונן לקליקים פרקוסיביים, אקורדים, וזנב ריברב אלגוריתמי קצר.

let ctx = null;
let sfxMuted = false;
let musicMuted = false;
let reverbBuffer = null;

function ensureCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) ctx = new AC();
  }
  if (ctx && ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export function setMuted(v) { sfxMuted = v; }
export function isMuted() { return sfxMuted; }

export function setMusicMuted(v) {
  musicMuted = v;
  if (bgUsingRealFile && musicPool.bg) {
    if (musicMuted) musicPool.bg.pause();
    else musicPool.bg.play().catch(() => {});
  }
}
export function isMusicMuted() { return musicMuted; }

/* ============================================================
   שלב 1: קבצי שמע אמיתיים (אופציונלי)
   שימו קובץ עם השם המתאים בתוך assets/audio/ — הוא ינוגן אוטומטית
   במקום הסאונד הסינתטי. שמות הקבצים המצופים:
   click.mp3, select.mp3, toggle.mp3, success.mp3, error.mp3,
   hint.mp3, unlock.mp3, victory.mp3, tick.mp3, countdown-step.mp3, countdown-go.mp3
   ============================================================ */
const REAL_FILES = {
  tick: 'assets/audio/tick.mp3',
  select: 'assets/audio/select.mp3',
  toggle: 'assets/audio/toggle.mp3',
  success: 'assets/audio/success.mp3',
  error: 'assets/audio/error.mp3',
  hint: 'assets/audio/hint.mp3',
  unlock: 'assets/audio/unlock.mp3',
  victory: 'assets/audio/victory.mp3',
  countdownStep: 'assets/audio/countdown-step.mp3',
  countdownGo: 'assets/audio/countdown-go.mp3',
};

const availability = {}; // key -> true/false/undefined (עדיין בבדיקה)
const audioPool = {};    // key -> HTMLAudioElement מוכן לשכפול מהיר

Object.entries(REAL_FILES).forEach(([key, path]) => {
  fetch(path, { method: 'GET', cache: 'force-cache' })
    .then((res) => {
      if (!res.ok) throw new Error('missing');
      availability[key] = true;
      const el = new Audio(path);
      el.preload = 'auto';
      audioPool[key] = el;
    })
    .catch(() => { availability[key] = false; });
});

function playReal(key, volume = 1) {
  const base = audioPool[key];
  if (!base) return false;
  try {
    const node = base.cloneNode(true); // מאפשר נגינות חופפות (לחיצות מהירות)
    node.volume = volume;
    node.play().catch(() => {});
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * מנסה לנגן קובץ אמיתי; אם אין/עדיין לא אושר — מפעיל את פונקציית ה-fallback הסינתטית.
 */
function playSfx(key, synthFallback, volume = 1) {
  if (sfxMuted) return;
  if (availability[key] && playReal(key, volume)) return;
  synthFallback();
}

/* ============================================================
   שלב 2: מנוע סינתזה עשיר (fallback) — אנוולופים, רעש, ריברב קצר
   ============================================================ */

function getReverbBuffer(c) {
  if (reverbBuffer) return reverbBuffer;
  const len = c.sampleRate * 1.1;
  const buf = c.createBuffer(2, len, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
  }
  reverbBuffer = buf;
  return buf;
}

function makeReverbSend(c, wetLevel = 0.18) {
  const conv = c.createConvolver();
  conv.buffer = getReverbBuffer(c);
  const wet = c.createGain();
  wet.gain.value = wetLevel;
  conv.connect(wet).connect(c.destination);
  return conv;
}

/** טון בודד עם אנוולופ ADSR אמיתי + פילטר לואו-פס לחום, ואפשרות שליחה לריברב */
function envTone(c, { freq, start = 0, attack = 0.008, decay = 0.09, sustain = 0.55, sustainTime = 0.03, release = 0.16, gain = 0.11, type = 'sine', detune = 0, filterFreq = 3200, reverb = false }) {
  const t0 = c.currentTime + start;
  const osc = c.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (detune) osc.detune.setValueAtTime(detune, t0);

  const filt = c.createBiquadFilter();
  filt.type = 'lowpass';
  filt.frequency.setValueAtTime(filterFreq, t0);

  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + attack);
  g.gain.exponentialRampToValueAtTime(Math.max(gain * sustain, 0.0001), t0 + attack + decay);
  g.gain.setValueAtTime(Math.max(gain * sustain, 0.0001), t0 + attack + decay + sustainTime);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + attack + decay + sustainTime + release);

  osc.connect(filt).connect(g).connect(c.destination);
  if (reverb) g.connect(makeReverbSend(c));

  osc.start(t0);
  osc.stop(t0 + attack + decay + sustainTime + release + 0.05);
}

/** קליק/טיק פרקוסיבי מבוסס רעש מסונן — נשמע כמו קליק ממשי, לא צפצוף */
function noiseClick(c, { start = 0, duration = 0.045, filterFreq = 2600, gain = 0.16, filterType = 'bandpass', q = 1.1 } = {}) {
  const t0 = c.currentTime + start;
  const bufSize = Math.max(1, Math.floor(c.sampleRate * duration));
  const buf = c.createBuffer(1, bufSize, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufSize);

  const src = c.createBufferSource();
  src.buffer = buf;

  const filt = c.createBiquadFilter();
  filt.type = filterType;
  filt.frequency.setValueAtTime(filterFreq, t0);
  filt.Q.value = q;

  const g = c.createGain();
  g.gain.setValueAtTime(gain, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

  src.connect(filt).connect(g).connect(c.destination);
  src.start(t0);
}

/** צליל "שגיאה" — שני אוסצילטורים מפוזרים מעט (Beating) לתחושת באזר אמיתי, פחות טון נקי */
function errorBuzz(c) {
  const t0 = c.currentTime;
  [0, -12].forEach((detune, i) => {
    const osc = c.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, t0);
    osc.frequency.exponentialRampToValueAtTime(95, t0 + 0.32);
    osc.detune.setValueAtTime(detune, t0);

    const filt = c.createBiquadFilter();
    filt.type = 'lowpass';
    filt.frequency.setValueAtTime(900, t0);

    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(i === 0 ? 0.1 : 0.06, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.38);

    osc.connect(filt).connect(g).connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + 0.4);
  });
  noiseClick(c, { start: 0, duration: 0.03, filterFreq: 1200, gain: 0.08, filterType: 'lowpass' });
}

/** אקורד קצר (טריאדה) לתחושת "הצלחה" מוזיקלית ולא ביפ בודד */
function chord(c, freqs, { start = 0, stagger = 0.03, type = 'triangle', gain = 0.085, reverb = true } = {}) {
  freqs.forEach((f, i) => {
    envTone(c, { freq: f, start: start + i * stagger, attack: 0.006, decay: 0.14, sustain: 0.4, sustainTime: 0.05, release: 0.32, gain, type, filterFreq: 4200, reverb });
  });
}

const sfxImpl = {
  tick: (c) => noiseClick(c, { duration: 0.02, filterFreq: 4200, gain: 0.05, filterType: 'highpass', q: 0.8 }),
  select: (c) => {
    noiseClick(c, { duration: 0.025, filterFreq: 3000, gain: 0.09, filterType: 'bandpass' });
    envTone(c, { freq: 660, start: 0.005, attack: 0.004, decay: 0.06, sustain: 0.3, sustainTime: 0, release: 0.08, gain: 0.05, type: 'triangle', filterFreq: 5200 });
  },
  toggle: (c) => {
    noiseClick(c, { duration: 0.02, filterFreq: 2200, gain: 0.08, filterType: 'bandpass' });
    envTone(c, { freq: 520, attack: 0.003, decay: 0.05, sustain: 0.3, sustainTime: 0, release: 0.07, gain: 0.06, type: 'sine' });
  },
  success: (c) => chord(c, [523.25, 659.25, 783.99, 1046.5], { stagger: 0.07, type: 'triangle', gain: 0.09, reverb: true }),
  error: (c) => errorBuzz(c),
  hint: (c) => {
    envTone(c, { freq: 880, attack: 0.01, decay: 0.1, sustain: 0.5, sustainTime: 0.05, release: 0.35, gain: 0.08, type: 'sine', reverb: true });
    envTone(c, { freq: 1318.5, start: 0.05, attack: 0.008, decay: 0.09, sustain: 0.4, sustainTime: 0.03, release: 0.3, gain: 0.05, type: 'sine', reverb: true });
  },
  countdownStep: (c, i = 0) => {
    noiseClick(c, { duration: 0.03, filterFreq: 3200, gain: 0.1, filterType: 'bandpass' });
    envTone(c, { freq: 420 + i * 90, attack: 0.004, decay: 0.08, sustain: 0.3, sustainTime: 0, release: 0.12, gain: 0.08, type: 'triangle' });
  },
  countdownGo: (c) => chord(c, [660, 990], { stagger: 0.02, type: 'triangle', gain: 0.1, reverb: true }),
  unlock: (c) => {
    const t0 = c.currentTime;
    const osc = c.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(340, t0);
    osc.frequency.exponentialRampToValueAtTime(920, t0 + 0.22);
    const filt = c.createBiquadFilter();
    filt.type = 'lowpass'; filt.frequency.setValueAtTime(3800, t0);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(0.09, t0 + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.3);
    osc.connect(filt).connect(g).connect(c.destination);
    g.connect(makeReverbSend(c, 0.22));
    osc.start(t0); osc.stop(t0 + 0.32);
    chord(c, [880, 1318.5], { start: 0.14, stagger: 0.03, type: 'sine', gain: 0.06, reverb: true });
  },
  victory: (c) => {
    chord(c, [523.25, 659.25, 783.99], { start: 0, stagger: 0.09, type: 'triangle', gain: 0.09, reverb: true });
    chord(c, [659.25, 830.61, 987.77, 1318.5], { start: 0.34, stagger: 0.07, type: 'triangle', gain: 0.1, reverb: true });
  },
};

function callSynth(name, arg) {
  const c = ensureCtx();
  if (!c) return;
  try { sfxImpl[name](c, arg); } catch (e) { /* noop */ }
}

export const sfx = {
  tick: () => playSfx('tick', () => callSynth('tick'), 0.5),
  select: () => playSfx('select', () => callSynth('select'), 0.6),
  toggle: () => playSfx('toggle', () => callSynth('toggle'), 0.6),
  success: () => playSfx('success', () => callSynth('success'), 0.7),
  error: () => playSfx('error', () => callSynth('error'), 0.7),
  hint: () => playSfx('hint', () => callSynth('hint'), 0.6),
  countdownStep: (i) => playSfx('countdownStep', () => callSynth('countdownStep', i), 0.6),
  countdownGo: () => playSfx('countdownGo', () => callSynth('countdownGo'), 0.7),
  unlock: () => playSfx('unlock', () => callSynth('unlock'), 0.7),
  victory: () => playSfx('victory', () => callSynth('victory'), 0.8),
};

/* ============================================================
   מוזיקת רקע ומוזיקת ניצחון
   אם יש קבצים אמיתיים ב-assets/audio/bg-music.mp3 ו/או victory-music.mp3 — הם ינוגנו.
   אחרת: לולאת רקע שמחה וקצבית ומעבר-ניצחון גדול, שניהם מיוצרים על-ידי המנוע (Web Audio),
   בסגנון פרוגרסיית אקורדים מז'ורית עם ארפג'יו וקליק קצבי — לא רק "צליל אחד".
   ============================================================ */
const MUSIC_FILES = {
  bg: 'assets/audio/bg-music.mp3',
  victory: 'assets/audio/victory-music.mp3',
};
const musicAvailable = {};
const musicPool = {};
Object.entries(MUSIC_FILES).forEach(([key, path]) => {
  fetch(path, { method: 'GET', cache: 'force-cache' })
    .then((res) => {
      if (!res.ok) throw new Error('missing');
      musicAvailable[key] = true;
      const el = new Audio(path);
      el.preload = 'auto';
      el.loop = key === 'bg';
      musicPool[key] = el;
    })
    .catch(() => { musicAvailable[key] = false; });
});

// פרוגרסיית אקורדים בת 8 תיבות (במקום 4) כדי שהלולאה תישמע פחות חוזרת על עצמה:
// I - V - vi - iii - IV - I - ii - V  (C - G - Am - Em - F - C - Dm - G)
const BG_PROGRESSION = [
  [261.63, 329.63, 392.0],   // C
  [392.0, 493.88, 587.33],   // G
  [220.0, 261.63, 329.63],   // Am
  [329.63, 392.0, 493.88],   // Em
  [349.23, 440.0, 523.25],   // F
  [261.63, 329.63, 392.0],   // C
  [293.66, 349.23, 440.0],   // Dm
  [392.0, 493.88, 587.33],   // G
];
const BG_BPM = 108;
const BG_BEAT = 60 / BG_BPM;
const BG_BAR = BG_BEAT * 4;

// כמה "צורות" ארפג'יו שונות שמתחלפות מתיבה לתיבה, כדי שלא יישמע אותו דבר כל פעם
const ARP_PATTERNS = [
  [0, 1, 2, 3, 2, 1, 0, 1],
  [0, 2, 1, 3, 1, 2, 0, 2],
  [2, 1, 0, 1, 2, 3, 2, 1],
  [0, 1, 2, 1, 3, 2, 1, 0],
];

let bgChordIdx = 0;
let bgInterval = null;
let bgUsingRealFile = false;

function playGenerativeBar(c) {
  if (musicMuted) return;
  const barsInCycle = BG_PROGRESSION.length;
  const chordNotes = BG_PROGRESSION[bgChordIdx % barsInCycle];
  const cycleNum = Math.floor(bgChordIdx / barsInCycle);

  // בס: לסירוגין תיבה עם שורש מתמשך ותיבה עם שורש+חמישית פועמים, לגיוון קצבי
  if (bgChordIdx % 2 === 0) {
    envTone(c, { freq: chordNotes[0] / 2, start: 0, attack: 0.02, decay: 0.15, sustain: 0.5, sustainTime: BG_BAR - 0.35, release: 0.2, gain: 0.045, type: 'sine', filterFreq: 600 });
  } else {
    envTone(c, { freq: chordNotes[0] / 2, start: 0, attack: 0.015, decay: 0.12, sustain: 0.4, sustainTime: 0, release: 0.1, gain: 0.045, type: 'sine', filterFreq: 600 });
    envTone(c, { freq: chordNotes[2] / 2, start: BG_BEAT * 2, attack: 0.015, decay: 0.12, sustain: 0.4, sustainTime: 0, release: 0.15, gain: 0.038, type: 'sine', filterFreq: 600 });
  }

  // ארפג'יו: הצורה מתחלפת בכל תיבה, כך שהלולאה לא נשמעת זהה כל הזמן
  const pattern = ARP_PATTERNS[bgChordIdx % ARP_PATTERNS.length];
  const arpNotes = pattern.map((i) => (i < 3 ? chordNotes[i] : chordNotes[0] * 2));
  const step = BG_BAR / 8;
  arpNotes.forEach((f, i) => {
    envTone(c, { freq: f, start: i * step, attack: 0.005, decay: 0.06, sustain: 0.3, sustainTime: 0, release: 0.08, gain: 0.028, type: 'triangle', filterFreq: 3600 });
  });

  // כל 3 מחזורים (24 תיבות), מלודיית "עוקב" קצרה וקלילה בטימבר בהיר יותר, כדי לשבור את החזרתיות
  if (cycleNum % 3 === 2 && bgChordIdx % barsInCycle === 0) {
    [chordNotes[2] * 2, chordNotes[1] * 2, chordNotes[0] * 2].forEach((f, i) => {
      envTone(c, { freq: f, start: i * BG_BEAT, attack: 0.008, decay: 0.1, sustain: 0.4, sustainTime: 0.04, release: 0.2, gain: 0.04, type: 'sine', filterFreq: 5200, reverb: true });
    });
  }

  for (let b = 0; b < 4; b++) {
    noiseClick(c, { start: b * BG_BEAT, duration: 0.018, filterFreq: 5200, gain: 0.02, filterType: 'highpass', q: 0.7 });
  }
}

function startGenerativeBg() {
  const c = ensureCtx();
  if (!c || bgInterval) return;
  bgChordIdx = 0;
  playGenerativeBar(c);
  bgChordIdx++;
  bgInterval = setInterval(() => {
    const cc = ensureCtx();
    if (!cc) return;
    playGenerativeBar(cc);
    bgChordIdx++;
  }, BG_BAR * 1000);
}

function stopGenerativeBg() {
  clearInterval(bgInterval);
  bgInterval = null;
}

export function startBackgroundMusic() {
  if (musicAvailable.bg && musicPool.bg) {
    bgUsingRealFile = true;
    musicPool.bg.volume = 0.35;
    if (!musicMuted) musicPool.bg.play().catch(() => {});
    return;
  }
  bgUsingRealFile = false;
  startGenerativeBg();
}

export function stopBackgroundMusic() {
  if (bgUsingRealFile && musicPool.bg) { musicPool.bg.pause(); musicPool.bg.currentTime = 0; }
  stopGenerativeBg();
}

export function pauseBackgroundMusic() {
  if (bgUsingRealFile && musicPool.bg) musicPool.bg.pause();
}

export function resumeBackgroundMusic() {
  if (musicMuted) return;
  if (bgUsingRealFile && musicPool.bg) musicPool.bg.play().catch(() => {});
}

export function playVictoryMusic() {
  stopBackgroundMusic();
  if (musicMuted) return;
  if (musicAvailable.victory && musicPool.victory) {
    musicPool.victory.volume = 0.65;
    musicPool.victory.currentTime = 0;
    musicPool.victory.play().catch(() => {});
    return;
  }
  const c = ensureCtx();
  if (!c) return;
  chord(c, [523.25, 659.25, 783.99], { start: 0, stagger: 0.08, type: 'triangle', gain: 0.09, reverb: true });
  chord(c, [659.25, 830.61, 987.77, 1318.5], { start: 0.36, stagger: 0.06, type: 'triangle', gain: 0.1, reverb: true });
  chord(c, [783.99, 987.77, 1174.66, 1567.98], { start: 0.74, stagger: 0.05, type: 'triangle', gain: 0.11, reverb: true });
}

/**
 * הדפדפן חוסם נגינת סאונד אוטומטית לפני אינטראקציה כלשהי של המשתמש בעמוד.
 * הפונקציה הזו "מפעילה" את מנוע הסאונד ברגע הלחיצה/הקשה הראשונה בעמוד — כדי שמוזיקת
 * הרקע (שכבר הותחלה קודם) תהיה נשמעת בפועל בהקדם האפשרי.
 */
export function armAutoplayUnlock() {
  const unlock = () => {
    ensureCtx();
    if (bgUsingRealFile && musicPool.bg && !musicMuted && musicPool.bg.paused) {
      musicPool.bg.play().catch(() => {});
    }
    document.removeEventListener('pointerdown', unlock);
    document.removeEventListener('keydown', unlock);
  };
  document.addEventListener('pointerdown', unlock, { once: true });
  document.addEventListener('keydown', unlock, { once: true });
}
