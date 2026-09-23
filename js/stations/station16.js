import { lettersFill } from '../widgets.js';

export const meta = {
  id: 16,
  title: 'מה ההגדרה של דמוקרטיה?',
  subtitle: 'השלימו את שתי המילים החסרות — מילה בת 5 אותיות ומילה בת 3 אותיות.',
  badge: 'השלמת אותיות',
  points: 5,
  icon: 'layers',
  media: { type: 'image', src: 'assets/images/station-16.jpg' },
  info: 'דמוקרטיה, במקור יווני, פירושה המילולי "שלטון העם".',
  hint: 'המילה הראשונה: שלטון. המילה השנייה: העם.',
  explanationTitle: 'שלטון העם',
  explanationText: 'דמוקרטיה משמעה שלטון העם — האזרחים הם מקור הסמכות השלטונית.',
  defaultWrongReason: 'התשובה אינה מדויקת. נסו שוב.',
};

function norm(s) {
  return (s || '').trim().replace(/[\u0591-\u05C7]/g, '');
}

export function mount(container) {
  const w = lettersFill(container, ['שלטון', 'העם']);
  return {
    verify: () => {
      const [w1, w2] = w.getValue();
      return { correct: norm(w1) === 'שלטון' && norm(w2) === 'העם' };
    },
  };
}
