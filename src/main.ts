const gameGrid = document.getElementById("game-grid")!;

type DirectionEnum = "up" | "down" | "left" | "right";

const directions: Record<DirectionEnum, coord2D> = {
	up: [-1, 0],
	down: [1, 0],
	left: [0, -1],
	right: [0, 1]
};

const rows = 21;
const columns = 21;

function fillGrid() {
	for (let row = 0; row < 21; row++) {
		for (let col = 0; col < 21; col++) {
			const newGridElement = document.createElement("div");
			newGridElement.id = `grid-${row}-${col}`;

			newGridElement.classList.add("grid-element");
			newGridElement.textContent = `${row}-${col}`;
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

// Game State
let snakeDirection: DirectionEnum = "up";
const snake = ["9-10", "10-10", "11-10"];
const apples = ["2-2"];

function renderEntities() {
	styleElements(snake, "snake");
	styleElements(apples, "apple");
}

function coordToId(coord: coord2D) {
	const [row, col] = coord;
	return `${row}-${col}` as const;
}

function idToCoord(id: string) {
	return id.split("-").map((comp) => Number(comp)) as coord2D;
}

function vec2PlaneAdd(a: coord2D, b: coord2D) {
	const [rowA, colA] = a;
	const [rowB, colB] = b;

	return [rowA + rowB, colA + colB] as coord2D;
}

function modulo(a: number, b: number) {
	return ((a % b) + b) % b;
}

function vec2ToroidAdd(a: coord2D, b: coord2D) {
	const [rowA, colA] = a;
	const [rowB, colB] = b;

	return [modulo(rowA + rowB, rows), modulo(colA + colB, columns)] as coord2D;
}

type coord2D = [number, number];

function checkSnakeSelfCollission() {
	// TODO
	// check if snake head is in snake
	// if so, game over
	// endGame()
}

function moveSnake() {
	const snakeHead = idToCoord(snake[0]!);
	const snakeTail = idToCoord(snake.pop()!); // snake tail removed from snake

	const newSnakeHead = vec2ToroidAdd(snakeHead, directions[snakeDirection]);

	checkSnakeSelfCollision(newSnakeHead);

	snake.unshift(coordToId(newSnakeHead)); // snake head added to snake
}

function styleElements(elements: string[], style: string) {
	elements.forEach((element) => {
		const gridElement = document.getElementById(`grid-${element}`);
		gridElement?.classList.add(style);
	});
}

const gameLoopDelay = 300;

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
			gameLoop();
		});
	}, gameLoopDelay);
}

// initialize Game
fillGrid();
renderEntities();
gameLoop();

document.addEventListener("keydown", (event) => {
	const key = event.key;

	if (key === "ArrowUp") {
		snakeDirection = "up";
	} else if (key === "ArrowDown") {
		snakeDirection = "down";
	} else if (key === "ArrowLeft") {
		snakeDirection = "left";
	} else if (key === "ArrowRight") {
		snakeDirection = "right";
	}
});
