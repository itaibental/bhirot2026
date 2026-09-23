import { yesNo } from '../widgets.js';

export const meta = {
  id: 14,
  title: 'התמודדות בשתי רשימות',
  subtitle: 'האם מותר לאדם להתמודד לכנסת בשתי רשימות מפלגתיות שונות בו-זמנית?',
  badge: 'כן / לא',
  points: 5,
  icon: 'gavel',
  media: { type: 'image', src: 'assets/images/station-14.jpg' },
  info: 'החוק הישראלי קובע כי לכל מועמד מותר להופיע רק ברשימה מפלגתית אחת בלבד.',
  hint: 'התשובה היא לא.',
  explanationTitle: 'לא — רשימה אחת בלבד',
  explanationText: 'לכל אדם מותר להתמודד רק ברשימה מפלגתית אחת בבחירות לכנסת.',
  defaultWrongReason: 'התשובה הנכונה היא "לא" — מותר להתמודד רק ברשימה אחת.',
};

export function mount(container) {
  const w = yesNo(container);
  return { verify: () => ({ correct: w.getValue() === 'no' }) };
}
