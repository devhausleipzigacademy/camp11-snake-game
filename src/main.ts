const gameGrid = document.getElementById("game-grid")!;

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
const snake = ["10-11", "11-11", "12-11"];
const apples = ["2-2"];

function renderEntities() {
	styleElements(snake, "snake");
	styleElements(apples, "apple");
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
