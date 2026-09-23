import { multiSelect } from '../widgets.js';

export const meta = {
  id: 8,
  title: 'מהם קולות פסולים?',
  subtitle: 'סמנו את כל הסיבות שבגללן קול נפסל בספירה (יותר מתשובה אחת).',
  badge: 'בחירה מרובה',
  points: 5,
  icon: 'sort',
  media: { type: 'image', src: 'assets/images/station-08.jpg' },
  info: 'קול נפסל כאשר המעטפה אינה תקינה, כשהפתק ריק, או כשיש על הפתק קשקוש וסימון מזהה.',
  hint: 'שלוש התשובות הנכונות: מעטפה לא תקינה, פתק ריק, פתק עם קשקוש.',
  explanationTitle: 'קולות פסולים',
  explanationText: 'קול נפסל כאשר המעטפה לא תקינה, הפתק ריק, או שיש עליו קשקוש או סימון מזהה.',
  defaultWrongReason: 'הסימון אינו מדויק. הקולות הפסולים הם: מעטפה לא תקינה, פתק ריק, ופתק עם קשקוש.',
};

export function mount(container) {
  const w = multiSelect(container, [
    { label: 'מעטפה לא תקינה', correct: true },
    { label: 'פתק ריק', correct: true },
    { label: 'פתק עם קשקוש', correct: true },
    { label: 'פתק מפלגה תקין בתוך מעטפה סגורה', correct: false },
  ]);
  return { verify: () => ({ correct: w.isCorrect() }) };
}
