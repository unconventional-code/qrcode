import BitMatrix from '../../../lib/core/bit-matrix';
import * as MaskPattern from '../../../lib/core/mask-pattern';

describe('Mask pattern - Pattern references', () => {
	const patternsCount = Object.keys(MaskPattern.Patterns).length;
	it('should return return 8 patterns', () => {
		expect(patternsCount).toEqual(8);
	});
});

const expectedPattern000 = [
	[1, 0, 1, 0, 1, 0],
	[0, 1, 0, 1, 0, 1],
	[1, 0, 1, 0, 1, 0],
	[0, 1, 0, 1, 0, 1],
	[1, 0, 1, 0, 1, 0],
	[0, 1, 0, 1, 0, 1],
].flat();

const expectedPattern001 = [
	[1, 1, 1, 1, 1, 1],
	[0, 0, 0, 0, 0, 0],
	[1, 1, 1, 1, 1, 1],
	[0, 0, 0, 0, 0, 0],
	[1, 1, 1, 1, 1, 1],
	[0, 0, 0, 0, 0, 0],
].flat();

const expectedPattern010 = [
	[1, 0, 0, 1, 0, 0],
	[1, 0, 0, 1, 0, 0],
	[1, 0, 0, 1, 0, 0],
	[1, 0, 0, 1, 0, 0],
	[1, 0, 0, 1, 0, 0],
	[1, 0, 0, 1, 0, 0],
].flat();

const expectedPattern011 = [
	[1, 0, 0, 1, 0, 0],
	[0, 0, 1, 0, 0, 1],
	[0, 1, 0, 0, 1, 0],
	[1, 0, 0, 1, 0, 0],
	[0, 0, 1, 0, 0, 1],
	[0, 1, 0, 0, 1, 0],
].flat();

const expectedPattern100 = [
	[1, 1, 1, 0, 0, 0],
	[1, 1, 1, 0, 0, 0],
	[0, 0, 0, 1, 1, 1],
	[0, 0, 0, 1, 1, 1],
	[1, 1, 1, 0, 0, 0],
	[1, 1, 1, 0, 0, 0],
].flat();

const expectedPattern101 = [
	[1, 1, 1, 1, 1, 1],
	[1, 0, 0, 0, 0, 0],
	[1, 0, 0, 1, 0, 0],
	[1, 0, 1, 0, 1, 0],
	[1, 0, 0, 1, 0, 0],
	[1, 0, 0, 0, 0, 0],
].flat();

const expectedPattern110 = [
	[1, 1, 1, 1, 1, 1],
	[1, 1, 1, 0, 0, 0],
	[1, 1, 0, 1, 1, 0],
	[1, 0, 1, 0, 1, 0],
	[1, 0, 1, 1, 0, 1],
	[1, 0, 0, 0, 1, 1],
].flat();

const expectedPattern111 = [
	[1, 0, 1, 0, 1, 0],
	[0, 0, 0, 1, 1, 1],
	[1, 0, 0, 0, 1, 1],
	[0, 1, 0, 1, 0, 1],
	[1, 1, 1, 0, 0, 0],
	[0, 1, 1, 1, 0, 0],
].flat();

describe('MaskPattern validity', () => {
	it('should return false if no input', () => {
		expect(MaskPattern.isValid(undefined as unknown as number)).toBe(false);
	});
	it('should return false if value is not a number', () => {
		expect(MaskPattern.isValid('' as unknown as number)).toBe(false);
	});
	it('should return false if value is not in range', () => {
		expect(MaskPattern.isValid(-1)).toBe(false);
	});
	it('should return false if value is not in range', () => {
		expect(MaskPattern.isValid(8)).toBe(false);
	});
});

describe('Mask pattern - Apply mask', () => {
	const patterns = Object.keys(MaskPattern.Patterns).length;
	const expectedPatterns = [
		expectedPattern000,
		expectedPattern001,
		expectedPattern010,
		expectedPattern011,
		expectedPattern100,
		expectedPattern101,
		expectedPattern110,
		expectedPattern111,
	];

	for (let p = 0; p < patterns; p++) {
		const matrix = new BitMatrix(6);
		MaskPattern.applyMask(p, matrix);
		it('should return correct pattern for pattern ' + p, () => {
			expect(matrix.data).toEqual(new Uint8Array(expectedPatterns[p]));
		});
	}

	const matrix = new BitMatrix(2);
	matrix.set(0, 0, 0, true);
	matrix.set(0, 1, 0, true);
	matrix.set(1, 0, 0, true);
	matrix.set(1, 1, 0, true);
	MaskPattern.applyMask(0, matrix);

	it('should leave reserved bit unchanged', () => {
		expect(matrix.data).toEqual(new Uint8Array([0, 0, 0, 0]));
	});

	it('should throw if pattern is invalid', () => {
		expect(() => MaskPattern.applyMask(-1, new BitMatrix(1))).toThrow();
	});
});

describe('Mask pattern - Penalty N1', () => {
	it('should return correct penalty points', () => {
		const matrix = new BitMatrix(11);
		matrix.data = new Uint8Array(
			[
				[1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1],
				[1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
				[0, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
				[1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
				[1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
				[1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1],
				[1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1],
				[1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1],
				[1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
				[0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
			].flat()
		);

		expect(MaskPattern.getPenaltyN1(matrix)).toEqual(59);
	});

	it('should return correct penalty points', () => {
		const matrix = new BitMatrix(6);

		matrix.data = new Uint8Array(expectedPattern000);
		expect(MaskPattern.getPenaltyN1(matrix)).toEqual(0);
	});

	it('should return correct penalty points', () => {
		const matrix = new BitMatrix(6);
		matrix.data = new Uint8Array(expectedPattern001);
		expect(MaskPattern.getPenaltyN1(matrix)).toEqual(24);
	});

	it('should return correct penalty points', () => {
		const matrix = new BitMatrix(6);
		matrix.data = new Uint8Array(expectedPattern010);
		expect(MaskPattern.getPenaltyN1(matrix)).toEqual(24);
	});

	it('should return correct penalty points', () => {
		const matrix = new BitMatrix(6);
		matrix.data = new Uint8Array(expectedPattern101);
		expect(MaskPattern.getPenaltyN1(matrix)).toEqual(20);
	});
});

describe('Mask pattern - Penalty N2', () => {
	it('should return correct penalty points', () => {
		const matrix = new BitMatrix(8);
		matrix.data = new Uint8Array(
			[
				[1, 1, 1, 1, 1, 1, 1, 1],
				[1, 1, 1, 0, 0, 0, 1, 1],
				[0, 1, 1, 1, 0, 0, 1, 1],
				[1, 0, 0, 0, 1, 1, 0, 1],
				[0, 0, 0, 0, 0, 0, 0, 0],
				[1, 0, 1, 1, 0, 0, 0, 0],
				[1, 1, 1, 1, 1, 0, 0, 0],
				[1, 1, 0, 0, 1, 0, 1, 1],
			].flat()
		);
		expect(MaskPattern.getPenaltyN2(matrix)).toEqual(45);
	});

	const matrix = new BitMatrix(6);

	it('should return correct penalty points', () => {
		const matrix = new BitMatrix(6);
		matrix.data = new Uint8Array(expectedPattern000);
		expect(MaskPattern.getPenaltyN2(matrix)).toEqual(0);
	});

	it('should return correct penalty points', () => {
		const matrix = new BitMatrix(6);
		matrix.data = new Uint8Array(expectedPattern010);
		expect(MaskPattern.getPenaltyN2(matrix)).toEqual(30);
	});

	it('should return correct penalty points', () => {
		const matrix = new BitMatrix(6);
		matrix.data = new Uint8Array(expectedPattern100);
		expect(MaskPattern.getPenaltyN2(matrix)).toEqual(36);
	});
});

describe('Mask pattern - Penalty N3', () => {
	it('should return correct penalty points', () => {
		const matrix = new BitMatrix(11);
		matrix.data = new Uint8Array(
			[
				[0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1],
				[0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1],
				[0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1],
				[0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1],
				[1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
				[1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1],
				[0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1],
				[1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1],
				[1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0],
				[1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0],
			].flat()
		);

		expect(MaskPattern.getPenaltyN3(matrix)).toEqual(160);
	});

	it('should return correct penalty points', () => {
		const matrix = new BitMatrix(11);
		matrix.data = new Uint8Array(
			[
				[1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0],
				[1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0],
				[1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0],
				[1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0],
				[1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1],
				[1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0],
				[0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1],
				[1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1],
				[0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 1],
				[1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0],
				[1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1],
			].flat()
		);
		expect(MaskPattern.getPenaltyN3(matrix)).toEqual(280);
	});
});

describe('Mask pattern - Penalty N4', () => {
	it('should return correct penalty points', () => {
		const matrix = new BitMatrix(10);
		matrix.data = new Uint8Array(new Array(50).fill(1).concat(new Array(50).fill(0)));
		expect(MaskPattern.getPenaltyN4(matrix)).toEqual(0);
	});

	it('should return correct penalty points', () => {
		const matrix2 = new BitMatrix(21);
		matrix2.data = new Uint8Array(new Array(190).fill(1).concat(new Array(251).fill(0)));
		expect(MaskPattern.getPenaltyN4(matrix2)).toEqual(10);
	});

	it('should return correct penalty points', () => {
		const matrix3 = new BitMatrix(10);
		matrix3.data = new Uint8Array(new Array(22).fill(1).concat(new Array(78).fill(0)));
		expect(MaskPattern.getPenaltyN4(matrix3)).toEqual(50);
	});
});

describe('Mask pattern - Best mask', () => {
	const matrix = new BitMatrix(11);
	matrix.data = new Uint8Array(
		[
			[0, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1],
			[0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1],
			[0, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1],
			[0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1],
			[1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
			[1, 0, 1, 0, 0, 0, 1, 1, 1, 1, 1],
			[0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1],
			[1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1],
			[1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0],
			[1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0],
		].flat()
	);

	const mask = MaskPattern.getBestMask(matrix, function () {});
	it('should return a number', () => {
		expect(!isNaN(mask)).toBe(true);
	});
	it('should return a number in range 0,7', () => {
		expect(mask >= 0 && mask < 8).toBe(true);
	});
});
