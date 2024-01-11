import * as Utils from '../../../lib/core/utils';
import Version from '../../../lib/core/version';
import * as ECLevel from '../../../lib/core/error-correction-level';
import * as ECCode from '../../../lib/core/error-correction-code';
import Mode from '../../../lib/core/mode';

describe('Error correction codewords', () => {
	const levels = [ECLevel.L, ECLevel.M, ECLevel.Q, ECLevel.H];

	it('should return the correct codewords number', () => {
		for (let v = 1; v <= 40; v++) {
			const totalCodewords = Utils.getSymbolTotalCodewords(v);
			const reservedByte = Math.ceil((Mode.getCharCountIndicator(Mode.BYTE, v) + 4) / 8);

			for (let l = 0; l < levels.length; l++) {
				// @ts-ignore
				const dataCodewords = Version.getCapacity(v, levels[l], Mode.BYTE) + reservedByte;

				const expectedCodewords = totalCodewords - dataCodewords;
				// @ts-ignore
				expect(ECCode.getTotalCodewordsCount(v, levels[l])).toEqual(expectedCodewords);
			}
		}
	});

	it('should return undefined if EC level is not specified', () => {
		expect(
			ECCode.getTotalCodewordsCount(1, undefined as unknown as ECLevel.ErrorCorrectionLevel)
		).toBeUndefined();
	});
});

describe('Error correction blocks', () => {
	const levels = [ECLevel.L, ECLevel.M, ECLevel.Q, ECLevel.H];

	it('should return a positive number', () => {
		for (let v = 1; v <= 40; v++) {
			for (let l = 0; l < levels.length; l++) {
				// @ts-ignore
				expect(ECCode.getBlocksCount(v, levels[l])).toBeGreaterThan(0);
			}
		}
	});

	it('should return undefined if EC level is not specified', () => {
		expect(
			ECCode.getBlocksCount(1, undefined as unknown as ECLevel.ErrorCorrectionLevel)
		).toBeUndefined();
	});
});
