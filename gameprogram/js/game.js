/**
 * ============================================================================
 * Game.js
 * Central Engine Architecture for "Tappy Bird: Skybound Challenge".
 * Coordinates Game Loop, State Machine, Delta-Time integration, Object
 * Lifecycles, Audio triggers, and Level Progression.
 * ============================================================================
 */

const GameState = {
  MENU: 'MENU',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
  LEVEL_COMPLETE: 'LEVEL_COMPLETE',
  GAME_OVER: 'GAME_OVER',
  VICTORY: 'VICTORY'
};

class Game {
  constructor() {
    // 1. Setup Canvas & Rendering Context
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    // 2. Initialize Subsystem Managers
    this.audio = new AudioManager();
    this.input = new InputManager(this.canvas);
    this.score = new ScoreManager();
    this.level = new LevelManager();
    this.ui = new UIManager();

    // 3. Game Entities & State
    this.state = GameState.MENU;
    this.bird = new Bird(110, 260);
    this.obstacles = [];
    this.spawnTimer = 0;

    // 4. Timing & Game Loop Variables
    this.lastTime = 0;
    this.isRunning = false;

    // 5. Connect Input & UI Listeners
    this._bindInputs();
    this._bindUIButtons();

    // Show initial Menu
    this.ui.updateMenuStats(this.score.highScore, this.score.unlockedLevel);
    this.ui.showScreen('menu');

    // Start background render loop (for animated menu sky)
    this.startLoop();
  }

  /**
   * Binds input callbacks from InputManager
   */
  _bindInputs() {
    this.input.onFlap = () => {
      this.handleFlap();
    };

    this.input.onPauseToggle = () => {
      if (this.state === GameState.PLAYING) {
        this.pauseGame();
      } else if (this.state === GameState.PAUSED) {
        this.resumeGame();
      }
    };

    this.input.onMenuToggle = () => {
      if (this.state === GameState.PLAYING || this.state === GameState.PAUSED) {
        this.pauseGame();
      } else if (this.state === GameState.LEVEL_COMPLETE || this.state === GameState.GAME_OVER) {
        this.goToMainMenu();
      }
    };

    this.input.onMuteToggle = () => {
      const isMuted = this.audio.toggleMute();
      this.ui.updateAudioButton(isMuted);
    };
  }

  /**
   * Binds DOM UI Buttons
   */
  _bindUIButtons() {
    // Audio Toggle button in HUD
    const btnAudio = document.getElementById('btn-audio-toggle');
    if (btnAudio) {
      btnAudio.onclick = () => {
        const isMuted = this.audio.toggleMute();
        this.ui.updateAudioButton(isMuted);
      };
    }

    // Pause Toggle button in HUD
    const btnPause = document.getElementById('btn-pause-toggle');
    if (btnPause) {
      btnPause.onclick = () => this.pauseGame();
    }

    // Main Menu Buttons
    const btnPlayNow = document.getElementById('btn-play-now');
    if (btnPlayNow) {
      btnPlayNow.onclick = () => this.startLevel(this.level.currentLevel);
    }

    const btnLevelSelect = document.getElementById('btn-level-select');
    if (btnLevelSelect) {
      btnLevelSelect.onclick = () => {
        this.ui.updateLevelSelectCards(this.score.unlockedLevel);
        this.ui.showScreen('levelSelect');
      };
    }

    const btnHowToPlay = document.getElementById('btn-how-to-play');
    if (btnHowToPlay) {
      btnHowToPlay.onclick = () => this.ui.showScreen('howToPlay');
    }

    const btnBackLevels = document.getElementById('btn-back-from-levels');
    if (btnBackLevels) {
      btnBackLevels.onclick = () => this.goToMainMenu();
    }

    const btnBackInstructions = document.getElementById('btn-back-from-instructions');
    if (btnBackInstructions) {
      btnBackInstructions.onclick = () => this.goToMainMenu();
    }

    // Level Selection Cards
    for (let lvl = 1; lvl <= 3; lvl++) {
      const card = document.getElementById(`card-level-${lvl}`);
      if (card) {
        card.onclick = () => {
          if (lvl <= this.score.unlockedLevel) {
            this.startLevel(lvl);
          }
        };
      }
    }

    // Pause Menu Buttons
    const btnResume = document.getElementById('btn-resume-game');
    if (btnResume) btnResume.onclick = () => this.resumeGame();

    const btnRestartPause = document.getElementById('btn-restart-from-pause');
    if (btnRestartPause) btnRestartPause.onclick = () => this.startLevel(this.level.currentLevel);

    const btnLevelsPause = document.getElementById('btn-levels-from-pause');
    if (btnLevelsPause) {
      btnLevelsPause.onclick = () => {
        this.ui.updateLevelSelectCards(this.score.unlockedLevel);
        this.ui.showScreen('levelSelect');
      };
    }

    const btnMenuPause = document.getElementById('btn-menu-from-pause');
    if (btnMenuPause) btnMenuPause.onclick = () => this.goToMainMenu();

    // Game Over Buttons
    const btnRetry = document.getElementById('btn-retry-stage');
    if (btnRetry) btnRetry.onclick = () => this.startLevel(this.level.currentLevel);

    const btnLevelsGO = document.getElementById('btn-levels-from-gameover');
    if (btnLevelsGO) {
      btnLevelsGO.onclick = () => {
        this.ui.updateLevelSelectCards(this.score.unlockedLevel);
        this.ui.showScreen('levelSelect');
      };
    }

    const btnMenuGO = document.getElementById('btn-menu-from-gameover');
    if (btnMenuGO) btnMenuGO.onclick = () => this.goToMainMenu();

    // Level Complete Buttons
    const btnNextStage = document.getElementById('btn-next-stage');
    if (btnNextStage) {
      btnNextStage.onclick = () => {
        if (this.level.advanceLevel()) {
          this.score.saveUnlockedLevel(this.level.currentLevel);
          this.startLevel(this.level.currentLevel);
        } else {
          this.triggerVictory();
        }
      };
    }

    const btnReplayStage = document.getElementById('btn-replay-stage');
    if (btnReplayStage) btnReplayStage.onclick = () => this.startLevel(this.level.currentLevel);

    const btnMenuClear = document.getElementById('btn-menu-from-clear');
    if (btnMenuClear) btnMenuClear.onclick = () => this.goToMainMenu();

    // Victory Buttons
    const btnPlayAgain = document.getElementById('btn-play-again-victory');
    if (btnPlayAgain) {
      btnPlayAgain.onclick = () => {
        this.score.resetFullCampaign();
        this.startLevel(1);
      };
    }

    const btnMenuVictory = document.getElementById('btn-menu-from-victory');
    if (btnMenuVictory) btnMenuVictory.onclick = () => this.goToMainMenu();
  }

  // --- State Transitions ---

  startLevel(levelNum) {
    this.level.setLevel(levelNum);
    const cfg = this.level.getCurrentConfig();

    this.score.resetCurrentLevelScore();
    this.score.setTargetScore(cfg.targetScore);

    this.bird.reset(110, 260);
    this.obstacles = [];
    this.spawnTimer = 0.5; // Quick initial spawn

    this.state = GameState.PLAYING;
    this.ui.hideAllScreens();
    this.ui.showHUD(true);
    this.ui.updateHUD(this.score.currentScore, this.score.targetScore, this.level.currentLevel);
  }

  handleFlap() {
    if (this.state === GameState.PLAYING) {
      const cfg = this.level.getCurrentConfig();
      this.bird.flap(cfg.flapForce);
      this.audio.playFlap();
    }
  }

  pauseGame() {
    if (this.state === GameState.PLAYING) {
      this.state = GameState.PAUSED;
      this.ui.showScreen('pause');
    }
  }

  resumeGame() {
    if (this.state === GameState.PAUSED) {
      this.state = GameState.PLAYING;
      this.ui.hideAllScreens();
      this.ui.showHUD(true);
      this.lastTime = performance.now();
    }
  }

  goToMainMenu() {
    this.state = GameState.MENU;
    this.ui.showHUD(false);
    this.ui.updateMenuStats(this.score.highScore, this.score.unlockedLevel);
    this.ui.showScreen('menu');
  }

  triggerGameOver(reason) {
    this.state = GameState.GAME_OVER;
    this.audio.playHit();
    this.ui.showGameOver(this.score.currentScore, this.score.targetScore, reason);
  }

  triggerLevelComplete() {
    this.state = GameState.LEVEL_COMPLETE;
    this.audio.playLevelComplete();

    // Check if this was the final level
    if (!this.level.hasNextLevel()) {
      // Completed all 3 stages! Trigger final victory!
      this.triggerVictory();
    } else {
      // Advance unlock
      this.score.saveUnlockedLevel(this.level.currentLevel + 1);
      const cfg = this.level.getCurrentConfig();
      this.ui.showLevelComplete(this.score.currentScore, cfg.name);
    }
  }

  triggerVictory() {
    this.state = GameState.VICTORY;
    this.audio.playVictory();
    this.score.saveUnlockedLevel(3);
    this.ui.showVictory(this.score.cumulativeScore, this.score.highScore);
  }

  // --- Main Game Loop (requestAnimationFrame) ---

  startLoop() {
    this.isRunning = true;
    this.lastTime = performance.now();

    const loop = (timestamp) => {
      // 1. Calculate delta time (seconds) with clamp
      const rawDt = (timestamp - this.lastTime) / 1000;
      this.lastTime = timestamp;
      const dt = Math.min(rawDt, 0.08); // Prevents simulation breakdown on tab switch

      // 2-7. Update & Physics simulation
      this.update(dt);

      // 8. Render scene
      this.render();

      // 9. Repeat frame
      if (this.isRunning) {
        requestAnimationFrame(loop);
      }
    };

    requestAnimationFrame(loop);
  }

  update(dt) {
    // Environmental animations always update (e.g. ambient menu sky & in-game)
    this.level.updateEnvironment(dt);

    if (this.state !== GameState.PLAYING) {
      return;
    }

    const cfg = this.level.getCurrentConfig();

    // 3 & 4. Update Game Objects & Apply Physics
    this.bird.update(dt, cfg.gravity);

    // Obstacle Spawner
    this.spawnTimer -= dt;
    if (this.spawnTimer <= 0) {
      this.obstacles.push(this.level.createObstacle(this.width + 40));
      this.spawnTimer = cfg.spawnInterval;
    }

    // Update Obstacles
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.update(dt, this.bird);

      // 6. Update Score (passing obstacles)
      if (!obs.passed && (this.bird.x > obs.x + obs.width)) {
        obs.passed = true;
        this.score.addPoint(1);
        this.audio.playScore();
        this.ui.updateHUD(this.score.currentScore, this.score.targetScore, this.level.currentLevel);

        // 7. Check Level Condition
        if (this.score.isTargetReached()) {
          this.triggerLevelComplete();
          return;
        }
      }

      // Remove offscreen obstacles
      if (obs.isOffScreen()) {
        this.obstacles.splice(i, 1);
      }
    }

    // 5. Detect Collisions
    // Soft Ceiling Clamp: prevent dying when flying high; gracefully slide along the top
    if (this.bird.y - this.bird.radius <= 0) {
      this.bird.y = this.bird.radius;
      if (this.bird.vy < 0) {
        this.bird.vy = 0;
      }
    }

    // Boundary collision (Floor: y = 580)
    const boundaryHit = CollisionSystem.checkWorldBoundaries(this.bird, 0, 580);
    if (boundaryHit === 'ground') {
      this.triggerGameOver('Crashed into the ground!');
      return;
    }

    // Obstacle Pipe collisions
    for (const obs of this.obstacles) {
      if (CollisionSystem.checkBirdObstacle(this.bird, obs)) {
        this.triggerGameOver('Collided with obstacle pipe!');
        return;
      }
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Render Environment Sky & Ground
    this.level.renderBackground(this.ctx, this.width, this.height);

    const cfg = this.level.getCurrentConfig();

    // Render Obstacles
    for (const obs of this.obstacles) {
      obs.render(this.ctx, cfg.theme);
    }

    // Render Bird (During active gameplay, pause, or game over)
    if (this.state === GameState.PLAYING || this.state === GameState.PAUSED || this.state === GameState.GAME_OVER) {
      this.bird.render(this.ctx);
    }
  }
}
