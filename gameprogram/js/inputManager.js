/**
 * ============================================================================
 * InputManager.js
 * Centralized Human Interface Device (HID) input processor for keyboard,
 * mouse, and touch events. Demonstrates Game Programming Unit II syllabus.
 * ============================================================================
 */
class InputManager {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.spacePressed = false;

    // Callback hooks for game events
    this.onFlap = null;
    this.onPauseToggle = null;
    this.onMenuToggle = null;
    this.onMuteToggle = null;

    this._bindEvents();
  }

  _bindEvents() {
    // Keyboard Event Listener
    window.addEventListener('keydown', (e) => {
      // Flap triggers: Space, ArrowUp, 'W'
      if (e.code === 'Space' || e.key === ' ' || e.code === 'ArrowUp' || e.key.toLowerCase() === 'w') {
        e.preventDefault();
        if (!this.spacePressed) {
          this.spacePressed = true;
          if (this.onFlap) this.onFlap();
        }
      }

      // Pause toggle: 'P'
      if (e.key.toLowerCase() === 'p') {
        e.preventDefault();
        if (this.onPauseToggle) this.onPauseToggle();
      }

      // Return/Menu: 'Escape'
      if (e.key === 'Escape') {
        e.preventDefault();
        if (this.onMenuToggle) this.onMenuToggle();
      }

      // Mute shortcut: 'M'
      if (e.key.toLowerCase() === 'm') {
        e.preventDefault();
        if (this.onMuteToggle) this.onMuteToggle();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'Space' || e.key === ' ' || e.code === 'ArrowUp' || e.key.toLowerCase() === 'w') {
        this.spacePressed = false;
      }
    });

    // Pointer / Mouse / Touch triggers on Canvas
    if (this.canvas) {
      this.canvas.addEventListener('pointerdown', (e) => {
        // Prevent default browser gesture behavior
        e.preventDefault();
        if (this.onFlap) this.onFlap();
      });
    }
  }
}
