import { state, resetState, addScore, formatClock } from './gameState.js';
import { stations } from './stations/index.js';
import { runQuiz, quizQuestions } from './quiz.js';
import { runStation } from './stationEngine.js';
import { renderLevelMap } from './levelMap.js';
import {
  showScreen, updateHud, setHudTeamName, toggleHudStats, initAudioButton, initMusicButton,
  runCountdownOverlay, fireConfetti, showVideoPopup,
} from './ui.js';
import { sfx, startBackgroundMusic, armAutoplayUnlock, playVictoryMusic } from './audio.js';

const $ = (id) => document.getElementById(id);

const INTRO_VIDEO = { type: 'video', src: 'assets/video/intro.mp4' };
const INTRO_CAPTION = 'אז אחרי שצחקנו נעבור לחלק האמנותי';
const SPLASH_DELAY_MS = 4000;

let currentStationHelpers = null; // { showInfo, showHint } של התחנה הפעילה כרגע

function init() {
  initAudioButton();
  initMusicButton();
  $('form-register').addEventListener('submit', handleStartGame);
  $('btn-hint').addEventListener('click', () => currentStationHelpers && currentStationHelpers.showHint());
  $('btn-restart').addEventListener('click', () => location.reload());

  // מוזיקת רקע שמחה מתחילה מייד; דפדפנים חוסמים קול לפני אינטראקציה ראשונה,
  // אז גם "פותחים מנעול" בלחיצה/הקשה הראשונה בעמוד כדי שהיא תישמע בפועל בהקדם האפשרי.
  startBackgroundMusic();
  armAutoplayUnlock();

  // 4 שניות של צפייה בתמונת הרקע לפני שחלון ההרשמה נחשף
  showScreen('screen-welcome');
  setTimeout(() => {
    $('app-shell').classList.add('revealed');
  }, SPLASH_DELAY_MS);
}

function handleStartGame(e) {
  e.preventDefault();
  const team = $('input-team-name').value.trim() || 'קבוצת הדמוקרטיה';
  const members = $('input-team-members').value.trim() || 'תלמידי ישראל';

  resetState(stations.length);
  state.team = team;
  state.members = members;
  setHudTeamName(team);

  // מציגים את מפת השלבים ברקע, וקופצת מעליה שקופית הווידאו — השעון עוד לא רץ בשלב הזה
  goToMap();
  showVideoPopup({
    media: INTRO_VIDEO,
    title: 'לפני שמתחילים...',
    caption: INTRO_CAPTION,
    onDismiss: startClockAndReveal,
  });
}

function startClockAndReveal() {
  toggleHudStats(true);
  $('hud-progress-container').hidden = false;
  updateHud();

  clearInterval(state.timers.elapsed);
  state.timers.elapsed = setInterval(() => {
    state.secondsElapsed++;
    updateHud();
    sfx.tick();
  }, 1000);
}

function goToMap() {
  currentStationHelpers = null;
  $('topbar-task-btns').hidden = true;
  state.currentStationIndex = 0;
  updateHud();
  renderLevelMap($('screen-map'), stations, openStation);
  showScreen('screen-map');
}

function openStation(num) {
  showScreen('screen-station');
  runCountdownOverlay(() => {
    $('topbar-task-btns').hidden = false;
    const stationModule = stations[num - 1];
    currentStationHelpers = runStation($('station-mount'), stationModule, num, stations.length, () => {
      state.completed[num - 1] = true;
      currentStationHelpers = null;
      $('topbar-task-btns').hidden = true;

      if (num < stations.length) {
        goToMap();
        requestAnimationFrame(() => {
          const doneNode = $(`map-node-${num}`);
          const nextNode = $(`map-node-${num + 1}`);
          if (doneNode) { doneNode.classList.remove('pop'); void doneNode.offsetWidth; doneNode.classList.add('pop'); }
          if (nextNode) { nextNode.classList.remove('pop'); void nextNode.offsetWidth; nextNode.classList.add('pop'); }
        });
      } else {
        startQuiz();
      }
    });

    // חלק מהתחנות מגדירות סרטון שקופץ אוטומטית לפני שרואים את השאלה (למשל תחנה 19)
    if (stationModule.meta.popupVideo) {
      showVideoPopup({
        media: stationModule.meta.popupVideo,
        title: stationModule.meta.title,
      });
    }
  });
}

function startQuiz() {
  showScreen('screen-quiz');
  $('hud-progress-container').hidden = true;
  runQuiz($('quiz-mount'), endGame);
}

function endGame() {
  clearInterval(state.timers.elapsed);
  clearInterval(state.timers.stage);
  toggleHudStats(false);
  $('hud-progress-container').hidden = true;

  $('res-team').textContent = state.team;
  $('res-members').textContent = state.members;
  $('res-score').textContent = `${state.score} מתוך 100`;
  $('res-time').textContent = `${formatClock(state.secondsElapsed)} דקות`;

  showScreen('screen-victory');
  playVictoryMusic();
  fireConfetti($('screen-victory'));
}

document.addEventListener('DOMContentLoaded', init);
