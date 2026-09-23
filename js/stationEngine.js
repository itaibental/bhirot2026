import { state, addScore } from './gameState.js';
import { sfx } from './audio.js';
import {
  updateHud, updateStageCountdown, showErrorModal, showSuccessModal,
  showHintModal, showInfoModal, buildMediaEl, showTimeUpModal,
} from './ui.js';

const STAGE_SECONDS = 60;

/**
 * מריץ תחנה בודדת בתוך container נתון.
 * stationModule: { meta, mount(body, helpers) => { verify() } }
 * onFinished(): callback לאחר הצלחה (לפני שנעבר לתחנה הבאה)
 */
export function runStation(container, stationModule, index, total, onFinished) {
  const { meta, mount } = stationModule;
  state.currentStationIndex = index;

  container.innerHTML = `
    <div class="station-shell has-media">
      <div class="station-media-slot"></div>
      <div class="station-main">
        <div class="station-head">
          <div class="station-tags">
            <span class="tag-progress">תחנה ${index} מתוך ${total} · ${meta.points} נק׳</span>
            <span class="tag-badge">${meta.badge}</span>
          </div>
          <div class="station-title">${meta.title}</div>
        </div>
        <div class="station-body">
          <p style="font-size:12.5px;color:var(--ink-600);font-weight:700;margin:0 0 10px;line-height:1.5;">${meta.subtitle}</p>
          <div class="widget-mount"></div>
          <div class="status-line" id="station-status"></div>
        </div>
        <div class="station-foot">
          <button class="btn btn-primary" id="station-verify-btn">בקש אימות פיצוח</button>
        </div>
      </div>
    </div>
  `;

  container.querySelector('.station-media-slot').appendChild(buildMediaEl(meta.media, meta.icon));

  const statusEl = container.querySelector('#station-status');
  const helpers = {
    setStatus: (txt) => { statusEl.textContent = txt; statusEl.classList.add('active'); },
    playTone: sfx.select,
  };

  const widgetMount = container.querySelector('.widget-mount');
  const { verify } = mount(widgetMount, helpers);

  container.querySelector('#station-verify-btn').addEventListener('click', () => {
    const result = verify();
    const ok = result === true || (result && result.correct);
    if (ok) {
      clearInterval(state.timers.stage);
      addScore(meta.points);
      updateHud();
      showSuccessModal(meta.explanationTitle, meta.explanationText, onFinished);
    } else {
      const reason = (result && result.reason) || meta.defaultWrongReason;
      addScore(-3);
      updateHud();
      showErrorModal(reason);
    }
  });

  startStageTimer(meta, onFinished);
  updateHud();

  return {
    showInfo: () => showInfoModal(meta.title, meta.info),
    showHint: () => {
      addScore(-3);
      updateHud();
      showHintModal(meta.hint);
    },
  };
}

function startStageTimer(meta, onTimeUpExtended) {
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
        startStageTimer(meta, onTimeUpExtended);
      });
    }
  }, 1000);
}
