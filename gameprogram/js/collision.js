/**
 * ============================================================================
 * Collision.js
 * Algorithmic collision detection engine implementing Circle-to-AABB
 * (Axis-Aligned Bounding Box) and Boundary limits.
 * Demonstrates Unit I & II syllabus mathematics.
 * ============================================================================
 */
class CollisionSystem {
  /**
   * Tests collision between a 2D Circle (Bird) and an Axis-Aligned Bounding Box (Obstacle Pipe).
   * Math: Finds closest point on rectangle to circle center, then compares distance to radius.
   *
   * @param {Object} circle - { x, y, radius }
   * @param {Object} rect - { x, y, width, height }
   * @returns {boolean} - true if colliding
   */
  static checkCircleRect(circle, rect) {
    // 1. Clamp circle center to nearest point on the rectangle
    const closestX = Math.max(rect.x, Math.min(circle.x, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(circle.y, rect.y + rect.height));

    // 2. Compute distance vector from closest point to circle center
    const distanceX = circle.x - closestX;
    const distanceY = circle.y - closestY;

    // 3. Compare squared distance with squared radius (avoids costly Math.sqrt)
    const distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
    return distanceSquared <= (circle.radius * circle.radius);
  }

  /**
   * Tests standard 2D Axis-Aligned Bounding Box (AABB) intersection.
   *
   * @param {Object} rectA - { x, y, width, height }
   * @param {Object} rectB - { x, y, width, height }
   * @returns {boolean}
   */
  static checkAABB(rectA, rectB) {
    return (
      rectA.x < rectB.x + rectB.width &&
      rectA.x + rectA.width > rectB.x &&
      rectA.y < rectB.y + rectB.height &&
      rectA.y + rectA.height > rectB.y
    );
  }

  /**
   * Checks if the bird collides with world vertical boundaries (ceiling or ground).
   *
   * @param {Object} bird - Bird instance
   * @param {number} ceilingY - Top boundary (0)
   * @param {number} groundY - Floor boundary
   * @returns {string|null} - 'ceiling', 'ground', or null
   */
  static checkWorldBoundaries(bird, ceilingY = 0, groundY = 640) {
    // Collision with ground surface
    if (bird.y + bird.radius >= groundY) {
      return 'ground';
    }
    return null;
  }

  /**
   * Evaluates bird collision against an entire obstacle pair (top pipe + bottom pipe).
   *
   * @param {Object} bird
   * @param {Object} obstacle
   * @returns {boolean}
   */
  static checkBirdObstacle(bird, obstacle) {
    // Forgiving hitbox buffer (-3.5px) ensures tight visual clearance without cheap collisions
    const birdCircle = { x: bird.x, y: bird.y, radius: Math.max(8, bird.radius - 3.5) };
    
    // Top pipe bounds
    const topRect = {
      x: obstacle.x,
      y: obstacle.topY,
      width: obstacle.width,
      height: obstacle.topHeight
    };

    // Bottom pipe bounds
    const bottomRect = {
      x: obstacle.x,
      y: obstacle.bottomY,
      width: obstacle.width,
      height: obstacle.bottomHeight
    };

    return this.checkCircleRect(birdCircle, topRect) || this.checkCircleRect(birdCircle, bottomRect);
  }
}
