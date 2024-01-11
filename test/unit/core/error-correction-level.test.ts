// @ts-nocheck
import * as ECLevel from '../../../lib/core/error-correction-level';
import { QRCodeErrorCorrectionLevel } from '../../../types';

const EC_LEVELS = [ECLevel.L, ECLevel.M, ECLevel.Q, ECLevel.H];

describe('Error level from input value', () => {
	const values: QRCodeErrorCorrectionLevel[][] = [
		['L', 'low'],
		['M', 'medium'],
		['Q', 'quartile'],
		['H', 'high'],
	];

	it('should return correct error level', () => {
		for (let l = 0; l < values.length; l++) {
			for (let i = 0; i < values[l].length; i++) {
				expect(ECLevel.from(values[l][i])).toBe(EC_LEVELS[l]);
				expect(ECLevel.from(values[l][i].toUpperCase())).toBe(EC_LEVELS[l]);
			}
		}
	});

	it('should return passed level if value is valid', () => {
		expect(ECLevel.from(ECLevel.L)).toBe(ECLevel.L);
	});
	it('should return default level if value is undefined', () => {
		expect(ECLevel.from(undefined, ECLevel.M)).toBe(ECLevel.M);
	});
	it('should return default level if value is invalid', () => {
		expect(ECLevel.from('', ECLevel.Q)).toBe(ECLevel.Q);
	});
});

describe('Error level validity', () => {
	it('should return true if error level is valid', () => {
		for (let l = 0; l < EC_LEVELS.length; l++) {
			expect(ECLevel.isValid(EC_LEVELS[l])).toBe(true);
		}
	});

	it('should return false if error level is undefined', () => {
		expect(ECLevel.isValid(undefined)).toBe(false);
	});

	it('should return false if bit property is undefined', () => {
		expect(ECLevel.isValid({})).toBe(false);
	});

	it('should return false if bit property value is < 0', () => {
		expect(ECLevel.isValid({ bit: -1 })).toBe(false);
	});

	it('should return false if bit property value is > 3', () => {
		expect(ECLevel.isValid({ bit: 4 })).toBe(false);
	});
});
