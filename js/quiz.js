import { state, addScore, formatClock } from './gameState.js';
import { sfx } from './audio.js';
import { updateHud, updateStageCountdown, showScreen, showTimeUpModal } from './ui.js';

const STAGE_SECONDS = 60;

function startQuizTimer() {
  clearInterval(state.timers.stage);
  state.stageSecondsLeft = STAGE_SECONDS;
  updateStageCountdown(state.stageSecondsLeft);
  state.timers.stage = setInterval(() => {
    state.stageSecondsLeft--;
    updateStageCountdown(state.stageSecondsLeft);
    if (state.stageSecondsLeft <= 0) {
      clearInterval(state.timers.stage);
      sfx.error();
      showTimeUpModal(() => {
        addScore(-5);
        updateHud();
        startQuizTimer();
      });
    }
  }, 1000);
}

export const quizQuestions = [
  {
    q: 'מהו התאריך המדויק שבו מתקיימות הבחירות לכנסת ה-26?',
    correct: '27.10.2026',
    distractors: ['15.09.2026', '03.11.2026', '27.11.2026'],
  },
  {
    q: 'מהו הסכום של גיל זכות ההצבעה וגיל הזכות להתמודד לכנסת בישראל?',
    correct: '39 (18 לבחור + 21 להיבחר)',
    distractors: ['36 (18 + 18)', '43 (18 + 25)', '41 (16 + 25)'],
  },
  {
    q: 'כמה רשימות מפלגתיות אושרו להתמודדות בבחירות לכנסת ה-26?',
    correct: '38 רשימות',
    distractors: ['26 רשימות', '45 רשימות', '120 רשימות'],
  },
  {
    q: 'מה היה שיעור ההצבעה במערכת הבחירות הקודמת?',
    correct: '70.6%',
    distractors: ['62.4%', '78.2%', '50.1%'],
  },
  {
    q: 'מהו אחוז החסימה הקבוע בחוק וכמה מנדטים שווה כניסה זו?',
    correct: '3.25%, השווים ל-4 מנדטים',
    distractors: ['2%, השווים ל-2 מנדטים', '5%, השווים ל-6 מנדטים', '3%, השווים ל-3 מנדטים'],
  },
  {
    q: 'באיזה יום בשבוע נקבעו הבחירות לפי חוק יסוד: הכנסת?',
    correct: 'יום שלישי',
    distractors: ['יום ראשון', 'יום חמישי', 'יום שישי'],
  },
  {
    q: 'מהי ההגדרה המדויקת של "קולות כשרים" בספירת הקלפי?',
    correct: 'קולות שנמצאו תקינים ועברו את הספירה הרשמית',
    distractors: ['רק פתקים שנכתבו בכתב יד', 'כל המעטפות שהגיעו לקלפי כולל ריקות', 'קולות שניתנו רק למפלגות הקואליציה'],
  },
  {
    q: 'לאילו שתי מטרות חוקיות משמש הפתק הלבן?',
    correct: 'הבעת מחאה, ופתק גיבוי ידני',
    distractors: ['מתן שני קולות למפלגה אחת, והצבעת תיירים', 'הצבעה סודית של שרים', 'רישום תלונות לוועדת הקלפי'],
  },
  {
    q: 'מהו הסכם עודפים בין שתי מפלגות?',
    correct: 'חיבור קולות מיותרים שלא הספיקו למנדט שלם',
    distractors: ['חלוקת תיקי שרים ותקציבים', 'מחיקת מפלגה קטנה', 'החזר הוצאות קמפיין'],
  },
  {
    q: 'האם אזרח בחופשה פרטית בחו"ל רשאי להצביע בנציגות ישראלית?',
    correct: 'לא — רק שליחי מדינה רשמיים זכאים',
    distractors: ['כן, בכל קונסוליה בעולם', 'כן, לאחר רישום מקוון', 'לא, אין הצבעה מחוץ לארץ לאף אחד'],
  },
  {
    q: 'מה תפקיד המעטפה החיצונית, ומאיזו שנה מצביעים אסירים?',
    correct: 'אימות פרטי המצביע; משנת 1984',
    distractors: ['פרסום הפתק לעיני שופטים; משנת 1948', 'קביעת סדר כניסה; משנת 2000', 'שמירת תעודת זהות; אסירים אינם מצביעים'],
  },
  {
    q: 'מהי דמוקרטיה, מהו מצע ומה תפקיד האופוזיציה?',
    correct: 'שלטון העם; תוכנית עבודה; ביקורת על הממשלה',
    distractors: ['שלטון השופטים; חוק יסוד; ניהול משרדים', 'שלטון יחיד; תקציב המדינה; חקיקה ללא אישור', 'שלטון הרוב; הסכם קואליציוני; בחירת נשיא'],
  },
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function runQuiz(container, onComplete) {
  state.quizIndex = 0;
  renderQuestion();

  function renderQuestion() {
    startQuizTimer();
    const item = quizQuestions[state.quizIndex];
    const letters = ['א', 'ב', 'ג', 'ד'];
    const options = shuffle([
      { text: item.correct, correct: true },
      ...item.distractors.map((d) => ({ text: d, correct: false })),
    ]);

    container.innerHTML = `
      <div class="station-shell">
        <div class="station-head">
          <div class="station-tags">
            <span class="tag-progress">בוחן ידע מסכם</span>
            <span class="tag-badge">שאלה ${state.quizIndex + 1} מתוך ${quizQuestions.length}</span>
          </div>
          <div class="quiz-progress-dots" id="quiz-dots" style="margin-top:8px;"></div>
        </div>
        <div class="station-body">
          <h3 style="font-size:16px;font-weight:900;color:var(--ink-900);line-height:1.4;margin:2px 0 14px;">${item.q}</h3>
          <div id="quiz-options"></div>
        </div>
      </div>`;

    const dots = container.querySelector('#quiz-dots');
    quizQuestions.forEach((_, i) => {
      const d = document.createElement('span');
      d.className = 'qdot' + (i < state.quizIndex ? ' on' : '') + (i === state.quizIndex ? ' now' : '');
      dots.appendChild(d);
    });

    const optWrap = container.querySelector('#quiz-options');
    options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quiz-option';
      btn.innerHTML = `<span class="qletter">${letters[idx]}</span><span>${opt.text}</span>`;
      btn.addEventListener('click', () => handleAnswer(opt.correct, btn, optWrap));
      optWrap.appendChild(btn);
    });
  }

  function handleAnswer(isCorrect, btn, optWrap) {
    optWrap.querySelectorAll('.quiz-option').forEach((b) => (b.style.pointerEvents = 'none'));
    if (isCorrect) {
      btn.classList.add('correct');
      sfx.success();
      setTimeout(() => {
        state.quizIndex++;
        if (state.quizIndex < quizQuestions.length) renderQuestion();
        else onComplete();
      }, 450);
    } else {
      btn.classList.add('wrong');
      addScore(-3);
      updateHud();
      sfx.error();
      setTimeout(() => { optWrap.querySelectorAll('.quiz-option').forEach((b) => (b.style.pointerEvents = 'auto')); }, 550);
    }
  }
}
