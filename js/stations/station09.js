import { mcQuiz } from '../widgets.js';

export const meta = {
  id: 9,
  title: 'מהו פתק לבן?',
  subtitle: 'בחרו את ההגדרה המדויקת של הפתק הלבן ומטרותיו.',
  badge: 'הגדרה',
  points: 5,
  icon: 'envelope',
  media: { type: 'image', src: 'assets/images/station-09.jpg' },
  info: 'פתק לבן חלק משמש לשתי מטרות: הבעת מחאה ואי-שביעות רצון מהמתמודדים, ופתק גיבוי אם פתק המפלגה הרצוי לא נמצא בקלפי.',
  hint: 'שתי מטרות: מחאה, ופתק גיבוי לכתיבת שם המפלגה ביד.',
  explanationTitle: 'שני תפקידי הפתק הלבן',
  explanationText: 'פתק לבן חלק משמש להבעת מחאה ואי-שביעות רצון מהמתמודדים, וכפתק גיבוי אם פתק המפלגה הרצוי לא נמצא בקלפי (ניתן לכתוב את אותיות המפלגה).',
  defaultWrongReason: 'זו אינה ההגדרה המדויקת של הפתק הלבן.',
};

export function mount(container) {
  const w = mcQuiz(container, [
    { text: 'פתק חלק שמשמש למחאה, או כגיבוי לכתיבת אותיות המפלגה ביד', correct: true },
    { text: 'פתק שמעניק קול נוסף למפלגה הגדולה ביותר' },
    { text: 'פתק המשמש רק לחיילים המצביעים מחוץ לבסיס' },
    { text: 'פתק שמבטל את ההצבעה של הבוחר לגמרי' },
  ]);
  return { verify: () => ({ correct: w.isCorrect() }) };
}
