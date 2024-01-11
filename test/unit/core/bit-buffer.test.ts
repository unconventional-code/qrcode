import BitBuffer from '../../../lib/core/bit-buffer';


describe('Bit Buffer', () => {
	const testData = 0x41; // 'A'


	it('should have an initial lenght of 0', () => {
		const bitBuffer = new BitBuffer();
		expect(bitBuffer.getLengthInBits()).toBe(0);
	})

	it('should correctly put data', () => {
		const bitBuffer = new BitBuffer();
		bitBuffer.put(testData, 8);
		expect(bitBuffer.getLengthInBits()).toEqual(8);
	})

	it('should retrun correct bit value', () => {
		const expectedDataBits = [false, true, false, false, false, false, false, true];
		const bitBuffer = new BitBuffer();
		bitBuffer.put(testData, 8);
		for (let i = 0; i < 8; i++) {
			expect(bitBuffer.get(i)).toEqual(expectedDataBits[i]);
		}
	})

});
