import { mcQuiz } from '../widgets.js';

export const meta = {
  id: 20,
  title: 'מה זה מעטפות כפולות?',
  subtitle: 'בחרו את ההגדרה המדויקת.',
  badge: 'הגדרה',
  points: 5,
  icon: 'envelope',
  media: { type: 'image', src: 'assets/images/station-20.jpg' },
  info: 'שיטת המעטפות הכפולות מאפשרת לחיילים ואסירים להצביע בקלפיות מיוחדות: מעטפה חיצונית מאמתת זהות, ומעטפה פנימית שומרת חשאיות.',
  hint: 'מעטפה חיצונית = זיהוי. מעטפה פנימית = חשאיות.',
  explanationTitle: 'מעטפות כפולות',
  explanationText: 'שיטת הצבעה המאפשרת לאזרחים המשרתים או שוהים מחוץ לביתם (כמו חיילים ואסירים) להצביע בקלפיות מיוחדות, תוך אימות פרטיהם על המעטפה החיצונית, ושמירה על חשאיות הפתק שבמעטפה הפנימית.',
  defaultWrongReason: 'זו אינה ההגדרה המדויקת של מעטפות כפולות.',
};

export function mount(container) {
  const w = mcQuiz(container, [
    { text: 'מעטפה חיצונית לאימות זהות המצביע, ומעטפה פנימית לשמירת חשאיות הפתק', correct: true },
    { text: 'שתי מעטפות שנשלחות בדואר לכל אזרח מראש' },
    { text: 'מעטפה אחת לכל מפלגה בנפרד' },
    { text: 'שיטה להכפלת מספר הקולות של אזרחים בחו"ל' },
  ]);
  return { verify: () => ({ correct: w.isCorrect() }) };
}
