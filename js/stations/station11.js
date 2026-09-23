import { mcQuiz } from '../widgets.js';

export const meta = {
  id: 11,
  title: 'מהם הסכמים קואליציוניים?',
  subtitle: 'בחרו את ההגדרה המדויקת.',
  badge: 'הגדרה',
  points: 5,
  icon: 'gavel',
  media: { type: 'image', src: 'assets/images/station-11.jpg' },
  info: 'הסכמים קואליציוניים הם חוזים פוליטיים בין המפלגות השותפות בממשלה, המסדירים חלוקת תפקידים, תקציבים וקווי יסוד.',
  hint: 'המילים המרכזיות: חלוקת תפקידים, תקציבים וקווי יסוד של הממשלה.',
  explanationTitle: 'הסכמים קואליציוניים',
  explanationText: 'חוזים פוליטיים שנחתמים בין המפלגות השותפות בממשלה ומסדירים את חלוקת התפקידים, התקציבים וקווי היסוד של הממשלה החדשה.',
  defaultWrongReason: 'זו אינה ההגדרה המדויקת של הסכם קואליציוני.',
};

export function mount(container) {
  const w = mcQuiz(container, [
    { text: 'חוזים פוליטיים בין שותפות הממשלה, לחלוקת תפקידים, תקציבים וקווי יסוד', correct: true },
    { text: 'הסכם טכני לחיבור קולות עודפים בין שתי מפלגות' },
    { text: 'חוזה בין הכנסת לבית המשפט העליון' },
    { text: 'הסכם בין מפלגות האופוזיציה בלבד' },
  ]);
  return { verify: () => ({ correct: w.isCorrect() }) };
}
