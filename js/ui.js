import { icon, icons } from './icons.js';
import { state } from './gameState.js';
import { sfx, isMuted, setMuted, isMusicMuted, setMusicMuted, pauseBackgroundMusic, resumeBackgroundMusic } from './audio.js';

const $ = (id) => document.getElementById(id);

/* ============ Screen switching with animated transitions ============ */
let activeScreenEl = null;

export function showScreen(id) {
  const next = $(id);
  if (!next) return;
  const prev = activeScreenEl;

  if (prev && prev !== next) {
    prev.classList.remove('enter');
    prev.classList.add('leave');
    setTimeout(() => { prev.hidden = true; prev.classList.remove('leave'); }, 260);
  }
  next.hidden = false;
  next.classList.remove('leave', 'enter');
  void next.offsetWidth;
  next.classList.add('enter');
  activeScreenEl = next;
}

/* ============ HUD ============ */
export function updateHud() {
  $('hud-score').textContent = state.score;
  const mm = String(Math.floor(state.secondsElapsed / 60)).padStart(2, '0');
  const ss = String(state.secondsElapsed % 60).padStart(2, '0');
  $('hud-timer').textContent = `${mm}:${ss}`;

  if (state.currentStationIndex >= 1 && state.currentStationIndex <= state.totalStations) {
    $('hud-progress-container').hidden = false;
    $('hud-station-title').textContent = `תחנה ${state.currentStationIndex} מתוך ${state.totalStations}`;
    $('hud-stations-left').textContent = `נותרו ${state.totalStations - state.currentStationIndex + 1}`;
    const pct = ((state.currentStationIndex - 1) / state.totalStations) * 100;
    $('hud-progress-bar').style.width = pct + '%';
  } else {
    $('hud-progress-container').hidden = true;
  }
}

export function setHudTeamName(name) {
  $('hud-team-name').textContent = name;
}

export function toggleHudStats(visible) {
  $('hud-stats').hidden = !visible;
}

export function updateStageCountdown(seconds) {
  const el = $('hud-countdown');
  const card = $('countdown-card');
  if (!el) return;
  el.textContent = seconds;
  card.classList.toggle('pulse', seconds <= 10);
}

/* ============ Audio toggle button (SFX) ============ */
export function initAudioButton() {
  const btn = $('btn-audio-toggle');
  const render = () => {
    btn.innerHTML = icon(isMuted() ? 'soundOff' : 'sound', 'icon-inline') + `<span>${isMuted() ? 'כבוי' : 'פעיל'}</span>`;
  };
  render();
  btn.addEventListener('click', () => { setMuted(!isMuted()); if (!isMuted()) sfx.select(); render(); });
}

/* ============ Music toggle button ============ */
export function initMusicButton() {
  const btn = $('btn-music-toggle');
  const render = () => {
    btn.innerHTML = icon(isMusicMuted() ? 'musicOff' : 'music', 'icon-inline') + `<span>${isMusicMuted() ? 'מוזיקה כבויה' : 'מוזיקה'}</span>`;
  };
  render();
  btn.addEventListener('click', () => { setMusicMuted(!isMusicMuted()); render(); });
}

/* ============ Generic overlay / modal ============ */
function buildModal({ tone = 'info', iconName = 'info', title, bodyHtml, noteHtml, primaryLabel, onPrimary, secondaryLabel, onSecondary }) {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.innerHTML = `
    <div class="modal-card tone-${tone}">
      <div class="modal-head">
        <span class="modal-icon ${tone}">${icons[iconName] || icons.info}</span>
        <span class="modal-head-title">${title}</span>
      </div>
      <div class="modal-body">${bodyHtml}</div>
      ${noteHtml ? `<div class="modal-note ${tone}">${noteHtml}</div>` : ''}
      <div style="display:flex; gap:8px; margin-top:14px;">
        ${secondaryLabel ? `<button class="btn btn-secondary" data-role="secondary">${secondaryLabel}</button>` : ''}
        <button class="btn ${tone === 'success' ? 'btn-primary' : 'btn-ghost-dark'}" data-role="primary">${primaryLabel}</button>
      </div>
    </div>`;
  document.getElementById('overlays-root').appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('show'));

  const close = () => {
    overlay.classList.remove('show');
    setTimeout(() => overlay.remove(), 220);
  };
  overlay.querySelector('[data-role="primary"]').addEventListener('click', () => { close(); if (onPrimary) onPrimary(); });
  const secBtn = overlay.querySelector('[data-role="secondary"]');
  if (secBtn) secBtn.addEventListener('click', () => { close(); if (onSecondary) onSecondary(); });
  return close;
}

export function showErrorModal(reason, onClose) {
  sfx.error();
  buildModal({
    tone: 'danger', iconName: 'x', title: 'הפיצוח אינו מדויק',
    bodyHtml: reason || 'הנתונים שכיילתם או סימנתם אינם תואמים לכללי הבחירות בישראל.',
    noteHtml: 'הופחתו 3 נקודות מהציון הקבוצתי.',
    primaryLabel: 'ננסה שוב', onPrimary: onClose,
  });
}

export function showSuccessModal(title, text, onClose) {
  sfx.success();
  fireConfetti(document.getElementById('overlays-root'), 22, 1.6);
  buildModal({
    tone: 'success', iconName: 'check', title: 'פיצוח מדויק!',
    bodyHtml: `<strong style="display:block;color:#071229;font-size:14px;margin-bottom:4px;">${title}</strong>${text}`,
    primaryLabel: 'המשך לתחנה הבאה', onPrimary: onClose,
  });
}

export function showHintModal(text) {
  sfx.hint();
  buildModal({
    tone: 'gold', iconName: 'bulb', title: 'רמז לחקירה',
    bodyHtml: text,
    noteHtml: 'שימוש ברמז מפחית 3 נקודות מהציון הקבוצתי.',
    primaryLabel: 'חזרה לפתרון',
  });
}

export function showInfoModal(title, bodyHtml) {
  buildModal({
    tone: 'info', iconName: 'info', title,
    bodyHtml,
    primaryLabel: 'קדימה למשימה',
  });
}

export function showTimeUpModal(onExtend) {
  buildModal({
    tone: 'gold', iconName: 'bulb', title: 'תמו 60 השניות לתחנה',
    bodyHtml: 'הזמן שהוקצב לתחנה זו הסתיים. ניתן לקבל הארכה של 60 שניות נוספות תמורת 5 נקודות.',
    noteHtml: 'עלות הארכת הזמן: 5 נקודות מהציון הקבוצתי.',
    primaryLabel: 'הארכת זמן (-5 נק׳)', onPrimary: onExtend,
  });
}

/* ============ Video popup — קופצת עם נגינה אוטומטית, נסגרת בלחיצת כפתור ============ */
export function showVideoPopup({ media, title, caption, onDismiss }) {
  pauseBackgroundMusic();
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.innerHTML = `
    <div class="modal-card video-modal">
      ${title ? `<div class="modal-head"><span class="modal-head-title">${title}</span></div>` : ''}
      <div class="video-modal-player"></div>
      ${caption ? `<p class="video-modal-caption">${caption}</p>` : ''}
      <div id="video-unmute-hint" class="video-unmute-hint" hidden>🔇 הקול כבוי בדפדפן — לחצו על הסרטון להפעלת קול</div>
      <button class="btn btn-primary" data-role="stop" style="margin-top:12px;">עצירת הסרטון והמשך</button>
    </div>`;
  document.getElementById('overlays-root').appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('show'));

  const playerWrap = overlay.querySelector('.video-modal-player');
  const unmuteHint = overlay.querySelector('#video-unmute-hint');
  let videoEl = null;

  if (media && media.type === 'youtube' && media.id) {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${media.id}?autoplay=1&mute=1&rel=0&modestbranding=1&playsinline=1`;
    iframe.title = 'YouTube video';
    iframe.frameBorder = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    playerWrap.appendChild(iframe);
    unmuteHint.hidden = false;
  } else if (media && media.type === 'video') {
    videoEl = document.createElement('video');
    videoEl.src = media.src;
    videoEl.controls = true;
    videoEl.playsInline = true;
    videoEl.autoplay = true;
    playerWrap.appendChild(videoEl);
    const attempt = videoEl.play();
    if (attempt && attempt.catch) {
      attempt.catch(() => {
        videoEl.muted = true;
        unmuteHint.hidden = false;
        videoEl.play().catch(() => {});
      });
    }
  }

  const close = () => {
    if (videoEl) videoEl.pause();
    overlay.classList.remove('show');
    setTimeout(() => overlay.remove(), 220);
    resumeBackgroundMusic();
  };
  overlay.querySelector('[data-role="stop"]').addEventListener('click', () => { close(); if (onDismiss) onDismiss(); });
  return close;
}


export function runCountdownOverlay(callback) {
  const overlay = $('countdown-overlay');
  const numEl = $('countdown-number');
  overlay.classList.add('show');
  let count = 3;
  numEl.textContent = count;
  numEl.classList.remove('pop'); void numEl.offsetWidth; numEl.classList.add('pop');
  sfx.countdownStep(0);

  const iv = setInterval(() => {
    count--;
    if (count > 0) {
      numEl.textContent = count;
      numEl.classList.remove('pop'); void numEl.offsetWidth; numEl.classList.add('pop');
      sfx.countdownStep(3 - count);
    } else if (count === 0) {
      numEl.textContent = 'צאו לדרך!';
      numEl.style.fontSize = '38px';
      sfx.countdownGo();
    } else {
      clearInterval(iv);
      numEl.style.fontSize = '';
      overlay.classList.remove('show');
      callback && callback();
    }
  }, 600);
}

/* ============ Confetti / fireworks burst ============ */
export function fireConfetti(root, count = 46, durationScale = 1) {
  const colors = ['#2f7dfb', '#4fc3ff', '#ffffff', '#e0a527', '#1447e6'];
  const target = root || document.body;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    const size = 5 + Math.random() * 6;
    p.style.width = size + 'px';
    p.style.height = size * 0.5 + 'px';
    p.style.left = Math.random() * 100 + '%';
    p.style.background = colors[i % colors.length];
    p.style.animationDuration = ((1.6 + Math.random() * 1.4) * durationScale) + 's';
    p.style.animationDelay = (Math.random() * 0.4) + 's';
    target.appendChild(p);
    setTimeout(() => p.remove(), 3400 * durationScale);
  }
}

/* ============ Media block with graceful fallback ============ */
export function buildMediaEl(media, fallbackIconName) {
  const wrap = document.createElement('div');
  wrap.className = 'station-media';
  if (media && media.type === 'video') {
    const v = document.createElement('video');
    v.src = media.src; v.autoplay = true; v.loop = true; v.muted = true; v.playsInline = true;
    v.onerror = () => { wrap.innerHTML = `<span class="media-fallback-icon">${icons[fallbackIconName] || icons.flagCheck}</span>`; };
    wrap.appendChild(v);
  } else if (media && media.type === 'youtube' && media.id) {
    wrap.classList.add('has-youtube');
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${media.id}?rel=0&modestbranding=1`;
    iframe.title = 'YouTube video';
    iframe.frameBorder = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    wrap.appendChild(iframe);
  } else if (media && media.type === 'image') {
    const img = document.createElement('img');
    img.src = media.src; img.alt = '';
    img.onerror = () => { wrap.innerHTML = `<span class="media-fallback-icon">${icons[fallbackIconName] || icons.flagCheck}</span>`; };
    wrap.appendChild(img);
  } else {
    wrap.innerHTML = `<span class="media-fallback-icon">${icons[fallbackIconName] || icons.flagCheck}</span>`;
  }
  return wrap;
}
