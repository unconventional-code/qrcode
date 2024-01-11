import BitBuffer from '../../../lib/core/bit-buffer';
import StructuredAppendData from '../../../lib/core/structured-append-data';
import * as Mode from '../../../lib/core/mode';

describe('Structured Append Data', () => {
	const data = { position: 0x1, total: 0x3, parity: 0x0a };

	const bytes = [0x13, 0xa];

	const structuredAppendData = new StructuredAppendData(data);

	it('should be STRUCTURED_APPEND mode', () => {
		expect(structuredAppendData.mode).toBe(Mode.STRUCTURED_APPEND);
	});

	it('should return correct length', () => {
		expect(structuredAppendData.getLength()).toBe(0);
	});

	it('should return correct bit length', () => {
		expect(structuredAppendData.getBitsLength()).toBe(16);
	});

	const bitBuffer = new BitBuffer();
	structuredAppendData.write(bitBuffer);
	it('should write correct data to buffer', () => {
		expect(bitBuffer.buffer).toEqual(bytes);
	});
});
