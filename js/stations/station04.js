import { barChoice } from '../widgets.js';

export const meta = {
  id: 4,
  title: 'שיעור ההצבעה בבחירות הקודמות',
  subtitle: 'בחרו את העמודה הנכונה בגרף — כמה אחוזים מבעלי זכות ההצבעה הצביעו בפועל.',
  badge: 'גרף אחוזים',
  points: 5,
  icon: 'gauge',
  media: { type: 'image', src: 'assets/images/station-04.jpg' },
  info: 'בבחירות הקודמות הצביעו 70.6% מבעלי זכות הבחירה הרשומים בפנקס הבוחרים.',
  hint: 'העמודה הנכונה היא 70.6%.',
  explanationTitle: 'שיעור הצבעה: 70.6%',
  explanationText: 'בבחירות הקודמות הצביעו 70.6% מבעלי זכות הבחירה.',
  defaultWrongReason: 'העמודה שנבחרה אינה נכונה. שיעור ההצבעה היה 70.6%.',
};

export function mount(container) {
  const w = barChoice(container, [
    { label: '62.4%', value: 62.4 },
    { label: '70.6%', value: 70.6, correct: true },
    { label: '78.2%', value: 78.2 },
    { label: '50.1%', value: 50.1 },
    { label: '85.0%', value: 85.0 },
  ]);
  return { verify: () => ({ correct: w.isCorrect() }) };
}
