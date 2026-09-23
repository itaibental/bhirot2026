import { dragNumberLine } from '../widgets.js';

export const meta = {
  id: 2,
  title: 'חיבור גילאי הבחירה',
  subtitle: 'גררו את המחוון לסכום הגיל שממנו אזרח יכול להצביע והגיל שבו ניתן להתמודד בבחירות.',
  badge: 'חיבור',
  points: 5,
  icon: 'scale',
  media: { type: 'image', src: 'assets/images/station-02.jpg' },
  info: 'הזכות להצביע ניתנת מגיל 18, והזכות להתמודד לכנסת ניתנת מגיל 21. גררו את המחוון לסכום שלהם.',
  hint: 'חברו 18 (גיל הצבעה) + 21 (גיל התמודדות).',
  explanationTitle: 'הסכום הוא 39',
  explanationText: 'גיל 18 לזכות ההצבעה, וגיל 21 לזכות ההתמודדות — יחד 39.',
  defaultWrongReason: 'הסכום אינו נכון. גררו את המחוון שוב.',
};

export function mount(container) {
  const w = dragNumberLine(container, 60);
  return { verify: () => ({ correct: w.getValue() === 39 }) };
}
