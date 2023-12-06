export type coord2D = [number, number];

export function vec2PlaneAdd(a: coord2D, b: coord2D) {
	const [rowA, colA] = a;
	const [rowB, colB] = b;

	return [rowA + rowB, colA + colB] as coord2D;
}

export function modulo(a: number, b: number) {
	return ((a % b) + b) % b;
}

export function vec2ToroidAdd(
	a: coord2D,
	b: coord2D,
	rowMod: number,
	colMod: number
) {
	const [rowA, colA] = a;
	const [rowB, colB] = b;

	return [
		modulo(rowA + rowB, rowMod),
		modulo(colA + colB, colMod)
	] as coord2D;
}
