import { coord2D } from "./math";

export function coordToId(coord: coord2D) {
	const [row, col] = coord;
	return `${row}-${col}` as const;
}

export function idToCoord(id: string) {
	return id.split("-").map((comp) => Number(comp)) as coord2D;
}

export function styleElements(elements: string[], style: string) {
	elements.forEach((element) => {
		const gridElement = document.getElementById(`grid-${element}`);
		gridElement?.classList.add(style);
	});
}
