/**
 * ============================================================================
 * ScoreManager.js
 * Tracks active score, level objectives, cumulative scores, and saves
 * high scores/unlocked levels persistently using HTML5 localStorage.
 * ============================================================================
 */
class ScoreManager {
  constructor() {
    this.currentScore = 0;
    this.cumulativeScore = 0;
    this.targetScore = 10;
    this.highScore = this._loadHighScore();
    this.unlockedLevel = this._loadUnlockedLevel();
  }

  _loadHighScore() {
    try {
      const saved = localStorage.getItem('tappy_bird_highscore');
      return saved ? parseInt(saved, 10) : 0;
    } catch (e) {
      return 0;
    }
  }

  _saveHighScore() {
    try {
      if (this.currentScore > this.highScore) {
        this.highScore = this.currentScore;
        localStorage.setItem('tappy_bird_highscore', this.highScore.toString());
      }
    } catch (e) {}
  }

  _loadUnlockedLevel() {
    try {
      const saved = localStorage.getItem('tappy_bird_unlocked_level');
      return saved ? parseInt(saved, 10) : 1;
    } catch (e) {
      return 1;
    }
  }

  saveUnlockedLevel(levelNum) {
    if (levelNum > this.unlockedLevel) {
      this.unlockedLevel = levelNum;
      try {
        localStorage.setItem('tappy_bird_unlocked_level', this.unlockedLevel.toString());
      } catch (e) {}
    }
  }

  setTargetScore(target) {
    this.targetScore = target;
  }

  addPoint(pts = 1) {
    this.currentScore += pts;
    this.cumulativeScore += pts;
    this._saveHighScore();
    return this.currentScore;
  }

  isTargetReached() {
    return this.currentScore >= this.targetScore;
  }

  getProgressRatio() {
    return Math.min(1.0, this.currentScore / Math.max(1, this.targetScore));
  }

  resetCurrentLevelScore() {
    this.currentScore = 0;
  }

  resetFullCampaign() {
    this.currentScore = 0;
    this.cumulativeScore = 0;
  }
}
