// ============================================
// Simple Pacman Game
// ============================================

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const messageEl = document.getElementById('message');

const TILE = 20;
const COLS = 28;
const ROWS = 31;

// Map legend: 1=wall, 0=dot, 2=empty, 3=power pellet, 4=ghost house
const MAP = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,3,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,3,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
    [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,0,1,1,1,1,1,2,1,1,2,1,1,1,1,1,0,1,1,1,1,1,1],
    [2,2,2,2,2,1,0,1,1,1,1,1,2,1,1,2,1,1,1,1,1,0,1,2,2,2,2,2],
    [2,2,2,2,2,1,0,1,1,2,2,2,2,2,2,2,2,2,2,1,1,0,1,2,2,2,2,2],
    [2,2,2,2,2,1,0,1,1,2,1,1,1,4,4,1,1,1,2,1,1,0,1,2,2,2,2,2],
    [1,1,1,1,1,1,0,1,1,2,1,4,4,4,4,4,4,1,2,1,1,0,1,1,1,1,1,1],
    [2,2,2,2,2,2,0,2,2,2,1,4,4,4,4,4,4,1,2,2,2,0,2,2,2,2,2,2],
    [1,1,1,1,1,1,0,1,1,2,1,4,4,4,4,4,4,1,2,1,1,0,1,1,1,1,1,1],
    [2,2,2,2,2,1,0,1,1,2,1,1,1,1,1,1,1,1,2,1,1,0,1,2,2,2,2,2],
    [2,2,2,2,2,1,0,1,1,2,2,2,2,2,2,2,2,2,2,1,1,0,1,2,2,2,2,2],
    [2,2,2,2,2,1,0,1,1,2,1,1,1,1,1,1,1,1,2,1,1,0,1,2,2,2,2,2],
    [1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,3,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,3,1],
    [1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1],
    [1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

// Deep copy map for reset
function copyMap() {
    return MAP.map(row => [...row]);
}

let map = copyMap();
let score = 0;
let lives = 3;
let gameStarted = false;
let gameOver = false;
let gameWon = false;
let powerMode = false;
let powerTimer = null;

// Count total dots
function countDots() {
    let count = 0;
    for (let r = 0; r < ROWS; r++)
        for (let c = 0; c < COLS; c++)
            if (map[r][c] === 0 || map[r][c] === 3) count++;
    return count;
}
let dotsLeft = countDots();

// ============================================
// Pacman
// ============================================
const pacman = {
    x: 14, y: 23,
    dir: { x: 0, y: 0 },
    nextDir: { x: 0, y: 0 },
    mouthOpen: 0,
    mouthDir: 1,
    speed: 150,

    reset() {
        this.x = 14; this.y = 23;
        this.dir = { x: 0, y: 0 };
        this.nextDir = { x: 0, y: 0 };
    },

    draw() {
        const cx = this.x * TILE + TILE / 2;
        const cy = this.y * TILE + TILE / 2;
        const r = TILE / 2 - 1;

        // Mouth animation
        this.mouthOpen += 0.15 * this.mouthDir;
        if (this.mouthOpen >= 0.3) this.mouthDir = -1;
        if (this.mouthOpen <= 0) this.mouthDir = 1;

        let angle = 0;
        if (this.dir.x === 1) angle = 0;
        else if (this.dir.x === -1) angle = Math.PI;
        else if (this.dir.y === -1) angle = -Math.PI / 2;
        else if (this.dir.y === 1) angle = Math.PI / 2;

        const mouth = this.mouthOpen * Math.PI;

        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(cx, cy, r, angle + mouth, angle + 2 * Math.PI - mouth);
        ctx.lineTo(cx, cy);
        ctx.closePath();
        ctx.fill();
    },

    canMove(dir) {
        const nx = this.x + dir.x;
        const ny = this.y + dir.y;
        // Tunnel wrap
        if (nx < 0 || nx >= COLS) return true;
        if (ny < 0 || ny >= ROWS) return false;
        return map[ny][nx] !== 1;
    },

    move() {
        if (this.canMove(this.nextDir)) {
            this.dir = { ...this.nextDir };
        }
        if (!this.canMove(this.dir)) return;

        this.x += this.dir.x;
        this.y += this.dir.y;

        // Tunnel wrap
        if (this.x < 0) this.x = COLS - 1;
        if (this.x >= COLS) this.x = 0;

        // Eat dot
        if (map[this.y][this.x] === 0) {
            map[this.y][this.x] = 2;
            score += 10;
            dotsLeft--;
        }
        // Eat power pellet
        if (map[this.y][this.x] === 3) {
            map[this.y][this.x] = 2;
            score += 50;
            dotsLeft--;
            activatePowerMode();
        }

        if (dotsLeft <= 0) {
            gameWon = true;
            messageEl.textContent = 'YOU WIN! Press R to restart';
        }
    }
};

// ============================================
// Ghosts
// ============================================
const GHOST_COLORS = ['#ff0000', '#ffb8ff', '#00ffff', '#ffb852'];

class Ghost {
    constructor(x, y, color) {
        this.startX = x;
        this.startY = y;
        this.x = x;
        this.y = y;
        this.color = color;
        this.dir = { x: 0, y: -1 };
        this.scared = false;
    }

    reset() {
        this.x = this.startX;
        this.y = this.startY;
        this.dir = { x: 0, y: -1 };
        this.scared = false;
    }

    draw() {
        const cx = this.x * TILE + TILE / 2;
        const cy = this.y * TILE + TILE / 2;
        const r = TILE / 2 - 1;

        ctx.fillStyle = this.scared ? '#2121de' : this.color;
        // Ghost body
        ctx.beginPath();
        ctx.arc(cx, cy - 2, r, Math.PI, 0);
        ctx.lineTo(cx + r, cy + r);
        // Wavy bottom
        for (let i = 0; i < 3; i++) {
            const segW = (2 * r) / 3;
            const sx = cx + r - i * segW;
            ctx.quadraticCurveTo(sx - segW / 4, cy + r - 4, sx - segW, cy + r);
        }
        ctx.closePath();
        ctx.fill();

        // Eyes
        if (!this.scared) {
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(cx - 4, cy - 3, 3, 0, Math.PI * 2);
            ctx.arc(cx + 4, cy - 3, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#00f';
            ctx.beginPath();
            ctx.arc(cx - 4 + this.dir.x * 1.5, cy - 3 + this.dir.y * 1.5, 1.5, 0, Math.PI * 2);
            ctx.arc(cx + 4 + this.dir.x * 1.5, cy - 3 + this.dir.y * 1.5, 1.5, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Scared face
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(cx - 4, cy - 3, 2, 0, Math.PI * 2);
            ctx.arc(cx + 4, cy - 3, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    canMove(dir) {
        const nx = this.x + dir.x;
        const ny = this.y + dir.y;
        if (nx < 0 || nx >= COLS) return true;
        if (ny < 0 || ny >= ROWS) return false;
        return map[ny][nx] !== 1;
    }

    move() {
        const dirs = [
            { x: 0, y: -1 },
            { x: 0, y: 1 },
            { x: -1, y: 0 },
            { x: 1, y: 0 },
        ];

        // Filter valid directions (no reversing unless stuck)
        const reverse = { x: -this.dir.x, y: -this.dir.y };
        let valid = dirs.filter(d =>
            this.canMove(d) && !(d.x === reverse.x && d.y === reverse.y)
        );
        if (valid.length === 0) {
            valid = dirs.filter(d => this.canMove(d));
        }
        if (valid.length === 0) return;

        if (this.scared) {
            // Random movement when scared
            this.dir = valid[Math.floor(Math.random() * valid.length)];
        } else {
            // Chase pacman (simple: pick direction that reduces distance)
            let best = valid[0];
            let bestDist = Infinity;
            for (const d of valid) {
                const nx = this.x + d.x;
                const ny = this.y + d.y;
                const dist = Math.abs(nx - pacman.x) + Math.abs(ny - pacman.y);
                if (dist < bestDist) {
                    bestDist = dist;
                    best = d;
                }
            }
            // Add some randomness so ghosts don't perfectly track
            if (Math.random() < 0.2 && valid.length > 1) {
                this.dir = valid[Math.floor(Math.random() * valid.length)];
            } else {
                this.dir = best;
            }
        }

        this.x += this.dir.x;
        this.y += this.dir.y;

        // Tunnel wrap
        if (this.x < 0) this.x = COLS - 1;
        if (this.x >= COLS) this.x = 0;
    }
}

const ghosts = [
    new Ghost(13, 14, GHOST_COLORS[0]),
    new Ghost(14, 14, GHOST_COLORS[1]),
    new Ghost(13, 12, GHOST_COLORS[2]),
    new Ghost(14, 12, GHOST_COLORS[3]),
];

// ============================================
// Power Mode
// ============================================
function activatePowerMode() {
    powerMode = true;
    ghosts.forEach(g => g.scared = true);
    clearTimeout(powerTimer);
    powerTimer = setTimeout(() => {
        powerMode = false;
        ghosts.forEach(g => g.scared = false);
    }, 7000);
}

// ============================================
// Collision Detection
// ============================================
function checkCollisions() {
    for (const ghost of ghosts) {
        if (ghost.x === pacman.x && ghost.y === pacman.y) {
            if (ghost.scared) {
                // Eat ghost
                score += 200;
                ghost.reset();
            } else {
                // Pacman dies
                lives--;
                livesEl.textContent = 'Lives: ' + lives;
                if (lives <= 0) {
                    gameOver = true;
                    messageEl.textContent = 'GAME OVER! Press R to restart';
                } else {
                    pacman.reset();
                    ghosts.forEach(g => g.reset());
                }
                return;
            }
        }
    }
}

// ============================================
// Drawing
// ============================================
function drawMap() {
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const x = c * TILE;
            const y = r * TILE;

            if (map[r][c] === 1) {
                ctx.fillStyle = '#2121de';
                ctx.fillRect(x, y, TILE, TILE);
                // Inner border for wall effect
                ctx.fillStyle = '#1919a6';
                ctx.fillRect(x + 2, y + 2, TILE - 4, TILE - 4);
            } else {
                ctx.fillStyle = '#000';
                ctx.fillRect(x, y, TILE, TILE);

                if (map[r][c] === 0) {
                    // Dot
                    ctx.fillStyle = '#ffb8ae';
                    ctx.beginPath();
                    ctx.arc(x + TILE / 2, y + TILE / 2, 2, 0, Math.PI * 2);
                    ctx.fill();
                } else if (map[r][c] === 3) {
                    // Power pellet (pulsing)
                    const pulse = Math.abs(Math.sin(Date.now() / 300)) * 2 + 4;
                    ctx.fillStyle = '#ffb8ae';
                    ctx.beginPath();
                    ctx.arc(x + TILE / 2, y + TILE / 2, pulse, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
    }
}

// ============================================
// Game Loop
// ============================================
let lastMove = 0;
let lastGhostMove = 0;
const GHOST_SPEED = 200;

function gameLoop(timestamp) {
    if (gameOver || gameWon) {
        drawMap();
        pacman.draw();
        ghosts.forEach(g => g.draw());
        scoreEl.textContent = 'Score: ' + score;
        return;
    }

    // Move pacman
    if (gameStarted && timestamp - lastMove > pacman.speed) {
        pacman.move();
        lastMove = timestamp;
    }

    // Move ghosts
    if (gameStarted && timestamp - lastGhostMove > GHOST_SPEED) {
        ghosts.forEach(g => g.move());
        lastGhostMove = timestamp;
    }

    checkCollisions();

    // Draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMap();
    pacman.draw();
    ghosts.forEach(g => g.draw());

    scoreEl.textContent = 'Score: ' + score;
    livesEl.textContent = 'Lives: ' + lives;

    requestAnimationFrame(gameLoop);
}

// ============================================
// Input
// ============================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'r' || e.key === 'R') {
        resetGame();
        return;
    }

    const dirs = {
        ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 }, W: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 }, S: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 }, A: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 }, D: { x: 1, y: 0 },
    };

    if (dirs[e.key]) {
        e.preventDefault();
        pacman.nextDir = dirs[e.key];
        if (!gameStarted && !gameOver && !gameWon) {
            gameStarted = true;
            messageEl.textContent = '';
        }
    }
});

// ============================================
// Reset
// ============================================
function resetGame() {
    map = copyMap();
    score = 0;
    lives = 3;
    gameOver = false;
    gameWon = false;
    gameStarted = false;
    powerMode = false;
    clearTimeout(powerTimer);
    dotsLeft = countDots();
    pacman.reset();
    ghosts.forEach(g => g.reset());
    messageEl.textContent = 'Press any arrow key to start';
    scoreEl.textContent = 'Score: 0';
    livesEl.textContent = 'Lives: 3';
    requestAnimationFrame(gameLoop);
}

// Start
requestAnimationFrame(gameLoop);
