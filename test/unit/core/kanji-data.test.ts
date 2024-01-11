import BitBuffer from '../../../lib/core/bit-buffer';
import KanjiData from '../../../lib/core/kanji-data';
import Mode from '../../../lib/core/mode';
import toSJIS from '../../../helper/to-sjis';
import { setToSJISFunction } from '../../../lib/core/utils';

// TODO: In jest this might break other tests
setToSJISFunction(toSJIS);

describe('Kanji Data', () => {
	const data = '漢字漾癶';
	const length = 4;
	const bitLength = 52; // length * 13

	const dataBit = [57, 250, 134, 174, 129, 134, 0];


	it('should be KANJI mode', () => {
		const kanjiData = new KanjiData(data);
		expect(kanjiData.mode).toBe(Mode.KANJI);
	});

	it('should return correct length', () => {
		const kanjiData = new KanjiData(data);
		expect(kanjiData.mode).toBe(Mode.KANJI);
		expect(kanjiData.getLength()).toBe(length);
	});

	it('should return correct bit length', () => {
		const kanjiData = new KanjiData(data);
		expect(kanjiData.getBitsLength()).toBe(bitLength);
	});

	it('should write correct data to buffer', () => {
		const bitBuffer = new BitBuffer();
		const kanjiData = new KanjiData(data);
		kanjiData.write(bitBuffer);
		expect(bitBuffer.buffer).toEqual(dataBit);
	});

	it('should throw if data is invalid', () => {
		const kanjiData = new KanjiData('abc');
		const bitBuffer = new BitBuffer();
		expect(() => {
			kanjiData.write(bitBuffer);
		}).toThrow();
	});
});
