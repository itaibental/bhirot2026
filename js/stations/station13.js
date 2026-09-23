import { mcQuiz } from '../widgets.js';

export const meta = {
  id: 13,
  title: 'מפלגות מתחת לאחוז החסימה',
  subtitle: 'מה קורה לקולות של מפלגות שלא עוברות את אחוז החסימה?',
  badge: 'הגדרה',
  points: 5,
  icon: 'sort',
  media: { type: 'image', src: 'assets/images/station-13.jpg' },
  info: 'קולות שניתנו למפלגה שלא עברה את אחוז החסימה נפסלים ואינם נספרים לחלוקת המנדטים — הם "הולכים לאיבוד".',
  hint: 'הקולות נפסלים ו"הולכים לאיבוד".',
  explanationTitle: 'הקולות הולכים לאיבוד',
  explanationText: 'קולות של מפלגות שלא עברו את אחוז החסימה נפסלים ואינם משפיעים על חלוקת המנדטים.',
  defaultWrongReason: 'התשובה הנכונה: הקולות נפסלים ו"הולכים לאיבוד".',
};

export function mount(container) {
  const w = mcQuiz(container, [
    { text: 'הקולות נפסלים ו"הולכים לאיבוד"', correct: true },
    { text: 'הקולות מחולקים בין כל שאר המפלגות באופן שווה' },
    { text: 'הקולות עוברים אוטומטית למפלגה הגדולה ביותר' },
    { text: 'עורכים בחירות חוזרות רק לאותה מפלגה' },
  ]);
  return { verify: () => ({ correct: w.isCorrect() }) };
}
