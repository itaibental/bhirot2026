// מצב המשחק המרכזי — נגיש לכל המודולים
export const state = {
  team: '',
  members: '',
  score: 0,
  secondsElapsed: 0,
  stageSecondsLeft: 60,
  totalStations: 0,          // מוגדר ע"י main.js לפי מספר התחנות שנרשמו
  currentStationIndex: 0,    // 1-based, 0 = טרם התחיל
  completed: [],             // מערך בוליאני לכל תחנה
  quizIndex: 0,
  quizCorrectStreak: 0,
  timers: { elapsed: null, stage: null },
};

export function resetState(totalStations) {
  state.team = '';
  state.members = '';
  state.score = 0;
  state.secondsElapsed = 0;
  state.stageSecondsLeft = 60;
  state.totalStations = totalStations;
  state.currentStationIndex = 0;
  state.completed = new Array(totalStations).fill(false);
  state.quizIndex = 0;
  clearAllTimers();
}

export function clearAllTimers() {
  clearInterval(state.timers.elapsed);
  clearInterval(state.timers.stage);
  state.timers.elapsed = null;
  state.timers.stage = null;
}

export function addScore(delta) {
  state.score = Math.max(0, Math.min(100, state.score + delta));
}

export function isUnlocked(stationNumber) {
  // תחנה 1 תמיד פתוחה; תחנה n פתוחה אם התחנה שלפניה הושלמה
  if (stationNumber === 1) return true;
  return !!state.completed[stationNumber - 2];
}

export function isDone(stationNumber) {
  return !!state.completed[stationNumber - 1];
}

export function formatClock(totalSeconds) {
  const mm = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const ss = String(totalSeconds % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}
