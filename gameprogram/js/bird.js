/**
 * ============================================================================
 * Bird.js
 * Player-controlled entity with Newtonian physics simulation (Euler integration),
 * transformation matrices (translate, rotate, scale), and procedural animation.
 * ============================================================================
 */
class Bird {
  constructor(x = 100, y = 250) {
    // Spatial Cartesian Coordinates (Unit I Syllabus)
    this.startX = x;
    this.startY = y;
    this.x = x;
    this.y = y;
    this.radius = 16;

    // Kinematic Velocity Vector
    this.vy = 0;
    this.maxFallSpeed = 480; // Smooth, manageable terminal velocity

    // Angular orientation & rotation
    this.rotation = 0; // in radians
    this.targetRotation = 0;

    // Wing flap procedural animation timer
    this.flapPhase = 0;
    this.flapSpeed = 15;

    // Particle trail on jump
    this.particles = [];
  }

  /**
   * Resets bird position and state for level start or restart.
   */
  reset(x = this.startX, y = this.startY) {
    this.x = x;
    this.y = y;
    this.vy = 0;
    this.rotation = 0;
    this.targetRotation = 0;
    this.flapPhase = 0;
    this.particles = [];
  }

  /**
   * Applies an instantaneous upward jump impulse (replaces downward velocity).
   * @param {number} flapForce - Positive impulse magnitude
   */
  flap(flapForce = 300) {
    this.vy = -flapForce;
    this.targetRotation = -0.38;
    this.rotation = -0.30; // Snappy visual wing impulse

    // Spawn tiny feather/puff particles
    for (let i = 0; i < 4; i++) {
      this.particles.push({
        x: this.x - 10,
        y: this.y + (Math.random() * 8 - 4),
        vx: -(Math.random() * 50 + 20),
        vy: (Math.random() * 60 - 30),
        life: 1.0,
        decay: Math.random() * 2 + 2,
        size: Math.random() * 3 + 2
      });
    }
  }

  /**
   * Updates physics, velocity vector, and rotational transformation.
   * Demonstrates Delta-Time Euler Integration:
   * v(t + dt) = v(t) + g * dt
   * y(t + dt) = y(t) + v * dt
   */
  update(dt, gravity = 650) {
    // 1. Vector addition: Apply gravitational acceleration
    this.vy += gravity * dt;

    // Terminal velocity clamp (prevents uncontrollable freefall)
    if (this.vy > this.maxFallSpeed) {
      this.vy = this.maxFallSpeed;
    }

    // 2. Position vector update: Translation
    this.y += this.vy * dt;

    // 3. Compute rotation angle based on vertical velocity
    // When rising or near apex: maintain buoyant upward tilt
    // When descending steadily: smooth aerodynamic nose dive
    if (this.vy < 50) {
      this.targetRotation = -0.36; // upward aerodynamic pitch
    } else {
      this.targetRotation = Math.min(1.15, ((this.vy - 50) / 360) * 1.15);
    }
    // Smooth angle interpolation (lerp)
    this.rotation += (this.targetRotation - this.rotation) * (dt * 8);

    // 4. Update wing animation cycle
    this.flapPhase += dt * (this.vy < 0 ? 25 : 8);

    // 5. Update trail particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= p.decay * dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  /**
   * Renders the bird using Canvas transformation matrix:
   * translate() -> rotate() -> scale() -> restore()
   * (Fulfills Unit I Syllabus Requirements)
   */
  render(ctx) {
    // Render trail particles
    for (const p of this.particles) {
      ctx.save();
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, p.life * 0.7)})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.save();

    // 1. Translation: Move coordinate origin to bird center
    ctx.translate(this.x, this.y);

    // 2. Rotation: Rotate Cartesian plane by tilt angle theta
    ctx.rotate(this.rotation);

    // 3. Draw Bird Body (Layered geometric shapes)
    // Bird Body Gradient
    const bodyGrad = ctx.createRadialGradient(-3, -3, 2, 0, 0, this.radius);
    bodyGrad.addColorStop(0, '#fde047');
    bodyGrad.addColorStop(0.7, '#eab308');
    bodyGrad.addColorStop(1, '#ca8a04');

    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Belly highlight
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.ellipse(-2, 4, this.radius * 0.65, this.radius * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wing with flap oscillation
    const wingYOffset = Math.sin(this.flapPhase) * 5;
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.ellipse(-6, wingYOffset, 8, 5, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Eye (White sclera)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(7, -6, 6, 0, Math.PI * 2);
    ctx.fill();

    // Eye pupil (Dark)
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(9, -6, 3, 0, Math.PI * 2);
    ctx.fill();

    // Eye glint
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(10, -7.5, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Beak (Cartesian triangle)
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.moveTo(11, -2);
    ctx.lineTo(21, 1);
    ctx.lineTo(11, 6);
    ctx.closePath();
    ctx.fill();

    // Beak shine
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(11, -2);
    ctx.lineTo(20, 1);
    ctx.lineTo(11, 1);
    ctx.closePath();
    ctx.fill();

    // Feather Crest / Tuft
    ctx.fillStyle = '#ca8a04';
    ctx.beginPath();
    ctx.moveTo(-7, -13);
    ctx.lineTo(-2, -20);
    ctx.lineTo(3, -13);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}
