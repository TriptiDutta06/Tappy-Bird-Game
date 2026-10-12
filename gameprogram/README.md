# Tappy Bird: Skybound Challenge 🎮
> **College CA-2 Game Programming Evaluation Project**  
> Built with HTML5 Canvas, Vanilla JavaScript (ES6+), and CSS3.  
> *No Unity • No External Game Engines • No Paid APIs • 100% Offline Capable*

---

## 1. Project Overview & Features
**Tappy Bird: Skybound Challenge** is a multi-stage 2D browser-based arcade game designed to explicitly demonstrate the core principles of game engine architecture, 2D computer graphics, Cartesian coordinate math, vector physics, collision detection, and procedural audio.

### Key Highlights:
* **Three Distinct Stages with Graduated Difficulty:**
  * **Level 1 — "Training Sky" (Easy):** Sunny morning sky, static pipes, wide gaps ($185\text{px}$), gentle gravity ($620\text{px/s}^2$), responsive jump impulse, target score: **8**.
  * **Level 2 — "Storm Sky" (Medium):** Tempest weather with animated rain streaks, wind drift, dynamic lightning flashes, gentle harmonic oscillating pipes ($A \sin(\omega t)$), comfortable gaps ($165\text{px}$), target score: **12**.
  * **Level 3 — "Nightmare Sky" (Hard):** Cosmic night theme with twinkling parallax starfield, neon obsidian pipes, moderate pipe velocity ($165\text{px/s}$), balanced gaps ($150\text{px}$), stable gravity ($710\text{px/s}^2$), and dynamic AI-inspired tracking obstacles, target score: **15**.
* **Zero External Dependencies / 100% Offline:** Operates directly by double-clicking `index.html` via `file://`.
* **Integrated Procedural Audio Engine:** Procedurally synthesizes sound effects (flap chirp, score chime, collision crash, level clear fanfare, victory fanfare) via the HTML5 Web Audio API—preventing browser CORS errors from external audio files.
* **Persistent Progress:** High scores and unlocked stages are saved client-side using `localStorage`.

---

## 2. Project File Structure
```
tappy-bird/
│
├── index.html                  # Responsive HTML container, Canvas, and glassmorphic UI screens
├── README.md                   # Complete evaluation, viva, and execution guide
├── server.js                   # Optional local Node HTTP server (for evaluation convenience)
│
├── css/
│   └── style.css               # Modern arcade glassmorphic styling, HUD, typography, buttons
│
├── js/
│   ├── main.js                 # Bootstrap and application entry point
│   ├── game.js                 # Central engine loop, state machine, and entity coordinators
│   ├── bird.js                 # Player avatar: vector physics, Euler integration, tilt rotation
│   ├── obstacle.js             # Static, harmonic oscillating, and AI tracking obstacle classes
│   ├── collision.js            # Circle-to-AABB and boundary collision detection algorithms
│   ├── levelManager.js         # Level configurations and weather particle systems (rain, clouds, stars)
│   ├── scoreManager.js         # Active score, target goals, campaign tracking, and localStorage
│   ├── inputManager.js         # HID input processor for keyboard, mouse, and mobile touch
│   ├── uiManager.js            # Modal transitions, HUD data binding, and screen management
│   └── audioManager.js         # Procedural Web Audio API sound effect synthesizer
│
├── assets/
│   ├── images/                 # Placeholder directory (pure procedural Canvas vector graphics used)
│   └── audio/                  # Placeholder directory (pure Web Audio synthesizer used)
│
└── documentation/
    ├── PROJECT_REPORT.md       # Comprehensive 30-section CA-2 Evaluation Report & Viva Guide
    ├── 23_ABC_TEMPLATE.doc     # MS Word submission document template
    └── export_to_doc.js        # Script to update Word submission document from markdown
```

---

## 3. Explanation of Important Files
* **[`index.html`](file:///c:/Users/dutta/OneDrive/Desktop/gameprogram/index.html):** Declares the primary `<canvas width="480" height="640">` element alongside decoupled DOM overlays for the Main Menu, Level Select, How to Play, Pause, Game Over, Level Complete, and Final Victory screens.
* **[`js/game.js`](file:///c:/Users/dutta/OneDrive/Desktop/gameprogram/js/game.js):** Coordinates the main game loop using `requestAnimationFrame(loop)`, calculates delta time ($\Delta t$) clamped to $0.08\text{s}$, transitions states, spawns obstacles, updates entities, checks collisions, and controls rendering passes.
* **[`js/bird.js`](file:///c:/Users/dutta/OneDrive/Desktop/gameprogram/js/bird.js):** Encapsulates the player character. Implements numerical Euler integration:
  $$\vec{v}_y(t + \Delta t) = \vec{v}_y(t) + g \cdot \Delta t$$
  $$\vec{y}(t + \Delta t) = \vec{y}(t) + \vec{v}_y \cdot \Delta t$$
  Applies 2D affine transformation matrices (`ctx.translate`, `ctx.rotate`) to orient the bird according to its vertical velocity vector.
* **[`js/obstacle.js`](file:///c:/Users/dutta/OneDrive/Desktop/gameprogram/js/obstacle.js):** Contains the base `Obstacle` class and its subclasses:
  - `MovingObstacle`: Computes harmonic vertical displacement $\Delta y = A \sin(\omega t)$.
  - `AIObstacle`: Implements a simple behavioral AI algorithm that dynamically tracks player altitude as it approaches.
* **[`js/collision.js`](file:///c:/Users/dutta/OneDrive/Desktop/gameprogram/js/collision.js):** Mathematical collision detection decoupled from rendering. Clamps circle center to rectangle bounds to compute squared Euclidean distance $(d^2 \le r^2)$.
* **[`js/levelManager.js`](file:///c:/Users/dutta/OneDrive/Desktop/gameprogram/js/levelManager.js):** Stores stage parameters (gravity, speed, gap, target score) and coordinates environmental particle systems (drifting clouds, rain streaks, lightning flashes, twinkling stars, and parallax ground hash markers).
* **[`js/audioManager.js`](file:///c:/Users/dutta/OneDrive/Desktop/gameprogram/js/audioManager.js):** Synthesizes sound waves directly in the browser using `AudioContext`, oscillators (sine, triangle, sawtooth), and gain envelopes.

---

## 4. How to Run the Game Locally

### Option A: Instant Direct Browser Launch (No server needed)
1. Open the project folder in Windows File Explorer.
2. Double-click **`index.html`**.
3. The game will launch immediately in your default browser (Chrome, Edge, Firefox, etc.) with full audio and visual features.

### Option B: Using the Local Node Server (Optional)
1. Open PowerShell / Command Prompt inside the `gameprogram` directory.
2. Run:
   ```bash
   node server.js
   ```
3. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

---

## 5. Controls
* **Flap Wings (Ascend):** `SPACEBAR` or **Mouse Left Click** / **Touch Tap**.
* **Pause / Resume:** `P` key or click the ⏸ button in the HUD.
* **Main Menu / Back:** `ESC` key or click on-screen buttons.
* **Mute / Unmute Audio:** `M` key or click the 🔊 icon in the HUD.

---

## 6. How to Demonstrate During College CA-2 Evaluation
Follow this step-by-step walkthrough during your viva / practical presentation:

1. **Main Menu Presentation:**
   * Launch `index.html`.
   * Highlight the glassmorphic arcade UI, persistent high score, and unlocked level badges.
   * Click **"HOW TO PLAY"** to demonstrate the flight manual and syllabus controls.
2. **Level 1 Demonstration (Training Sky):**
   * Click **"PLAY NOW"** or select Level 1 from **"LEVEL SELECT"**.
   * Demonstrate basic flight physics: show how tapping `SPACE` imparts an upward impulse vector and how releasing it allows gravity to accelerate the bird downward.
   * Show velocity-based rotation: climbing tilts the bird up; falling tilts it down.
   * Pass pipes until reaching the target score of **8**.
   * Show the **Stage Cleared** modal with the option to advance to Level 2.
3. **Level 2 Demonstration (Storm Sky):**
   * Advance to Level 2.
   * Point out the dynamic weather engine: storm sky, falling rain particles with wind angle, and random lightning flashes.
   * Point out the **Moving Obstacles**: vertical pipes moving up and down via harmonic sine wave motion.
   * Pass pipes until reaching the target score of **12**.
4. **Level 3 Demonstration (Nightmare Sky):**
   * Advance to Level 3.
   * Highlight the cosmic night theme, twinkling parallax starfield, crescent moon, and neon cyber pipes.
   * Demonstrate the **Simple Game AI**: observe how the AI obstacles detect the bird's elevation and smoothly adapt their gap height to create an intelligent hazard.
   * Show that reaching the target score of **15** triggers the **Final Victory Screen ("Skybound Master")** with total score summary.
5. **Testing Edge Cases & Mechanics:**
   * Demonstrate **Pause (`P`)**: physics halts instantly; resuming resumes smoothly.
   * Demonstrate **Collision Detection**: deliberately graze a pipe or land on the ground to show the **Game Over Screen** with custom reason string and instant retry capability.

---

## 7. Short Viva Q&A Guide for Students

**Q1: What is the coordinate system used by HTML5 Canvas?**  
> *Answer:* The canvas uses a 2D Cartesian screen coordinate system where the origin $(0, 0)$ is at the top-left corner. The $X$-axis increases positively to the right, and the $Y$-axis increases positively downward.

**Q2: How is physics simulated without a third-party physics engine?**  
> *Answer:* We use First-Order Semi-Implicit Euler integration calculated on every frame:
> $$v_y \leftarrow v_y + g \cdot \Delta t$$
> $$y \leftarrow y + v_y \cdot \Delta t$$
> Delta time ($\Delta t$) ensures the physics simulation runs at the same physical speed regardless of whether the user has a 60 Hz or 144 Hz monitor.

**Q3: How does the bird tilt dynamically?**  
> *Answer:* We use Canvas transformation matrices: `ctx.save()`, `ctx.translate(bird.x, bird.y)`, and `ctx.rotate(angle)`. The angle is calculated as a function of the bird's vertical velocity $v_y$, clamped between $-25^\circ$ (ascending) and $+70^\circ$ (falling).

**Q4: How does collision detection work?**  
> *Answer:* We use Circle-to-AABB (Axis-Aligned Bounding Box) collision detection in `CollisionSystem.checkCircleRect()`. The closest point on the pipe rectangle to the bird's center is calculated by clamping coordinates, and we compare the squared Euclidean distance with the squared radius:
> $$d^2 = (c_x - p_x)^2 + (c_y - p_y)^2 \le r^2$$
> Using squared distance avoids the computational overhead of `Math.sqrt()`.

**Q5: How does the AI obstacle in Level 3 work?**  
> *Answer:* As part of syllabus Unit III (Introduction to Game AI), the `AIObstacle` implements a simple behavioral rule: when the pipe is within 280 pixels of the bird, it calculates the vertical delta between the bird's altitude and its gap center, smoothly adjusting its gap elevation towards the player at a rate of 45 px/s.

**Q6: Why use the Web Audio API instead of loading MP3 files?**  
> *Answer:* Browsers frequently block external audio files with CORS errors when HTML files are opened directly via `file://`. By synthesizing 8-bit sound waves procedurally using `AudioContext` oscillators and gain nodes, the game is 100% self-contained and guaranteed to play audio offline without a server.

---

## 8. Mapping to Game Programming Syllabus

| Syllabus Unit | Concept | Implementation in Code |
| :--- | :--- | :--- |
| **Unit I** | Cartesian Coordinate System | Origin $(0, 0)$ at top-left; $X$ right, $Y$ down (`bird.js`, `game.js`). |
| **Unit I** | Position & Velocity Vectors | $\vec{r} = (x, y)$, $\vec{v} = (0, v_y)$ in `Bird` class. |
| **Unit I** | Transformations (Translation, Rotation) | `ctx.translate()` and `ctx.rotate()` in `bird.js` `render()`. |
| **Unit I** | Geometric Shapes | Circles, arcs, ellipses, polygons, and rectangles rendered via Path2D. |
| **Unit II** | CPU vs GPU Concept | Logic/physics executed on CPU; rasterization hardware-accelerated by GPU. |
| **Unit II** | Game Loop & Delta Time | `requestAnimationFrame()` with delta-time clamping in `game.js`. |
| **Unit II** | Collision Detection | Circle-to-AABB bounding box checks in `collision.js`. |
| **Unit II** | Human Interface Device (HID) Input | Keyboard, mouse, and touch listener registry in `inputManager.js`. |
| **Unit II** | UI & Event Management | Decoupled glassmorphic DOM screens and state transitions in `uiManager.js`. |
| **Unit III** | 2D Game Development & Progression | 3 distinct levels with progressive parameters in `levelManager.js`. |
| **Unit III** | Particle Systems & Animation | Wing flap cycles, feather trail particles, rain, and lightning. |
| **Unit III** | Introduction to Game AI | Behavioral tracking obstacle in `obstacle.js` (`AIObstacle`). |

---

## 9. Submission Instructions (CA-2 Evaluation)
The required evaluation document format is **`[RollNo]_[StudentInitials].docx`** (e.g., `23_ABC.docx`).
1. Navigate to the `documentation/` folder.
2. Open `23_ABC_TEMPLATE.doc` in Microsoft Word or Google Docs.
3. Replace `23_ABC` with your actual roll number and name/initials.
4. Save the file as `23_ABC.docx` (e.g. `12_JDS.docx`).
5. Submit along with the project code!

