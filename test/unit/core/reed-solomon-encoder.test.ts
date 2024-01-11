import RS from '../../../lib/core/reed-solomon-encoder';

describe('Reed-Solomon encoder', () => {
	it('should have an undefined generator polynomial', () => {
		const enc = new RS();
		expect(enc.genPoly).toBeUndefined();
	});
	it('should throw if generator polynomial is undefined', () => {
		const enc = new RS();
		const emptyArray = new Uint8Array();
		expect(() => {
			enc.encode(emptyArray); // []
		}).toThrow();
	});

	it('should set correct degree value', () => {
		const enc = new RS();
		enc.initialize(2);
		expect(enc.degree).toBe(2);
	});
	it('should have a generator polynomial', () => {
		const enc = new RS();
		enc.initialize(2);
		expect(enc.genPoly).toBeDefined();
	});

	it('should return a number of codewords equal to gen poly degree', () => {
		const enc = new RS();
		enc.initialize(2);
		const result = enc.encode(new Uint8Array([48, 49, 50, 51, 52]));
		expect(result.length).toEqual(2);
	});

	it('should set correct degree value', () => {
		const enc = new RS();
		enc.initialize(2);
		expect(enc.degree).toBe(2);
	});

	it('should reinitialize the generator polynomial', () => {
		const enc = new RS();
		enc.initialize(2);
		const genPoly = enc.genPoly;
		enc.initialize(3);
		expect(enc.degree).not.toEqual(genPoly);
	});

	it('should not create a generator polynomial if degree is 0', () => {
		const enc = new RS(0);
		expect(enc.genPoly).toBeUndefined();
	});

	it('should return correct buffer', () => {
		const enc = new RS(1);
		expect(enc.encode(new Uint8Array([0])).toString()).toBe(new Uint8Array([0]).toString());
	});
});
