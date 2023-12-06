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

// setup
const gameGrid = document.getElementById("game-grid")!;
const scoreElement = document.getElementById("score")!;
const pauseResumeButton = document.getElementById("pause-resume-button")!;
const resetButton = document.getElementById("reset-button")!;

const appleBiteSound = new Audio("./public/sound/apple-bite.mp3");
appleBiteSound.playbackRate = 3;

// define game configuration
const rows = 21;
const columns = 21;
const gameLoopDelay = 100;

// defining game state
const defaultDirection: DirectionEnum = "up";
const defaultSnake = ["9-10", "10-10", "11-10"];

let stopped = false;
let score = 0;
let snakeDirection: DirectionEnum = defaultDirection;
let snake = [...defaultSnake];
let apples: string[] = [];
generateApple();

// grid functions
function fillGrid() {
	for (let row = 0; row < 21; row++) {
		for (let col = 0; col < 21; col++) {
			const newGridElement = document.createElement("div");
			newGridElement.id = `grid-${row}-${col}`;

			newGridElement.classList.add("grid-element");
			gameGrid.append(newGridElement);
		}
	}
}

function emptyGrid() {
	while (gameGrid.firstChild) {
		gameGrid.removeChild(gameGrid.firstChild);
	}
}

function resetGrid() {
	emptyGrid();
	fillGrid();
}

// game update functions
function updateScore() {
	score += 1;
	scoreElement.textContent = `${score}`;
}

function renderEntities() {
	styleElements(snake, "snake");
	styleElements(apples, "apple");
}

function endGame() {
	stopped = true;
	alert("Game Over");
}

function generateApple() {
	let noValidApple = true;

	while (noValidApple) {
		const newApple = [
			Math.floor(Math.random() * 21),
			Math.floor(Math.random() * 21)
		] as coord2D;

		const newAppleId = coordToId(newApple);

		const isSnakeCollission = snake.includes(newAppleId);
		const isAppleCollission = apples.includes(newAppleId);

		if (!isSnakeCollission && !isAppleCollission) {
			noValidApple = false;
			apples.push(newAppleId);
		}
	}
}

function eatApple() {
	appleBiteSound.play();
	// score to update
	apples.pop(); // remove the first apple of the apples array
	updateScore();
	generateApple();
}

function moveSnake() {
	const snakeHead = idToCoord(snake[0]!);
	const newSnakeHead = vec2ToroidAdd(
		snakeHead,
		directions[snakeDirection],
		rows,
		columns
	);

	const isSnakeCollission = snake.includes(coordToId(newSnakeHead));
	const isAppleCollission = apples.includes(coordToId(newSnakeHead));

	if (isSnakeCollission) {
		endGame();
		return;
	}

	if (isAppleCollission) {
		eatApple();
	} else {
		snake.pop(); // snake tail removed from snake
	}

	snake.unshift(coordToId(newSnakeHead)); // snake head added to snake
}

function updateGame() {
	moveSnake();
}

function renderGame() {
	resetGrid();
	renderEntities();
}

function gameLoop() {
	setTimeout(() => {
		requestAnimationFrame(() => {
			updateGame();
			renderGame();

			if (!stopped) {
				gameLoop();
			}
		});
	}, gameLoopDelay);
}

// initialize Game
fillGrid();
renderEntities();
gameLoop();

// UI event listeners
document.addEventListener("keydown", (event) => {
	const key = event.key;

	if (key === "ArrowUp") {
		if (snakeDirection === "down") {
			return;
		}
		snakeDirection = "up";
	} else if (key === "ArrowDown") {
		if (snakeDirection === "up") {
			return;
		}
		snakeDirection = "down";
	} else if (key === "ArrowLeft") {
		if (snakeDirection === "right") {
			return;
		}
		snakeDirection = "left";
	} else if (key === "ArrowRight") {
		if (snakeDirection === "left") {
			return;
		}
		snakeDirection = "right";
	}
});

pauseResumeButton.addEventListener("click", () => {
	if (stopped) {
		stopped = false;
		gameLoop();
	} else {
		stopped = true;
	}
});

resetButton.addEventListener("click", () => {
	stopped = false;
	score = 0;
	snakeDirection = defaultDirection;
	snake = [...defaultSnake];
	apples = [];
	generateApple();
	resetGrid();
	scoreElement.textContent = `${score}`;
});
