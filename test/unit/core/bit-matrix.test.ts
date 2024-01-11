import BitMatrix from '../../../lib/core/bit-matrix';

describe('Bit Matrix', () => {
	it('should throw if size is 0', () => {
		expect(() => BitMatrix(0)).toThrow();
	})
	it('should throw if size is less than 0', () => {
		expect(() => BitMatrix(-1)).toThrow();
	});

	it('should have correct size', () => {
		const bm = new BitMatrix(2);
		expect(bm.size).toBe(2);
	});

	it('should correctly set buffer size', () => {
		const bm = new BitMatrix(2);
		expect(bm.data.length).toBe(4);
	});

	it('should correctly set bit to true (1)', () => {
		const bm = new BitMatrix(2);
		bm.set(0, 1, true, true);
		expect(bm.get(0, 1)).toBe(1);
	})
	it('should correctly set bit as reserved', () => {
		const bm = new BitMatrix(2);
		bm.set(0, 1, true, true);
		expect(bm.isReserved(0, 1)).toBe(1);
	});

	it('should correctly xor bit', () => {
		const bm = new BitMatrix(2);
		bm.set(0, 1, true, true);
		bm.xor(0, 1, 1);
		expect(bm.get(0, 1)).toBe(0);
	})

	it('should correctly set bit to false (0)', () => {
		const bm = new BitMatrix(2);
		bm.set(0, 1, false);
		expect(bm.get(0, 1)).toBe(0);
	})
});
