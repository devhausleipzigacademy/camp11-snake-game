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
	for (let row = 1; row <= 21; row++) {
		for (let col = 1; col <= 21; col++) {
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
const snakeDirection: DirectionEnum = "up";
const snake = ["10-11", "11-11", "12-11"];
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

function vec2Add(a: coord2D, b: coord2D) {
	return [a[0] + b[0], a[1] + b[1]] as coord2D;
}

type coord2D = [number, number];

function moveSnake() {
	const snakeHead = idToCoord(snake[0]!);
	const snakeTail = idToCoord(snake.pop()!); // snake tail removed from snake

	const newSnakeHead = vec2Add(snakeHead, directions[snakeDirection]);
	snake.unshift(coordToId(newSnakeHead)); // snake head added to snake
}

function styleElements(elements: string[], style: string) {
	elements.forEach((element) => {
		const gridElement = document.getElementById(`grid-${element}`);
		gridElement?.classList.add(style);
	});
}

// initialize Game
fillGrid();
renderEntities();

// test moving snake & rerendering new state
moveSnake();
resetGrid();
renderEntities();
