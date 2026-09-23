import { yesNo } from '../widgets.js';

export const meta = {
  id: 15,
  title: 'הצבעת אסירים',
  subtitle: 'האם אסירים בבתי סוהר זכאים להצביע בבחירות לכנסת?',
  badge: 'כן / לא',
  points: 5,
  icon: 'shield',
  media: { type: 'image', src: 'assets/images/station-15.jpg' },
  info: 'זכות ההצבעה של אסירים הוכרה בבג"ץ בשנת 1984.',
  hint: 'התשובה היא כן — מאז 1984.',
  explanationTitle: 'כן, משנת 1984',
  explanationText: 'בג"ץ פסק בשנת 1984 כי גם לאסירים בבתי הסוהר עומדת הזכות הדמוקרטית להצביע.',
  defaultWrongReason: 'התשובה הנכונה היא "כן" — אסירים זכאים להצביע משנת 1984.',
};

export function mount(container) {
  const w = yesNo(container);
  return { verify: () => ({ correct: w.getValue() === 'yes' }) };
}
