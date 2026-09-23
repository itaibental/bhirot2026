import { sfx } from '../audio.js';

export const meta = {
  id: 6,
  title: 'יום הבחירות בשבוע',
  subtitle: 'לפי חוק יסוד: הכנסת — באיזה יום בשבוע מתקיימות הבחירות?',
  badge: 'יום קבוע',
  points: 5,
  icon: 'calendar',
  media: { type: 'image', src: 'assets/images/station-06.jpg' },
  info: 'סעיף 9 לחוק יסוד: הכנסת קובע כי הבחירות מתקיימות ביום שלישי.',
  hint: 'התשובה היא יום שלישי.',
  explanationTitle: 'יום שלישי',
  explanationText: 'חוק יסוד: הכנסת קובע כי הבחירות לכנסת מתקיימות ביום שלישי.',
  defaultWrongReason: 'היום הקבוע בחוק הוא יום שלישי.',
};

const days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי'];

export function mount(container) {
  let selected = null;
  const wrap = document.createElement('div');
  wrap.className = 'widget-surface';
  wrap.innerHTML = `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;" id="days"></div>`;
  container.appendChild(wrap);

  const daysWrap = wrap.querySelector('#days');
  days.forEach((label) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'chip'; b.style.padding = '12px 6px';
    b.textContent = label;
    b.addEventListener('click', () => {
      selected = label;
      daysWrap.querySelectorAll('.chip').forEach((c) => c.classList.remove('selected'));
      b.classList.add('selected');
      sfx.select();
    });
    daysWrap.appendChild(b);
  });

  return { verify: () => ({ correct: selected === 'שלישי' }) };
}
