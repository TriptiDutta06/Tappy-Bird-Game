# TAPPY BIRD: SKYBOUND CHALLENGE
## Continuous Assessment 2 (CA-2) Project Report
**Course:** Game Programming  
**Submission Template:** `[RollNo]_[StudentInitials].docx` (e.g., `23_ABC.docx`)  
*Note: Students must replace 23 and ABC with their actual roll number and initials before final submission.*

---

## Table of Contents
1. [Title](#1-title)
2. [Introduction](#2-introduction)
3. [Problem Statement](#3-problem-statement)
4. [Game Concept](#4-game-concept)
5. [Objectives](#5-objectives)
6. [Technologies Used](#6-technologies-used)
7. [Hardware/Software Requirements](#7-hardwaresoftware-requirements)
8. [Game Controls](#8-game-controls)
9. [Gameplay](#9-gameplay)
10. [Game Architecture](#10-game-architecture)
11. [Game Loop](#11-game-loop)
12. [Level 1 — Training Sky](#12-level-1--training-sky)
13. [Level 2 — Storm Sky](#13-level-2--storm-sky)
14. [Level 3 — Nightmare Sky](#14-level-3--nightmare-sky)
15. [Mathematics/Graphics Concepts Used](#15-mathematicsgraphics-concepts-used)
16. [Vectors](#16-vectors)
17. [Coordinate System](#17-coordinate-system)
18. [Transformations](#18-transformations)
19. [Physics](#19-physics)
20. [Collision Detection](#20-collision-detection)
21. [Rendering](#21-rendering)
22. [Animation](#22-animation)
23. [Game Engine Concepts](#23-game-engine-concepts)
24. [Input Handling](#24-input-handling)
25. [UI Management](#25-ui-management)
26. [Testing](#26-testing)
27. [Results](#27-results)
28. [Future Scope](#28-future-scope)
29. [Conclusion](#29-conclusion)
30. [Game Programming Syllabus Mapping](#30-game-programming-syllabus-mapping)

---

## 1. Title
**Tappy Bird: Skybound Challenge**  
A Multistage 2D Browser-Based Arcade Game demonstrating Computer Graphics, Kinematic Physics, and Game Engine Architecture.

---

## 2. Introduction
Video game programming synthesizes foundational computer science disciplines: linear algebra, coordinate transformations, numerical physics simulation, real-time input dispatching, audio synthesis, and graphics rendering pipelines. **Tappy Bird: Skybound Challenge** was engineered from the ground up using pure standard web technologies (HTML5 Canvas, Vanilla ECMAScript, and modern CSS) without third-party frameworks, paid APIs, or external game engines such as Unity or Phaser.

---

## 3. Problem Statement
Many introductory game development projects either rely too heavily on heavyweight third-party game engines (which abstract away essential mathematical and rendering concepts), or reduce the scope to a static, single-screen flappy clone devoid of progressive mechanics. The challenge for CA-2 is to engineer a multi-stage, mathematically rigorous, self-contained 2D game running offline in standard browsers that visibly demonstrates every topic of the Game Programming curriculum.

---

## 4. Game Concept
The player pilots a kinetic avian character through perilous skies segmented into three distinct levels of increasing difficulty. The player overcomes continuous gravitational acceleration through discrete flap impulses, timing vertical trajectory through advancing pipe obstacles. Each level introduces distinct environmental dynamics, varying physics parameters, oscillating structures, weather particle systems, and responsive obstacle behavior.

---

## 5. Objectives
1. Implement a real-time, deterministic 60 FPS game loop utilizing `requestAnimationFrame()` with delta-time ($\Delta t$) clamping.
2. Develop a Newtonian physics system with position vectors, velocity vectors, and gravity Euler integration.
3. Construct transformation matrices (`translate`, `rotate`, `scale`) for velocity-based tilt orientation.
4. Implement rigorous Axis-Aligned Bounding Box (AABB) and Circle-to-Rectangle collision algorithms.
5. Create a 3-tier level progression system with distinct objectives, environmental themes, and dynamic obstacles.
6. Provide procedural, zero-dependency audio using the HTML5 Web Audio API to prevent CORS errors during offline evaluation.
7. Implement persistent data storage using browser `localStorage` for high scores and level unlocks.

---

## 6. Technologies Used
* **HTML5 Canvas 2D Context:** Low-level immediate mode graphics rendering.
* **Vanilla JavaScript (ES6+):** Object-oriented classes, state machines, and mathematical calculations.
* **Modern CSS3:** Glassmorphic UI overlays, typography, flexbox/grid layout, and arcade glow effects.
* **HTML5 Web Audio API:** Procedural mathematical frequency synthesis for real-time sound effects.
* **Browser LocalStorage API:** Client-side persistent key-value storage.

---

## 7. Hardware/Software Requirements
### Software Requirements:
* Any modern web browser (Google Chrome 90+, Mozilla Firefox 88+, Microsoft Edge 90+, Safari 14+).
* Text/Code editor (Antigravity IDE, Visual Studio Code, Sublime Text).
* No web server or database required (operates natively via `file://`).

### Hardware Requirements:
* **Processor:** Dual-core 1.6 GHz or higher.
* **RAM:** 2 GB minimum (4 GB recommended).
* **Display Resolution:** Minimum $800 \times 600$ (optimized for $480 \times 640$ viewport).
* **Input:** Keyboard and Mouse / Touchpad / Touchscreen.

---

## 8. Game Controls
| Action | Primary Input | Secondary / Touch | Function |
| :--- | :--- | :--- | :--- |
| **Flap Wings** | `SPACE` | Mouse Left Click / Screen Tap | Imparts upward velocity impulse vector |
| **Pause / Resume** | `P` | Top HUD ⏸ Button | Toggles active physics and object updates |
| **Back / Menu** | `ESC` | UI On-screen Buttons | Navigates back from sub-menus |
| **Mute Sound** | `M` | Top HUD 🔊 Button | Toggles Web Audio master gain state |

---

## 9. Gameplay
The player begins at the Main Menu with options to start playing, select unlocked stages, or view flight instructions. Upon starting:
1. The bird spawns at $(x = 110, y = 260)$.
2. Gravity continuously pulls the bird downward along the positive Y Cartesian axis.
3. The player flaps to maintain altitude and pass through gaps between vertical pipes.
4. Successfully crossing a pipe's horizontal boundary increments the stage score.
5. Reaching the stage target score clears the level and unlocks the subsequent stage.
6. Colliding with a pipe, the ground, or the sky ceiling triggers an immediate Game Over with a retry option.

---

## 10. Game Architecture
The codebase adheres to the Single Responsibility Principle (SRP) through modular ES6 classes:
* `Game`: Central coordinator, state machine, and `requestAnimationFrame` loop.
* `Bird`: Avatar kinematics, Euler integration, tilt rotation, and wing animation.
* `Obstacle`: Base static pipe pair class.
* `MovingObstacle`: Subclass with harmonic vertical oscillation ($A \sin(\omega t)$).
* `AIObstacle`: Subclass with predictive altitude-tracking gap behavior.
* `CollisionSystem`: Circle-AABB and boundary intersection calculations.
* `LevelManager`: Configurations for 3 stages, weather engines (rain, lightning, clouds, stars).
* `ScoreManager`: Current score, target goals, campaign tracking, and `localStorage`.
* `InputManager`: HID keyboard, mouse, and touch listener registry with debounce protection.
* `UIManager`: DOM overlay transitions, HUD updates, modal display.
* `AudioManager`: Web Audio API sound synthesizer.

---

## 11. Game Loop
The application implements an industry-standard game loop pattern:
```
1. Calculate Delta Time: dt = (currentTime - lastTime) / 1000
2. Clamp Delta Time: dt = min(dt, 0.08)
3. Process Inputs: Check keyboard and pointer flags
4. Update World Objects: bird.update(dt), obstacle.update(dt), environment.update(dt)
5. Detect Collisions: CollisionSystem.checkBirdObstacle(bird, obs)
6. Check Scoring & Objectives: bird.x > obs.x + obs.width
7. Clear Canvas: ctx.clearRect(0, 0, width, height)
8. Render Frame: Background -> Obstacles -> Bird -> HUD Overlays
9. Schedule Next Frame: requestAnimationFrame(gameLoop)
```

---

## 12. Level 1 — "Training Sky"
* **Difficulty:** Easy
* **Target Score:** 10 points
* **Gravity Acceleration:** $800 \text{ px/s}^2$
* **Flap Impulse:** $320 \text{ px/s}$
* **Horizontal Speed:** $155 \text{ px/s}$
* **Pipe Gap:** $165 \text{ px}$
* **Obstacle Configuration:** 100% static pipe pairs.
* **Visual Atmosphere:** Bright daylight sky gradient, drifting cumulus clouds, peaceful sunny horizon.
* **Objective:** Introduce basic controls and familiarize player with timing and momentum.

---

## 13. Level 2 — "Storm Sky"
* **Difficulty:** Medium
* **Target Score:** 15 points
* **Gravity Acceleration:** $920 \text{ px/s}^2$
* **Flap Impulse:** $345 \text{ px/s}$
* **Horizontal Speed:** $210 \text{ px/s}$
* **Pipe Gap:** $140 \text{ px}$
* **Obstacle Configuration:** 50% vertical moving obstacles oscillating sinusoidally ($y = y_0 + 45\sin(2.2t)$).
* **Visual Atmosphere:** Tempest slate background, active rain particle system (70 streaks with wind slant), dynamic lightning flashes.
* **Objective:** Challenge player reflexes against moving targets and visual distractions.

---

## 14. Level 3 — "Nightmare Sky"
* **Difficulty:** Hard
* **Target Score:** 20 points
* **Gravity Acceleration:** $1050 \text{ px/s}^2$
* **Flap Impulse:** $375 \text{ px/s}$
* **Horizontal Speed:** $260 \text{ px/s}$
* **Pipe Gap:** $120 \text{ px}$
* **Obstacle Configuration:** Oscillating pipes and AI-inspired adaptive tracking obstacles.
* **Visual Atmosphere:** Deep cosmic night sky, parallax twinkling starfield, crescent moon, neon obsidian pipes.
* **Objective:** Test master-level precision flight under high gravity and narrow clearances.

---

## 15. Mathematics/Graphics Concepts Used
The engine applies foundational linear algebra and calculus principles:
* **Position Vectors:** $\vec{r} = (x, y)$
* **Velocity Vectors:** $\vec{v} = (v_x, v_y)$
* **Vector Addition:** $\vec{r}_{t+\Delta t} = \vec{r}_t + \vec{v}\Delta t$
* **Harmonic Motion:** $y(t) = y_{\text{base}} + A \sin(\omega t + \phi)$
* **Rotation Matrix:** 2D Cartesian plane rotation about the origin.
* **Pythagorean Distance Optimization:** Testing squared Euclidean distance $(d^2 \le r^2)$ to avoid expensive square root operations.

---

## 16. Vectors
A vector in 2D space represents magnitude and direction:
$$\vec{v} = \begin{bmatrix} v_x \\ v_y \end{bmatrix}$$
In our simulation, gravity is a constant acceleration vector directed downwards: $\vec{g} = (0, g)$.
Flapping exerts an instantaneous impulse vector directed upwards: $\vec{J} = (0, -F_{\text{flap}})$.

---

## 17. Coordinate System
The game operates in standard 2D Screen Cartesian space:
* **Origin $(0, 0)$:** Upper-left corner of the HTML5 Canvas.
* **X-Axis:** Extends horizontally to the right ($+X$).
* **Y-Axis:** Extends vertically downward ($+Y$).
* **Playable World Dimensions:** $480 \text{ px (Width)} \times 640 \text{ px (Height)}$.
* **Ground Datum:** Positioned at $y = 580 \text{ px}$.

---

## 18. Transformations
Affine transformations are implemented using Canvas context transformation stack:
1. `ctx.save()`: Preserves previous transformation state.
2. `ctx.translate(bird.x, bird.y)`: Shifts origin to bird center.
3. `ctx.rotate(theta)`: Rotates plane by angle $\theta$ proportional to vertical velocity:
   $$\theta = \text{clamp}\left(\frac{v_y}{500} \times 1.2, -0.38 \text{ rad}, +1.22 \text{ rad}\right)$$
4. `ctx.restore()`: Restores global coordinate space for subsequent entities.

---

## 19. Physics
Numerical physics simulation utilizes First-Order Semi-Implicit Euler Integration:
$$v_y(t + \Delta t) = v_y(t) + g \cdot \Delta t$$
$$y(t + \Delta t) = y(t) + v_y(t + \Delta t) \cdot \Delta t$$
To prevent physics tunneling through obstacles during lag spikes, $\Delta t$ is capped at $0.08 \text{ s}$.

---

## 20. Collision Detection
The collision subsystem employs Circle-to-AABB (Axis-Aligned Bounding Box) testing:
1. Given a bird circle with center $(c_x, c_y)$ and radius $r$, and a pipe rectangle $[x_1, y_1, x_2, y_2]$:
2. Find the closest point $(p_x, p_y)$ on the rectangle to the circle:
   $$p_x = \max(x_1, \min(c_x, x_2))$$
   $$p_y = \max(y_1, \min(c_y, y_2))$$
3. Compute distance squared: $d^2 = (c_x - p_x)^2 + (c_y - p_y)^2$
4. If $d^2 \le r^2$, an intersection exists.

---

## 21. Rendering
Rendering employs immediate mode 2D Canvas rendering:
* Radial and linear gradients create lighting and depth on pipes, sky, and character.
* Dual-pass rendering ensures background scenery is drawn before interactive entities and UI overlays.
* Double buffering is handled natively by `requestAnimationFrame` before blitting to display hardware.

---

## 22. Animation
* **Wing Flapping:** Evaluates $\sin(\text{phase})$ to dynamically vary ellipse radii and vertical offsets.
* **Particle Systems:** Feather and smoke trail particles spawn on flap impulse with velocity, decay, and alpha fading.
* **Environmental Parallax:** Clouds and ground stripes scroll horizontally proportional to stage velocity.

---

## 23. Game Engine Concepts
The project demonstrates core structural game engine design patterns:
* **State Machine Pattern:** Regulates transitions between `MENU`, `PLAYING`, `PAUSED`, `LEVEL_COMPLETE`, `GAME_OVER`, and `VICTORY`.
* **Component Separation:** Rendering, input processing, and physics are decoupled into dedicated classes.
* **Object Pooling / Garbage Cleanup:** Offscreen obstacles are pruned using `splice` to prevent memory leaks.

---

## 24. Input Handling
The `InputManager` class intercepts Human Interface Device (HID) events:
* Listens to `keydown`, `keyup`, and `pointerdown`.
* Enforces key release before re-triggering flap impulses to prevent holding the spacebar to hover.
* Normalizes mouse clicks and mobile touch events onto a unified canvas input handler.

---

## 25. UI Management
User interface layers are organized into glassmorphic DOM modals floating over the game canvas:
* CSS `backdrop-filter: blur(12px)` provides modern aesthetics.
* Reactive HUD displaying stage number, live score, target goal, and an animated progress bar.
* Responsive feedback dialogs for Stage Clear, Game Over, Pause, and Grand Victory.

---

## 26. Testing
Comprehensive functional and boundary testing was performed:
* **Frame Rate Stability:** Maintained a consistent 60 FPS across extended playthroughs.
* **Edge Collisions:** Verified that grazing pipe corners, flying into the ceiling, or touching the ground immediately registers collision.
* **State Resets:** Confirmed that retrying resets velocity, positions, and timers without residual velocity.
* **Storage Persistence:** High score and stage unlock flags persist after refreshing the browser.
* **Web Audio Compatibility:** Verified that sound plays cleanly across Chrome, Edge, and Firefox without CORS blocking.

---

## 27. Results
* A completely functional, 3-level playable 2D game running in all major browsers.
* 100% offline functionality without any build step, npm dependency, or external server.
* Clear visual distinction and graduated difficulty between Training Sky, Storm Sky, and Nightmare Sky.

---

## 28. Future Scope
* Addition of power-ups (e.g., invincibility shield, speed boost, coin magnets).
* Sprite sheet asset importing with texture atlas animations.
* Online leaderboard synchronization using WebSocket services.
* Procedurally generated infinite survival mode following Stage 3 completion.

---

## 29. Conclusion
"Tappy Bird: Skybound Challenge" successfully fulfills all requirements for the CA-2 Game Programming evaluation. By writing pure vanilla JavaScript and HTML5 Canvas code without high-level engines, the project clearly demonstrates low-level mastery of coordinate spaces, vector mathematics, kinematic physics, collision algorithms, state machines, and real-time rendering pipelines.

---

## 30. Game Programming Syllabus Mapping

### Unit I: Mathematics & Transformations
* **Cartesian Coordinate System & XY Plane:** Canvas coordinate space ($X$ right, $Y$ down) implemented in `bird.js` and `game.js`.
* **Vectors & Kinematics:** Position $\vec{r}$ and velocity $\vec{v}$ vectors integrated with gravity $\vec{g}$.
* **Transformations (Translation, Rotation, Scaling):** `ctx.translate()` and `ctx.rotate()` dynamically tilting the bird based on instantaneous vertical velocity.
* **Geometric Shapes:** Rectangles (pipes, ground), circles (bird, particles, sun, moon), and polygons (beak, crest) drawn via Canvas 2D API paths.

### Unit II: Engine Architecture & Pipelines
* **CPU vs GPU Concept:** JavaScript execution on CPU; rasterization and alpha compositing hardware-accelerated by GPU via Canvas 2D context.
* **Game Loop & Delta Time:** `requestAnimationFrame()` with clamped $\Delta t$ ensuring consistent physics independent of display refresh rate (60Hz vs 144Hz).
* **Collision Detection:** Circle-to-AABB bounding box intersection separated cleanly in `collision.js`.
* **Input (HID) Processing:** Keyboard, mouse, and touch events mapped through `inputManager.js`.
* **UI & State Management:** Decoupled HTML/CSS overlay screens and state machine in `uiManager.js` and `game.js`.

### Unit III: 2D Game Development & AI
* **Level Progression:** 3 distinct stages with parameterized configurations in `levelManager.js`.
* **Particle Systems & Animation:** Procedural wing flap oscillation, weather effects (rain, lightning, clouds, stars), and feather trail particles.
* **Introduction to Game AI:** Dynamic obstacle in Level 3 (`AIObstacle` in `obstacle.js`) that tracks player altitude to create an adaptive gameplay hazard.
* **Audio Synthesis:** Real-time Web Audio API procedural sound synthesis in `audioManager.js`.
