import { coord2D } from "./math";

export function coordToId(coord: coord2D) {
	const [row, col] = coord;
	return `grid-${row}-${col}` as const;
}

export function idToCoord(id: string) {
	return id
		.replace("grid-", "")
		.split("-")
		.map((comp) => Number(comp)) as coord2D;
}

export function styleElements(ids: string[], style: string) {
	ids.forEach((id) => {
		const gridElement = document.getElementById(id);
		gridElement?.classList.add(style);
	});
}
