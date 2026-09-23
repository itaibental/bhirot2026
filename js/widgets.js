import { sfx } from './audio.js';

/**
 * כל בונה מחזיר אובייקט עם getValue() שמחזיר את מצב הבחירה הנוכחי של המשתמש.
 * הקובץ הזה קיים כדי שקבצי התחנות (js/stations/stationXX.js) יישארו קצרים —
 * הם רק מספקים תוכן (שאלה, אפשרויות, תשובה נכונה) והבונה כאן מטפל ב-DOM ובאנימציה.
 */

const letters = ['א', 'ב', 'ג', 'ד', 'ה', 'ו'];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ---------- שאלת רב-ברירה (4 אפשרויות, מעורבבות) ---------- */
/* options: [{ text, correct }] */
export function mcQuiz(container, options) {
  let selectedCorrect = null;
  const shuffled = shuffle(options);
  const wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex;flex-direction:column;gap:8px;';
  container.appendChild(wrap);

  shuffled.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'quiz-option';
    btn.innerHTML = `<span class="qletter">${letters[idx]}</span><span>${opt.text}</span>`;
    btn.addEventListener('click', () => {
      selectedCorrect = !!opt.correct;
      wrap.querySelectorAll('.quiz-option').forEach((b) => b.classList.remove('selected-mc'));
      btn.classList.add('selected-mc');
      sfx.select();
    });
    wrap.appendChild(btn);
  });

  return { isCorrect: () => selectedCorrect === true, hasAnswer: () => selectedCorrect !== null };
}

/* ---------- כן / לא ---------- */
export function yesNo(container) {
  let value = null;
  const wrap = document.createElement('div');
  wrap.className = 'widget-surface';
  wrap.style.cssText = 'display:flex;gap:10px;';
  wrap.innerHTML = `
    <button type="button" class="chip" style="flex:1;padding:16px;font-size:15px;" data-v="yes">כן</button>
    <button type="button" class="chip" style="flex:1;padding:16px;font-size:15px;" data-v="no">לא</button>`;
  container.appendChild(wrap);
  wrap.querySelectorAll('[data-v]').forEach((btn) => {
    btn.addEventListener('click', () => {
      value = btn.dataset.v;
      wrap.querySelectorAll('[data-v]').forEach((b) => b.classList.remove('selected'));
      btn.classList.add('selected');
      sfx.select();
    });
  });
  return { getValue: () => value };
}

/* ---------- קלט תאריך (יום / חודש / שנה) ---------- */
export function dateInput(container) {
  const wrap = document.createElement('div');
  wrap.className = 'widget-surface';
  wrap.style.cssText = 'display:flex;gap:8px;';
  wrap.innerHTML = `
    <div style="flex:1;">
      <label class="field-label" style="text-align:center;display:block;">יום</label>
      <input type="number" min="1" max="31" id="dd" class="field-input" style="text-align:center;" placeholder="DD">
    </div>
    <div style="flex:1;">
      <label class="field-label" style="text-align:center;display:block;">חודש</label>
      <input type="number" min="1" max="12" id="mm" class="field-input" style="text-align:center;" placeholder="MM">
    </div>
    <div style="flex:1;">
      <label class="field-label" style="text-align:center;display:block;">שנה</label>
      <input type="number" min="0" max="9999" id="yy" class="field-input" style="text-align:center;" placeholder="YYYY">
    </div>`;
  container.appendChild(wrap);
  wrap.querySelectorAll('input').forEach((inp) => inp.addEventListener('input', () => sfx.tick()));
  return {
    getValue: () => ({
      d: parseInt(wrap.querySelector('#dd').value, 10),
      m: parseInt(wrap.querySelector('#mm').value, 10),
      y: parseInt(wrap.querySelector('#yy').value, 10),
    }),
  };
}

/* ---------- שני קלטי מספר/טקסט זה לצד זה ---------- */
export function dualInput(container, label1, label2, suffix1 = '', suffix2 = '') {
  const wrap = document.createElement('div');
  wrap.className = 'widget-surface';
  wrap.style.cssText = 'display:flex;flex-direction:column;gap:12px;';
  wrap.innerHTML = `
    <div>
      <label class="field-label">${label1}</label>
      <div style="display:flex;align-items:center;gap:6px;">
        <input type="text" inputmode="decimal" id="v1" class="field-input" style="text-align:center;">
        ${suffix1 ? `<span style="font-weight:800;color:var(--ink-600);font-size:13px;">${suffix1}</span>` : ''}
      </div>
    </div>
    <div>
      <label class="field-label">${label2}</label>
      <div style="display:flex;align-items:center;gap:6px;">
        <input type="text" inputmode="decimal" id="v2" class="field-input" style="text-align:center;">
        ${suffix2 ? `<span style="font-weight:800;color:var(--ink-600);font-size:13px;">${suffix2}</span>` : ''}
      </div>
    </div>`;
  container.appendChild(wrap);
  wrap.querySelectorAll('input').forEach((inp) => inp.addEventListener('input', () => sfx.tick()));
  return {
    getValue: () => ({
      v1: wrap.querySelector('#v1').value.trim().replace(',', '.'),
      v2: wrap.querySelector('#v2').value.trim().replace(',', '.'),
    }),
  };
}

/* ---------- גרירה על ציר מספרים (0..max) ---------- */
export function dragNumberLine(container, max, unit = '') {
  let val = 0;
  const wrap = document.createElement('div');
  wrap.className = 'widget-surface';
  wrap.style.textAlign = 'center';
  wrap.innerHTML = `
    <div class="readout" style="margin-bottom:12px;"><span id="dl-val">0</span>${unit ? `<small>${unit}</small>` : ''}</div>
    <input type="range" id="dl-slider" min="0" max="${max}" value="0">
    <div style="display:flex;justify-content:space-between;font-size:10.5px;font-weight:800;color:var(--ink-400);margin-top:4px;">
      <span>0</span><span>${max}</span>
    </div>`;
  container.appendChild(wrap);
  const slider = wrap.querySelector('#dl-slider');
  slider.addEventListener('input', () => {
    val = parseInt(slider.value, 10);
    wrap.querySelector('#dl-val').textContent = val;
    sfx.tick();
  });
  return { getValue: () => val };
}

/* ---------- גלגל מזל צבעוני (SVG, גוררים כדי לסובב) ---------- */
const WHEEL_COLORS = ['#e0384c', '#e0a527', '#f2c14e', '#0f9d6b', '#0284c7', '#1447e6', '#7c3aed', '#d6249f'];

function polarPoint(cx, cy, r, angleDeg) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export function colorWheel(container, min, max) {
  const count = max - min + 1;
  const wedgeAngle = 360 / count;
  const R = 148, CX = 150, CY = 150;

  const wrap = document.createElement('div');
  wrap.className = 'widget-surface';
  wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:10px;';
  wrap.innerHTML = `
    <span style="font-size:11px;font-weight:800;color:var(--ink-600);">גררו את הגלגל כדי לסובב אותו — עצרו על המספר הנכון</span>
    <div class="color-wheel-frame">
      <div class="color-wheel-pointer"></div>
      <svg viewBox="0 0 300 300" class="color-wheel-svg" id="cw-svg"></svg>
    </div>
    <div class="readout"><span id="cw-val">${min}</span></div>`;
  container.appendChild(wrap);

  const svg = wrap.querySelector('#cw-svg');
  const ns = 'http://www.w3.org/2000/svg';
  const g = document.createElementNS(ns, 'g');
  g.setAttribute('id', 'cw-group');
  svg.appendChild(g);

  for (let i = 0; i < count; i++) {
    const startA = i * wedgeAngle;
    const endA = (i + 1) * wedgeAngle;
    const p1 = polarPoint(CX, CY, R, startA);
    const p2 = polarPoint(CX, CY, R, endA);
    const largeArc = wedgeAngle > 180 ? 1 : 0;
    const path = document.createElementNS(ns, 'path');
    path.setAttribute('d', `M${CX},${CY} L${p1.x.toFixed(2)},${p1.y.toFixed(2)} A${R},${R} 0 ${largeArc} 1 ${p2.x.toFixed(2)},${p2.y.toFixed(2)} Z`);
    path.setAttribute('fill', WHEEL_COLORS[i % WHEEL_COLORS.length]);
    path.setAttribute('stroke', 'rgba(255,255,255,.55)');
    path.setAttribute('stroke-width', '1');
    g.appendChild(path);

    const mid = startA + wedgeAngle / 2;
    const labelPt = polarPoint(CX, CY, R * 0.8, mid);
    const text = document.createElementNS(ns, 'text');
    text.setAttribute('x', labelPt.x.toFixed(2));
    text.setAttribute('y', labelPt.y.toFixed(2));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('transform', `rotate(${mid.toFixed(2)}, ${labelPt.x.toFixed(2)}, ${labelPt.y.toFixed(2)})`);
    text.setAttribute('font-size', count > 40 ? '9' : '12');
    text.setAttribute('font-weight', '800');
    text.setAttribute('fill', '#ffffff');
    text.textContent = min + i;
    g.appendChild(text);
  }

  const hub = document.createElementNS(ns, 'circle');
  hub.setAttribute('cx', CX); hub.setAttribute('cy', CY); hub.setAttribute('r', 16);
  hub.setAttribute('fill', '#ffffff'); hub.setAttribute('stroke', 'var(--blue-700)'); hub.setAttribute('stroke-width', '3');
  g.appendChild(hub);

  let rotation = 0;
  let dragging = false;
  let lastAngle = 0;

  function currentIndex() {
    const norm = ((-rotation % 360) + 360) % 360;
    return Math.floor(norm / wedgeAngle) % count;
  }
  function updateReadout() {
    const n = min + currentIndex();
    wrap.querySelector('#cw-val').textContent = n;
    return n;
  }
  function applyTransform() {
    g.setAttribute('transform', `rotate(${rotation}, ${CX}, ${CY})`);
  }

  function pointerAngle(clientX, clientY) {
    const rect = svg.getBoundingClientRect();
    const dx = clientX - (rect.left + rect.width / 2);
    const dy = clientY - (rect.top + rect.height / 2);
    return (Math.atan2(dx, -dy) * 180 / Math.PI + 360) % 360;
  }

  function snapToCenter() {
    const idx = currentIndex();
    const desiredCenter = idx * wedgeAngle + wedgeAngle / 2;
    const curMod = ((rotation % 360) + 360) % 360;
    const targetMod = ((-desiredCenter % 360) + 360) % 360;
    let diff = targetMod - curMod;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    g.style.transition = 'transform .25s cubic-bezier(.16,1,.3,1)';
    rotation += diff;
    applyTransform();
    setTimeout(() => { g.style.transition = ''; }, 260);
    updateReadout();
  }

  svg.style.touchAction = 'none';
  svg.addEventListener('pointerdown', (e) => {
    dragging = true;
    svg.setPointerCapture(e.pointerId);
    lastAngle = pointerAngle(e.clientX, e.clientY);
    g.style.transition = '';
  });
  svg.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const ang = pointerAngle(e.clientX, e.clientY);
    let delta = ang - lastAngle;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    rotation += delta;
    lastAngle = ang;
    applyTransform();
    const n = updateReadout();
    if (n !== updateReadout.lastN) { sfx.tick(); updateReadout.lastN = n; }
  });
  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    try { svg.releasePointerCapture(e.pointerId); } catch (err) { /* noop */ }
    snapToCenter();
  }
  svg.addEventListener('pointerup', endDrag);
  svg.addEventListener('pointercancel', endDrag);

  updateReadout();
  return { getValue: () => min + currentIndex() };
}

/* ---------- גלגל מספרים מסתובב — גרסה ישנה מבוססת גלילה (נשמר לתאימות) ---------- */
export function spinWheel(container, min, max) {
  const ITEM_H = 46;
  const wrap = document.createElement('div');
  wrap.className = 'widget-surface';
  wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:8px;';
  wrap.innerHTML = `
    <span style="font-size:11px;font-weight:800;color:var(--ink-600);">גללו את הגלגל עד שהמספר הנכון ייעצר במרכז</span>
    <div style="position:relative;width:120px;height:${ITEM_H * 3}px;overflow:hidden;border-radius:16px;background:var(--white);border:1.5px solid var(--line);">
      <div style="position:absolute;top:${ITEM_H}px;left:0;right:0;height:${ITEM_H}px;border-top:2px solid var(--blue-700);border-bottom:2px solid var(--blue-700);background:var(--ice-100);pointer-events:none;z-index:2;"></div>
      <div id="wheel-scroll" style="height:100%;overflow-y:scroll;scroll-snap-type:y mandatory;">
        <div style="height:${ITEM_H}px;"></div>
        <div id="wheel-items"></div>
        <div style="height:${ITEM_H}px;"></div>
      </div>
    </div>`;
  container.appendChild(wrap);

  const itemsWrap = wrap.querySelector('#wheel-items');
  for (let n = min; n <= max; n++) {
    const it = document.createElement('div');
    it.style.cssText = `height:${ITEM_H}px;display:flex;align-items:center;justify-content:center;font-family:'JetBrains Mono',monospace;font-weight:800;font-size:20px;color:var(--ink-900);scroll-snap-align:center;`;
    it.textContent = n;
    itemsWrap.appendChild(it);
  }

  const scroller = wrap.querySelector('#wheel-scroll');
  let current = min;
  let tickTimeout = null;
  scroller.addEventListener('scroll', () => {
    const idx = Math.round(scroller.scrollTop / ITEM_H);
    const n = min + idx;
    if (n !== current) { current = n; clearTimeout(tickTimeout); tickTimeout = setTimeout(() => sfx.tick(), 40); }
  });

  return { getValue: () => current };
}

/* ---------- בחירת עמודה בגרף אחוזים ---------- */
/* options: [{ label, value, correct }] — value קובע את גובה העמודה, correct מסמן את התשובה */
export function barChoice(container, options) {
  let selectedCorrect = null;
  const shuffled = shuffle(options);
  const maxVal = Math.max(...shuffled.map((o) => o.value));
  const wrap = document.createElement('div');
  wrap.className = 'widget-surface';
  wrap.style.cssText = 'display:flex;align-items:flex-end;justify-content:space-around;gap:8px;height:150px;';
  container.appendChild(wrap);

  shuffled.forEach((opt) => {
    const col = document.createElement('button');
    col.type = 'button';
    col.style.cssText = `flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;background:none;border:none;cursor:pointer;font-family:inherit;`;
    const barH = Math.max(14, (opt.value / maxVal) * 100);
    col.innerHTML = `
      <span style="font-size:10.5px;font-weight:800;color:var(--ink-600);margin-bottom:4px;">${opt.label}</span>
      <div class="bar-fill" style="width:70%;height:${barH}%;border-radius:8px 8px 3px 3px;background:var(--line);transition:background .15s;"></div>`;
    col.addEventListener('click', () => {
      selectedCorrect = !!opt.correct;
      wrap.querySelectorAll('.bar-fill').forEach((b) => { b.style.background = 'var(--line)'; });
      col.querySelector('.bar-fill').style.background = 'linear-gradient(180deg, var(--sky-400), var(--blue-700))';
      sfx.select();
    });
    wrap.appendChild(col);
  });

  return { isCorrect: () => selectedCorrect === true };
}

/* ---------- בחירה מרובה (checkboxes) ---------- */
/* items: [{ label, correct }] — התשובה נכונה כשכל וכל-רק הפריטים המסומנים כ-correct מסומנים */
export function multiSelect(container, items) {
  const checked = new Array(items.length).fill(false);
  const grid = document.createElement('div');
  grid.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:8px;';
  container.appendChild(grid);

  items.forEach((item, i) => {
    const card = document.createElement('label');
    card.className = 'check-card';
    card.innerHTML = `<input type="checkbox"><span class="ct">${item.label}</span>`;
    const input = card.querySelector('input');
    input.addEventListener('change', () => {
      checked[i] = input.checked;
      card.classList.toggle('selected', input.checked);
      sfx.toggle();
    });
    grid.appendChild(card);
  });

  return { isCorrect: () => items.every((item, i) => !!item.correct === checked[i]) };
}

/* ---------- השלמת אותיות (מילים עם תאים לכל אות) ---------- */
export function lettersFill(container, words) {
  const wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex;flex-direction:column;gap:14px;align-items:center;';
  container.appendChild(wrap);

  const allInputs = [];
  words.forEach((word) => {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:6px;direction:rtl;';
    for (let i = 0; i < word.length; i++) {
      const inp = document.createElement('input');
      inp.type = 'text'; inp.maxLength = 2;
      inp.className = 'field-input';
      inp.style.cssText = 'width:38px;height:44px;text-align:center;padding:0;font-size:18px;font-weight:800;';
      row.appendChild(inp);
      allInputs.push(inp);
    }
    wrap.appendChild(row);
  });

  allInputs.forEach((inp, i) => {
    inp.addEventListener('input', () => {
      sfx.tick();
      if (inp.value && i < allInputs.length - 1) allInputs[i + 1].focus();
    });
  });

  return {
    getValue: () => {
      let out = [];
      let cursor = 0;
      words.forEach((word) => {
        let w = '';
        for (let i = 0; i < word.length; i++) w += (allInputs[cursor + i].value || '').trim();
        out.push(w);
        cursor += word.length;
      });
      return out;
    },
  };
}
