import { colorWheel } from '../widgets.js';

export const meta = {
  id: 3,
  title: 'כמה מפלגות מתמודדות?',
  subtitle: 'סובבו את גלגל המזל וגררו אותו עד שיעצור על מספר הרשימות המתמודדות בבחירות לכנסת ה-26.',
  badge: 'גלגל מזל',
  points: 5,
  icon: 'list',
  media: { type: 'image', src: 'assets/images/station-03.jpg' },
  info: 'בבחירות לכנסת ה-26 מתמודדות 38 רשימות מפלגתיות שונות.',
  hint: 'המספר הוא 38.',
  explanationTitle: '38 מפלגות',
  explanationText: 'בבחירות לכנסת ה-26 מתמודדות 38 רשימות מפלגתיות.',
  defaultWrongReason: 'המספר אינו נכון. סובבו את הגלגל שוב עד 38.',
};

export function mount(container) {
  const w = colorWheel(container, 10, 60);
  return { verify: () => ({ correct: w.getValue() === 38 }) };
}
