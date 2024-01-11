import * as GF from '../../../lib/core/galois-field';

describe('Galois Field', () => {
	it('should throw for log(n) with n < 1', () => {
		expect(() => GF.log(0)).toThrow();
	});

	it('log and exp should be one the inverse of the other', () => {
		for (let i = 1; i < 255; i++) {
			expect(GF.log(GF.exp(i))).toEqual(i);
		}
	});
	it('exp and log should be one the inverse of the other', () => {
		for (let i = 1; i < 255; i++) {
			expect(GF.exp(GF.log(i))).toEqual(i);
		}
	});
	it('should return 0 if first param is 0', () => {
		expect(GF.mul(0, 1)).toEqual(0);
	});
	it('should return 0 if second param is 0', () => {
		expect(GF.mul(1, 0)).toEqual(0);
	});
	it('should return 0 if both params are 0', () => {
		expect(GF.mul(0, 0)).toEqual(0);
	});

	it('should perform commutative multiplication', () => {
		for (let j = 1; j < 255; j++) {
			expect(GF.mul(j, 255 - j)).toEqual(GF.mul(255 - j, j));
		}
	});
});
