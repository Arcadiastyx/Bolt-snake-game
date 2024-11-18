import './style.css';
import Toastify from 'toastify-js';

const CANVAS_SIZE = 400;
const GRID_SIZE = 20;
const CELL_SIZE = CANVAS_SIZE / GRID_SIZE;
const INITIAL_SPEED = 150;

class Game {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = CANVAS_SIZE;
    this.canvas.height = CANVAS_SIZE;
    
    this.snake = [];
    this.direction = 'right';
    this.nextDirection = 'right';
    this.food = null;
    this.score = 0;
    this.gameLoop = null;
    this.isPaused = false;
    
    this.setupEventListeners();
  }

  setupEventListeners() {
    document.addEventListener('keydown', (e) => {
      const directions = {
        'ArrowUp': 'up',
        'ArrowDown': 'down',
        'ArrowLeft': 'left',
        'ArrowRight': 'right'
      };
      
      if (directions[e.key]) {
        const newDirection = directions[e.key];
        const opposites = { up: 'down', down: 'up', left: 'right', right: 'left' };
        if (opposites[this.direction] !== newDirection) {
          this.nextDirection = newDirection;
        }
      }
    });

    document.getElementById('pause-button').addEventListener('click', () => this.togglePause());
    document.getElementById('quit-button').addEventListener('click', () => this.quit());
    document.getElementById('start-button').addEventListener('click', () => this.start());
    document.getElementById('replay-button').addEventListener('click', () => this.start());
  }

  start() {
    this.snake = [
      { x: 5, y: 10 },
      { x: 4, y: 10 },
      { x: 3, y: 10 }
    ];
    this.direction = 'right';
    this.nextDirection = 'right';
    this.score = 0;
    this.isPaused = false;
    this.generateFood();
    
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-over-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    
    if (this.gameLoop) clearInterval(this.gameLoop);
    this.gameLoop = setInterval(() => this.update(), INITIAL_SPEED);
  }

  showToast(message) {
    Toastify({
      text: message,
      duration: 2000,
      gravity: "top",
      position: "center",
      style: {
        background: "var(--primary-color)",
      }
    }).showToast();
  }

  togglePause() {
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      clearInterval(this.gameLoop);
      this.showToast("Jeu en pause");
    } else {
      this.gameLoop = setInterval(() => this.update(), INITIAL_SPEED);
    }
  }

  quit() {
    clearInterval(this.gameLoop);
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
    this.showToast("Jeu quitté");
  }

  generateFood() {
    do {
      this.food = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (this.snake.some(segment => segment.x === this.food.x && segment.y === this.food.y));
  }

  update() {
    this.direction = this.nextDirection;
    const head = { ...this.snake[0] };
    
    switch (this.direction) {
      case 'up': head.y--; break;
      case 'down': head.y++; break;
      case 'left': head.x--; break;
      case 'right': head.x++; break;
    }

    if (this.checkCollision(head)) {
      this.gameOver();
      return;
    }

    this.snake.unshift(head);
    
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score++;
      this.generateFood();
    } else {
      this.snake.pop();
    }

    this.draw();
  }

  checkCollision(head) {
    return (
      head.x < 0 || head.x >= GRID_SIZE ||
      head.y < 0 || head.y >= GRID_SIZE ||
      this.snake.some(segment => segment.x === head.x && segment.y === head.y)
    );
  }

  gameOver() {
    clearInterval(this.gameLoop);
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('game-over-screen').classList.remove('hidden');
    document.getElementById('final-score').textContent = this.score;
    this.showToast("Vous avez perdu");
  }

  draw() {
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw snake
    this.ctx.fillStyle = '#ffffff';
    this.snake.forEach(segment => {
      this.ctx.fillRect(
        segment.x * CELL_SIZE,
        segment.y * CELL_SIZE,
        CELL_SIZE - 1,
        CELL_SIZE - 1
      );
    });

    // Draw food
    this.ctx.fillStyle = '#ff0000';
    this.ctx.fillRect(
      this.food.x * CELL_SIZE,
      this.food.y * CELL_SIZE,
      CELL_SIZE - 1,
      CELL_SIZE - 1
    );
  }
}

// Initialize game
new Game();