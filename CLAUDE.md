# CLAUDE.md - AI Assistant Guide

## Project Overview

This is a **classic Pacman arcade game** built with vanilla JavaScript and the HTML5 Canvas API. No frameworks, libraries, or build tools are used — the game runs directly in a browser by opening an HTML file.

## Repository Structure

```
hello/
├── index.html              # Main entry point (links to pacman.js)
├── pacman.js               # Core game engine (all game logic)
└── pacman-standalone.html  # Single-file version (embedded JS, for easy sharing)
```

- **index.html** + **pacman.js**: The modular version. `index.html` provides the HTML/CSS shell and loads `pacman.js` via a `<script>` tag.
- **pacman-standalone.html**: A self-contained single-file copy of the entire game. Duplicates the logic from `pacman.js` inline.

## Tech Stack

- **Language**: Vanilla JavaScript (ES6+)
- **Rendering**: HTML5 Canvas (560x620px)
- **Styling**: Embedded CSS in each HTML file
- **Dependencies**: None
- **Build system**: None — no npm, no bundler, no transpiler

## How to Run

Open `index.html` (or `pacman-standalone.html`) in any modern web browser. No server or build step needed.

## Game Architecture (pacman.js)

### Constants & Map

- `TILE = 20` — pixel size of each grid cell
- `COLS = 28`, `ROWS = 31` — map dimensions
- `MAP` — 2D array encoding the maze layout:
  - `0` = Dot, `1` = Wall, `2` = Empty, `3` = Power pellet, `4` = Ghost house

### Key Objects

| Object | Description |
|--------|-------------|
| `pacman` | Player object with position, direction buffering, mouth animation, and movement at 150ms intervals |
| `ghosts` (array of 4) | Ghost class instances (Red, Pink, Cyan, Orange) with chase AI using Manhattan distance, 200ms movement interval, and scared-mode random movement |

### Game Mechanics

- **Scoring**: Dot = +10, Power pellet = +50, Eating scared ghost = +200
- **Lives**: 3 (lose one on ghost collision)
- **Power mode**: 7-second duration after eating a power pellet; ghosts turn blue and are edible
- **Win condition**: All dots eaten
- **Loss condition**: All lives lost
- **Tunnel wrapping**: Exiting left/right edge teleports to the opposite side

### Code Sections

The code is organized with section-header comments (`====`):

1. **Pacman** — Player object, drawing, movement, collision with dots
2. **Ghosts** — Ghost class, AI pathfinding, drawing
3. **Power Mode** — Power pellet activation and timer
4. **Collision Detection** — Pacman-ghost interaction
5. **Drawing** — Map rendering (walls, dots, pellets)
6. **Game Loop** — `requestAnimationFrame`-based main loop
7. **Input** — Arrow keys, WASD, and R to restart
8. **Reset** — Game state reset logic

### Input Controls

- **Arrow keys** or **WASD** — Move Pacman
- **R** — Restart the game
- First directional input starts the game

## Development Conventions

- No build or lint tooling is configured. Code changes take effect immediately on browser refresh.
- There are two copies of the game logic (`pacman.js` and inline in `pacman-standalone.html`). **Keep them in sync** when making gameplay changes.
- The map is defined as a hardcoded 2D array — edit the `MAP` constant to change the maze layout.
- No tests exist. Verify changes by playing the game in a browser.
- No `.gitignore` is configured.

## Important Notes for AI Assistants

- This is a zero-dependency, zero-build project. Do not introduce package managers or build tools unless explicitly requested.
- When modifying game logic, remember to update **both** `pacman.js` and `pacman-standalone.html` to keep them consistent.
- The canvas size (560x620) is derived from `COLS * TILE` x `ROWS * TILE`. Changing grid dimensions requires updating the canvas element in both HTML files.
