import * as Regex from '../../../lib/core/regex';

describe('Regex', () => {
	it('should export a regex for NUMERIC', () => {
		expect(Regex.NUMERIC instanceof RegExp).toBe(true);
	});

	it('should export a regex for ALPHANUMERIC', () => {
		expect(Regex.ALPHANUMERIC instanceof RegExp).toBe(true);
	});

	it('should export a regex for BYTE', () => {
		expect(Regex.BYTE instanceof RegExp).toBe(true);
	});

	it('should export a regex for KANJI', () => {
		expect(Regex.KANJI instanceof RegExp).toBe(true);
	});

	it('should export a regex for BYTE_KANJI', () => {
		expect(Regex.BYTE_KANJI instanceof RegExp).toBe(true);
	});
});

describe('Regex test', () => {
	describe('testNumeric', () => {
		it('should return true if it is a number', () => {
			expect(Regex.testNumeric('123456')).toBe(true);
		});
		it('should return false if it is not a number', () => {
			expect(Regex.testNumeric('a12345')).toBe(false);
			expect(Regex.testNumeric('ABC123')).toBe(false);
		});
	});
	describe('testAlphanumeric', () => {
		it('should return true if it is alphanumeric', () => {
			expect(Regex.testAlphanumeric('123ABC')).toBe(true);
			expect(Regex.testAlphanumeric('123456')).toBe(true);
		});
		it('should return false if it is not alphanumeric', () => {
			expect(Regex.testAlphanumeric('ABCabc')).toBe(false);
		});
	});

	describe('testKanji', () => {
		it('should return true if it is kanji', () => {
			expect(Regex.testKanji('乂ЁЖぞβ')).toBe(true);
		});
		it('should return false if it is not kanji', () => {
			expect(Regex.testKanji('皿a晒三A')).toBe(false);
			expect(Regex.testKanji('123456')).toBe(false);
			expect(Regex.testKanji('ABC123')).toBe(false);
			expect(Regex.testKanji('abcdef')).toBe(false);
		});
	});
});
