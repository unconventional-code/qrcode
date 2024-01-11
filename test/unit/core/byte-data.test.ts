import BitBuffer from '../../../lib/core/bit-buffer';
import ByteData from '../../../lib/core/byte-data';
import * as Mode from '../../../lib/core/mode';

describe('Byte Data: String Input', () => {
	const text = '1234';
	const textBitLength = 32;
	const textByte = [49, 50, 51, 52]; // 1, 2, 3, 4
	const utf8Text = '\u00bd + \u00bc = \u00be'; // 9 char, 12 byte

	const byteData = new ByteData(text);

	it('should be BYTE mode', () => {
		expect(byteData.mode).toBe(Mode.BYTE);
	});

	it('should return correct length', () => {
		expect(byteData.getLength()).toBe(text.length);
	});

	it('should return correct bit length', () => {
		expect(byteData.getBitsLength()).toBe(textBitLength);
	});

	it('should write correct data to buffer', () => {
		const bitBuffer = new BitBuffer();
		byteData.write(bitBuffer);
		expect(bitBuffer.buffer).toEqual(textByte);
	});

	it('should return correct length for utf8 chars', () => {
		const byteDataUtf8 = new ByteData(utf8Text);
		expect(byteDataUtf8.getLength()).toBe(12);
	});
});

describe('Byte Data: Byte Input', () => {
	const bytes = new Uint8ClampedArray([1, 231, 32, 22]);

	const byteData = new ByteData(bytes);
	it('should return correct length', () => {
		expect(byteData.getLength()).toBe(bytes.length);
	});
	it('should return correct bit length', () => {
		expect(byteData.getBitsLength()).toBe(bytes.length * 8);
	});

	it('should write correct data to buffer', () => {
		const bitBuffer = new BitBuffer();
		byteData.write(bitBuffer);
		expect(bitBuffer.buffer.toString()).toBe(bytes.toString());
	});
});
