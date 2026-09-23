import { dualInput } from '../widgets.js';

export const meta = {
  id: 5,
  title: 'אחוז החסימה ומנדטים',
  subtitle: 'הזינו את אחוז החסימה הקבוע בחוק, ואת מספר המנדטים שהוא שווה.',
  badge: 'שני מספרים',
  points: 5,
  icon: 'shield',
  media: { type: 'image', src: 'assets/images/station-05.jpg' },
  info: 'אחוז החסימה בישראל עומד על 3.25% מכלל הקולות הכשרים, השווה ל-4 מנדטים.',
  hint: 'אחוז החסימה 3.25%, ושווה 4 מנדטים.',
  explanationTitle: '3.25% = 4 מנדטים',
  explanationText: 'אחוז החסימה בישראל הוא 3.25% מהקולות הכשרים, השווה ל-4 מנדטים.',
  defaultWrongReason: 'אחת התשובות (או שתיהן) אינה מדויקת. אחוז החסימה 3.25%, שווה 4 מנדטים.',
};

export function mount(container) {
  const w = dualInput(container, 'אחוז החסימה', 'שווה כמה מנדטים?', '%', 'מנדטים');
  return {
    verify: () => {
      const { v1, v2 } = w.getValue();
      const pctOk = Math.abs(parseFloat(v1) - 3.25) < 0.05;
      const seatsOk = parseInt(v2, 10) === 4;
      return { correct: pctOk && seatsOk };
    },
  };
}
