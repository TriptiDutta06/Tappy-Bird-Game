/**
 * ============================================================================
 * UIManager.js
 * Controls screen transitions, HUD displays, modals, and user interactivity.
 * Demonstrates Game Programming Unit II syllabus (UI & Event Management).
 * ============================================================================
 */
class UIManager {
  constructor() {
    // Screen Elements
    this.screens = {
      menu: document.getElementById('screen-main-menu'),
      levelSelect: document.getElementById('screen-level-select'),
      howToPlay: document.getElementById('screen-how-to-play'),
      pause: document.getElementById('screen-pause'),
      gameOver: document.getElementById('screen-game-over'),
      levelComplete: document.getElementById('screen-level-complete'),
      victory: document.getElementById('screen-victory')
    };

    // HUD Elements
    this.hud = document.getElementById('hud');
    this.hudProgressWrap = document.getElementById('hud-progress-wrap');
    this.hudProgressBar = document.getElementById('hud-progress-bar');
    this.hudLevelVal = document.getElementById('hud-level-val');
    this.hudScoreVal = document.getElementById('hud-score-val');
    this.hudTargetVal = document.getElementById('hud-target-val');
    this.btnAudioToggle = document.getElementById('btn-audio-toggle');
    this.btnPauseToggle = document.getElementById('btn-pause-toggle');

    // Menu stats
    this.menuBestScore = document.getElementById('menu-best-score');
    this.menuHighestLevel = document.getElementById('menu-highest-level');

    // Game Over elements
    this.gameOverScore = document.getElementById('game-over-score');
    this.gameOverTarget = document.getElementById('game-over-target');
    this.gameOverReason = document.getElementById('game-over-reason');

    // Level Complete elements
    this.lvlClearScore = document.getElementById('lvl-clear-score');
    this.levelCompleteDesc = document.getElementById('level-complete-desc');

    // Victory elements
    this.victoryTotalScore = document.getElementById('victory-total-score');
    this.victoryHighScore = document.getElementById('victory-high-score');
  }

  hideAllScreens() {
    Object.values(this.screens).forEach(screen => {
      if (screen) screen.classList.add('hidden');
    });
  }

  showScreen(name) {
    this.hideAllScreens();
    if (this.screens[name]) {
      this.screens[name].classList.remove('hidden');
    }
  }

  showHUD(visible = true) {
    if (visible) {
      this.hud.classList.remove('hidden');
      this.hudProgressWrap.classList.remove('hidden');
    } else {
      this.hud.classList.add('hidden');
      this.hudProgressWrap.classList.add('hidden');
    }
  }

  updateHUD(score, target, levelNum) {
    if (this.hudScoreVal) this.hudScoreVal.textContent = score;
    if (this.hudTargetVal) this.hudTargetVal.textContent = target;
    if (this.hudLevelVal) this.hudLevelVal.textContent = levelNum;

    // Update Progress bar percentage
    if (this.hudProgressBar) {
      const pct = Math.min(100, Math.round((score / Math.max(1, target)) * 100));
      this.hudProgressBar.style.width = `${pct}%`;
    }
  }

  updateMenuStats(highScore, unlockedLevel) {
    if (this.menuBestScore) this.menuBestScore.textContent = highScore;
    if (this.menuHighestLevel) this.menuHighestLevel.textContent = `LVL ${unlockedLevel}`;
  }

  updateLevelSelectCards(unlockedLevel) {
    for (let lvl = 1; lvl <= 3; lvl++) {
      const card = document.getElementById(`card-level-${lvl}`);
      if (card) {
        if (lvl <= unlockedLevel) {
          card.style.opacity = '1';
          card.style.pointerEvents = 'auto';
        } else {
          card.style.opacity = '0.45';
          card.style.pointerEvents = 'none';
        }
      }
    }
  }

  showGameOver(score, target, reason = 'Collision detected') {
    if (this.gameOverScore) this.gameOverScore.textContent = score;
    if (this.gameOverTarget) this.gameOverTarget.textContent = target;
    if (this.gameOverReason) this.gameOverReason.textContent = reason;
    this.showHUD(false);
    this.showScreen('gameOver');
  }

  showLevelComplete(score, levelName) {
    if (this.lvlClearScore) this.lvlClearScore.textContent = score;
    if (this.levelCompleteDesc) {
      this.levelCompleteDesc.textContent = `You conquered ${levelName}! Ready for the next sky?`;
    }
    this.showHUD(false);
    this.showScreen('levelComplete');
  }

  showVictory(totalScore, highScore) {
    if (this.victoryTotalScore) this.victoryTotalScore.textContent = totalScore;
    if (this.victoryHighScore) this.victoryHighScore.textContent = highScore;
    this.showHUD(false);
    this.showScreen('victory');
  }

  updateAudioButton(isMuted) {
    if (this.btnAudioToggle) {
      this.btnAudioToggle.textContent = isMuted ? '🔇' : '🔊';
    }
  }
}
