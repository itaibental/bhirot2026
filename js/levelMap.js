import { icons } from './icons.js';
import { state, isUnlocked, isDone } from './gameState.js';
import { sfx } from './audio.js';

/**
 * מרנדר את מפת השלבים (מסך הבית) בתוך container.
 * stations: מערך מודולי התחנות (meta, mount)
 * onOpenStation(index 1-based): callback כאשר לוחצים על תחנה פתוחה
 */
export function renderLevelMap(container, stations, onOpenStation) {
  container.innerHTML = `
    <div class="map-header">
      <span class="map-eyebrow">מערכת הבחירות לכנסת ה-26</span>
      <h2 class="map-title">מפת חדר הבריחה</h2>
      <p class="map-desc">12 תחנות ידע, בוחן מסכם, ותעודת גמר. כל תחנה נפתחת רק אחרי שפיצחתם את קודמתה.</p>
    </div>
    <div class="path-wrap">
      <div class="path" id="map-path"><div class="path-line"></div></div>
    </div>
  `;

  const pathEl = container.querySelector('#map-path');
  const positions = ['pos-c', 'pos-r', 'pos-l'];

  stations.forEach((mod, i) => {
    const num = i + 1;
    const row = document.createElement('div');
    row.className = `node-row ${positions[i % positions.length]}`;

    const node = document.createElement('button');
    node.type = 'button';
    node.id = `map-node-${num}`;
    const unlocked = isUnlocked(num);
    const done = isDone(num);
    node.className = 'node ' + (done ? 'done' : unlocked ? 'unlocked' : 'locked');
    node.innerHTML = `
      <span class="node-num">${num}</span>
      <span class="node-icon">${done ? icons.check : icons[mod.meta.icon] || icons.flagCheck}</span>
      <span class="node-badge">${mod.meta.badge}</span>
      ${!unlocked ? `<span class="lock-chip">${icons.lock}</span>` : ''}
    `;
    node.disabled = !unlocked;
    node.addEventListener('click', () => {
      if (!unlocked) { sfx.error(); return; }
      sfx.select();
      onOpenStation(num);
    });

    row.appendChild(node);
    pathEl.appendChild(row);
  });
}

export function refreshLevelMapNode(stationNumber, stations) {
  const node = document.getElementById(`map-node-${stationNumber}`);
  if (!node) return;
  const done = isDone(stationNumber);
  node.className = 'node ' + (done ? 'done pop' : 'unlocked');
  node.disabled = false;
  const mod = stations[stationNumber - 1];
  node.innerHTML = `
    <span class="node-num">${stationNumber}</span>
    <span class="node-icon">${done ? icons.check : icons[mod.meta.icon] || icons.flagCheck}</span>
    <span class="node-badge">${mod.meta.badge}</span>
  `;
}

export function unlockNextNode(stationNumber) {
  const node = document.getElementById(`map-node-${stationNumber}`);
  if (!node || !node.classList.contains('locked')) return;
  sfx.unlock();
  node.classList.remove('locked');
  node.classList.add('unlocked', 'pop');
  node.disabled = false;
  const lockChip = node.querySelector('.lock-chip');
  if (lockChip) lockChip.remove();
}
