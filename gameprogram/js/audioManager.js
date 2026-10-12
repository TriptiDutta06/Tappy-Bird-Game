/**
 * ============================================================================
 * AudioManager.js
 * Synthesizes procedural 8-bit / arcade sound effects via Web Audio API.
 * 100% offline and standalone: No external MP3/WAV files, preventing CORS issues.
 * ============================================================================
 */
class AudioManager {
  constructor() {
    this.audioCtx = null;
    this.muted = false;
    this.initialized = false;
  }

  /**
   * Initializes or unlocks Web Audio Context on first user interaction.
   */
  init() {
    if (!this.initialized) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
        this.initialized = true;
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  /**
   * Toggle mute state. Returns the new muted boolean.
   */
  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  /**
   * Generates a tone oscillator with volume envelope.
   */
  _createTone(freq, type = 'sine', duration = 0.15, gainVal = 0.2) {
    if (this.muted) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gainNode.gain.setValueAtTime(gainVal, this.audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Audio playback error:", e);
    }
  }

  /**
   * Flap sound: Quick rising pitch chirp.
   */
  playFlap() {
    if (this.muted) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.12);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {}
  }

  /**
   * Score sound: Harmonious two-tone arcade chime.
   */
  playScore() {
    if (this.muted) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      
      // Note 1 (E5)
      const osc1 = this.audioCtx.createOscillator();
      const gain1 = this.audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0.2, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc1.connect(gain1);
      gain1.connect(this.audioCtx.destination);
      osc1.start(now);
      osc1.stop(now + 0.1);

      // Note 2 (B5)
      const osc2 = this.audioCtx.createOscillator();
      const gain2 = this.audioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(987.77, now + 0.08);
      gain2.gain.setValueAtTime(0.25, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc2.connect(gain2);
      gain2.connect(this.audioCtx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.28);
    } catch (e) {}
  }

  /**
   * Collision sound: Low crunch/distortion burst.
   */
  playHit() {
    if (this.muted) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.linearRampToValueAtTime(40, now + 0.25);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {}
  }

  /**
   * Level Complete: Ascending triumphant triad arpeggio.
   */
  playLevelComplete() {
    if (this.muted) return;
    this.init();
    if (!this.audioCtx) return;

    const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this._createTone(freq, 'triangle', 0.22, 0.22);
      }, idx * 110);
    });
  }

  /**
   * Final Game Victory: Grand melodic fanfare.
   */
  playVictory() {
    if (this.muted) return;
    this.init();
    if (!this.audioCtx) return;

    const sequence = [
      { f: 523.25, d: 0.15, delay: 0 },    // C5
      { f: 659.25, d: 0.15, delay: 140 },  // E5
      { f: 783.99, d: 0.15, delay: 280 },  // G5
      { f: 1046.50, d: 0.45, delay: 420 }, // C6
      { f: 880.00, d: 0.15, delay: 650 },  // A5
      { f: 1046.50, d: 0.6, delay: 820 }   // C6 sustained
    ];

    sequence.forEach(item => {
      setTimeout(() => {
        this._createTone(item.f, 'sine', item.d, 0.25);
      }, item.delay);
    });
  }
}
