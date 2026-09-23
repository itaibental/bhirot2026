import { mcQuiz } from '../widgets.js';

export const meta = {
  id: 7,
  title: 'מה זה קולות כשרים?',
  subtitle: 'בחרו את ההגדרה המדויקת.',
  badge: 'הגדרה',
  points: 5,
  icon: 'ballot',
  media: { type: 'image', src: 'assets/images/station-07.jpg' },
  info: 'קולות כשרים הם כל קולות ההצבעה שנמצאו תקינים ועברו את הספירה הרשמית, לאחר שהופחתו מהם הקולות הפסולים.',
  hint: 'חפשו את ההגדרה שמדברת על קולות "תקינים" ו"ספירה רשמית".',
  explanationTitle: 'קולות כשרים',
  explanationText: 'כל קולות ההצבעה שנמצאו תקינים ועברו את ספירת הקולות הרשמית בבחירות, לאחר שהופחתו מהם הקולות הפסולים.',
  defaultWrongReason: 'זו אינה ההגדרה המדויקת של קולות כשרים.',
};

export function mount(container) {
  const w = mcQuiz(container, [
    { text: 'כל קולות ההצבעה שנמצאו תקינים ועברו את ספירת הקולות הרשמית, לאחר הפחתת הקולות הפסולים', correct: true },
    { text: 'רק קולות שניתנו למפלגות שנכנסו לכנסת' },
    { text: 'כל המעטפות שהגיעו לקלפי, כולל ריקות' },
    { text: 'קולות שנספרו על ידי משקיפים בינלאומיים בלבד' },
  ]);
  return { verify: () => ({ correct: w.isCorrect() }) };
}
