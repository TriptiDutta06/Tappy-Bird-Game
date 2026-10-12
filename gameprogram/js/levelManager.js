/**
 * ============================================================================
 * LevelManager.js
 * Configures distinct game stages, physics parameters, visual themes,
 * environmental particle systems (rain, lightning, clouds, stars), and
 * obstacle spawning strategies for CA-2 Game Programming requirements.
 * ============================================================================
 */
class LevelManager {
  constructor() {
    this.currentLevel = 1;

    // Stage Configurations (Tuned for smooth, fair, accessible progression)
    this.configs = {
      1: {
        id: 1,
        name: 'Training Sky',
        theme: 'day',
        difficulty: 'Easy',
        targetScore: 8,
        gravity: 620,
        flapForce: 300,
        pipeSpeed: 125,
        gapSize: 185,
        spawnInterval: 2.4,
        movingObstacleRatio: 0.0,
        aiObstacleRatio: 0.0
      },
      2: {
        id: 2,
        name: 'Storm Sky',
        theme: 'storm',
        difficulty: 'Medium',
        targetScore: 12,
        gravity: 660,
        flapForce: 315,
        pipeSpeed: 145,
        gapSize: 165,
        spawnInterval: 2.1,
        movingObstacleRatio: 0.3, // 30% gentle oscillating pipes
        aiObstacleRatio: 0.0
      },
      3: {
        id: 3,
        name: 'Nightmare Sky',
        theme: 'night',
        difficulty: 'Hard',
        targetScore: 15,
        gravity: 710,
        flapForce: 330,
        pipeSpeed: 165,
        gapSize: 150,
        spawnInterval: 1.9,
        movingObstacleRatio: 0.25,
        aiObstacleRatio: 0.25 // 25% AI tracking obstacles
      }
    };

    // Environmental Systems
    this.clouds = this._initClouds();
    this.rainDrops = this._initRain();
    this.stars = this._initStars();

    this.lightningAlpha = 0;
    this.lightningTimer = 3 + Math.random() * 4;

    this.groundOffset = 0;
  }

  getCurrentConfig() {
    return this.configs[this.currentLevel] || this.configs[1];
  }

  setLevel(levelNum) {
    if (this.configs[levelNum]) {
      this.currentLevel = levelNum;
    }
  }

  hasNextLevel() {
    return this.configs[this.currentLevel + 1] !== undefined;
  }

  advanceLevel() {
    if (this.hasNextLevel()) {
      this.currentLevel += 1;
      return true;
    }
    return false;
  }

  /**
   * Spawns an appropriate obstacle instance depending on level probabilities.
   */
  createObstacle(spawnX = 500) {
    const cfg = this.getCurrentConfig();
    const playableHeight = 640 - 60; // ground height is 60
    const padding = 80;
    const minCenter = padding + (cfg.gapSize / 2);
    const maxCenter = (playableHeight - padding) - (cfg.gapSize / 2);
    const gapY = minCenter + Math.random() * (maxCenter - minCenter);

    const rand = Math.random();

    if (cfg.aiObstacleRatio > 0 && rand < cfg.aiObstacleRatio) {
      return new AIObstacle(spawnX, gapY, cfg.gapSize, cfg.pipeSpeed);
    } else if (cfg.movingObstacleRatio > 0 && rand < (cfg.movingObstacleRatio + cfg.aiObstacleRatio)) {
      return new MovingObstacle(spawnX, gapY, cfg.gapSize, cfg.pipeSpeed);
    } else {
      return new Obstacle(spawnX, gapY, cfg.gapSize, cfg.pipeSpeed);
    }
  }

  // --- Environmental Particle Initializers ---

  _initClouds() {
    const clouds = [];
    for (let i = 0; i < 5; i++) {
      clouds.push({
        x: Math.random() * 480,
        y: 30 + Math.random() * 180,
        speed: 15 + Math.random() * 20,
        scale: 0.6 + Math.random() * 0.7,
        alpha: 0.4 + Math.random() * 0.4
      });
    }
    return clouds;
  }

  _initRain() {
    const rain = [];
    for (let i = 0; i < 70; i++) {
      rain.push({
        x: Math.random() * 480,
        y: Math.random() * 640,
        speed: 650 + Math.random() * 300,
        length: 12 + Math.random() * 10
      });
    }
    return rain;
  }

  _initStars() {
    const stars = [];
    for (let i = 0; i < 60; i++) {
      stars.push({
        x: Math.random() * 480,
        y: Math.random() * 450,
        radius: Math.random() * 1.5 + 0.5,
        twinkleSpeed: Math.random() * 3 + 1,
        phase: Math.random() * Math.PI * 2
      });
    }
    return stars;
  }

  /**
   * Updates environmental animations (clouds, rain, ground parallax).
   */
  updateEnvironment(dt) {
    const cfg = this.getCurrentConfig();

    // Scroll ground with pipe speed
    this.groundOffset = (this.groundOffset + cfg.pipeSpeed * dt) % 24;

    // 1. Update Clouds (Levels 1 & 2)
    for (const cloud of this.clouds) {
      cloud.x -= cloud.speed * dt;
      if (cloud.x < -120) {
        cloud.x = 520;
        cloud.y = 30 + Math.random() * 180;
      }
    }

    // 2. Update Rain (Level 2)
    if (cfg.theme === 'storm') {
      for (const drop of this.rainDrops) {
        drop.y += drop.speed * dt;
        drop.x -= 120 * dt; // wind slant
        if (drop.y > 640) {
          drop.y = -20;
          drop.x = Math.random() * 520;
        }
      }

      // Lightning flash timer
      this.lightningTimer -= dt;
      if (this.lightningTimer <= 0) {
        this.lightningAlpha = 0.8;
        this.lightningTimer = 4 + Math.random() * 6;
      }
      if (this.lightningAlpha > 0) {
        this.lightningAlpha = Math.max(0, this.lightningAlpha - dt * 4);
      }
    }

    // 3. Update Stars (Level 3)
    if (cfg.theme === 'night') {
      for (const star of this.stars) {
        star.phase += star.twinkleSpeed * dt;
      }
    }
  }

  /**
   * Renders background sky, weather effects, and ground surface.
   */
  renderBackground(ctx, width = 480, height = 640) {
    const cfg = this.getCurrentConfig();

    // 1. Render Sky Gradient
    if (cfg.theme === 'day') {
      const daySky = ctx.createLinearGradient(0, 0, 0, height);
      daySky.addColorStop(0, '#38bdf8'); // Radiant azure
      daySky.addColorStop(0.6, '#bae6fd');
      daySky.addColorStop(1, '#fef08a'); // Warm horizon
      ctx.fillStyle = daySky;
      ctx.fillRect(0, 0, width, height);

      // Sun
      ctx.save();
      const sunGrad = ctx.createRadialGradient(400, 80, 5, 400, 80, 50);
      sunGrad.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
      sunGrad.addColorStop(0.5, 'rgba(253, 224, 71, 0.4)');
      sunGrad.addColorStop(1, 'rgba(253, 224, 71, 0)');
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(400, 80, 50, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (cfg.theme === 'storm') {
      const stormSky = ctx.createLinearGradient(0, 0, 0, height);
      stormSky.addColorStop(0, '#0f172a'); // Deep slate
      stormSky.addColorStop(0.5, '#1e293b');
      stormSky.addColorStop(1, '#334155'); // Tempest overcast
      ctx.fillStyle = stormSky;
      ctx.fillRect(0, 0, width, height);
    } else {
      // Night / Nightmare
      const nightSky = ctx.createLinearGradient(0, 0, 0, height);
      nightSky.addColorStop(0, '#020617'); // Pitch cosmic black
      nightSky.addColorStop(0.5, '#0f172a');
      nightSky.addColorStop(1, '#2e1065'); // Violet twilight
      ctx.fillStyle = nightSky;
      ctx.fillRect(0, 0, width, height);

      // Stars
      for (const s of this.stars) {
        const a = 0.3 + 0.7 * Math.abs(Math.sin(s.phase));
        ctx.fillStyle = `rgba(255, 255, 255, ${a})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Crescent Moon
      ctx.save();
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(390, 75, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#020617';
      ctx.beginPath();
      ctx.arc(380, 70, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 2. Render Clouds (Level 1 & 2)
    if (cfg.theme !== 'night') {
      ctx.save();
      for (const c of this.clouds) {
        ctx.fillStyle = cfg.theme === 'day' 
          ? `rgba(255, 255, 255, ${c.alpha})`
          : `rgba(100, 116, 139, ${c.alpha * 0.7})`;
        
        ctx.beginPath();
        ctx.arc(c.x, c.y, 25 * c.scale, 0, Math.PI * 2);
        ctx.arc(c.x + 20 * c.scale, c.y - 12 * c.scale, 30 * c.scale, 0, Math.PI * 2);
        ctx.arc(c.x + 45 * c.scale, c.y, 22 * c.scale, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 3. Render Rain & Lightning (Level 2)
    if (cfg.theme === 'storm') {
      // Rain streaks
      ctx.save();
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.45)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (const r of this.rainDrops) {
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(r.x - 4, r.y + r.length);
      }
      ctx.stroke();
      ctx.restore();

      // Lightning flash
      if (this.lightningAlpha > 0) {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.lightningAlpha})`;
        ctx.fillRect(0, 0, width, height);
      }
    }

    // 4. Render Ground Terrain (Cartesian y = 580 to 640)
    this.renderGround(ctx, width, height, cfg.theme);
  }

  renderGround(ctx, width, height, theme) {
    const groundY = 580;
    const groundH = 60;

    let baseColor, grassColor, patternColor;
    if (theme === 'day') {
      baseColor = '#ded895';
      grassColor = '#15803d';
      patternColor = '#ca8a04';
    } else if (theme === 'storm') {
      baseColor = '#475569';
      grassColor = '#334155';
      patternColor = '#1e293b';
    } else {
      baseColor = '#1e1b4b';
      grassColor = '#ec4899';
      patternColor = '#4338ca';
    }

    // Ground Dirt Base
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, groundY, width, groundH);

    // Top Grass/Trim Line
    ctx.fillStyle = grassColor;
    ctx.fillRect(0, groundY, width, 12);

    // Parallax scrolling hash markers on the ground
    ctx.strokeStyle = patternColor;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let x = -24; x < width + 24; x += 24) {
      const drawX = x - this.groundOffset;
      ctx.moveTo(drawX, groundY + 12);
      ctx.lineTo(drawX + 10, groundY + groundH);
    }
    ctx.stroke();
  }
}
