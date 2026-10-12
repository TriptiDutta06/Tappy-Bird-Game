/**
 * ============================================================================
 * Obstacle.js
 * Modular obstacle architectures:
 * 1. Base Obstacle (Static pipes for Level 1)
 * 2. MovingObstacle (Harmonic oscillating pipes for Level 2)
 * 3. AIObstacle (Behavioral tracking gap for Level 3)
 * Demonstrates Game Programming Unit II & III syllabus.
 * ============================================================================
 */

class Obstacle {
  constructor(x, gapY, gapSize = 160, speed = 150, width = 64) {
    this.x = x;
    this.width = width;
    this.gapSize = gapSize;
    this.speed = speed;
    this.passed = false;
    this.type = 'static';

    this.worldHeight = 640;
    this.groundHeight = 60;
    this.playableHeight = this.worldHeight - this.groundHeight;

    this.gapY = gapY;
    this._recalcBounds();
  }

  _recalcBounds() {
    this.topY = 0;
    this.topHeight = Math.max(20, this.gapY - (this.gapSize / 2));

    this.bottomY = this.gapY + (this.gapSize / 2);
    this.bottomHeight = Math.max(20, this.playableHeight - this.bottomY);
  }

  update(dt, bird = null) {
    // Horizontal translation: x = x - speed * dt
    this.x -= this.speed * dt;
  }

  isOffScreen() {
    return this.x + this.width < -10;
  }

  render(ctx, theme = 'day') {
    ctx.save();

    // Pipe color themes depending on the active level
    let primaryGradColor, secondaryGradColor, rimColor, capColor;

    if (theme === 'day') {
      // Level 1: Classic Emerald Forest Pipes
      primaryGradColor = '#15803d';
      secondaryGradColor = '#22c55e';
      rimColor = '#166534';
      capColor = '#4ade80';
    } else if (theme === 'storm') {
      // Level 2: Industrial Weathered Steel with warning glow
      primaryGradColor = '#475569';
      secondaryGradColor = '#94a3b8';
      rimColor = '#334155';
      capColor = '#f59e0b';
    } else {
      // Level 3: Nightmare / Cyber Neon Obsidian
      primaryGradColor = '#312e81';
      secondaryGradColor = '#7c3aed';
      rimColor = '#1e1b4b';
      capColor = '#ec4899';
    }

    const capHeight = 24;
    const capOverhang = 6;

    // --- 1. RENDER TOP PIPE ---
    if (this.topHeight > 0) {
      // Body
      const topGrad = ctx.createLinearGradient(this.x, 0, this.x + this.width, 0);
      topGrad.addColorStop(0, rimColor);
      topGrad.addColorStop(0.3, secondaryGradColor);
      topGrad.addColorStop(0.7, primaryGradColor);
      topGrad.addColorStop(1, rimColor);

      ctx.fillStyle = topGrad;
      ctx.fillRect(this.x, 0, this.width, this.topHeight - capHeight);

      // Top Cap
      ctx.fillStyle = topGrad;
      ctx.fillRect(this.x - capOverhang, this.topHeight - capHeight, this.width + (capOverhang * 2), capHeight);

      // Top Cap Rim Highlight
      ctx.fillStyle = capColor;
      ctx.fillRect(this.x - capOverhang, this.topHeight - 3, this.width + (capOverhang * 2), 3);
    }

    // --- 2. RENDER BOTTOM PIPE ---
    if (this.bottomHeight > 0) {
      // Body
      const btmGrad = ctx.createLinearGradient(this.x, 0, this.x + this.width, 0);
      btmGrad.addColorStop(0, rimColor);
      btmGrad.addColorStop(0.3, secondaryGradColor);
      btmGrad.addColorStop(0.7, primaryGradColor);
      btmGrad.addColorStop(1, rimColor);

      ctx.fillStyle = btmGrad;
      ctx.fillRect(this.x, this.bottomY + capHeight, this.width, this.bottomHeight - capHeight);

      // Bottom Cap
      ctx.fillStyle = btmGrad;
      ctx.fillRect(this.x - capOverhang, this.bottomY, this.width + (capOverhang * 2), capHeight);

      // Bottom Cap Rim Highlight
      ctx.fillStyle = capColor;
      ctx.fillRect(this.x - capOverhang, this.bottomY, this.width + (capOverhang * 2), 3);
    }

    ctx.restore();
  }
}

/**
 * Level 2: Moving Obstacle with vertical harmonic oscillation.
 * Math: gapY(t) = baseGapY + amplitude * sin(omega * t + phase)
 */
class MovingObstacle extends Obstacle {
  constructor(x, gapY, gapSize = 165, speed = 145, width = 64) {
    super(x, gapY, gapSize, speed, width);
    this.type = 'moving';
    this.baseGapY = gapY;
    this.amplitude = 26; // gentle vertical oscillation height (was 45)
    this.frequency = 1.5; // smooth oscillation speed (rad/sec) (was 2.2)
    this.time = Math.random() * Math.PI * 2;
  }

  update(dt, bird = null) {
    super.update(dt);
    this.time += dt;

    // Harmonic sinusoidal motion: y(t) = y0 + A * sin(wt)
    this.gapY = this.baseGapY + (this.amplitude * Math.sin(this.time * this.frequency));

    // Clamp gap position safely inside screen bounds
    const minGapY = 90 + (this.gapSize / 2);
    const maxGapY = (this.playableHeight - 90) - (this.gapSize / 2);
    this.gapY = Math.max(minGapY, Math.min(maxGapY, this.gapY));

    this._recalcBounds();
  }
}

/**
 * Level 3: Simple Game-AI Inspired Obstacle.
 * Dynamically adjusts gap center based on player tracking and adaptive oscillation.
 * (Syllabus Unit III: Introduction to Game AI).
 */
class AIObstacle extends Obstacle {
  constructor(x, gapY, gapSize = 150, speed = 165, width = 64) {
    super(x, gapY, gapSize, speed, width);
    this.type = 'ai';
    this.trackingSpeed = 22; // Controlled, fair AI reaction rate in px/sec (was 45)
    this.phase = Math.random() * Math.PI * 2;
  }

  update(dt, bird = null) {
    super.update(dt);

    // Simple Game-AI Behavioral Rule:
    // When the obstacle approaches the player (within 280px),
    // the obstacle smoothly adjusts its gap elevation to track the bird altitude.
    if (bird && this.x > bird.x && (this.x - bird.x) < 280) {
      const targetY = bird.y;
      const dy = targetY - this.gapY;
      
      // Move toward bird with capped tracking speed
      const step = Math.sign(dy) * Math.min(Math.abs(dy), this.trackingSpeed * dt);
      this.gapY += step;
    } else {
      // Ambient slight pulse
      this.phase += dt * 3.0;
      this.gapY += Math.sin(this.phase) * (20 * dt);
    }

    // Strict boundary clamps
    const minGapY = 80 + (this.gapSize / 2);
    const maxGapY = (this.playableHeight - 80) - (this.gapSize / 2);
    this.gapY = Math.max(minGapY, Math.min(maxGapY, this.gapY));

    this._recalcBounds();
  }

  render(ctx, theme) {
    // Custom neon pulse indicator on the AI obstacle cap
    super.render(ctx, 'nightmare');

    // Draw an AI energy sensor line across the gap center
    ctx.save();
    ctx.strokeStyle = 'rgba(236, 72, 153, 0.4)';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(this.x, this.gapY);
    ctx.lineTo(this.x + this.width, this.gapY);
    ctx.stroke();
    ctx.restore();
  }
}
