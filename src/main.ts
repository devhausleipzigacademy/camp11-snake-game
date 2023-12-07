import { coord2D, vec2ToroidAdd } from "./math";
import { coordToId, idToCoord, styleElements } from "./utils";

// definitions
type DirectionEnum = "up" | "down" | "left" | "right";

const directions: Record<DirectionEnum, coord2D> = {
	up: [-1, 0],
	down: [1, 0],
	left: [0, -1],
	right: [0, 1]
};

////////////////////////

let game;

class SnakeGame {
	stopped: boolean = false;
	score: number = 0;
	snakeDirection: DirectionEnum = "up";
	snake: Array<string> = ["grid-9-10", "grid-10-10", "grid-11-10"];
	apples: Array<string> = [];
	rows: number = 21;
	columns: number = 21;
	gameLoopDelay: number = 100;

	constructor(
		public gameGrid: HTMLElement,
		public scoreElement: HTMLElement,
		public pauseResumeButton: HTMLElement,
		public resetButton: HTMLElement,
		public appleBiteSound: HTMLAudioElement
	) {
		this.gameGrid = gameGrid;
		this.scoreElement = scoreElement;
		this.pauseResumeButton = pauseResumeButton;
		this.resetButton = resetButton;
		this.appleBiteSound = appleBiteSound;
	}

	init() {
		this.generateApple();
		this.fillGrid();
		this.mountEventListeners();
		this.gameLoop();
	}

	fillGrid() {
		for (let row = 0; row < 21; row++) {
			for (let col = 0; col < 21; col++) {
				const newGridElement = document.createElement("div");
				newGridElement.id = `grid-${row}-${col}`;

				newGridElement.classList.add("grid-element");
				this.gameGrid.append(newGridElement);
			}
		}
	}

	emptyGrid() {
		while (gameGrid.firstChild) {
			gameGrid.removeChild(gameGrid.firstChild);
		}
	}

	resetGrid() {
		this.emptyGrid();
		this.fillGrid();
	}

	updateScore() {
		this.score += 1;
		scoreElement.textContent = `${this.score}`;
	}

	renderEntities() {
		styleElements(this.snake, "snake");
		styleElements(this.apples, "apple");
	}

	endGame() {
		this.stopped = true;
		alert("Game Over");
	}

	generateApple() {
		let noValidApple = true;

		while (noValidApple) {
			const newApple = [
				Math.floor(Math.random() * 21),
				Math.floor(Math.random() * 21)
			] as coord2D;

			const newAppleId = coordToId(newApple);

			const isSnakeCollission = this.snake.includes(newAppleId);
			const isAppleCollission = this.apples.includes(newAppleId);

			if (!isSnakeCollission && !isAppleCollission) {
				noValidApple = false;
				this.apples.push(newAppleId);
			}
		}
	}

	eatApple() {
		appleBiteSound.play();
		// score to update
		this.apples.pop(); // remove the first apple of the apples array
		this.updateScore();
		this.generateApple();
	}

	moveSnake() {
		const snakeHead = idToCoord(this.snake[0]!);
		const newSnakeHead = vec2ToroidAdd(
			snakeHead,
			directions[this.snakeDirection],
			this.rows,
			this.columns
		);

		const isSnakeCollission = this.snake.includes(coordToId(newSnakeHead));
		const isAppleCollission = this.apples.includes(coordToId(newSnakeHead));

		if (isSnakeCollission) {
			this.endGame();
			return;
		}

		if (isAppleCollission) {
			this.eatApple();
		} else {
			this.snake.pop(); // snake tail removed from snake
		}

		this.snake.unshift(coordToId(newSnakeHead)); // snake head added to snake
	}

	updateGame() {
		this.moveSnake();
	}

	renderGame() {
		this.resetGrid();
		this.renderEntities();
	}

	gameLoop() {
		setTimeout(() => {
			requestAnimationFrame(() => {
				this.updateGame();
				this.renderGame();

				if (!this.stopped) {
					this.gameLoop();
				}
			});
		}, this.gameLoopDelay);
	}

	controlEventListeners(event: KeyboardEvent) {
		const key = event.key;

		if (key === "ArrowUp") {
			if (this.snakeDirection === "down") {
				return;
			}
			this.snakeDirection = "up";
		} else if (key === "ArrowDown") {
			if (this.snakeDirection === "up") {
				return;
			}
			this.snakeDirection = "down";
		} else if (key === "ArrowLeft") {
			if (this.snakeDirection === "right") {
				return;
			}
			this.snakeDirection = "left";
		} else if (key === "ArrowRight") {
			if (this.snakeDirection === "left") {
				return;
			}
			this.snakeDirection = "right";
		}
	}

	pauseResumeEventListeners() {
		if (this.stopped) {
			this.stopped = false;
			this.gameLoop();
		} else {
			this.stopped = true;
		}
	}

	resetEventListeners() {
		this.stopped = true;
		this.unmountEventListeners();

		game = new SnakeGame(
			gameGrid,
			scoreElement,
			pauseResumeButton,
			resetButton,
			appleBiteSound
		);
		game.init();
	}

	mountEventListeners() {
		document.addEventListener(
			"keydown",
			this.controlEventListeners.bind(this)
		);
		pauseResumeButton.addEventListener(
			"click",
			this.pauseResumeEventListeners.bind(this)
		);
		resetButton.addEventListener(
			"click",
			this.resetEventListeners.bind(this)
		);
	}

	unmountEventListeners() {
		document.removeEventListener(
			"keydown",
			this.controlEventListeners.bind(this)
		);
		pauseResumeButton.removeEventListener(
			"click",
			this.pauseResumeEventListeners
		);
		resetButton.removeEventListener("click", this.resetEventListeners);
	}
}

const gameGrid = document.getElementById("game-grid")!;
const scoreElement = document.getElementById("score")!;
const pauseResumeButton = document.getElementById("pause-resume-button")!;
const resetButton = document.getElementById("reset-button")!;

const appleBiteSound = new Audio("./sound/apple-bite.mp3");
appleBiteSound.playbackRate = 3;

game = new SnakeGame(
	gameGrid,
	scoreElement,
	pauseResumeButton,
	resetButton,
	appleBiteSound
);
game.init();

////////////////////////

// create an HTML Input Element that allows numbers only
// make sure this input element is passed to the 'Snake' constructor as an argument
// create an event listener that listens for the onChange event of the input element and changes the gameLoopDelay property of the game object
// make sure the eventListener is mounted when the game is initialized, and unmounted when the game is reset
