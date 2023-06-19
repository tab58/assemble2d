import VError from "verror";

/// Checks if the tolerance is positive but under unity.
export const isValidTolerance = (tol: number): boolean => {
	return tol >= 0.0 && tol < 1.0;
}

export const isOverflow = (x: number): boolean => {
	return x === Number.POSITIVE_INFINITY || x === Number.NEGATIVE_INFINITY;
}

export const isNaN = (x: number): boolean => {
	return Number.isNaN(x);
}

export const resultFromCalculation = async (x: number): Promise<number> => {
	if (isOverflow(x)) {
		throw new VError("result_from_calculation(): overflowed result");
	} else if (isNaN(x)) {
		throw new VError("result_from_calculation(): number is NaN");
	} else {
		return x;
	}
}

// Computes the 2-norm of a vector (i.e. sqrt(a^2 + b^2)) in a numerically-stable way.
export const nrm2 = (a: number, b: number): number => {
	if (a === 0.0 && b === 0.0) {
		return 0.0;
	}

	const x = Math.abs(a);
	const y = Math.abs(b);
	const u = Math.max(x, y);
	const t = Math.min(x, y) / u;
	return u * Math.sqrt(1.0 + t * t);
}

// inscribedAngleTriangle returns inscribed angle between 2 sides of a triangle.
export const inscribedAngleTriangle = (a: number, b: number, c: number): number => {
	const mu = (c > b) ? 
		b - (a - c) :
		c - (a - b);

	const t1 = (a - b) + c;
	const t2 = a + (b + c);
	const t3 = (a - c) + b;

	const t = (t1 * mu) / (t2 * t3);
	return 2.0 * Math.atan(Math.sqrt(t));
}

// Splits a 53-bit number double precision number into two 26-bit numbers. Returns [x,y] such that x + y = a.
// The value x contains the more significant bits of the sum, and the value y contains the less significant bits.
// See https://www.sciencedirect.com/science/article/pii/S0890540112000715 for usage.
const split = (a: number): [number, number] => {
	const factor = 2.0e27 + 1.0;
	const c = factor * a;
	const x = c - (c - a);
	const y = a - x;
	return [x, y];
}

// Computes the product of 2 numbers. Returns [x,y] such that x + y = a + b.
// The value x contains the more significant bits of the sum, and the value y contains the less significant bits.
// See https://www.sciencedirect.com/science/article/pii/S0890540112000715 for usage.
export const twoProduct = (a: number, b: number): [number, number] => {
	const x = a * b;
	const [a1, a2] = split(a);
	const [b1, b2] = split(b);
	const y = a2 * b2 - (((x - a1 * b1) - a2 * b1) - a1 * b2);
	return [x, y];
}

// Computes the sum of 2 numbers. Returns [x,y] such that x + y = a + b.
// The value x contains the more significant bits of the sum, and the value y contains the less significant bits.
// See https://www.sciencedirect.com/science/article/pii/S0890540112000715 for usage.
export const twoSum = (a: number, b: number): [number, number] => {
	const x = a + b;
	const y = (Math.abs(a) >= Math.abs(b)) ? 
		b - (x - a) :
		a - (x - b);
	return [x, y];
}