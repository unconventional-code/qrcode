import Poly from '../../../lib/core/polynomial';

describe('Generator polynomial', () => {
	const result = Poly.generateECPolynomial(0);
	it('should return an Uint8Array', () => {
		expect(result instanceof Uint8Array).toBe(true);
	});
	it('should return coeff [1] for polynomial of degree 0', () => {
		expect(result.toString()).toBe(new Uint8Array([1]).toString());
	});

	it('should return a number of coefficients equal to (degree + 1)', () => {
		for (let e = 2; e <= 68; e++) {
			expect(Poly.generateECPolynomial(e).length).toBe(e + 1);
		}
	});
});

describe('Polynomial', () => {
	const p1 = new Uint8Array([0, 1, 2, 3, 4]);
	const p2 = new Uint8Array([5, 6]);

	describe('Polynomial multiplication', () => {
		it('should return an Uint8Array', () => {
			const result = Poly.mul(p1, p2);
			expect(Poly.mul(p1, p2) instanceof Uint8Array).toBe(true);
		});

		it('should return correct number of coefficients', () => {
			const result = Poly.mul(p1, p2);
			expect(result.length).toBe(6);
		});
	});

	describe('Polynomial modulo division', () => {
		it('should return an Uint8Array', () => {
			const result = Poly.mod(p1, Poly.generateECPolynomial(2));
			expect(result instanceof Uint8Array).toBe(true);
		});
		it('should return correct number of coefficients', () => {
			const result = Poly.mod(p1, Poly.generateECPolynomial(2));
			expect(result.length).toBe(2);
		});
	});
});
