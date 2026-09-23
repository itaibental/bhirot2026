import { dateInput } from '../widgets.js';

export const meta = {
  id: 1,
  title: 'מהו תאריך הבחירות?',
  subtitle: 'הזינו את היום, החודש והשנה המדויקים שבהם מתקיימות הבחירות לכנסת ה-26.',
  badge: 'תאריך',
  points: 5,
  icon: 'calendar',
  media: { type: 'image', src: 'assets/images/station-01.jpg' },
  info: 'מועד הבחירות לכנסת ה-26 נקבע ליום שלישי, 27 באוקטובר 2026.',
  hint: 'התאריך הוא 27.10.2026 — עשרים ושבעה באוקטובר.',
  explanationTitle: '27.10.2026',
  explanationText: 'הבחירות לכנסת ה-26 נקבעו ליום שלישי, 27 באוקטובר 2026.',
  defaultWrongReason: 'התאריך אינו מדויק. נסו שוב — יום, חודש ושנה.',
};

export function mount(container) {
  const w = dateInput(container);
  return {
    verify: () => {
      const { d, m, y } = w.getValue();
      const yearOk = y === 26 || y === 2026;
      return { correct: d === 27 && m === 10 && yearOk };
    },
  };
}
