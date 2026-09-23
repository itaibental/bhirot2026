import { yesNo } from '../widgets.js';
import { showVideoPopup } from '../ui.js';

const POPUP_VIDEO = { type: 'video', src: 'assets/video/station-19-pirates.mp4' };

export const meta = {
  id: 19,
  title: 'מפלגת הפיראטים',
  subtitle: 'צפיתם בסרטון? ענו: האם מפלגת הפיראטים מתמודדת בבחירות הנוכחיות?',
  badge: 'כן / לא',
  points: 5,
  icon: 'flagCheck',
  media: { type: 'image', src: 'assets/images/station-19.jpg' },
  popupVideo: POPUP_VIDEO,
  info: 'מפלגות קטנות רבות מגישות מועמדות בכל מערכת בחירות — לא כולן עוברות את אחוז החסימה. (המורה: עדכנו את התשובה הנכונה בקובץ station19.js בהתאם לרשימת המפלגות המעודכנת.)',
  hint: 'בדקו ברשימת הרשימות המאושרות לבחירות הנוכחיות.',
  explanationTitle: 'מפלגות קטנות בבחירות',
  explanationText: 'בכל מערכת בחירות מגישות מועמדות גם מפלגות קטנות ושוליות. כדאי לבדוק מול הרשימה הרשמית והמעודכנת של ועדת הבחירות המרכזית.',
  defaultWrongReason: 'זו אינה התשובה שהוגדרה לתחנה זו — המורה יכול לעדכן זאת בקובץ.',
};

// שימו לב: זו עובדה שיכולה להשתנות בין מערכות בחירות — ודאו/עדכנו מול הרשימה הרשמית.
const CORRECT_ANSWER = 'yes';

export function mount(container) {
  const replayBtn = document.createElement('button');
  replayBtn.type = 'button';
  replayBtn.className = 'chip';
  replayBtn.style.cssText = 'margin-bottom:12px;';
  replayBtn.textContent = '🔁 צפו שוב בסרטון';
  replayBtn.addEventListener('click', () => {
    showVideoPopup({ media: POPUP_VIDEO, title: meta.title });
  });
  container.appendChild(replayBtn);

  const w = yesNo(container);
  return { verify: () => ({ correct: w.getValue() === CORRECT_ANSWER }) };
}
