/**
 * ============================================================================
 * Main.js
 * Application bootstrap and entry point for "Tappy Bird: Skybound Challenge".
 * ============================================================================
 */

window.addEventListener('DOMContentLoaded', () => {
  // Initialize the central Game engine instance
  window.gameInstance = new Game();
  console.log("🎮 Tappy Bird: Skybound Challenge successfully initialized.");
});
