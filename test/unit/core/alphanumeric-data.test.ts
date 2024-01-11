import BitBuffer from '../../../lib/core/bit-buffer';
import AlphanumericData from '../../../lib/core/alphanumeric-data';
import Mode from '../../../lib/core/mode';

const testData = [
	{
		data: 'A',
		length: 1,
		bitLength: 6,
		dataBit: [40],
	},
	{
		data: 'AB',
		length: 2,
		bitLength: 11,
		dataBit: [57, 160],
	},
	{
		data: 'ABC12',
		length: 5,
		bitLength: 28,
		dataBit: [57, 168, 116, 32],
	},
];

describe('Alphanumeric Data', () => {
	testData.forEach(function (data) {
		const alphanumericData = new AlphanumericData(data.data);

		it('should be ALPHANUMERIC mode', () => {
			expect(alphanumericData.mode).toBe(Mode.ALPHANUMERIC);
		});
		it('should return correct length', () => {
			expect(alphanumericData.getLength()).toBe(data.length);
		});
		it('should return correct bit length', () => {
			expect(alphanumericData.getBitsLength()).toBe(data.bitLength);
		});

		it('should write correct data to buffer', () => {

		const bitBuffer = new BitBuffer();
		alphanumericData.write(bitBuffer);
		expect(bitBuffer.buffer).toEqual(data.dataBit);
		});
	});

});
