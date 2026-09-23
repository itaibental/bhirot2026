import { yesNo } from '../widgets.js';

export const meta = {
  id: 12,
  title: 'הצבעה מחו"ל',
  subtitle: 'האם אזרח ישראלי ששוהה בחו"ל ביום הבחירות (בחופשה פרטית) יכול להצביע?',
  badge: 'כן / לא',
  points: 5,
  icon: 'flagCheck',
  media: { type: 'image', src: 'assets/images/station-12.jpg' },
  info: 'רק עובדי מדינה שנשלחו באופן רשמי לעבודה במדינה זרה זכאים להצביע בנציגויות ישראל בחו"ל.',
  hint: 'התשובה היא לא.',
  explanationTitle: 'לא — רק שליחי מדינה רשמיים',
  explanationText: 'אזרח בחופשה פרטית בחו"ל אינו זכאי להצביע. רק עובדי מדינה שנשלחו רשמית לעבודה במדינה זרה זכאים להצביע בנציגויות.',
  defaultWrongReason: 'התשובה הנכונה היא "לא" — רק שליחי מדינה רשמיים זכאים להצביע בחו"ל.',
};

export function mount(container) {
  const w = yesNo(container);
  return { verify: () => ({ correct: w.getValue() === 'no' }) };
}
