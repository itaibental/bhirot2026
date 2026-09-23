import { mcQuiz } from '../widgets.js';

export const meta = {
  id: 17,
  title: 'מה זה מצע?',
  subtitle: 'בחרו את ההגדרה המדויקת.',
  badge: 'הגדרה',
  points: 5,
  icon: 'list',
  media: { type: 'image', src: 'assets/images/station-17.jpg' },
  info: 'מצע הוא המסמך שמפרסמת מפלגה ובו תוכנית העבודה, העקרונות והבטחותיה לציבור הבוחרים.',
  hint: 'זהו מסמך "תוכנית עבודה והתחייבות" של מפלגה.',
  explanationTitle: 'מצע מפלגתי',
  explanationText: 'מסמך המציג את תוכנית העבודה, העקרונות האידיאולוגיים וההתחייבות של מפלגה לציבור הבוחרים לקראת הבחירות.',
  defaultWrongReason: 'זו אינה ההגדרה המדויקת של מצע.',
};

export function mount(container) {
  const w = mcQuiz(container, [
    { text: 'מסמך המציג את תוכנית העבודה, העקרונות וההתחייבות של מפלגה לבוחרים', correct: true },
    { text: 'רשימת השמות של כל חברי המפלגה' },
    { text: 'תקציב המדינה לשנה הקרובה' },
    { text: 'הסכם בין המפלגה לוועדת הבחירות המרכזית' },
  ]);
  return { verify: () => ({ correct: w.isCorrect() }) };
}
