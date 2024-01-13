import * as ECLevel from '../../../lib/core/error-correction-level';

const EC_LEVELS = [ECLevel.L, ECLevel.M, ECLevel.Q, ECLevel.H];

describe('Error level from input value', () => {
	const values: [ECLevel.QRCodeErrorCorrectionLevel, ECLevel.QRCodeErrorCorrectionLevel][] = [
		['L', 'low'],
		['M', 'medium'],
		['Q', 'quartile'],
		['H', 'high'],
	];

	it('should return correct error level', () => {
		for (let l = 0; l < values.length; l++) {
			for (let i = 0; i < values[l].length; i++) {
				expect(ECLevel.from(values[l][i])).toBe(EC_LEVELS[l]);
				expect(ECLevel.from(values[l][i].toUpperCase() as ECLevel.QRCodeErrorCorrectionLevel)).toBe(
					EC_LEVELS[l]
				);
			}
		}
	});

	it('should return passed level if value is valid', () => {
		expect(ECLevel.from('L')).toBe(ECLevel.L);
	});
	it('should return default level if value is undefined', () => {
		expect(ECLevel.from(undefined, 'M')).toBe(ECLevel.M);
	});
	it('should return default level if value is invalid', () => {
		expect(ECLevel.from('' as ECLevel.QRCodeErrorCorrectionLevel, 'Q')).toBe(ECLevel.Q);
	});
});
