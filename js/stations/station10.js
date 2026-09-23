import { mcQuiz } from '../widgets.js';

export const meta = {
  id: 10,
  title: 'מה זה הסכם עודפים?',
  subtitle: 'בחרו את ההגדרה המדויקת.',
  badge: 'הגדרה',
  points: 5,
  icon: 'handshake',
  media: { type: 'image', src: 'assets/images/station-10.jpg' },
  info: 'הסכם עודפים הוא הסכם משפטי בין שתי מפלגות המאפשר לחבר את קולות העודפים שלא הספיקו למנדט שלם.',
  hint: 'המילה המרכזית היא "חיבור קולות עודפים" בין שתי מפלגות.',
  explanationTitle: 'הסכם עודפים',
  explanationText: 'הסכם משפטי בין מפלגות שמאפשר להן לחבר את קולות הבוחרים המיותרים שלא הספיקו למנדט שלם.',
  defaultWrongReason: 'זו אינה ההגדרה המדויקת של הסכם עודפים.',
};

export function mount(container) {
  const w = mcQuiz(container, [
    { text: 'הסכם משפטי בין מפלגות לחיבור קולות עודפים שלא הספיקו למנדט שלם', correct: true },
    { text: 'הסכם לחלוקת תפקידי שרים ותקציבים בממשלה' },
    { text: 'הסכם המאפשר למפלגה למחוק מפלגה מתחרה' },
    { text: 'הסכם להחזר הוצאות התעמולה של מפלגה' },
  ]);
  return { verify: () => ({ correct: w.isCorrect() }) };
}
